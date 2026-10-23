// Prepara un .glb para AR: simplifica la malla, reduce texturas, lo escala a tamaño real y lo apoya en y=0.
// Uso: npm i @gltf-transform/core @gltf-transform/functions meshoptimizer sharp
//      node menu/tools/optimizar-modelo.mjs entrada.glb salida.glb 0.30   (0.30 = ancho del plato en metros)
import { NodeIO } from '@gltf-transform/core';
import { simplify, weld, textureCompress, getBounds } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
const [,, entrada, salida, ancho] = process.argv;
const io = new NodeIO();
const doc = await io.read(entrada);
await MeshoptSimplifier.ready;
await doc.transform(
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.07, error: 0.002 }),
  textureCompress({ encoder: sharp, resize: [1024, 1024], slots: /^(normal|metallicRoughness|occlusion)/ }),
);
const escena = doc.getRoot().listScenes()[0];
const b = getBounds(escena);
const s = Number(ancho) / Math.max(b.max[0] - b.min[0], b.max[2] - b.min[2]);
const raiz = doc.createNode('platillo');
for (const h of escena.listChildren()) { escena.removeChild(h); raiz.addChild(h); }
escena.addChild(raiz);
raiz.setScale([s, s, s]);
raiz.setTranslation([-(b.min[0] + b.max[0]) / 2 * s, -b.min[1] * s, -(b.min[2] + b.max[2]) / 2 * s]);
await io.write(salida, doc);
console.log(salida, 'escala', s.toFixed(4), 'alto m', ((b.max[1] - b.min[1]) * s).toFixed(3));
