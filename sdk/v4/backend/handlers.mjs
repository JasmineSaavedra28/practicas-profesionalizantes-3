import { parse } from 'node:querystring';
import { getRequestUrl, getSessionId } from './server.mjs';
import {
    iniciar_sesion,
    crear_usuario,
    leer_usuario,
    listar_usuarios,
    actualizar_usuario,
    eliminar_usuario,
    crear_rol,
    listar_roles,
    actualizar_rol,
    eliminar_rol,
    crear_permiso,
    listar_permisos,
    actualizar_permiso,
    eliminar_permiso,
    asignar_permiso_a_rol,
    obtener_permisos_rol,
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

async function register_handler(request, response, context) {
    return await crear_usuario_handler(request, response, context);
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
    try {
        const input = await parseRequestBody(request);
        const output = crear_usuario(context.db, input.username, input.password, input.email, input.role_id);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    } catch (err) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function listar_usuarios_handler(request, response, context) {
    try {
        const output = listar_usuarios(context.db);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    } catch (err) {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function leer_usuario_handler(request, response, context) {
    try {
        const url = getRequestUrl(request, context.config);
        const id = url.searchParams.get('id');
        const output = leer_usuario(context.db, id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    } catch (err) {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function actualizar_usuario_handler(request, response, context) {
    try {
        const input = await parseRequestBody(request);
        const output = actualizar_usuario(context.db, input.id, input.username, input.password, input.email, input.role_id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    } catch (err) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function eliminar_usuario_handler(request, response, context) {
    try {
        const input = await parseRequestBody(request);
        const output = eliminar_usuario(context.db, input.id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    } catch (err) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

// --- Handlers de Roles ---
async function crear_rol_handler(request, response, context) {
    const input = await parseRequestBody(request);
    const output = crear_rol(context.db, input.name, input.description);
    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

async function listar_roles_handler(request, response, context) {
    const output = listar_roles(context.db);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

async function actualizar_rol_handler(request, response, context) {
    const input = await parseRequestBody(request);
    const output = actualizar_rol(context.db, input.id, input.name, input.description);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

async function eliminar_rol_handler(request, response, context) {
    const input = await parseRequestBody(request);
    const output = eliminar_rol(context.db, input.id);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

// --- Handlers de Permisos ---
async function crear_permiso_handler(request, response, context) {
    const input = await parseRequestBody(request);
    const output = crear_permiso(context.db, input.name, input.description);
    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

async function listar_permisos_handler(request, response, context) {
    const output = listar_permisos(context.db);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

async function actualizar_permiso_handler(request, response, context) {
    const input = await parseRequestBody(request);
    const output = actualizar_permiso(context.db, input.id, input.name, input.description);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

async function eliminar_permiso_handler(request, response, context) {
    const input = await parseRequestBody(request);
    const output = eliminar_permiso(context.db, input.id);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

async function asignar_permiso_rol_handler(request, response, context) {
    const input = await parseRequestBody(request);
    const output = asignar_permiso_a_rol(context.db, input.role_id, input.permission_id);
    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

async function obtener_permisos_rol_handler(request, response, context) {
    const url = getRequestUrl(request, context.config);
    const role_id = url.searchParams.get('role_id');
    const output = obtener_permisos_rol(context.db, role_id);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

export { 
    register_handler,
    login_handler, 
    logout_handler, 
    action_handler, 
    crear_usuario_handler, 
    leer_usuario_handler,
    listar_usuarios_handler,
    actualizar_usuario_handler,
    eliminar_usuario_handler,
    crear_rol_handler,
    listar_roles_handler,
    actualizar_rol_handler,
    eliminar_rol_handler,
    crear_permiso_handler,
    listar_permisos_handler,
    actualizar_permiso_handler,
    eliminar_permiso_handler,
    asignar_permiso_rol_handler,
    obtener_permisos_rol_handler
};