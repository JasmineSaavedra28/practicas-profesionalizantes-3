import { createServer } from 'node:http';
import { URL } from 'node:url';

function create_router()
{
    return new Map();
}

function getRequestUrl(request, config)
{
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const host = request.headers.host || `${config.server.ip}:${config.server.port}`;
    return new URL(request.url, `${protocol}://${host}`);
}

function getSessionId(request)
{
    const cookies = request.headers.cookie;
    if (!cookies) return null;

    const list = {};
    cookies.split(';').forEach(function (cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list.sessionId;
}

async function request_dispatcher(request, response, router, context)
{
    const url = getRequestUrl(request, context.config);
    const path = url.pathname;
    const handler = router.get(path);

    if (handler)
    {
        // v4: Rutas públicas que no requieren sesión
        const publicPaths = ['/', '/login', '/register'];

        if (!publicPaths.includes(path))
        {
            const sessionId = getSessionId(request);
            const session = context.sessions ? context.sessions.get(sessionId) : null;

            if (!session)
            {
                response.writeHead(401, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'No autorizado. Inicie sesión.' }));
                return;
            }
            // Agregamos el usuario al request para que el handler lo use si lo necesita
            request.user = session.user;
        }

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

export { create_router, start_server, getRequestUrl };