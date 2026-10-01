# Tlatolli — contrato de trabajo

## Producto

Tlatolli es un sitio estático en español de México para explicar un sistema de
diagnóstico y crecimiento para negocios. La interfaz usa Vanilla HTML, CSS y
JavaScript; no se agregan dependencias de producción ni frameworks.

## Orden y ensamblaje

El documento final se ensambla en este orden exacto:

`hero → problema → ciclo → presencia → fidelizacion → analitica → marketing → live → mapas → app → proyectos → diferencia → diagnostico → contacto`

Cada agente entrega su sección dentro de `frontend/src/sections/<nombre>/`. Las
dos raíces especiales son `hero` en `frontend/src/pages/inicio/` y `ciclo` en
`frontend/src/sections/sistema/`; el build las inserta en las posiciones
`hero` y `ciclo` respectivamente.
El contrato de sección es:

- `<nombre>.html`: un bloque raíz `<section id="<nombre>" ...>` con clases de tema y atributos `data-stage` cuando correspondan.
- `<nombre>.css`: estilos encapsulados por el bloque o clases propias; no redefinir tokens globales.
- `<nombre>.js`: comportamiento opcional, sin dependencias externas; debe tolerar ausencia de elementos.

No cambiar el shell, los tokens ni el build desde una sección. Si una sección
necesita un componente compartido, documentarlo y solicitarlo; reutilizar las
clases `.btn`, `.badge--*`, `.phone`, `.browser`, `.tabs` y utilidades globales.

## Sistema visual

Usar tokens `--ivory`, `--paper`, `--forest`, `--olive`, `--terra`, `--ink`,
`--copper`, `--line`, `--dark-line`, `--shadow`, `--sans`, `--display`,
`--serif` y `--mono` de `frontend/src/styles/variables.css` y estos temas: `section--dark`,
`section--ink`, `section--ivory`, `section--paper`, `section--olive`,
`section--terra`. La paleta debe conservar el carácter de México contemporáneo.
Tipografías locales disponibles y sus fallbacks se declaran en variables; no
descargar fuentes. Instrument Serif se reserva para énfasis, Bricolage Display
para display, DM Sans para cuerpo y DM Mono para datos.

## Accesibilidad y contenido

El texto visible es español de México, concreto y legible. Mantener contraste,
foco visible, jerarquía semántica, etiquetas de formulario y controles de
teclado. Respetar `prefers-reduced-motion`; el contenido importante debe ser
visible si JavaScript no carga. No inventar teléfonos, clientes, métricas ni
contactos.

## Utilidades compartidas

`frontend/src/shared/shared.js` es la única casa para `TL.$(selector, root)`,
`TL.$$(selector, root)`, `TL.reduced()`, `TL.whatsapp(text)`, `TL.inView(element, options)`,
`TL.progress(element, options)`, `TL.countUp(element, to, options)`,
`lerp(start, end, amount)` y `clamp(value, min, max)`. Si una sección
usa una utilidad, manejar nodos ausentes y limpiar observers/listeners.

## Entrega

Probar con `node build.mjs`. El build debe tolerar temporalmente secciones
faltantes y ensamblar cuando todas existan. No añadir dependencias ni modificar
archivos asignados a otro agente. No publicar ni hacer commit desde esta tarea.
