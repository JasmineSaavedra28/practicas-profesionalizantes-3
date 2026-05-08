import {
    crear_usuario as crear_usuario_db,
    leer_usuario as leer_usuario_db,
    listar_usuarios as listar_usuarios_db,
    actualizar_usuario as actualizar_usuario_db,
    eliminar_usuario as eliminar_usuario_db,
    crear_rol as crear_rol_db,
    listar_roles as listar_roles_db,
    actualizar_rol as actualizar_rol_db,
    eliminar_rol as eliminar_rol_db,
    crear_permiso as crear_permiso_db,
    listar_permisos as listar_permisos_db,
    actualizar_permiso as actualizar_permiso_db,
    eliminar_permiso as eliminar_permiso_db,
    asignar_permiso_a_rol as asignar_permiso_a_rol_db,
    obtener_permisos_rol as obtener_permisos_rol_db,
    leer_usuario_por_username as leer_usuario_por_username_db
} from './db.mjs';

function crear_usuario(db, username, password, email, role_id = null)
{
    if (!username || !password)
    {
        throw new Error('username y password son requeridos');
    }
    if (username.length < 3)
    {
        throw new Error('username debe tener al menos 3 caracteres');
    }
    return crear_usuario_db(db, username, password, email, role_id);
}

function iniciar_sesion(db, username, password)
{
    if (!username || !password)
    {
        throw new Error('username y password son requeridos');
    }
    const usuario = leer_usuario_por_username_db(db, username);
    if (!usuario || usuario.password !== password)
    {
        throw new Error('Credenciales inválidas');
    }
    return {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        role_id: usuario.role_id,
        message: 'Login exitoso'
    };
}

function leer_usuario(db, id)
{
    if (!id)
    {
        throw new Error('id es requerido');
    }
    return leer_usuario_db(db, id);
}

function listar_usuarios(db)
{
    return listar_usuarios_db(db);
}

function actualizar_usuario(db, id, username, password, email, role_id)
{
    if (!id)
    {
        throw new Error('id es requerido');
    }
    return actualizar_usuario_db(db, id, username, password, email, role_id);
}

function eliminar_usuario(db, id)
{
    if (!id)
    {
        throw new Error('id es requerido');
    }
    return eliminar_usuario_db(db, id);
}

function crear_rol(db, name, description = null)
{
    if (!name)
    {
        throw new Error('name es requerido');
    }
    return crear_rol_db(db, name, description);
}

function listar_roles(db)
{
    return listar_roles_db(db);
}

function actualizar_rol(db, id, name, description)
{
    if (!id)
    {
        throw new Error('id es requerido');
    }
    return actualizar_rol_db(db, id, name, description);
}

function eliminar_rol(db, id)
{
    if (!id)
    {
        throw new Error('id es requerido');
    }
    return eliminar_rol_db(db, id);
}

function crear_permiso(db, name, description = null)
{
    if (!name)
    {
        throw new Error('name es requerido');
    }
    return crear_permiso_db(db, name, description);
}

function listar_permisos(db)
{
    return listar_permisos_db(db);
}

function actualizar_permiso(db, id, name, description)
{
    if (!id)
    {
        throw new Error('id es requerido');
    }
    return actualizar_permiso_db(db, id, name, description);
}

function eliminar_permiso(db, id)
{
    if (!id)
    {
        throw new Error('id es requerido');
    }
    return eliminar_permiso_db(db, id);
}

function asignar_permiso_a_rol(db, role_id, permission_id)
{
    if (!role_id || !permission_id)
    {
        throw new Error('role_id y permission_id son requeridos');
    }
    return asignar_permiso_a_rol_db(db, role_id, permission_id);
}

function obtener_permisos_rol(db, role_id)
{
    if (!role_id)
    {
        throw new Error('role_id es requerido');
    }
    return obtener_permisos_rol_db(db, role_id);
}

export {
    crear_usuario,
    iniciar_sesion,
    leer_usuario,
    listar_usuarios,
    actualizar_usuario,
    eliminar_usuario,
    crear_rol,
    listar_roles,
    actualizar_rol,
    eliminar_rol,
    crear_permiso,
    listar_permisos,
    actualizar_permiso,
    eliminar_permiso,
    asignar_permiso_a_rol,
    obtener_permisos_rol
};
