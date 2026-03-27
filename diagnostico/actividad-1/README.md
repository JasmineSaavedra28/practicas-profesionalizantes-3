# Actividad 1 - Gestión de Stock de Reciclaje

## Descripción

Sistema mínimo de gestión de stock para una planta de reciclaje.

## Requisitos

- Node.js (https://nodejs.org/)

## Instalación

1. Instalar Node.js.
2. En la carpeta `backend/`, ejecutar `npm install` para instalar dependencias.

## Ejecución

1. En la carpeta `backend/`, ejecutar `npm start` o `node server.js`.
2. Abrir `frontend/index.html` en un navegador web.

## Estructura del Proyecto

- `backend/`: Servidor Express con API REST (usa SQLite como base de datos).
- `frontend/`: Interfaz de usuario en HTML, CSS y JavaScript.
- `database/`: Esquema de la base de datos (no necesario con SQLite, se crea automáticamente).

## Operaciones

- Ver stock: Se muestra en la tabla al cargar la página.
- Agregar material: Usar el formulario "Agregar Material".
- Comprar (sumar stock): Usar el formulario "Comprar Material" con el ID.
- Vender (restar stock): Usar el formulario "Vender Material" con el ID (no permite stock negativo).
