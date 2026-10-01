# Tlatolli

Sitio estático en HTML, CSS y JavaScript vanilla. Presenta el ecosistema Tlatolli para atraer clientes, conocerlos, fidelizarlos, analizar señales y convertirlas en decisiones de marketing.

## Arquitectura

- `index.template.html`: shell y metadatos SEO.
- `build.mjs`: ensambla `index.html`, `dist/tlatolli.css` y `dist/tlatolli.js`.
- `frontend/src/pages/inicio/`: header, footer, navegación y estilos del shell.
- `frontend/src/sections/<nombre>/`: HTML, CSS y JS encapsulados por sección.
- `frontend/src/shared/shared.js`: utilidades `window.TL` compartidas.
- `frontend/src/styles/`: tokens, reset, componentes y reglas globales.
- `frontend/src/assets/`: marca, fuentes locales e imágenes de casos.

Las interfaces, estados y métricas conceptuales llevan etiquetas de ejemplo, capacidad, prototipo, beta, próximamente o disponible. Los estados de proyectos y la información de Kóoben provienen del informe de auditoría; el informe original se perdió y fue recreado en `docs/auditoria-y-casos.md`. No se inventan resultados ni se afirma despliegue donde solo existe una capacidad conceptual.

## Probar localmente

```sh
node build.mjs
node tools/check.mjs
python3 -m http.server 8000
```

Después abre `http://localhost:8000/`. El proyecto no se publica automáticamente; cualquier despliegue requiere una acción explícita.

## Estado de QA

Consulta [`docs/QA.md`](docs/QA.md) para la evidencia ejecutada y los pendientes de revisión.
