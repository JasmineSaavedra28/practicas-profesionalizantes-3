import { load_config } from './config.js';
import { connect_db } from './src/db.mjs';
import { create_router, start_server } from './src/server.mjs';

const config = load_config();
const db = connect_db(config.database.path);
const router = create_router();
const context = { db, config };

start_server(config, router, context);
