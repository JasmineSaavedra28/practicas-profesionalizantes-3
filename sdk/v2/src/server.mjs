import { createServer } from 'node:http';
import { URL } from 'node:url';
import * as handlers from './handlers.mjs';

function create_router()
{
    const router = new Map();

    router.set('/', handlers.default_handler);
    router.set('/register', handlers.register_handler);
    router.set('/login', handlers.login_handler);

    router.set('/usuarios/crear', handlers.crear_usuario_handler);
    router.set('/usuarios/leer', handlers.leer_usuario_handler);
    router.set('/usuarios/listar', handlers.listar_usuarios_handler);
    router.set('/usuarios/actualizar', handlers.actualizar_usuario_handler);
    router.set('/usuarios/eliminar', handlers.eliminar_usuario_handler);

    router.set('/roles/crear', handlers.crear_rol_handler);
    router.set('/roles/listar', handlers.listar_roles_handler);
    router.set('/roles/actualizar', handlers.actualizar_rol_handler);
    router.set('/roles/eliminar', handlers.eliminar_rol_handler);

    router.set('/permisos/crear', handlers.crear_permiso_handler);
    router.set('/permisos/listar', handlers.listar_permisos_handler);
    router.set('/permisos/actualizar', handlers.actualizar_permiso_handler);
    router.set('/permisos/eliminar', handlers.eliminar_permiso_handler);

    router.set('/roles/asignar-permiso', handlers.asignar_permiso_rol_handler);
    router.set('/roles/permisos', handlers.obtener_permisos_rol_handler);

    return router;
}

function getRequestUrl(request, config)
{
    const host = request.headers.host || `${config.server.ip}:${config.server.port}`;
    return new URL(request.url, `http://${host}`);
}

async function request_dispatcher(request, response, router, context)
{
    const url = getRequestUrl(request, context.config);
    const path = url.pathname;
    const handler = router.get(path);

    if (handler)
    {
        return await handler(request, response, context);
    }

    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Ruta no encontrada' }));
}

function create_request_listener(router, context)
{
    return function request_listener(request, response)
    {
        return request_dispatcher(request, response, router, context);
    };
}

function start_server(config, router, context)
{
    console.log('Servidor ejecutándose en http://' + config.server.ip + ':' + config.server.port);
    const server = createServer(create_request_listener(router, context));
    server.listen(config.server.port, config.server.ip);
}

export { create_router, start_server };