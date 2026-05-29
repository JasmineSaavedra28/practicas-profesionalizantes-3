import { load_config } from './config.js';
import { connect_db } from './src/db.mjs';
import { inicializar_tablas } from './src/model.mjs';
import { create_router, start_server } from './src/server.mjs';
import * as handlers from './src/handlers.mjs';

const config = load_config();
const db = connect_db(config.database.path);

// Inicializar el esquema de la base de datos
inicializar_tablas(db);

const router = create_router();

// Registro manual de rutas (Desacoplado del servidor)
router.set('/', handlers.default_handler);
router.set('/register', handlers.register_handler);
router.set('/login', handlers.login_handler);
router.set('/usuarios/crear', handlers.crear_usuario_handler);
router.set('/usuarios/leer', handlers.leer_usuario_handler);
router.set('/usuarios/listar', handlers.listar_usuarios_handler);
router.set('/usuarios/actualizar', handlers.actualizar_usuario_handler);
router.set('/usuarios/eliminar', handlers.eliminar_usuario_handler);
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

const context = { db, config };

start_server(config, router, context);
