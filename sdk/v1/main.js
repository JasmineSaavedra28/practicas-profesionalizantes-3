import { load_config } from './config.js';
import { connect_db, createUser } from './database.js';
import { login_handler, default_handler, register_handler, show_message_handler } from './handlers.js';
import { create_router, start_server } from './server.js';

const config = load_config();
const db = connect_db(config.database.path);

const handlers = { login_handler, default_handler, register_handler, show_message_handler };
const router = create_router(handlers, config, db, createUser);

start_server(config, router);