# QA

Fecha: 1 de octubre de 2026.

## Evidencia estática

`node build.mjs && node tools/check.mjs` pasa. El chequeo cubre las 9 páginas (home, ecosistema, nosotros, privacidad y 5 casos):

- un único `h1`, `lang="es-MX"`, landmarks `header`, `main` y `footer`;
- `title`, descripción, canonical por página (igual a la URL esperada) y Open Graph;
- JSON-LD válido en cada página, `sitemap.xml` con todas las páginas y `robots.txt`;
- enlaces internos y entre páginas con destino (`index.html#servicios`, etc.), assets y `srcset` existentes, `img` con `alt`;
- sintaxis de todo el JavaScript y pruebas de diagnóstico, marketing, fidelización, analítica y «Arma tu ruta»;
- peso de la home en 1x (HTML + CSS + JS + fuentes + imágenes más ligeras): 309 KB de 500 KB.

## Evidencia visual y de interacción

Revisadas con Chrome (Playwright), con capturas por sección y por página en 390, 768 y 1440 px:

- [Desktop 1440 × 900](evidence/desktop.jpg) · [Tablet 768 × 1024](evidence/tablet.jpg) · [Móvil 390 × 844](evidence/mobile.jpg) · [Home completa](evidence/full-page.jpg)
- Sin scroll horizontal en 320, 360, 390, 768, 1024, 1440 y 1920 px en las 9 páginas.
- Objetivos táctiles ≥ 44 px en todas las páginas y anchos. Excepción conocida: los días del calendario del simulador de marketing miden 41 px de ancho (44 px de alto) a 320 px porque siete columnas no caben.
- Ningún texto de lectura por debajo de 12 px (revisado en el DOM a 390 y 1440 px).
- Contraste AA calculado sobre el DOM en las 9 páginas a 1440 px y en home y ecosistema a 390 px. Sin hallazgos salvo el caption del mapa (texto marfil sobre SVG verde bosque, ratio 9.75, falso positivo del script) y una flecha decorativa. El script no analiza gradientes ni SVG.
- Teclado: el primer Tab es «Saltar al contenido», el orden es el visual, y todo elemento enfocable muestra contorno. El menú móvil abre con clic y cierra con Escape.
- Flujos verificados: detalles de servicios, «Arma tu ruta» (mensaje de WhatsApp con selecciones y punto de partida), diagnóstico de 3 preguntas (resultado y mensaje), enlace de contacto actualizado con el diagnóstico, eventos de analítica (con un stub de Plausible), página de caso y «Verlo aquí» (carga el iframe solo tras el clic). En Ecosistema se hizo clic en todos los botones sin errores de JavaScript.

## Movimiento reducido

`prefers-reduced-motion` desactiva el scroll suave, el revelado, las transiciones y las elevaciones al pasar el cursor. Las capturas se tomaron con la preferencia activada.

## No verificado

- Lighthouse, Core Web Vitals ni medición en producción.
- Lectores de pantalla reales (VoiceOver, NVDA).
- Safari y Firefox: solo se probó en Chrome.
- Validadores externos de datos estructurados y de Open Graph (requieren la URL publicada).
- Analítica con un proveedor real: queda apagada hasta recibir el ID.
- Aviso de privacidad: requiere revisión legal y los datos del responsable.
