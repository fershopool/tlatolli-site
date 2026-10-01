# Tlatolli

Sitio estático (HTML, CSS y JavaScript vanilla, sin dependencias) de Tlatolli, agencia de marketing mexicana. Publicado en https://fershopool.github.io/tlatolli-site/

## Páginas

| Archivo | Contenido |
| --- | --- |
| `index.html` | Promesa → servicios → arma tu ruta → casos → proceso → cómo cotizamos → diagnóstico → contacto |
| `ecosistema.html` | El ciclo Tlatolli y los simuladores (presencia, fidelización, analítica, marketing, mapas, en vivo, app) con datos ficticios |
| `nosotros.html` | Manifiesto, a quién ayudamos, por qué Tlatolli y preguntas frecuentes |
| `caso-*.html` | Una página por caso: problema, qué se hizo, estado actual y bitácora de mejora continua |
| `privacidad.html` | Aviso de privacidad (LFPDPPP) |

`index.html`, las demás páginas, `dist/`, `sitemap.xml` y `robots.txt` **se generan**: edita solo `frontend/src/**` y los JSON de configuración.

## Arquitectura

- `build.mjs`: ensambla páginas y un bundle CSS/JS por tipo de página (`dist/tlatolli.*`, `dist/ecosistema.*`, `dist/paginas.*`).
- `index.template.html`: shell, metadatos SEO, Open Graph y JSON-LD por página.
- `frontend/src/pages.json` y `frontend/src/sections/sections.json`: qué secciones lleva cada página.
- `frontend/src/content/servicios.json` y `casos.json`: fuente única de servicios y casos (tarjetas, páginas de caso, datos estructurados).
- `frontend/src/pages/inicio/`: encabezado, pie, botón de WhatsApp y barra móvil.
- `frontend/src/sections/<nombre>/`: HTML, CSS y JS encapsulados por sección.
- `frontend/src/styles/`: tokens, tipografía, componentes y `polish.css` (capa visual compartida).
- `tools/render.mjs`: fragmentos generados en build; `tools/check.mjs`: QA estático.
- `site.config.json`: URL, WhatsApp y analítica.

## Analítica (apagada por defecto)

Sin cookies, con Plausible o Umami. Se activa con el ID, en `site.config.json` o por variable de entorno:

```sh
TLATOLLI_ANALYTICS_PROVIDER=plausible TLATOLLI_ANALYTICS_ID=tu-dominio.mx node build.mjs
# Umami: TLATOLLI_ANALYTICS_PROVIDER=umami TLATOLLI_ANALYTICS_ID=<website-id>
# Auto-alojado: TLATOLLI_ANALYTICS_SRC=https://tu-servidor/script.js
```

Eventos: `cta_diagnostico`, `cta_ruta`, `whatsapp_click`, `diagnostico_completo`, `diagnostico_whatsapp`, `ruta_whatsapp`, `servicio_detalle`, `caso_abrir`, `caso_sitio`, `caso_en_vivo`, `contacto_enviar`. Se declaran con `data-track` / `data-track-label`.

## Probar localmente

```sh
node build.mjs && node tools/check.mjs
python3 -m http.server 8000
```

Abre `http://localhost:8000/`. El proyecto no se publica automáticamente.

## Contenido pendiente

Busca `[PENDIENTE` en `frontend/src` para ver los datos y fotografías que faltan (responsable legal, domicilio y correo del aviso de privacidad, fotos del equipo y de México, resultados medidos de cada caso).

## Estado de QA

Consulta [`docs/QA.md`](docs/QA.md). Los hechos de negocio y de los casos están en [`docs/auditoria-y-casos.md`](docs/auditoria-y-casos.md).
