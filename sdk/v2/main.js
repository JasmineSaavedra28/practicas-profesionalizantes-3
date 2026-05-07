import { load_config } from './config.js';
import {
    connect_db,
    crear_usuario, leer_usuario, listar_usuarios, actualizar_usuario, eliminar_usuario,
    crear_rol, leer_rol, listar_roles, actualizar_rol, eliminar_rol,
    crear_permiso, leer_permiso, listar_permisos, actualizar_permiso, eliminar_permiso,
    asignar_permiso_a_rol, obtener_permisos_rol
} from './database.js';
import {
    default_handler,
    crear_usuario_handler, leer_usuario_handler, listar_usuarios_handler, actualizar_usuario_handler, eliminar_usuario_handler,
    crear_rol_handler, listar_roles_handler, actualizar_rol_handler, eliminar_rol_handler,
    crear_permiso_handler, listar_permisos_handler, actualizar_permiso_handler, eliminar_permiso_handler,
    asignar_permiso_rol_handler, obtener_permisos_rol_handler
} from './handlers.js';
import { create_router, start_server } from './server.js';

const config = load_config();
const db = connect_db(config.database.path);

const handlers = {
    default_handler,
    crear_usuario_handler, leer_usuario_handler, listar_usuarios_handler, actualizar_usuario_handler, eliminar_usuario_handler,
    crear_rol_handler, listar_roles_handler, actualizar_rol_handler, eliminar_rol_handler,
    crear_permiso_handler, listar_permisos_handler, actualizar_permiso_handler, eliminar_permiso_handler,
    asignar_permiso_rol_handler, obtener_permisos_rol_handler
};

const dbFunctions = {
    crear_usuario, leer_usuario, listar_usuarios, actualizar_usuario, eliminar_usuario,
    crear_rol, leer_rol, listar_roles, actualizar_rol, eliminar_rol,
    crear_permiso, leer_permiso, listar_permisos, actualizar_permiso, eliminar_permiso,
    asignar_permiso_a_rol, obtener_permisos_rol
};

const router = create_router(handlers, db, dbFunctions, config);

start_server(config, router);