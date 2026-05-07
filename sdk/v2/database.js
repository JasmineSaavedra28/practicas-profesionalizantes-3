import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';

function connect_db(path)
{
    const dbPath = resolve(path);
    try
    {
        const db = new DatabaseSync(dbPath);

        db.exec(`
            CREATE TABLE IF NOT EXISTS role (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS permission (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                email TEXT UNIQUE,
                role_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES role(id)
            );

            CREATE TABLE IF NOT EXISTS role_permission (
                role_id INTEGER NOT NULL,
                permission_id INTEGER NOT NULL,
                PRIMARY KEY (role_id, permission_id),
                FOREIGN KEY (role_id) REFERENCES role(id),
                FOREIGN KEY (permission_id) REFERENCES permission(id)
            );
        `);
        return db;
    }
    catch (err)
    {
        throw new Error("Error al conectar a la base de datos: " + err.message);
    }
}

// CRUD Usuario
function crear_usuario(db, username, password, email, role_id = null)
{
    const sql = "INSERT INTO user (username, password, email, role_id) VALUES (?, ?, ?, ?) RETURNING id, username, email, role_id, created_at";
    try
    {
        const stmt = db.prepare(sql);
        const row = stmt.get(username, password, email, role_id);
        return row;
    }
    catch (err)
    {
        throw err;
    }
}

function leer_usuario(db, id)
{
    const sql = "SELECT id, username, email, role_id, created_at, updated_at FROM user WHERE id = ?";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
    catch (err)
    {
        throw err;
    }
}

function listar_usuarios(db)
{
    const sql = "SELECT id, username, email, role_id, created_at, updated_at FROM user ORDER BY id";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.all();
    }
    catch (err)
    {
        throw err;
    }
}

function actualizar_usuario(db, id, username, password, email, role_id)
{
    const sql = "UPDATE user SET username = ?, password = ?, email = ?, role_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id, username, email, role_id, updated_at";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(username, password, email, role_id, id);
    }
    catch (err)
    {
        throw err;
    }
}

function eliminar_usuario(db, id)
{
    const sql = "DELETE FROM user WHERE id = ? RETURNING id";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
    catch (err)
    {
        throw err;
    }
}

// CRUD Rol
function crear_rol(db, name, description = null)
{
    const sql = "INSERT INTO role (name, description) VALUES (?, ?) RETURNING id, name, description, created_at";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(name, description);
    }
    catch (err)
    {
        throw err;
    }
}

function leer_rol(db, id)
{
    const sql = "SELECT id, name, description, created_at FROM role WHERE id = ?";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
    catch (err)
    {
        throw err;
    }
}

function listar_roles(db)
{
    const sql = "SELECT id, name, description, created_at FROM role ORDER BY id";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.all();
    }
    catch (err)
    {
        throw err;
    }
}

function actualizar_rol(db, id, name, description)
{
    const sql = "UPDATE role SET name = ?, description = ? WHERE id = ? RETURNING id, name, description";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(name, description, id);
    }
    catch (err)
    {
        throw err;
    }
}

function eliminar_rol(db, id)
{
    const sql = "DELETE FROM role WHERE id = ? RETURNING id";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
    catch (err)
    {
        throw err;
    }
}

// CRUD Permiso
function crear_permiso(db, name, description = null)
{
    const sql = "INSERT INTO permission (name, description) VALUES (?, ?) RETURNING id, name, description, created_at";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(name, description);
    }
    catch (err)
    {
        throw err;
    }
}

function leer_permiso(db, id)
{
    const sql = "SELECT id, name, description, created_at FROM permission WHERE id = ?";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
    catch (err)
    {
        throw err;
    }
}

function listar_permisos(db)
{
    const sql = "SELECT id, name, description, created_at FROM permission ORDER BY id";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.all();
    }
    catch (err)
    {
        throw err;
    }
}

function actualizar_permiso(db, id, name, description)
{
    const sql = "UPDATE permission SET name = ?, description = ? WHERE id = ? RETURNING id, name, description";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(name, description, id);
    }
    catch (err)
    {
        throw err;
    }
}

function eliminar_permiso(db, id)
{
    const sql = "DELETE FROM permission WHERE id = ? RETURNING id";
    try
    {
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
    catch (err)
    {
        throw err;
    }
}

// Asignar permisos a roles
function asignar_permiso_a_rol(db, role_id, permission_id)
{
    const sql = "INSERT INTO role_permission (role_id, permission_id) VALUES (?, ?)";
    try
    {
        const stmt = db.prepare(sql);
        stmt.run(role_id, permission_id);
        return { role_id, permission_id, status: "success" };
    }
    catch (err)
    {
        throw err;
    }
}

function obtener_permisos_rol(db, role_id)
{
    const sql = `
        SELECT p.id, p.name, p.description
        FROM permission p
        INNER JOIN role_permission rp ON p.id = rp.permission_id
        WHERE rp.role_id = ?
    `;
    try
    {
        const stmt = db.prepare(sql);
        return stmt.all(role_id);
    }
    catch (err)
    {
        throw err;
    }
}

export {
    connect_db,
    crear_usuario, leer_usuario, listar_usuarios, actualizar_usuario, eliminar_usuario,
    crear_rol, leer_rol, listar_roles, actualizar_rol, eliminar_rol,
    crear_permiso, leer_permiso, listar_permisos, actualizar_permiso, eliminar_permiso,
    asignar_permiso_a_rol, obtener_permisos_rol
};