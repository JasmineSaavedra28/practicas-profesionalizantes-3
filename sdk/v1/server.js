import { createServer } from 'node:http';
import { URL } from 'node:url';

function create_router(handlers, config, db, createUser)
{
    let router = new Map();
    router.set('/', (req, res) => handlers.default_handler(req, res, config));
    router.set('/login', (req, res) => handlers.login_handler(req, res, config));
    router.set('/register', (req, res) => handlers.register_handler(req, res, config, db, createUser));
    router.set('/showMessage', (req, res) => handlers.show_message_handler(req, res));
    return router;
}

async function request_dispatcher(request, response, router, config)
{
    const url = new URL(request.url, 'http://' + config.server.ip);
    const path = url.pathname;
    const handler = router.get(path);

    if (handler)
    {
        return await handler(request, response);
    }
    else
    {
        response.writeHead(404);
        response.end('Método no encontrado');
    }
}

function start_server(config, router)
{
    console.log('Servidor ejecutándose en http://' + config.server.ip + ':' + config.server.port);

    let server = createServer((req, res) => request_dispatcher(req, res, router, config));
    server.listen(config.server.port, config.server.ip);
}

export { create_router, start_server };