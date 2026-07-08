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

function getAuthHeaders(request)
{
    const headers = request.headers || {};
    return {
        userId: headers['x-user-id'] || null,
        apiKey: headers['x-api-key'] || null
    };
}

async function request_dispatcher(request, response, router, context)
{
    // v4: Configuración de CORS para permitir acceso desde el Frontend (Apache/UniServer)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-id, x-api-key');

    if (request.method === 'OPTIONS')
    {
        response.writeHead(204);
        response.end();
        return;
    }

    const url = getRequestUrl(request, context.config);
    const path = url.pathname;
    const handler = router.get(path);

    if (handler)
    {
        // v4: Rutas públicas que no requieren sesión
        const publicPaths = ['/login', '/register'];

        if (!publicPaths.includes(path))
        {
            const auth = getAuthHeaders(request);
            const session = context.sessions ? context.sessions.get(auth.apiKey) : null;

            if (!session || session.username !== auth.userId)
            {
                response.writeHead(401, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ error: 'No autorizado. Inicie sesión.' }));
                return;
            }
            request.user = session;
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