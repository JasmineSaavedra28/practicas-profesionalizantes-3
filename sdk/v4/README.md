# SDK v4 — Sistema Integral Desacoplado (API + Frontend)

Esta versión implementa una refactorización arquitectónica profunda centrada en el **desacoplamiento total entre Frontend y Backend**, tal como se solicita en la Parte IV de la materia.

## Resumen (qué hace)
- **Desacoplamiento**: El backend ya no sirve archivos estáticos. Funciona exclusivamente como una WebAPI.
- **CORS**: Implementación de políticas de origen cruzado para permitir la comunicación entre diferentes servidores y puertos (Apache vs Node.js).
- **Autenticación y Sesiones**: Uso de sesiones en memoria y cookies `HttpOnly` con soporte para credenciales en peticiones cruzadas.
- **Autorización**: Control de acceso basado en base de datos mediante el mapeo de roles y permisos.
- **Seguridad**: Hashing SHA256 realizado íntegramente en el cliente para proteger la integridad de las credenciales.

## Estructura del Proyecto

```text
sdk/v4/
├── backend/              # Servidor WebAPI (Node.js)
│   ├── main.js           # Punto de entrada y registro de rutas RPC
│   ├── server.mjs        # Lógica del servidor, dispatcher y cabeceras CORS
│   ├── handlers.mjs      # Manejadores de la lógica de negocio (API)
│   ├── model.mjs         # Lógica de persistencia y autorización (SQL)
│   ├── db.mjs            # Conector agnóstico a SQLite
│   ├── config.json       # Parámetros de configuración
│   └── db.sqlite3        # Base de datos persistente
└── frontend/             # Aplicación Cliente (Apache / UniServer)
    └── index.html        # Interfaz de usuario y lógica de consumo de API
```

## Endpoints implementados

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST   | `/login`              | Autentica y genera cookie de sesión |
| POST   | `/logout`             | Invalida la sesión actual |
| POST   | `/register`           | Registro de usuarios |
| GET    | `/print`, `/log`, `/help`, `/sayHello`, `/sayBye` | Acciones protegidas (heredadas de v3) |

## Configuración de Servidores

Para el correcto funcionamiento del sistema desacoplado, se deben utilizar puertos diferentes:
- **Backend (WebAPI)**: Corre en Node.js (por defecto `http://localhost:3000`).
- **Frontend (Cliente)**: Debe ser servido por Apache (Uniform Server) en un puerto distinto (ej. `http://localhost:8081`).

### Manejo de CORS
El backend incluye cabeceras HTTP específicas para permitir la conexión desde el frontend:
- `Access-Control-Allow-Origin`: `*`
- `Access-Control-Allow-Methods`: `GET, POST, OPTIONS`
- Manejo de peticiones `OPTIONS` (Pre-flight requests).

## Comportamiento requerido (consigna)

- Se eliminó la ruta `/` del backend; Node.js ya no genera ni sirve el HTML.
- La aplicación cliente es independiente y consume la API mediante peticiones asíncronas (`fetch`).
- La autorización se verifica mediante la tabla `role_permission` antes de resolver peticiones protegidas.

- Las sesiones se gestionan mediante un `Map` en memoria inyectado a través del objeto `context`.

## Instrucciones de Ejecución

1. **Backend**:
   - Abrir una terminal en la carpeta `sdk/v4/backend`.
   - Ejecutar el servidor con: `node main.js`.
2. **Frontend**:
   - Copiar el contenido de la carpeta `sdk/v4/frontend` a la carpeta `www` de Uniform Server (UniServer/Apache).
   - Iniciar el servidor Apache.
   - Acceder desde el navegador a la URL de Apache (ej. `http://localhost:80/index.html`).

## Pruebas de Funcionamiento
Utilice la interfaz web para iniciar sesión. El navegador calculará el hash SHA256 y lo enviará al backend de Node.js. Una vez autenticado, la cookie de sesión permitirá realizar pruebas de autorización sobre los endpoints `/log` (permitido) y `/sayHello` (denegado), validando la arquitectura desacoplada.
