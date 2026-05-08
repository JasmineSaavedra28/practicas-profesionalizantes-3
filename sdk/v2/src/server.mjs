import { createServer } from 'node:http';
import { URL } from 'node:url';

function create_router(handlers, db, config)
{
    const router = new Map();

    router.set('/', (req, res) => handlers.default_handler(req, res, config));
    router.set('/register', (req, res) => handlers.register_handler(req, res, db));
    router.set('/login', (req, res) => handlers.login_handler(req, res, db));

    router.set('/usuarios/crear', (req, res) => handlers.crear_usuario_handler(req, res, db));
    router.set('/usuarios/leer', (req, res) => handlers.leer_usuario_handler(req, res, db));
    router.set('/usuarios/listar', (req, res) => handlers.listar_usuarios_handler(req, res, db));
    router.set('/usuarios/actualizar', (req, res) => handlers.actualizar_usuario_handler(req, res, db));
    router.set('/usuarios/eliminar', (req, res) => handlers.eliminar_usuario_handler(req, res, db));

    router.set('/roles/crear', (req, res) => handlers.crear_rol_handler(req, res, db));
    router.set('/roles/listar', (req, res) => handlers.listar_roles_handler(req, res, db));
    router.set('/roles/actualizar', (req, res) => handlers.actualizar_rol_handler(req, res, db));
    router.set('/roles/eliminar', (req, res) => handlers.eliminar_rol_handler(req, res, db));

    router.set('/permisos/crear', (req, res) => handlers.crear_permiso_handler(req, res, db));
    router.set('/permisos/listar', (req, res) => handlers.listar_permisos_handler(req, res, db));
    router.set('/permisos/actualizar', (req, res) => handlers.actualizar_permiso_handler(req, res, db));
    router.set('/permisos/eliminar', (req, res) => handlers.eliminar_permiso_handler(req, res, db));

    router.set('/roles/asignar-permiso', (req, res) => handlers.asignar_permiso_rol_handler(req, res, db));
    router.set('/roles/permisos', (req, res) => handlers.obtener_permisos_rol_handler(req, res, db));

    return router;
}

async function request_dispatcher(request, response, router, config)
{
    const url = new URL(request.url, 'http://localhost:' + config.server.port);
    const path = url.pathname;
    const handler = router.get(path);

    if (handler)
    {
        return await handler(request, response);
    }

    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Ruta no encontrada' }));
}

function start_server(config, router)
{
    console.log('Servidor ejecutándose en http://' + config.server.ip + ':' + config.server.port);
    const server = createServer((req, res) => request_dispatcher(req, res, router, config));
    server.listen(config.server.port, config.server.ip);
}

export { create_router, start_server };