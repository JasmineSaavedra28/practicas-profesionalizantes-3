const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./reciclaje.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS materiales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL,
        cantidad REAL NOT NULL,
        unidad TEXT NOT NULL
    )`);

    // Insertar datos iniciales si la tabla está vacía
    db.get("SELECT COUNT(*) as count FROM materiales", (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO materiales (nombre, cantidad, unidad) VALUES (?, ?, ?)");
            stmt.run('Vidrio', 100, 'kg');
            stmt.run('Hierro', 200, 'kg');
            stmt.run('Baterías', 10, 'unidades');
            stmt.run('Aceite de girasol', 2, 'm3');
            stmt.finalize();
        }
    });
});

module.exports = db;