# Arquitectura del proyecto web

## 1. Propósito del documento

Este documento define la organización recomendada para construir y mantener las distintas pantallas del proyecto web.

La arquitectura busca que:

- Cada pantalla sea fácil de encontrar y modificar.
- El HTML conserve una estructura predecible.
- Los estilos y comportamientos estén separados correctamente.
- Las conexiones con servicios externos no se mezclen con la interfaz.
- Los componentes comunes puedan reutilizarse.
- Los archivos estén comentados de manera uniforme.
- El proyecto pueda crecer sin convertirse en un conjunto de archivos difíciles de mantener.

La propuesta toma como punto de partida una aplicación desarrollada con HTML, CSS y JavaScript modular. Los mismos principios pueden adaptarse posteriormente a React, Vue, Angular u otro framework.

---

## 2. Principios generales

### 2.1. Separación de responsabilidades

Cada tipo de archivo debe tener una responsabilidad principal:

| Tipo de archivo | Responsabilidad |
| --- | --- |
| HTML | Define la estructura y el contenido de la pantalla. |
| CSS | Define la presentación visual, distribución y adaptación a diferentes tamaños. |
| JavaScript de pantalla | Controla eventos y coordina el comportamiento de una pantalla. |
| Componentes | Implementan elementos reutilizables de la interfaz. |
| Servicios | Realizan solicitudes a APIs o al backend. |
| Configuración | Centraliza rutas, constantes y valores dependientes del entorno. |
| Utilidades | Contiene funciones genéricas reutilizables. |
| Backend | Protege credenciales, aplica reglas de negocio y accede a la base de datos. |

Esta separación evita que un solo archivo contenga estructura, estilos, llamadas al servidor y reglas de negocio al mismo tiempo.

### 2.2. Organización por pantalla o funcionalidad

Cada pantalla debe contar con una carpeta propia. Dentro de ella se colocan los archivos exclusivos de esa pantalla.

Por ejemplo, la pantalla de usuarios podría contener:

```text
usuarios/
├── usuarios.html
├── usuarios.css
├── usuarios.js
├── usuarios-table.js
├── usuarios-form.js
└── usuarios-filters.js
```

Los archivos auxiliares solamente deben crearse cuando la pantalla realmente lo necesite. Una pantalla pequeña puede comenzar con tres archivos: HTML, CSS y JavaScript.

### 2.3. Reutilización antes que duplicación

Los elementos que aparezcan en varias pantallas no deben copiarse manualmente en cada una. Deben transformarse en componentes compartidos.

Algunos ejemplos son:

- Encabezado.
- Menú lateral.
- Navegación principal.
- Pie de página.
- Botones comunes.
- Ventanas modales.
- Mensajes de confirmación.
- Indicadores de carga.
- Notificaciones.
- Tablas reutilizables.

### 2.4. Crecimiento gradual

No es necesario crear desde el primer día todos los archivos posibles. La estructura debe crecer junto con las necesidades del proyecto.

La regla práctica será:

1. Comenzar con la estructura mínima.
2. Separar una responsabilidad cuando el archivo deje de ser fácil de entender.
3. Mover a `components/` aquello que empiece a repetirse.
4. Mover a `services/` toda comunicación con el backend.
5. Mover a `utils/` solamente las funciones que sean realmente genéricas.

---

## 3. Estructura general recomendada

```text
proyecto/
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   │
│   └── src/
│       ├── assets/
│       │   ├── fonts/
│       │   ├── icons/
│       │   └── images/
│       │
│       ├── components/
│       │   ├── header/
│       │   ├── sidebar/
│       │   ├── footer/
│       │   ├── modal/
│       │   └── notifications/
│       │
│       ├── config/
│       │   ├── environment.js
│       │   └── routes.js
│       │
│       ├── pages/
│       │   ├── inicio/
│       │   │   ├── inicio.html
│       │   │   ├── inicio.css
│       │   │   └── inicio.js
│       │   │
│       │   ├── usuarios/
│       │   │   ├── usuarios.html
│       │   │   ├── usuarios.css
│       │   │   ├── usuarios.js
│       │   │   ├── usuarios-table.js
│       │   │   └── usuarios-form.js
│       │   │
│       │   └── configuracion/
│       │       ├── configuracion.html
│       │       ├── configuracion.css
│       │       └── configuracion.js
│       │
│       ├── services/
│       │   ├── api.js
│       │   ├── auth.service.js
│       │   └── usuarios.service.js
│       │
│       ├── styles/
│       │   ├── reset.css
│       │   ├── variables.css
│       │   ├── global.css
│       │   └── utilities.css
│       │
│       ├── utils/
│       │   ├── formatters.js
│       │   ├── validators.js
│       │   └── dom.js
│       │
│       └── main.js
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── app.js
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   └── arquitectura.md
│
├── tests/
│   ├── frontend/
│   └── backend/
│
├── .env.example
├── .gitignore
└── README.md
```

Si el proyecto todavía no necesita backend, las carpetas `backend/` y `database/` pueden añadirse después. Aun así, el frontend debe diseñarse suponiendo que las conexiones externas se realizarán a través de servicios.

---

## 4. Responsabilidad de cada carpeta

### 4.1. `frontend/public/`

Contiene archivos que se sirven directamente y no forman parte de la lógica de la aplicación.

Ejemplos:

- Icono del sitio.
- Archivo `robots.txt`.
- Manifiesto de una aplicación instalable.
- Recursos públicos que deban conservar un nombre fijo.

### 4.2. `frontend/src/assets/`

Almacena recursos visuales y tipográficos utilizados por las pantallas.

```text
assets/
├── fonts/
├── icons/
└── images/
```

Los nombres deben describir el contenido del recurso:

```text
logo-principal.svg
icono-usuario.svg
fondo-inicio.webp
```

Se deben evitar nombres ambiguos como `imagen1.png`, `nuevo.svg` o `final-final.png`.

### 4.3. `frontend/src/components/`

Contiene partes reutilizables de la interfaz.

Cada componente puede incluir su propia estructura, estilos y comportamiento:

```text
modal/
├── modal.html
├── modal.css
└── modal.js
```

Un componente no debe conocer detalles innecesarios de una pantalla específica. Por ejemplo, un modal puede saber cómo abrirse y cerrarse, pero la pantalla debe decidir qué contenido mostrar y qué acción ejecutar al confirmar.

### 4.4. `frontend/src/pages/`

Contiene las pantallas o vistas principales del sitio.

Cada carpeta representa una pantalla navegable. Sus archivos coordinan componentes y servicios, pero no deben duplicar funciones genéricas.

Ejemplo:

```text
pages/usuarios/usuarios.js
```

Este archivo puede:

- Inicializar la pantalla.
- Escuchar eventos de botones y formularios.
- Solicitar datos mediante `usuarios.service.js`.
- Enviar los datos recibidos al módulo encargado de dibujar la tabla.
- Mostrar errores o estados de carga.

No debería:

- Contener credenciales.
- Abrir una conexión directa con la base de datos.
- Repetir validadores ya existentes.
- Incluir cientos de líneas de estilos dentro de JavaScript.

### 4.5. `frontend/src/services/`

Centraliza la comunicación con el backend o con APIs autorizadas.

Se recomienda un servicio base para controlar aspectos comunes:

- URL base.
- Encabezados HTTP.
- Conversión de respuestas.
- Gestión de errores.
- Autenticación.
- Cancelación o tiempo máximo de solicitudes.

Después se crean servicios por dominio:

```text
services/
├── api.js
├── auth.service.js
├── usuarios.service.js
└── configuracion.service.js
```

### 4.6. `frontend/src/config/`

Contiene configuración pública de la aplicación.

Ejemplos:

- Rutas internas.
- URL pública del backend.
- Límites de paginación.
- Banderas de funcionalidades.
- Constantes compartidas.

Esta carpeta no debe contener secretos. Todo archivo enviado al navegador puede ser visto por una persona usuaria.

### 4.7. `frontend/src/styles/`

Contiene estilos que afectan a toda la aplicación.

| Archivo | Contenido esperado |
| --- | --- |
| `reset.css` | Normalización de estilos del navegador. |
| `variables.css` | Colores, tamaños, tipografía, espacios y capas. |
| `global.css` | Estilos generales de `body`, títulos, enlaces y formularios. |
| `utilities.css` | Clases pequeñas de utilidad utilizadas en varias pantallas. |

Los estilos exclusivos de una pantalla deben permanecer dentro de la carpeta de esa pantalla.

### 4.8. `frontend/src/utils/`

Contiene funciones reutilizables que no pertenecen a una pantalla ni a un servicio concreto.

Ejemplos:

- Formatear fechas.
- Formatear monedas.
- Validar correos electrónicos.
- Limpiar texto.
- Consultar elementos del DOM de forma segura.

La carpeta `utils/` no debe convertirse en un lugar para guardar código sin clasificación. Cada utilidad debe tener una responsabilidad clara.

### 4.9. `backend/`

El backend recibe las solicitudes del navegador, valida la información, ejecuta reglas de negocio y se comunica con la base de datos.

La estructura propuesta separa:

- `routes/`: define las direcciones disponibles.
- `controllers/`: recibe solicitudes y prepara respuestas.
- `services/`: contiene reglas de negocio.
- `repositories/`: encapsula consultas a la base de datos.
- `models/`: define entidades o modelos de datos.
- `middlewares/`: maneja autenticación, permisos, validación y errores.
- `config/`: configura base de datos, servidor y variables de entorno.

### 4.10. `database/`

Contiene archivos para administrar la evolución de la base de datos.

- `migrations/`: cambios versionados en la estructura de la base de datos.
- `seeds/`: datos iniciales o de prueba controlados.

No se deben guardar respaldos con información real ni datos sensibles dentro del repositorio.

---

## 5. Estructura estándar de cada HTML

Todas las pantallas deben mantener un orden similar. Esto permite encontrar rápidamente cada bloque sin importar quién haya creado el archivo.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- =====================================================
         METADATOS DE LA PANTALLA
    ====================================================== -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta
        name="description"
        content="Descripción breve de la pantalla"
    >

    <!-- =====================================================
         TÍTULO E ÍCONO
    ====================================================== -->
    <title>Nombre de la pantalla</title>
    <link rel="icon" href="../../public/favicon.ico">

    <!-- =====================================================
         ESTILOS GLOBALES
    ====================================================== -->
    <link rel="stylesheet" href="../../styles/reset.css">
    <link rel="stylesheet" href="../../styles/variables.css">
    <link rel="stylesheet" href="../../styles/global.css">

    <!-- =====================================================
         ESTILOS DE LA PANTALLA
    ====================================================== -->
    <link rel="stylesheet" href="./nombre-pantalla.css">
</head>

<body>
    <!-- =====================================================
         ENLACE DE ACCESIBILIDAD
    ====================================================== -->
    <a class="skip-link" href="#contenido-principal">
        Ir al contenido principal
    </a>

    <!-- =====================================================
         ENCABEZADO
    ====================================================== -->
    <header id="encabezado-principal">
        <!-- El componente de encabezado se carga aquí. -->
    </header>

    <!-- =====================================================
         NAVEGACIÓN
    ====================================================== -->
    <nav id="navegacion-principal" aria-label="Navegación principal">
        <!-- El menú principal se carga aquí. -->
    </nav>

    <!-- =====================================================
         CONTENIDO PRINCIPAL
    ====================================================== -->
    <main id="contenido-principal">
        <!-- Secciones exclusivas de esta pantalla. -->
    </main>

    <!-- =====================================================
         PIE DE PÁGINA
    ====================================================== -->
    <footer id="pie-pagina">
        <!-- El componente de pie de página se carga aquí. -->
    </footer>

    <!-- =====================================================
         MODALES Y ELEMENTOS FLOTANTES
    ====================================================== -->
    <div id="contenedor-modales"></div>
    <div
        id="contenedor-notificaciones"
        aria-live="polite"
        aria-atomic="true"
    ></div>

    <!-- =====================================================
         SCRIPTS Y PUNTO DE ENTRADA DE LA PANTALLA

         Los scripts se colocan al final para que la estructura
         de la página ya exista cuando se ejecute JavaScript.
    ====================================================== -->
    <script type="module" src="./nombre-pantalla.js"></script>
</body>
</html>
```

### Orden de las secciones

El orden estándar será:

1. Metadatos.
2. Título e icono.
3. Estilos globales.
4. Estilos propios de la pantalla.
5. Enlace de accesibilidad.
6. Encabezado.
7. Navegación.
8. Contenido principal.
9. Pie de página.
10. Modales y notificaciones.
11. Scripts.

Los estilos se cargan dentro de `head`. Los scripts de la pantalla se colocan al final de `body`.

Los módulos cargados con `type="module"` ya tienen un comportamiento diferido, pero mantenerlos al final hace visible y consistente la convención acordada para el proyecto.

---

## 6. Organización del JavaScript de una pantalla

El archivo principal de cada pantalla debe funcionar como coordinador.

```js
/**
 * Pantalla: Administración de usuarios
 *
 * Responsabilidades:
 * - Inicializar los elementos de la pantalla.
 * - Registrar eventos.
 * - Solicitar datos al servicio de usuarios.
 * - Coordinar el formulario y la tabla.
 *
 * Conexiones relacionadas:
 * - services/usuarios.service.js
 */

import { obtenerUsuarios } from '../../services/usuarios.service.js';
import { mostrarUsuarios } from './usuarios-table.js';
import { iniciarFormulario } from './usuarios-form.js';

// ============================================================
// REFERENCIAS DEL DOM
// ============================================================

const tablaUsuarios = document.querySelector('#tabla-usuarios');
const mensajeEstado = document.querySelector('#mensaje-estado');

// ============================================================
// ESTADO DE LA PANTALLA
// ============================================================

const estado = {
    usuarios: [],
    cargando: false,
    error: null,
};

// ============================================================
// CARGA DE DATOS
// ============================================================

async function cargarUsuarios() {
    estado.cargando = true;
    mensajeEstado.textContent = 'Cargando usuarios...';

    try {
        estado.usuarios = await obtenerUsuarios();
        mostrarUsuarios(tablaUsuarios, estado.usuarios);
        mensajeEstado.textContent = '';
    } catch (error) {
        estado.error = error;
        mensajeEstado.textContent = 'No fue posible cargar los usuarios.';
    } finally {
        estado.cargando = false;
    }
}

// ============================================================
// EVENTOS
// ============================================================

function registrarEventos() {
    iniciarFormulario({ alGuardar: cargarUsuarios });
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

async function iniciarPantalla() {
    registrarEventos();
    await cargarUsuarios();
}

iniciarPantalla();
```

### Orden recomendado dentro de JavaScript

1. Comentario de responsabilidad del archivo.
2. Importaciones.
3. Constantes y referencias del DOM.
4. Estado local.
5. Funciones de presentación.
6. Funciones de carga o coordinación.
7. Eventos.
8. Inicialización.

---

## 7. Conexiones y servicios

### 7.1. Regla principal

El HTML no debe contener la implementación de las conexiones.

En la parte inferior del HTML se carga el archivo JavaScript de la pantalla. Ese archivo importa un servicio, y el servicio se comunica con el backend.

```text
HTML de la pantalla
        ↓
JavaScript de la pantalla
        ↓
Servicio del frontend
        ↓
API del backend
        ↓
Servicio del backend
        ↓
Repositorio
        ↓
Base de datos
```

### 7.2. Cliente base para la API

Un módulo base evita repetir la dirección del servidor, encabezados y manejo de errores.

```js
/**
 * Cliente común para comunicarse con el backend.
 * Este archivo no debe contener contraseñas ni claves privadas.
 */

import { API_URL } from '../config/environment.js';

export async function solicitar(ruta, opciones = {}) {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
            'Content-Type': 'application/json',
            ...opciones.headers,
        },
    });

    if (!respuesta.ok) {
        throw new Error(`La solicitud falló con estado ${respuesta.status}`);
    }

    if (respuesta.status === 204) {
        return null;
    }

    return respuesta.json();
}
```

### 7.3. Servicio específico

```js
/**
 * Operaciones disponibles para el dominio de usuarios.
 */

import { solicitar } from './api.js';

export function obtenerUsuarios() {
    return solicitar('/usuarios');
}

export function obtenerUsuario(id) {
    return solicitar(`/usuarios/${id}`);
}

export function crearUsuario(datos) {
    return solicitar('/usuarios', {
        method: 'POST',
        body: JSON.stringify(datos),
    });
}

export function actualizarUsuario(id, datos) {
    return solicitar(`/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
    });
}
```

La pantalla no necesita conocer cómo se construye cada solicitud. Solo utiliza operaciones con nombres claros.

### 7.4. Información que nunca debe colocarse en el frontend

- Contraseñas de base de datos.
- Claves privadas.
- Tokens administrativos.
- Credenciales de servicios internos.
- Llaves secretas de proveedores externos.
- Cadenas de conexión privadas.
- Reglas de autorización que solo existan en el navegador.

El navegador es un entorno público. Aunque una variable se llame “secreta” o se encuentre en un archivo oculto durante el desarrollo, dejará de ser secreta si se incluye en el código enviado al navegador.

---

## 8. Variables de entorno

El proyecto puede incluir un archivo `.env.example` para documentar qué configuración necesita.

```dotenv
# Dirección pública utilizada por el frontend.
PUBLIC_API_URL=http://localhost:3000/api

# Puerto del servidor backend.
PORT=3000

# La conexión real debe configurarse localmente y no subirse al repositorio.
DATABASE_URL=
```

Reglas:

1. `.env.example` puede versionarse porque no contiene valores secretos.
2. `.env` no debe guardarse en el repositorio.
3. Las variables privadas solamente deben ser leídas por el backend.
4. Las variables públicas del frontend deben considerarse visibles para cualquier visitante.
5. El archivo `README.md` debe explicar cómo crear la configuración local.

---

## 9. Convención de comentarios

Los comentarios deben facilitar la navegación, explicar decisiones y aclarar responsabilidades. No deben repetir literalmente lo que ya expresa el código.

### 9.1. Encabezado de archivo

Cada archivo importante debe comenzar con una descripción breve:

```js
/**
 * Componente: Modal de confirmación
 *
 * Responsabilidad:
 * - Mostrar una pregunta de confirmación.
 * - Ejecutar las acciones de aceptar o cancelar.
 *
 * No realiza solicitudes al servidor.
 */
```

### 9.2. División principal

Para bloques principales se utilizará:

```js
// ============================================================
// INICIALIZACIÓN DE LA PANTALLA
// ============================================================
```

### 9.3. División secundaria

Para subdivisiones se utilizará:

```js
// ------------------------------------------------------------
// Eventos del formulario
// ------------------------------------------------------------
```

### 9.4. Comentario explicativo

Se utiliza cuando existe una decisión que no es evidente:

```js
// Se conserva el filtro al recargar para no interrumpir la tarea del usuario.
const filtroActual = obtenerFiltroGuardado();
```

### 9.5. Comentarios que deben evitarse

No se deben añadir comentarios que solo traduzcan la instrucción:

```js
// Incrementar contador en uno.
contador += 1;
```

Tampoco se debe conservar código desactivado dentro de comentarios. El historial de versiones debe encargarse de conservar implementaciones anteriores.

---

## 10. Convenciones de nombres

El proyecto debe elegir un idioma principal para nombres internos y mantenerlo de forma consistente. En esta propuesta se utilizan nombres en español.

### Archivos y carpetas

Utilizar minúsculas y guiones:

```text
recuperar-contrasena.html
usuarios-table.js
menu-lateral.css
```

### Variables y funciones

Utilizar `camelCase` y comenzar las funciones con un verbo:

```js
const usuariosActivos = [];

function obtenerUsuarios() {}
function validarFormulario() {}
function mostrarNotificacion() {}
```

### Constantes globales

Utilizar mayúsculas y guiones bajos:

```js
const API_URL = '...';
const MAXIMO_INTENTOS = 3;
```

### Clases de CSS

Utilizar nombres descriptivos en minúsculas:

```css
.usuarios-tabla {}
.usuarios-tabla__encabezado {}
.usuarios-tabla__fila--seleccionada {}
```

### Identificadores HTML

Los identificadores deben reservarse para elementos únicos o para enlaces de accesibilidad y JavaScript:

```html
<main id="contenido-principal"></main>
<form id="formulario-usuario"></form>
```

---

## 11. Organización de estilos

### 11.1. Variables visuales

Los valores compartidos deben definirse una sola vez:

```css
:root {
    /* Colores */
    --color-primario: #2457d6;
    --color-texto: #1d2433;
    --color-fondo: #f6f7fb;
    --color-error: #b42318;

    /* Espaciado */
    --espacio-xs: 0.25rem;
    --espacio-sm: 0.5rem;
    --espacio-md: 1rem;
    --espacio-lg: 1.5rem;
    --espacio-xl: 2rem;

    /* Bordes */
    --radio-sm: 0.25rem;
    --radio-md: 0.5rem;

    /* Capas */
    --capa-menu: 100;
    --capa-modal: 1000;
    --capa-notificacion: 1100;
}
```

### 11.2. Orden dentro de un CSS de pantalla

```css
/* ============================================================
   CONTENEDOR PRINCIPAL
============================================================ */

/* ============================================================
   ENCABEZADO DE LA PANTALLA
============================================================ */

/* ============================================================
   FILTROS
============================================================ */

/* ============================================================
   TABLA O CONTENIDO CENTRAL
============================================================ */

/* ============================================================
   ESTADOS VACÍOS Y ERRORES
============================================================ */

/* ============================================================
   DISEÑO RESPONSIVO
============================================================ */
```

### 11.3. Alcance de los estilos

- Los estilos globales deben ser pocos y deliberados.
- Cada componente debe utilizar clases propias.
- Las pantallas no deben depender de selectores excesivamente generales.
- Se deben evitar selectores frágiles basados en demasiados niveles de anidación.
- Las adaptaciones responsivas deben permanecer cerca de la sección que modifican o reunirse al final siguiendo una convención única.

---

## 12. Navegación entre pantallas

Mientras el proyecto utilice HTML independiente por pantalla, la navegación puede realizarse mediante enlaces normales:

```html
<a href="../usuarios/usuarios.html">Usuarios</a>
```

Las rutas deben centralizarse cuando empiecen a repetirse o cuando exista un proceso de construcción que permita hacerlo.

Si el sistema evoluciona hacia una aplicación de una sola página, las carpetas de `pages/`, `components/`, `services/`, `config/` y `utils/` pueden conservarse. Lo que cambiará principalmente será el sistema de rutas y la forma de representar las vistas.

---

## 13. Estados que debe contemplar cada pantalla

Una pantalla que carga información no solo tiene un estado “correcto”. Debe contemplar como mínimo:

1. Estado inicial.
2. Carga en progreso.
3. Datos disponibles.
4. Resultado vacío.
5. Error de conexión.
6. Error de validación.
7. Acción realizada correctamente.
8. Falta de permisos, cuando corresponda.

Estos estados deben definirse desde el diseño para evitar interfaces que parezcan bloqueadas cuando la conexión es lenta o falla.

---

## 14. Accesibilidad

La estructura de todas las pantallas debe considerar:

- Un solo contenido principal mediante `main`.
- Jerarquía correcta de encabezados.
- Etiquetas asociadas a cada control de formulario.
- Navegación mediante teclado.
- Indicadores de enfoque visibles.
- Texto alternativo para imágenes informativas.
- Botones reales para acciones y enlaces para navegación.
- Mensajes accesibles para errores y notificaciones.
- Contraste suficiente entre texto y fondo.
- Uso moderado y correcto de atributos ARIA.

Ejemplo de campo accesible:

```html
<div class="campo-formulario">
    <label for="correo">Correo electrónico</label>
    <input
        id="correo"
        name="correo"
        type="email"
        autocomplete="email"
        aria-describedby="correo-error"
        required
    >
    <p id="correo-error" class="campo-formulario__error"></p>
</div>
```

---

## 15. Seguridad básica

La arquitectura debe aplicar estas reglas desde el inicio:

- Nunca confiar únicamente en la validación del navegador.
- Validar nuevamente todos los datos en el backend.
- Escapar o tratar como texto el contenido proporcionado por usuarios.
- No insertar contenido desconocido mediante `innerHTML`.
- Proteger rutas privadas en el backend.
- Verificar permisos en cada operación sensible.
- Utilizar conexiones HTTPS en producción.
- No mostrar detalles internos del servidor en mensajes de error.
- No registrar contraseñas, tokens ni información sensible.
- Limitar intentos en operaciones de autenticación.
- Mantener dependencias actualizadas.

La interfaz puede ocultar botones según los permisos, pero esto no sustituye la autorización del backend.

---

## 16. Manejo de errores

Los errores deben tratarse en la capa adecuada:

| Capa | Responsabilidad |
| --- | --- |
| Cliente base de API | Detectar respuestas fallidas y normalizar el error. |
| Servicio específico | Añadir contexto propio de la operación cuando sea necesario. |
| Pantalla | Mostrar un mensaje comprensible y ofrecer una acción posible. |
| Backend | Registrar el detalle técnico y devolver una respuesta segura. |

El mensaje visible debe ayudar a la persona usuaria:

```text
No fue posible cargar los usuarios. Intenta nuevamente.
```

El detalle técnico puede registrarse en el entorno de desarrollo, pero no debe exponerse completo en producción.

---

## 17. Pruebas recomendadas

### Frontend

- Validadores y formateadores.
- Servicios y manejo de respuestas.
- Interacciones principales de formularios.
- Estados de carga, error y resultado vacío.
- Navegación básica entre pantallas.
- Comportamiento en diferentes tamaños de pantalla.

### Backend

- Reglas de negocio.
- Validación de entradas.
- Autenticación y permisos.
- Respuestas de cada ruta.
- Manejo de errores.
- Consultas importantes a la base de datos.

### Flujo completo

- Inicio de sesión.
- Creación y edición de datos.
- Eliminación con confirmación.
- Recuperación después de un error.
- Cierre de sesión.

---

## 18. Cuándo dividir un archivo

Un archivo debe dividirse cuando ocurra una o varias de estas condiciones:

- Contiene responsabilidades claramente distintas.
- Resulta difícil encontrar una sección específica.
- Una parte puede reutilizarse en otras pantallas.
- Varias personas necesitan modificar secciones diferentes con frecuencia.
- Las pruebas requieren demasiada preparación por el acoplamiento existente.
- Un componente conoce detalles que no necesita.

El número de líneas puede servir como señal, pero no debe ser la única regla. Un archivo largo y ordenado puede ser más comprensible que muchos archivos pequeños sin límites claros.

---

## 19. Flujo recomendado para crear una pantalla nueva

1. Crear una carpeta dentro de `frontend/src/pages/`.
2. Añadir los archivos HTML, CSS y JavaScript con el mismo nombre base.
3. Copiar la estructura estándar del HTML.
4. Definir las secciones visuales y los estados de la pantalla.
5. Identificar qué componentes existentes pueden reutilizarse.
6. Crear un servicio si la pantalla necesita datos del backend.
7. Mantener la solicitud fuera del HTML.
8. Registrar eventos dentro del JavaScript de la pantalla.
9. Añadir comentarios de sección.
10. Verificar accesibilidad, errores y diseño responsivo.
11. Añadir las pruebas necesarias.
12. Documentar decisiones especiales que no sean evidentes.

---

## 20. Lista de revisión para cada pantalla

Antes de considerar terminada una pantalla se debe revisar:

### Estructura

- [ ] La pantalla se encuentra en su propia carpeta.
- [ ] El HTML utiliza elementos semánticos.
- [ ] Las secciones mantienen el orden acordado.
- [ ] Los scripts están al final de `body`.
- [ ] Los estilos están en archivos CSS, no mezclados innecesariamente con HTML.

### Código

- [ ] El JavaScript tiene una responsabilidad clara.
- [ ] Las conexiones se realizan mediante servicios.
- [ ] No existe código repetido que deba convertirse en componente.
- [ ] Los nombres describen correctamente su propósito.
- [ ] Los comentarios explican secciones y decisiones relevantes.

### Experiencia de uso

- [ ] Existe un indicador de carga.
- [ ] Existe un estado vacío.
- [ ] Los errores se muestran de forma comprensible.
- [ ] Los formularios indican cómo corregir datos inválidos.
- [ ] Las acciones importantes solicitan confirmación cuando corresponde.

### Accesibilidad y diseño

- [ ] La pantalla puede recorrerse con teclado.
- [ ] Los campos tienen etiquetas.
- [ ] Las imágenes tienen texto alternativo cuando lo necesitan.
- [ ] El enfoque es visible.
- [ ] La pantalla funciona en móvil, tableta y escritorio.

### Seguridad

- [ ] No existen secretos en el frontend.
- [ ] Los datos se validan también en el backend.
- [ ] Los permisos se verifican en el servidor.
- [ ] Los mensajes no revelan detalles internos.

---

## 21. Decisiones principales de esta arquitectura

1. La unidad principal de organización del frontend será la pantalla o funcionalidad.
2. Los elementos compartidos se implementarán como componentes.
3. El HTML se limitará principalmente a la estructura de la interfaz.
4. Los estilos globales y los estilos de pantalla permanecerán separados.
5. El JavaScript de pantalla coordinará eventos, componentes y servicios.
6. Las llamadas al servidor se concentrarán en `services/`.
7. Los scripts se cargarán al final del HTML.
8. Las conexiones privadas y el acceso a la base de datos vivirán en el backend.
9. Los comentarios seguirán una convención uniforme.
10. La estructura podrá ampliarse sin obligar a crear archivos que todavía no sean necesarios.

---

## 22. Conclusión

La arquitectura propuesta combina una organización por pantallas con una separación clara por capas. Esta combinación permite localizar rápidamente el código de cada interfaz sin mezclarlo con conexiones, configuración, utilidades o reglas del servidor.

El HTML de cada pantalla conservará un orden constante y terminará con la carga de sus scripts. Sin embargo, las conexiones no se implementarán directamente dentro del HTML: se encapsularán en servicios del frontend y se dirigirán a un backend responsable de la seguridad, la lógica y la base de datos.

Esta estructura es suficientemente sencilla para comenzar con HTML, CSS y JavaScript, pero también establece límites que facilitarán el crecimiento del proyecto y una posible migración futura a un framework.
