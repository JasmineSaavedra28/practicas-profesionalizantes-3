import { URL } from 'node:url';
import { readFileSync } from 'node:fs';
import { parse } from 'node:querystring';

function login(input)
{
    const userdata =
    {
        username: 'admin',
        password: '1234'
    };

    let output =
    {
        status: false,
        result: null,
        description: 'INVALID_USER_PASS'
    };

    if (input.username === userdata.username && input.password === userdata.password)
    {
        output.status = true;
        output.result = input.username;
        output.description = null;
    }

    return output;
}

// Manejadores
async function login_handler(request, response, config)
{
    const url = new URL(request.url, 'http://' + config.server.ip);
    const input = Object.fromEntries(url.searchParams);

    const output = login(input);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(output));
}

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

async function register_handler(request, response, config, db, createUser)
{
    if (request.method !== 'POST') {
        response.writeHead(405, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', async () => {
        try {
            const input = parse(body);
            const output = await createUser(db, input.username, input.password);

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(output));
        } catch (err) {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: err.message }));
        }
    });
}

function show_message_handler(request, response)
{
    console.log("Petición recibida: Mostrando mensaje en el servidor!");
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: "Mensaje procesado" }));
}

export { login_handler, default_handler, register_handler, show_message_handler };