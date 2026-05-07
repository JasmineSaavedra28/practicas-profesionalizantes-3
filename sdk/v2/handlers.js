import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { parse } from 'node:querystring';

function default_handler(request, response, config)
{
    try
    {
        const html = readFileSync(config.server.default_path, 'utf-8');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
    }
    catch (error)
    {
        response.writeHead(500);
        response.end('Error interno: No se pudo cargar la vista principal.');
    }
}

// CRUD Usuario handlers
async function crear_usuario_handler(request, response, db, crear_usuario)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        try
        {
            const input = parse(body);
            const output = crear_usuario(db, input.username, input.password, input.email, input.role_id || null);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(output));
        }
        catch (err)
        {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: err.message }));
        }
    });
}

async function leer_usuario_handler(request, response, db, leer_usuario)
{
    const url = new URL(request.url, 'http://localhost');
    const id = url.searchParams.get('id');

    if (!id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'id requerido' }));
        return;
    }

    try
    {
        const output = leer_usuario(db, id);
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

async function listar_usuarios_handler(request, response, db, listar_usuarios)
{
    try
    {
        const output = listar_usuarios(db);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function actualizar_usuario_handler(request, response, db, actualizar_usuario)
{
    if (request.method !== 'PUT')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        try
        {
            const input = parse(body);
            if (!input.id)
            {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'id requerido' }));
                return;
            }
            const output = actualizar_usuario(db, input.id, input.username, input.password, input.email, input.role_id);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(output));
        }
        catch (err)
        {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: err.message }));
        }
    });
}

async function eliminar_usuario_handler(request, response, db, eliminar_usuario)
{
    if (request.method !== 'DELETE')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const url = new URL(request.url, 'http://localhost');
    const id = url.searchParams.get('id');

    if (!id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'id requerido' }));
        return;
    }

    try
    {
        const output = eliminar_usuario(db, id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'Usuario eliminado', data: output }));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

// CRUD Rol handlers
async function crear_rol_handler(request, response, db, crear_rol)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        try
        {
            const input = parse(body);
            const output = crear_rol(db, input.name, input.description || null);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(output));
        }
        catch (err)
        {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: err.message }));
        }
    });
}

async function listar_roles_handler(request, response, db, listar_roles)
{
    try
    {
        const output = listar_roles(db);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function actualizar_rol_handler(request, response, db, actualizar_rol)
{
    if (request.method !== 'PUT')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        try
        {
            const input = parse(body);
            if (!input.id)
            {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'id requerido' }));
                return;
            }
            const output = actualizar_rol(db, input.id, input.name, input.description);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(output));
        }
        catch (err)
        {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: err.message }));
        }
    });
}

async function eliminar_rol_handler(request, response, db, eliminar_rol)
{
    if (request.method !== 'DELETE')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const url = new URL(request.url, 'http://localhost');
    const id = url.searchParams.get('id');

    if (!id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'id requerido' }));
        return;
    }

    try
    {
        const output = eliminar_rol(db, id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'Rol eliminado', data: output }));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

// CRUD Permiso handlers
async function crear_permiso_handler(request, response, db, crear_permiso)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        try
        {
            const input = parse(body);
            const output = crear_permiso(db, input.name, input.description || null);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(output));
        }
        catch (err)
        {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: err.message }));
        }
    });
}

async function listar_permisos_handler(request, response, db, listar_permisos)
{
    try
    {
        const output = listar_permisos(db);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(output));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

async function actualizar_permiso_handler(request, response, db, actualizar_permiso)
{
    if (request.method !== 'PUT')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        try
        {
            const input = parse(body);
            if (!input.id)
            {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'id requerido' }));
                return;
            }
            const output = actualizar_permiso(db, input.id, input.name, input.description);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(output));
        }
        catch (err)
        {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: err.message }));
        }
    });
}

async function eliminar_permiso_handler(request, response, db, eliminar_permiso)
{
    if (request.method !== 'DELETE')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    const url = new URL(request.url, 'http://localhost');
    const id = url.searchParams.get('id');

    if (!id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'id requerido' }));
        return;
    }

    try
    {
        const output = eliminar_permiso(db, id);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ message: 'Permiso eliminado', data: output }));
    }
    catch (err)
    {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: err.message }));
    }
}

// Asignar permisos a rol
async function asignar_permiso_rol_handler(request, response, db, asignar_permiso_a_rol)
{
    if (request.method !== 'POST')
    {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        try
        {
            const input = parse(body);
            if (!input.role_id || !input.permission_id)
            {
                response.writeHead(400, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'role_id y permission_id requeridos' }));
                return;
            }
            const output = asignar_permiso_a_rol(db, input.role_id, input.permission_id);
            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(output));
        }
        catch (err)
        {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: err.message }));
        }
    });
}

// Obtener permisos de un rol
async function obtener_permisos_rol_handler(request, response, db, obtener_permisos_rol)
{
    const url = new URL(request.url, 'http://localhost');
    const role_id = url.searchParams.get('role_id');

    if (!role_id)
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'role_id requerido' }));
        return;
    }

    try
    {
        const output = obtener_permisos_rol(db, role_id);
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
    crear_usuario_handler, leer_usuario_handler, listar_usuarios_handler, actualizar_usuario_handler, eliminar_usuario_handler,
    crear_rol_handler, listar_roles_handler, actualizar_rol_handler, eliminar_rol_handler,
    crear_permiso_handler, listar_permisos_handler, actualizar_permiso_handler, eliminar_permiso_handler,
    asignar_permiso_rol_handler, obtener_permisos_rol_handler
};