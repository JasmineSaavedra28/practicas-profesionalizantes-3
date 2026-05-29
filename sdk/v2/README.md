# SDK v2 — Sistema de Autenticación y Gestión de Permisos

## Descripción

Proyecto de `sdk/v2` para el trabajo práctico de autenticación y permisos. Incluye:
- Gestión de usuarios
- Gestión de roles
- Gestión de permisos
- Asignación de permisos a roles
- Interfaz web simple en un solo archivo HTML
- Base de datos SQLite integrada (`db.sqlite3`)

## Estado del Proyecto

- La lógica de conexión a la base de datos está en `src/db.mjs`
- Las consultas CRUD y la gestión de relaciones están en `src/model.mjs`
- La lógica de negocio y validación está en `src/usecase.mjs`
- Los handlers HTTP están en `src/handlers.mjs`
- El router y dispatcher están en `src/server.mjs`
- El servidor se inicia desde `main.js`
- La interfaz web se sirve desde `public/default.html`

## Endpoints disponibles

### Usuarios
- **POST** `/usuarios/crear`
- **GET** `/usuarios/leer?id=<id>`
- **GET** `/usuarios/listar`
- **POST** `/usuarios/actualizar`
- **POST** `/usuarios/eliminar?id=<id>`

### Roles
- **POST** `/roles/crear`
- **GET** `/roles/listar`
- **POST** `/roles/actualizar`
- **POST** `/roles/eliminar?id=<id>`
- **POST** `/roles/asignar-permiso`
- **GET** `/roles/permisos?role_id=<id>`

### Permisos
- **POST** `/permisos/crear`
- **GET** `/permisos/listar`
- **POST** `/permisos/actualizar`
- **POST** `/permisos/eliminar?id=<id>`

## Instalación y ejecución

Desde `sdk/v2`:

```bash
npm install
npm run seed
npm start
```

Luego abrir `http://127.0.0.1:3001` en el navegador.

## Notas importantes

- No incluir `node_modules/` en el repositorio.
- La interfaz está en un solo archivo HTML: `public/default.html`.
- No se usan frameworks frontend.
- `db.sqlite3` se conserva como base de datos del TP.

## Comandos útiles

```bash
npm install
npm run seed
npm start
```

## Archivo de configuración

- `config.json` define la IP, el puerto y la ruta del HTML.
- `db.sqlite3` es la base de datos usada por el servidor.

## Estructura principal

```
v2/
├── main.js
├── config.js
├── config.json
├── package.json
├── package-lock.json
├── seed.mjs
├── .gitignore
├── db.sqlite3
├── public/default.html
└── src/
    ├── db.mjs
    ├── model.mjs
    ├── usecase.mjs
    ├── handlers.mjs
    └── server.mjs
```

## Consideraciones de entrega

- El repositorio entregable es `sdk/v2`
- Se mantiene la base de datos en `db.sqlite3`
- No se incluye `node_modules`
- Interfaz no modularizada en archivos separados
- No se usan frameworks
