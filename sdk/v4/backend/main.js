// v4: El backend es puramente una WebAPI. El frontend se sirve desde Apache.
import { load_config } from './config.js';
import { connect_db } from './db.mjs';
import { inicializar_tablas } from './model.mjs';
import { create_router, start_server } from './server.mjs';
import * as handlers from './handlers.mjs';

const config = load_config();
const db = connect_db(config.database.path);

// Inicializar el esquema de la base de datos (v4 usa password_hash)
inicializar_tablas(db);

const router = create_router();

// v4: Mapa de sesiones en memoria para acoplar la lógica de la v3
const sessions = new Map();

// Registro de rutas (Patrón RPC - Desacoplado)
router.set('/register', handlers.register_handler);
router.set('/login', handlers.login_handler);
router.set('/logout', handlers.logout_handler);

// Rutas de Usuarios
router.set('/usuarios/crear', handlers.crear_usuario_handler);
router.set('/usuarios/leer', handlers.leer_usuario_handler);
router.set('/usuarios/listar', handlers.listar_usuarios_handler);
router.set('/usuarios/actualizar', handlers.actualizar_usuario_handler);
router.set('/usuarios/eliminar', handlers.eliminar_usuario_handler);

// Rutas de Roles y Permisos
router.set('/roles/crear', handlers.crear_rol_handler);
router.set('/roles/listar', handlers.listar_roles_handler);
router.set('/roles/actualizar', handlers.actualizar_rol_handler);
router.set('/roles/eliminar', handlers.eliminar_rol_handler);

router.set('/permisos/crear', handlers.crear_permiso_handler);
router.set('/permisos/listar', handlers.listar_permisos_handler);
router.set('/permisos/actualizar', handlers.actualizar_permiso_handler);
router.set('/permisos/eliminar', handlers.eliminar_permiso_handler);

router.set('/roles/asignar-permiso', handlers.asignar_permiso_rol_handler);
router.set('/roles/permisos', handlers.obtener_permisos_rol_handler);

// v4: Acoplamiento de acciones protegidas de la v3
router.set('/print', handlers.action_handler);
router.set('/log', handlers.action_handler);
router.set('/help', handlers.action_handler);
router.set('/sayHello', handlers.action_handler);
router.set('/sayBye', handlers.action_handler);

// El contexto ahora incluye 'sessions' para que el dispatcher y los handlers operen la seguridad
const context = { db, config, router, sessions };

start_server(config, router, context);