import { createServer } from 'node:http';
import { URL } from 'node:url';

function create_router(handlers, db, dbFunctions)
{
    let router = new Map();

    router.set('/', (req, res) => handlers.default_handler(req, res));

    // Usuario CRUD
    router.set('/usuarios/crear', (req, res) => handlers.crear_usuario_handler(req, res, db, dbFunctions.crear_usuario));
    router.set('/usuarios/leer', (req, res) => handlers.leer_usuario_handler(req, res, db, dbFunctions.leer_usuario));
    router.set('/usuarios/listar', (req, res) => handlers.listar_usuarios_handler(req, res, db, dbFunctions.listar_usuarios));
    router.set('/usuarios/actualizar', (req, res) => handlers.actualizar_usuario_handler(req, res, db, dbFunctions.actualizar_usuario));
    router.set('/usuarios/eliminar', (req, res) => handlers.eliminar_usuario_handler(req, res, db, dbFunctions.eliminar_usuario));

    // Rol CRUD
    router.set('/roles/crear', (req, res) => handlers.crear_rol_handler(req, res, db, dbFunctions.crear_rol));
    router.set('/roles/listar', (req, res) => handlers.listar_roles_handler(req, res, db, dbFunctions.listar_roles));
    router.set('/roles/actualizar', (req, res) => handlers.actualizar_rol_handler(req, res, db, dbFunctions.actualizar_rol));
    router.set('/roles/eliminar', (req, res) => handlers.eliminar_rol_handler(req, res, db, dbFunctions.eliminar_rol));

    // Permiso CRUD
    router.set('/permisos/crear', (req, res) => handlers.crear_permiso_handler(req, res, db, dbFunctions.crear_permiso));
    router.set('/permisos/listar', (req, res) => handlers.listar_permisos_handler(req, res, db, dbFunctions.listar_permisos));
    router.set('/permisos/actualizar', (req, res) => handlers.actualizar_permiso_handler(req, res, db, dbFunctions.actualizar_permiso));
    router.set('/permisos/eliminar', (req, res) => handlers.eliminar_permiso_handler(req, res, db, dbFunctions.eliminar_permiso));

    // Asignación de permisos a roles
    router.set('/roles/asignar-permiso', (req, res) => handlers.asignar_permiso_rol_handler(req, res, db, dbFunctions.asignar_permiso_a_rol));
    router.set('/roles/permisos', (req, res) => handlers.obtener_permisos_rol_handler(req, res, db, dbFunctions.obtener_permisos_rol));

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
    else
    {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
}

function start_server(config, router)
{
    console.log('Servidor ejecutándose en http://' + config.server.ip + ':' + config.server.port);

    let server = createServer((req, res) => request_dispatcher(req, res, router, config));
    server.listen(config.server.port, config.server.ip);
}

export { create_router, start_server };