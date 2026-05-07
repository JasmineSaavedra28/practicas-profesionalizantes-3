# Framework de Trabajo - Parte II: Autenticación y Gestión de Permisos

## Descripción

Sistema completo de autenticación y gestión de permisos basado en roles. Implementa operaciones CRUD consistentes para usuarios, roles y permisos con una interfaz web interactiva.

## Estructura de la Base de Datos

### Tablas Principales

#### `user`
- **id** (INTEGER): ID único del usuario (PK, autoincrementado)
- **username** (TEXT): Nombre de usuario único
- **password** (TEXT): Contraseña
- **email** (TEXT): Email único del usuario
- **role_id** (INTEGER): ID del rol asignado (FK)
- **created_at** (DATETIME): Timestamp de creación
- **updated_at** (DATETIME): Timestamp de última actualización

#### `role`
- **id** (INTEGER): ID único del rol (PK, autoincrementado)
- **name** (TEXT): Nombre único del rol
- **description** (TEXT): Descripción del rol
- **created_at** (DATETIME): Timestamp de creación

#### `permission`
- **id** (INTEGER): ID único del permiso (PK, autoincrementado)
- **name** (TEXT): Nombre único del permiso
- **description** (TEXT): Descripción del permiso
- **created_at** (DATETIME): Timestamp de creación

#### `role_permission`
- **role_id** (INTEGER): ID del rol (FK, PK)
- **permission_id** (INTEGER): ID del permiso (FK, PK)
- Relación de muchos-a-muchos entre roles y permisos

## Funcionalidades CRUD

Todas las operaciones siguen una convención de nombres consistente: **[verbo]_[entidad]**

### Usuarios
- `crear_usuario(db, username, password, email, role_id)` - Crear nuevo usuario
- `leer_usuario(db, id)` - Leer un usuario específico
- `listar_usuarios(db)` - Listar todos los usuarios
- `actualizar_usuario(db, id, username, password, email, role_id)` - Actualizar usuario
- `eliminar_usuario(db, id)` - Eliminar un usuario

### Roles
- `crear_rol(db, name, description)` - Crear nuevo rol
- `leer_rol(db, id)` - Leer un rol específico
- `listar_roles(db)` - Listar todos los roles
- `actualizar_rol(db, id, name, description)` - Actualizar rol
- `eliminar_rol(db, id)` - Eliminar un rol

### Permisos
- `crear_permiso(db, name, description)` - Crear nuevo permiso
- `leer_permiso(db, id)` - Leer un permiso específico
- `listar_permisos(db)` - Listar todos los permisos
- `actualizar_permiso(db, id, name, description)` - Actualizar permiso
- `eliminar_permiso(db, id)` - Eliminar un permiso

### Gestión de Relaciones
- `asignar_permiso_a_rol(db, role_id, permission_id)` - Asignar permiso a rol
- `obtener_permisos_rol(db, role_id)` - Obtener permisos de un rol

## Endpoints API

### Usuarios
- **POST** `/usuarios/crear` - Crear usuario
- **GET** `/usuarios/leer?id=<id>` - Leer usuario
- **GET** `/usuarios/listar` - Listar usuarios
- **PUT** `/usuarios/actualizar` - Actualizar usuario
- **DELETE** `/usuarios/eliminar?id=<id>` - Eliminar usuario

### Roles
- **POST** `/roles/crear` - Crear rol
- **GET** `/roles/listar` - Listar roles
- **PUT** `/roles/actualizar` - Actualizar rol
- **DELETE** `/roles/eliminar?id=<id>` - Eliminar rol
- **POST** `/roles/asignar-permiso` - Asignar permiso a rol
- **GET** `/roles/permisos?role_id=<id>` - Obtener permisos de un rol

### Permisos
- **POST** `/permisos/crear` - Crear permiso
- **GET** `/permisos/listar` - Listar permisos
- **PUT** `/permisos/actualizar` - Actualizar permiso
- **DELETE** `/permisos/eliminar?id=<id>` - Eliminar permiso

## Instalación y Uso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Generar datos de prueba
```bash
node seed_data.js
```

Este script crea automáticamente:
- **4 roles** predefinidos (Administrador, Gerente, Usuario, Invitado)
- **15 permisos** variados
- **30 usuarios** de prueba con diferentes roles

### 3. Iniciar el servidor
```bash
node main.js
```

El servidor se ejecutará en `http://127.0.0.1:3001`

### 4. Acceder a la interfaz web
Abrir `http://127.0.0.1:3001` en el navegador para acceder al panel de gestión completo.

## Datos de Prueba Generados

### Roles
| ID | Nombre | Descripción |
|----|--------|------------|
| 1 | Administrador | Usuario con acceso total al sistema |
| 2 | Gerente | Gerente con permisos de lectura y escritura |
| 3 | Usuario | Usuario estándar con permisos limitados |
| 4 | Invitado | Usuario invitado de solo lectura |

### Usuarios de Ejemplo
- **admin** - Rol: Administrador (ID: 1)
- **manager1, manager2** - Rol: Gerente (ID: 2)
- **usuario1-5** - Rol: Usuario (ID: 3)
- **invitado1, invitado2** - Rol: Invitado (ID: 4)
- **usuario_test_6 a usuario_test_25** - Diversos roles (20 usuarios adicionales)

**Contraseña para todos los usuarios de prueba:** `password123`

## Características

✅ **CRUD Consistente** - Todas las operaciones siguen el patrón [verbo]_[entidad]

✅ **Sistema de Roles** - Gestión completa de roles en el sistema

✅ **Sistema de Permisos** - Permisos granulares y asignables a roles

✅ **Relaciones Many-to-Many** - Roles pueden tener múltiples permisos

✅ **Interfaz Web** - Panel HTML interactivo sin frameworks

✅ **Datos de Prueba** - 30 usuarios + roles + permisos precargados

✅ **Timestamps** - created_at y updated_at en todas las entidades

✅ **API REST** - Endpoints consistentes basados en convenciones

## Ejemplos de Uso

### Crear un usuario
```bash
curl -X POST http://127.0.0.1:3001/usuarios/crear \
  -d "username=newuser&password=pass123&email=new@example.com&role_id=3"
```

### Listar todos los usuarios
```bash
curl http://127.0.0.1:3001/usuarios/listar
```

### Obtener permisos de un rol
```bash
curl "http://127.0.0.1:3001/roles/permisos?role_id=1"
```

### Actualizar un usuario
```bash
curl -X PUT http://127.0.0.1:3001/usuarios/actualizar \
  -d "id=1&username=admin_updated&password=newpass&email=admin@new.com&role_id=1"
```

### Eliminar un usuario
```bash
curl -X DELETE "http://127.0.0.1:3001/usuarios/eliminar?id=31"
```

## Tecnologías

- **Runtime:** Node.js
- **Base de datos:** SQLite (built-in con Node.js)
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript (sin frameworks)
- **API:** REST puro sin librerías externas

## Estructura de Archivos

```
v2/
├── main.js              # Punto de entrada del servidor
├── config.js            # Manejo de configuración
├── config.json          # Archivo de configuración
├── database.js          # Funciones CRUD y conexión a BD
├── handlers.js          # Handlers HTTP para todos los endpoints
├── server.js            # Router y dispatcher de requests
├── default.html         # Interfaz web interactiva
├── seed_data.js         # Script para generar datos de prueba
├── package.json         # Dependencias del proyecto
├── .gitignore           # Archivos a ignorar en git
└── db.sqlite3           # Base de datos (se genera automáticamente)
```

## Notas Importantes

- El archivo `db.sqlite3` se genera automáticamente al ejecutar `seed_data.js`
- No se incluye `node_modules/` en el repositorio (ver `.gitignore`)
- La interfaz HTML está en un único archivo (`default.html`) sin modularización
- No se utilizan frameworks frontend, solo JavaScript vanilla y CSS puro
- Todos los endpoints devuelven JSON
- Las contraseñas en los datos de prueba son plaintext (para desarrollo únicamente)

## Próximas Mejoras Posibles

- Implementar hash de contraseñas (bcrypt)
- Agregar autenticación con tokens/sesiones
- Implementar validación de permisos en los handlers
- Agregar logs de auditoría
- Implementar paginación en listados
- Agregar búsqueda y filtrado
