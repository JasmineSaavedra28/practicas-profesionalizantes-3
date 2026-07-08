# SDK v2 — Sistema de Autenticación y Gestión de Permisos

## Descripción

Proyecto de `sdk/v2` para el trabajo práctico de autenticación y permisos. Incluye:
- Gestión de usuarios
- Gestión de roles
- Gestión de permisos
- Asignación de permisos a roles
- Interfaz web simple en un solo archivo HTML
- Base de datos SQLite integrada con persistencia.

## Estado del Proyecto

- **Arquitectura Desacoplada**: El ruteador es genérico y no tiene dependencias de lógica o base de datos.
- **Capa de Datos**: `src/db.mjs` solo provee la conexión. El esquema y las funciones de ABM están en `src/model.mjs`.
- Los handlers HTTP están en `src/handlers.mjs`
- El router y dispatcher están en `src/server.mjs`
- El servidor se inicia desde `main.js`
- La interfaz web se sirve desde `public/default.html`
- El script de datos `seed.mjs` ahora utiliza `src/model.mjs` directamente.

## Endpoints disponibles

### Usuarios
- **POST** `/usuarios/crear`
- **GET** `/usuarios/leer?id=<id>`
- **GET** `/usuarios/listar`
- **POST** `/usuarios/actualizar`
- **POST** `/usuarios/eliminar` (vía Body ID)

### Roles
- **POST** `/roles/crear`
- **GET** `/roles/listar`
- **POST** `/roles/actualizar`
- **POST** `/roles/eliminar?id=<id>` (RPC via Query)
- **POST** `/roles/asignar-permiso`
- **GET** `/roles/permisos?role_id=<id>`

### Permisos
- **POST** `/permisos/crear`
- **GET** `/permisos/listar`
- **POST** `/permisos/actualizar`
- **POST** `/permisos/eliminar?id=<id>` (RPC via Query)

## Instalación y ejecución

Desde `sdk/v2`:

```bash
npm install
npm run seed
npm start
```

Luego abrir `http://127.0.0.1:3001` en el navegador.

## Notas importantes

- **Patrón RPC**: Se utilizan exclusivamente métodos **GET** y **POST** para cumplir con el esquema de la materia.
- **Configuración Dinámica**: El servidor resuelve la URL base mediante `config.json` y headers de petición, eliminando URLs estáticas en el código.
- **Inyección de Dependencias**: El `context` (db y config) se inyecta en los handlers en tiempo de despacho.
- **Estructura Limpia**: Se eliminó `src/usecase.mjs` y el script `seed.mjs` ahora se apoya directamente en `src/model.mjs`.

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
├── .gitignore
├── db.sqlite3
├── seed.mjs
├── public/default.html
└── src/
    ├── db.mjs
    ├── model.mjs
    ├── handlers.mjs
    └── server.mjs
```

## Consideraciones de entrega

- El repositorio entregable es `sdk/v2`
- Se mantiene la base de datos en `db.sqlite3`
- No se incluye `node_modules`
- Interfaz no modularizada en archivos separados
- No se usan frameworks
