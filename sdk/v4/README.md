# SDK v4 — Sistema Integral de Gestión, Autenticación y Autorización

Esta versión representa la convergencia final entre la arquitectura desacoplada de la **v2** y las funcionalidades de seguridad de la **v3**.

## Resumen (qué hace)
- **Arquitectura v2**: Desacoplamiento total entre el servidor, el ruteador, los handlers y el modelo de datos.
- **Seguridad v3**: Autenticación mediante sesiones en memoria, cookies `HttpOnly` y hashing SHA256 en el cliente.
- **Gestión Completa**: ABM (Alta, Baja, Modificación) de Usuarios, Roles y Permisos.
- **Autorización Dinámica**: Verificación de permisos basada en la base de datos (tabla `role_permission`) antes de ejecutar acciones protegidas.
- **Patrón RPC**: Cumplimiento estricto de la consigna utilizando únicamente métodos **GET** y **POST**.

## Estructura del Proyecto

```text
v4/
├── main.js              # Punto de entrada, registro de rutas y arranque.
├── config.js/json       # Configuración del entorno.
├── default.html         # Interfaz de usuario (Frontend).
├── db.sqlite3           # Base de datos persistente.
└── src/
    ├── db.mjs           # Conector agnóstico a SQLite.
    ├── model.mjs        # Lógica de datos (SQL, ABM y Autorización).
    ├── handlers.mjs     # Procesadores de peticiones (Lógica de negocio).
    └── server.mjs       # Servidor HTTP y Dispatcher con Middleware de sesión.
```

## Endpoints implementados

### Sistema y Sesión
- `POST /login`: Valida credenciales y genera cookie de sesión.
- `POST /logout`: Invalida la sesión actual.
- `POST /register`: Alias de creación de usuario.

### Gestión de Usuarios (RPC)
- `POST /usuarios/crear`
- `GET /usuarios/listar`
- `GET /usuarios/leer?id=X`
- `POST /usuarios/actualizar`
- `POST /usuarios/eliminar`

### Roles y Permisos
- `POST /roles/crear` | `GET /roles/listar` | `POST /roles/eliminar`
- `POST /permisos/crear` | `GET /permisos/listar`
- `POST /roles/asignar-permiso`: Vincula un permiso a un rol.
- `GET /roles/permisos?role_id=X`: Lista permisos asignados.

### Acciones Protegidas (v3 legacy)
- `GET /print`, `/log`, `/help`, `/sayHello`, `/sayBye`.

## Comportamiento requerido (consigna)

- El servidor utiliza un **Dispatcher** que actúa como middleware.
- Si una ruta no es pública (`/`, `/login`, `/register`), se verifica la existencia de una sesión válida en el `Map` de memoria a través de la cookie enviada.
- Para los endpoints de acciones (`/log`, `/print`, etc.), se consulta la función `authorize` en el modelo para verificar si el `role_id` del usuario tiene permiso sobre el path solicitado.

## Seguridad

- **Contraseñas**: Se reciben como hashes SHA256 calculados por el navegador. El servidor nunca conoce la contraseña en texto plano.
- **Sesiones**: Almacenadas en un `Map` inyectado mediante el `context` a los handlers, garantizando desacoplamiento.
- **Cookies**: Uso de `HttpOnly` para mitigar ataques XSS.

## Ejecución

1. Abrir terminal en `sdk/v4`.
2. Ejecutar el servidor: `node main.js`
3. Acceder a `http://localhost:3000` (o el puerto configurado en `config.json`).
