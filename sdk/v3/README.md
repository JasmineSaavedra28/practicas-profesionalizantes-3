# Sistema de Autenticación y Autorización — Versión mínima

Este repositorio contiene una versión simplificada y autocontenida del sistema
de autenticación y autorización visto en clase. 

## Resumen (qué hace)
- Autenticación con sesiones en memoria (no persistidas).
- Autorización basada en grupos y permisos de endpoint (`authorize`).
- Almacenamiento de contraseñas con SHA256 (procesado en el cliente).
- Interfaz de pruebas en `default.html` con botones para probar permisos.

## Estructura actual (archivos esenciales)
- `main.mjs` — servidor y lógica mínima (autenticación, autorización, sesiones).
- `default.html` — interfaz cliente de pruebas (login y botones de endpoints).
- `config.json` — configuración de host/puerto y ruta de DB.
- `db.sqlite3` — base de datos SQLite con usuarios, grupos, endpoints y permisos.
- `test-api.mjs` — pruebas automatizadas suministradas para validar la consigna.
- `README.md` — este archivo.

## Endpoints implementados

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/login` | Autentica y crea sesión |
| POST | `/logout` | Cierra sesión |
| POST | `/register` | Crea un usuario nuevo (guarda el hash recibido) |
| GET | `/print` | Acción protegida |
| GET | `/log` | Acción protegida |
| GET | `/help` | Acción protegida |
| GET | `/sayHello` | Acción protegida |
| GET | `/sayBye` | Acción protegida |

## Comportamiento requerido (consigna)

- Asumir que existe un usuario X en la tabla `user` asociado a un grupo G
  que tiene permisos sobre `/print`, `/log` y `/help` (pero no sobre
  `/sayHello` ni `/sayBye`).
- Cuando el cliente (desde `default.html`) ejecute `/log` con un usuario
  autenticado y sesión activa, la acción debe ejecutarse exitosamente.
- Cuando intente ejecutar `/sayHello`, la autorización debe denegar el acceso.

## Sesiones

- Las sesiones se guardan en memoria en un `Map` y solo existen mientras
  el servidor Node.js esté en ejecución.

## Contraseñas

- La seguridad se basa en el **hashing del lado del cliente**. El archivo `default.html` utiliza la función `calcularhashsha256` para que la contraseña nunca viaje en texto plano por la red.
- El servidor recibe directamente el hash y lo almacena o compara en la tabla `user` (columna `password_hash`).
- Se eliminó el uso de `salt` para simplificar la lógica de persistencia y evitar inconsistencias en el proceso de autenticación, siguiendo las recomendaciones de cátedra.
- Nota: SHA256 es irreversible pero es un hash rápido; para producción
  considerar `bcrypt` o `argon2`.

## Cómo ejecutar

1. Abrir una terminal en `sdk/v3`.
2. Ejecutar:
```bash
node main.mjs
```
3. Abrir el navegador en:
```text
http://127.0.0.1:3000
```

## Pruebas automáticas

Con el servidor en ejecución, correr:
```bash
node test-api.mjs
```

### Resultado esperado
- autenticación exitosa
- acceso permitido a `/log`
- acceso denegado a `/sayHello`
- sesión validada correctamente
- logout exitoso
- verificación de hash SHA256
