import { createServer } from 'node:http';
import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

function defaultConfig() {
    return {
        server: {
            ip: '127.0.0.1',
            port: 3000,
            default_path: './default.html'
        },
        database: {
            path: './db.sqlite3'
        }
    };
}

function loadConfig() {
    try {
        const data = readFileSync('./config.json', 'utf-8');
        const config = JSON.parse(data);
        console.log('Configuración cargada correctamente.');
        return config;
    } catch (error) {
        console.error('Error cargando config.json. Usando valores por defecto.');
        return defaultConfig();
    }
}

const config = loadConfig();
const databasePath = resolve(config.database.path);
const db = new DatabaseSync(databasePath);
const sessions = new Map();

function hashSha256(value) {
    return createHash('sha256').update(value).digest('hex');
}

function isSessionActive(username) {
    const session = sessions.get(username);
    return session && session.enabled === true;
}

function createSession(userId, username) {
    const session = {
        userId,
        username,
        enabled: true,
        createdAt: new Date().toISOString()
    };
    sessions.set(username, session);
    return session;
}

function terminateSession(username) {
    sessions.delete(username);
}

function authenticate(username, passwordHash) {
    const sql = 'SELECT id, username, password_hash FROM user WHERE username = ?';
    const row = db.prepare(sql).get(username);
    if (!row || !row.password_hash) {
        return null;
    }

    // Comparación directa de hashes (ambos vienen del frontend)
    if (passwordHash === row.password_hash) {
        return { id: row.id, username: row.username };
    }
    return null;
}

function authorize(username, endpointPath) {
    const normalizedPath = endpointPath.startsWith('/') ? endpointPath.slice(1) : endpointPath;
    const sql = `
        SELECT COUNT(*) AS total
        FROM access a
        JOIN members m ON a.id_group = m.id_group
        JOIN user u ON m.id_user = u.id
        JOIN endpoint e ON a.id_endpoint = e.id
        WHERE u.username = ?
          AND e.path = ?
    `;

    const row = db.prepare(sql).get(username, normalizedPath);
    return row && row.total > 0;
}

function parseJsonBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
        request.on('error', reject);
    });
}

function respondJson(response, status, payload) {
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(payload));
}

function defaultHandler(request, response) {
    try {
        const html = readFileSync(config.server.default_path, 'utf-8');
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(html);
    } catch (error) {
        respondJson(response, 500, { error: 'Error interno: no se pudo cargar la vista principal.' });
    }
}

async function loginHandler(request, response) {
    if (request.method !== 'POST') {
        respondJson(response, 405, { error: 'Método no permitido. Usa POST.' });
        return;
    }

    try {
        const input = await parseJsonBody(request);
        if (!input.username || !input.password) {
            respondJson(response, 400, { error: 'Faltan parámetros: username y password.' });
            return;
        }

        const user = authenticate(input.username, input.password);
        if (!user) {
            respondJson(response, 401, { error: 'Credenciales inválidas.' });
            return;
        }

        const session = createSession(user.id, user.username);
        respondJson(response, 200, { success: true, username: session.username, message: 'Login exitoso' });
    } catch (error) {
        respondJson(response, 400, { error: 'Formato JSON inválido.' });
    }
}

async function logoutHandler(request, response) {
    if (request.method !== 'POST') {
        respondJson(response, 405, { error: 'Método no permitido. Usa POST.' });
        return;
    }

    try {
        const input = await parseJsonBody(request);
        if (!input.username) {
            respondJson(response, 400, { error: 'Falta el parámetro username.' });
            return;
        }

        terminateSession(input.username);
        respondJson(response, 200, { success: true, message: 'Sesión cerrada.' });
    } catch (error) {
        respondJson(response, 400, { error: 'Formato JSON inválido.' });
    }
}

async function registerHandler(request, response) {
    if (request.method !== 'POST') {
        respondJson(response, 405, { error: 'Método no permitido. Usa POST.' });
        return;
    }

    try {
        const input = await parseJsonBody(request);
        if (!input.username || !input.password) {
            respondJson(response, 400, { error: 'Faltan parámetros: username y password.' });
            return;
        }

        // El input.password ya viene hasheado del frontend
        const sql = 'INSERT INTO user (username, password_hash) VALUES (?, ?)';
        const result = db.prepare(sql).run(input.username, input.password);

        respondJson(response, 201, { success: true, id: result.lastInsertRowid, username: input.username });
    } catch (error) {
        respondJson(response, 500, { error: 'No se pudo crear el usuario. Verifica el nombre de usuario.' });
    }
}

async function actionHandler(request, response, actionPath) {
    const host = request.headers.host || `${config.server.ip}:${config.server.port}`;
    const url = new URL(request.url, `http://${host}`);
    const username = url.searchParams.get('username');

    if (!username) {
        respondJson(response, 400, { error: 'Parámetro requerido: username.' });
        return;
    }

    if (!isSessionActive(username)) {
        respondJson(response, 401, { error: 'No hay sesión activa.' });
        return;
    }

    const allowed = authorize(username, actionPath);
    if (!allowed) {
        respondJson(response, 403, { error: `Acceso denegado al endpoint ${actionPath}`, authorized: false });
        return;
    }

    const messages = {
        '/print': 'Acción print ejecutada',
        '/log': 'Acción log ejecutada',
        '/help': 'Help: Endpoints disponibles son /print, /log, /help, /sayHello, /sayBye',
        '/sayHello': 'Hello!',
        '/sayBye': 'Bye!'
    };

    respondJson(response, 200, {
        success: true,
        authorized: true,
        action: actionPath,
        message: messages[actionPath] || 'Acción ejecutada'
    });
}

// Abstracción para evitar el uso de switch
const PUBLIC_ROUTES = {
    '/': defaultHandler,
    '/login': loginHandler,
    '/logout': logoutHandler,
    '/register': registerHandler
};

const PROTECTED_ACTIONS = ['/print', '/log', '/help', '/sayHello', '/sayBye'];

function requestDispatcher(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (request.method === 'OPTIONS') {
        response.writeHead(204);
        response.end();
        return;
    }

    const host = request.headers.host || `${config.server.ip}:${config.server.port}`;
    const url = new URL(request.url, `http://${host}`);
    const path = url.pathname;

    // 1. Verificamos si es una ruta pública
    if (PUBLIC_ROUTES[path]) {
        return PUBLIC_ROUTES[path](request, response);
    }

    // 2. Verificamos si es una acción protegida
    if (PROTECTED_ACTIONS.includes(path)) {
        return actionHandler(request, response, path);
    }

    respondJson(response, 404, { error: 'Endpoint no encontrado.' });
}

function start() {
    console.log(`Servidor ejecutándose en http://${config.server.ip}:${config.server.port}`);
    console.log('Base de datos conectada en:', databasePath);
}

const server = createServer((request, response) => requestDispatcher(request, response));
server.listen(config.server.port, config.server.ip, start);
