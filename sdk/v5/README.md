# SDK v5 — Refactorización Progresiva con WebComponents y RPC Web API

**Repositorio de entrega:** `sdk/v5`

**Condición:** Se trabaja tomando lo realizado en `sdk/v4` como base para la transición hacia una arquitectura más modular y una integración final futura.

## Objetivo general
Esta versión está destinada a comenzar una refactorización progresiva del frontend y sentar las bases para la integración final. El foco está en:

- encapsular las llamadas a la WebAPI en una función única de RPC,
- construir componentes reutilizables con WebComponents para login y registro,
- mantener el estilo W3Admin con el logo institucional de ISFT 151.

## 1. Adecuación del código frontend

### Problema
El código de frontend tenía mucho código repetido en la lógica de llamadas HTTP a la WebAPI.

### Solución
Se desarrolló la función `async RPCWebAPIFetch(name, content)` que:

- obliga a usar `POST` en todas las peticiones,
- envía los datos como JSON en el cuerpo (`Content-Type: application/json`),
- parsea siempre la respuesta como JSON,
- lanza excepciones para todos los códigos de estado distintos a la categoría `200`.

### Comportamiento requerido

- Si la respuesta es `200` se devuelve el cuerpo parseado.
- Si la respuesta es `401` o `403`, se lanza una excepción específica de tipo `UnauthorizedError`.
- Cualquier otro error HTTP también genera una excepción.
- El frontend puede responder a esas excepciones vaciando credenciales y mostrando el login.

## 2. WebComponents (Trabajo compartido con Seminario de Actualización)

### Qué se implementa
Se construyeron dos WebComponents principales basados en la plantilla W3Admin:

- `WCLoginFormView`: encapsula el formulario de LOGIN.
- `WCRegisterFormView`: encapsula el formulario de registro.

Los componentes toman como referencia los archivos de plantilla:

- `sdk/v5/w3admin-main/w3admin-main/login.html`
- `sdk/v5/w3admin-main/w3admin-main/register.html`

### Funcionalidad de los componentes

- `WCLoginFormView` encapsula el formulario de autenticación.
- `WCRegisterFormView` encapsula el formulario de registro.
- Ambos componentes exponen eventos personalizados (`login` y `register`) que el frontend consume.
- La lógica de validación y hashing SHA256 se mantiene en el cliente antes de enviar a la API.

### Integración visual

- Se utiliza el logo institucional `sdk/v5/isft.png` en la plantilla base.
- El diseño mantiene el estilo W3Admin para el panel de administración.
- El login y el registro se conservan en la misma pantalla, sin ventanas emergentes separadas.

## 3. Refactorización final de arquitectura

- Pendiente. Se definirá con el docente.

## 4. Integración final

- Se planea integrar la gestión de usuarios, grupos y permisos de `sdk/v2` con el frontend basado en WebComponents.
- Reglas de comportamiento previstas:
  - Si `RPCWebAPIFetch` lanza `UnauthorizedError`, el frontend vacía credenciales y muestra la pantalla de login.
  - El logout debe limpiar sesión y volver al login.
  - La barra lateral debe mostrar accesos a:
    - Gestión de usuarios y grupos
    - Control de accesos
  - La barra superior debe incluir el botón de cierre de sesión.
  - La plantilla debe ser completamente funcional para los casos de uso presentados.

## Estructura de `sdk/v5`

```text
sdk/v5/
├── backend/          # WebAPI backend basado en la arquitectura de v4
├── frontend/         # Frontend W3Admin con WebComponents
│   └── index.html    # Interfaz principal con `RPCWebAPIFetch` y componentes
├── isft.png          # Logo institucional ISFT 151
└── w3admin-main/     # Plantilla W3Admin de referencia usada para los componentes
```

## Notas importantes

- Esta versión arranca desde `sdk/v4` y comienza una refactorización de frontend.
- El foco de esta entrega es completo hasta el punto 2; los puntos 3 y 4 se mencionan como objetivos de integración futura.
- Las plantillas de W3Admin se utilizaron como fuente de diseño y referencia para los WebComponents.
