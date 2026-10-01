# Fuentes de assets

Fecha: 2026-10-01.

## Capturas de casos

Las cuatro capturas se recibieron como archivos locales de trabajo en `/tmp/tlatolli-*-hero.jpg` y se copiaron sin transformación a `frontend/src/assets/cases/`:

- `koben-hero.jpg`
- `clinica-hero.jpg`
- `ollin-hero.jpg`
- `calpulli-hero.jpg`
- `cuicoyan-hero.jpg` (captura 785 × 971 de https://fershopool.github.io/cuicoyan-site/ tomada con Chrome headless el 2026-10-01 y recomprimida a JPEG)

No contienen métricas añadidas por el sitio.

## Tipografías

`frontend/src/assets/fonts/fonts.css` y sus archivos `.woff2` se obtuvieron de Google Fonts, que distribuye estas familias bajo SIL Open Font License 1.1:

- Bricolage Grotesque 400–800
- DM Sans 400–700
- DM Mono 400 y 500
- Instrument Serif 400 normal e italic

Se usan subsets `latin` y `latin-ext` para conservar caracteres del español. La hoja se importa desde el bundle principal antes de las reglas que utilizan `--display`, `--sans`, `--mono` y `--serif`.

## Marca

`frontend/src/assets/images/logo.png` es el original disponible. `brand/logo.svg`, `brand/logo-light.svg` y `brand/favicon.svg` son trazados SVG manuales transparentes, sin imágenes incrustadas ni generación automática. Conservan la paleta verde bosque, terracota y cobre de la marca.

## Imagen social

`tools/og.html` es una composición estática de 1200×630 para que el proceso de build la renderice y guarde como `assets/brand/og.png`.
