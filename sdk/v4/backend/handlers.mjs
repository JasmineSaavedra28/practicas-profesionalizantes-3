import { getRequestUrl } from './server.mjs';
import {
    iniciar_sesion,
    crear_usuario,
    authorize
} from './model.mjs';

function parseRequestBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => body += chunk.toString());
        request.on('end', () => {
            try {
                resolve(JSON.parse(body || '{}'));
            } catch (err) {
                reject(err);
            }
        });
        request.on('error', reject);
    });
}

function getAuthHeaders(request) {
    const headers = request.headers || {};
    return {
        userId: headers['x-user-id'] || null,
        apiKey: headers['x-api-key'] || null
    };
}

async function register_handler(request, response, context) {
    if (request.method !== 'POST') {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ error: 'Método no permitido. Usa POST.' }));
    }

    try {
        const input = await parseRequestBody(request);
        const output = crear_usuario(context.db, input.username, input.password);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ success: true, user: output }));
    } catch (err) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function login_handler(request, response, context) {
    try {
        const input = await parseRequestBody(request);
        const user = iniciar_sesion(context.db, input.username, input.password);

        if (user) {
            const apiKey = Math.random().toString(36).substring(2);
            context.sessions.set(apiKey, user);
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            return response.end(JSON.stringify({ success: true, message: 'Login exitoso', apiKey, userId: user.username }));
        }
        response.writeHead(401, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Credenciales inválidas' }));
    } catch (err) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function logout_handler(request, response, context) {
    const auth = getAuthHeaders(request);
    if (auth.apiKey) context.sessions.delete(auth.apiKey);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Sesión cerrada' }));
}

async function action_handler(request, response, context) {
    if (request.method !== 'POST') {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ error: 'Método no permitido. Usa POST.' }));
    }

    const url = getRequestUrl(request, context.config);
    const path = url.pathname;

    if (!request.user) {
        response.writeHead(401, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ error: 'No autenticado', authorized: false }));
    }

    const allowed = authorize(context.db, request.user.id, path);
    if (!allowed) {
        response.writeHead(403, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ error: 'Acceso denegado', authorized: false }));
    }
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ success: true, authorized: true, message: `Acción ${path} ejecutada` }));
}

export { 
    register_handler,
    login_handler, 
    logout_handler, 
    action_handler
};