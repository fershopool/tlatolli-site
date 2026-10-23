# Menú con realidad aumentada (demo)

Página independiente (sin build): `menu/index.html`. Dos platillos de muestra de un restaurante ficticio, «Casa Copal».

- Al tocar un platillo se abre un visor 3D (`<model-viewer>`, incluido en `vendor/`). En celulares compatibles aparece **Ver en mi mesa**: Android (WebXR / Scene Viewer) y iPhone (AR Quick Look, USDZ generado al vuelo). En escritorio se muestra el 3D y un aviso.
- La AR requiere HTTPS (GitHub Pages sirve). Enlace directo a un platillo: `menu/#mole-poblano` (útil para un QR por platillo o por mesa).
- Para agregar o cambiar platillos edita la lista `PLATILLOS` al final de `index.html`.
- Los `.glb` de `modelos/` son modelos estilizados generados con `tools/generar-modelos.mjs` (`npm i three@0.160.0`). En producción se reemplazan por escaneos del platillo real con el mismo nombre de archivo; la portada `.webp` se renderiza del propio modelo.
- Tipografías con licencia OFL (`fonts/`); `model-viewer` con licencia Apache/BSD (`vendor/`).
