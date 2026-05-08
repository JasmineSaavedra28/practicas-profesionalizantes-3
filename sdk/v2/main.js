import { load_config } from './config.js';
import { connect_db } from './src/db.mjs';
import * as handlers from './src/handlers.mjs';
import { create_router, start_server } from './src/server.mjs';

const config = load_config();
const db = connect_db(config.database.path);
const router = create_router(handlers, db, config);

start_server(config, router);
