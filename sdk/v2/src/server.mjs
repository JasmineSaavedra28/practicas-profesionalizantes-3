import { createServer } from 'node:http';
import { URL } from 'node:url';

function create_router()
{
    return new Map();
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