import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';

function connect_db(path) 
{
    const dbPath = resolve(path);
    try 
    {
        const db = new DatabaseSync(dbPath);
        // Inicializar tabla si no existe
        db.exec(`
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);
        return db;
    } 
    catch (err) 
    {
        throw new Error("Error al conectar a la base de datos: " + err.message);
    }
}

// Lógica de negocio
async function createUser(db, username, password) 
{
    const sql = "INSERT INTO user (username, password) VALUES (?, ?) RETURNING id";

    try 
    {
        const stmt = db.prepare(sql);
        const row = stmt.get(username, password);

        const result = 
        {
            id: row.id,
            username: username,
            password: password
        };
        
        return result;
    } 
    catch (err) 
    {
        throw err;
    }
}

export { connect_db, createUser };