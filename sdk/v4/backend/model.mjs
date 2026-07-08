function inicializar_tablas(db) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT
        );

        CREATE TABLE IF NOT EXISTS endpoint (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS group (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS members (
            id_user INTEGER NOT NULL,
            id_group INTEGER NOT NULL,
            PRIMARY KEY (id_user, id_group)
        );

        CREATE TABLE IF NOT EXISTS access (
            id_group INTEGER NOT NULL,
            id_endpoint INTEGER NOT NULL,
            PRIMARY KEY (id_group, id_endpoint)
        );
    `);
}

function iniciar_sesion(db, username, password_hash) {
    const sql = 'SELECT id, username, password_hash FROM user WHERE username = ?';
    const stmt = db.prepare(sql);
    const user = stmt.get(username);

    if (!user) {
        return null;
    }
    if (user.password_hash !== password_hash) {
        return null;
    }
    return { id: user.id, username: user.username };
}

function crear_usuario(db, username, password_hash, salt = null) {
    const sql = 'INSERT INTO user (username, password_hash, salt) VALUES (?, ?, ?)';
    const stmt = db.prepare(sql);
    const info = stmt.run(username, password_hash, salt);
    return { id: info.lastInsertRowid, username, password_hash, salt };
}

function authorize(db, userId, endpointPath) {
    const normalizedPath = endpointPath.startsWith('/') ? endpointPath.slice(1) : endpointPath;
    const sql = `
        SELECT COUNT(*) AS total
        FROM access a
        JOIN members m ON a.id_group = m.id_group
        JOIN user u ON m.id_user = u.id
        JOIN endpoint e ON a.id_endpoint = e.id
        WHERE u.username = ?
          AND e.path = ?
    `;
    const stmt = db.prepare(sql);
    const row = stmt.get(userId, normalizedPath);
    return row && row.total > 0;
}

export { inicializar_tablas, iniciar_sesion, crear_usuario, authorize };