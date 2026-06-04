import { parse } from 'node:querystring';
import { getRequestUrl, getSessionId } from './server.mjs';
import {
    iniciar_sesion,
    crear_usuario,
    leer_usuario,
    listar_usuarios,
    eliminar_usuario,
    authorize
} from './model.mjs';

function parseRequestBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => body += chunk.toString());
        request.on('end', () => resolve(parse(body)));
        request.on('error', reject);
    });
}

async function login_handler(request, response, context) {
    try {
        const input = await parseRequestBody(request);
        const user = iniciar_sesion(context.db, input.username, input.password);
        const sessionId = Math.random().toString(36).substring(2);
        context.sessions.set(sessionId, { user, date: new Date() });
        response.writeHead(200, { 
            'Content-Type': 'application/json',
            'Set-Cookie': `sessionId=${sessionId}; Path=/; HttpOnly`
        });
        response.end(JSON.stringify({ success: true, username: user.username }));
    } catch (err) {
        response.writeHead(401, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function logout_handler(request, response, context) {
    const sessionId = getSessionId(request);
    if (sessionId) context.sessions.delete(sessionId);
    response.writeHead(200, { 
        'Content-Type': 'application/json',
        'Set-Cookie': 'sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    });
    response.end(JSON.stringify({ message: 'Sesión cerrada' }));
}

async function action_handler(request, response, context) {
    const url = getRequestUrl(request, context.config);
    const path = url.pathname;
    const allowed = authorize(context.db, request.user.id, path);
    if (!allowed) {
        response.writeHead(403, { 'Content-Type': 'application/json' });
        return response.end(JSON.stringify({ error: 'Acceso denegado', authorized: false }));
    }
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ success: true, authorized: true, message: `Acción ${path} ejecutada` }));
}

async function crear_usuario_handler(request, response, context) {
    const input = await parseRequestBody(request);
    const output = crear_usuario(context.db, input.username, input.password, input.email, input.role_id);
    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

async function listar_usuarios_handler(request, response, context) {
    const output = listar_usuarios(context.db);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

export { 
    login_handler, 
    logout_handler, 
    action_handler, 
    crear_usuario_handler, 
    listar_usuarios_handler,
    // ... exportar el resto de los ABM de model.mjs aquí
};