# QA

Fecha: 1 de octubre de 2026.

## Evidencia estática

- `node build.mjs`: 14/14 secciones ensambladas.
- `node tools/check.mjs`: ids exactos, un único `h1`, destinos `href="#..."`, assets relativos, sintaxis JavaScript y pruebas de diagnóstico, marketing, fidelización y analítica.
- `frontend/src/assets/brand/og.png`: PNG real de 1200 × 630.

## Evidencia visual y de interacción

La página completa fue revisada. Todas las reveals quedan visibles, las imágenes cargan, el documento y los containers no desbordan, y las 14 secciones están presentes.

- [Desktop 1440 × 900](evidence/desktop.jpg)
- [Móvil 390 × 844](evidence/mobile.jpg)
- [Tablet 768 × 1024](evidence/tablet.jpg)
- [Página completa](evidence/full-page.jpg)

Interacciones verificadas: menú abre y cierra con Escape; ciclo funciona en estado visible con anterior/siguiente y flechas; presencia responde a tabs y hotspots; Campus abre el sheet de mapas y Escape lo cierra; fidelización sincroniza POS y teléfono al pasar de visita 2 a 3; marketing cambia octubre a noviembre, marca Día de Muertos el 1 y 2, y sus siete formatos responden con teclado; live analiza y registra una respuesta de encuesta; diagnóstico con “Mis clientes no regresan”, restaurante y varias herramientas recomienda fidelización y conserva WhatsApp; portafolio carga el iframe de Clínica tras clic con `src` verificado.

El DOM scanner no encontró hallazgos de contraste aplicables después de las correcciones. Se excluyeron el botón disabled de Wallet en estado “Próximamente”, la flecha decorativa y el caption de mapas señalado como falso positivo; el SVG usa fondo `#234536` y marfil `#F7F5EF` con ratio 9.75. El scanner no sustituye una auditoría formal y no analiza automáticamente fondos con gradiente ni SVG.

## Movimiento reducido

El código desactiva scroll suave, reduce duraciones a `.01ms`, usa `countUp` con duración cero, detiene el parallax del hero y apila el ciclo. La capacidad disponible del navegador no permite emular la preferencia reducida; la validación visual bajo dicha preferencia no se ejecutó.

## SEO y rendimiento

Title, descripción, canonical, OG y Twitter están configurados. OG usa el PNG 1200 × 630. Assets son locales, las fuentes son WOFF2, el script usa `defer`, las capturas usan lazy loading y el iframe se crea después del clic. No se afirma Lighthouse ni medición de producción.
