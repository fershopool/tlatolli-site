# Menú con realidad aumentada (demo)

Página independiente (sin build): `menu/index.html`. Dos platillos de muestra de un restaurante ficticio, «Casa Copal».

- Al tocar un platillo se abre un visor 3D (`<model-viewer>`, incluido en `vendor/`). En celulares compatibles aparece **Ver en mi mesa**: Android (WebXR / Scene Viewer) y iPhone (AR Quick Look, USDZ generado al vuelo). En escritorio se muestra el 3D y un aviso.
- La AR requiere HTTPS (GitHub Pages sirve). Enlace directo a un platillo: `menu/#mole-poblano` (útil para un QR por platillo o por mesa).
- Para agregar o cambiar platillos edita la lista `PLATILLOS` al final de `index.html`.
- Las fotos (`modelos/*.webp`) y los modelos 3D (`modelos/*.glb`, ~4-5 MB c/u) se generaron con IA a partir de una descripción del platillo (imagen → 3D con textura). Son una muestra: un plato generado desde una sola foto sale un poco ovalado y la parte no visible es inventada. En producción conviene reemplazarlos por escaneos (fotogrametría) del platillo real, con el mismo nombre de archivo.
- `tools/optimizar-modelo.mjs` deja cualquier `.glb` listo para AR (menos polígonos, texturas ligeras, tamaño real, apoyado en la mesa).
- Tipografías con licencia OFL (`fonts/`); `model-viewer` con licencia Apache/BSD (`vendor/`).
