import { URL } from 'node:url';
import { parse } from 'node:querystring';
import { readFileSync } from 'node:fs';
import {
    crear_usuario,
    iniciar_sesion,
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
    obtener_permisos_rol
} from './usecase.mjs';

function getRequestUrl(request, config)
{
    const host = request.headers.host || `${config.server.ip}:${config.server.port}`;
    return new URL(request.url, `http://${host}`);
}

function default_handler(request, response, context)
{
    if (request.method !== 'GET')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const html = readFileSync(context.config.server.default_path, 'utf-8');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
    }
    catch (error)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Error interno: No se pudo cargar la vista principal.' }));
    }
}

function parseRequestBody(request)
{
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => resolve(parse(body)));
        request.on('error', reject);
    });
}

async function register_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const input = await parseRequestBody(request);
        const output = crear_usuario(context.db, input.username, input.password, input.email, input.role_id || null);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function login_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const input = await parseRequestBody(request);
        const output = iniciar_sesion(context.db, input.username, input.password);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(401, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function crear_usuario_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const input = await parseRequestBody(request);
        const output = crear_usuario(context.db, input.username, input.password, input.email, input.role_id || null);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

function leer_usuario_handler(request, response, context)
{
    if (request.method !== 'GET')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const url = getRequestUrl(request, context.config);
    const id = url.searchParams.get('id');

    if (!id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'id requerido' }));
        return;
    }

    try
    {
        const output = leer_usuario(context.db, id);
        if (!output)
        {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Usuario no encontrado' }));
            return;
        }
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

function listar_usuarios_handler(request, response, context)
{
    if (request.method !== 'GET')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const output = listar_usuarios(context.db);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function actualizar_usuario_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const input = await parseRequestBody(request);
        if (!input.id)
        {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'id requerido' }));
            return;
        }
        const output = actualizar_usuario(context.db, input.id, input.username, input.password, input.email, input.role_id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function eliminar_usuario_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const url = getRequestUrl(request, context.config);
    const id = url.searchParams.get('id');

    if (!id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'id requerido' }));
        return;
    }

    try
    {
        const output = eliminar_usuario(context.db, id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'Usuario eliminado', data: output }));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function crear_rol_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const input = await parseRequestBody(request);
        const output = crear_rol(context.db, input.name, input.description || null);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

function listar_roles_handler(request, response, context)
{
    if (request.method !== 'GET')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const output = listar_roles(context.db);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function actualizar_rol_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const input = await parseRequestBody(request);
        if (!input.id)
        {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'id requerido' }));
            return;
        }
        const output = actualizar_rol(context.db, input.id, input.name, input.description);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function eliminar_rol_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const url = getRequestUrl(request, context.config);
    const id = url.searchParams.get('id');

    if (!id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'id requerido' }));
        return;
    }

    try
    {
        const output = eliminar_rol(context.db, id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'Rol eliminado', data: output }));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function crear_permiso_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const input = await parseRequestBody(request);
        const output = crear_permiso(context.db, input.name, input.description || null);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

function listar_permisos_handler(request, response, context)
{
    if (request.method !== 'GET')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const output = listar_permisos(context.db);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function actualizar_permiso_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const input = await parseRequestBody(request);
        if (!input.id)
        {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'id requerido' }));
            return;
        }
        const output = actualizar_permiso(context.db, input.id, input.name, input.description);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function eliminar_permiso_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const url = getRequestUrl(request, context.config);
    const id = url.searchParams.get('id');

    if (!id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'id requerido' }));
        return;
    }

    try
    {
        const output = eliminar_permiso(context.db, id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'Permiso eliminado', data: output }));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function asignar_permiso_rol_handler(request, response, context)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try
    {
        const input = await parseRequestBody(request);
        const output = asignar_permiso_a_rol(context.db, input.role_id, input.permission_id);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

function obtener_permisos_rol_handler(request, response, context)
{
    if (request.method !== 'GET')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const url = getRequestUrl(request, context.config);
    const role_id = url.searchParams.get('role_id');

    if (!role_id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'role_id requerido' }));
        return;
    }

    try
    {
        const output = obtener_permisos_rol(context.db, role_id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

export {
    default_handler,
    register_handler,
    login_handler,
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
