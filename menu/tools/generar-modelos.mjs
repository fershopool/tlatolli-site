// Genera los modelos 3D (GLB) de los dos platillos de muestra.
// Uso: npm i three@0.160.0 && node menu/tools/generar-modelos.mjs
// Son modelos estilizados para la demo; en producción se reemplazan por
// escaneos (fotogrametría) del platillo real, conservando el mismo nombre de archivo.
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// GLTFExporter espera FileReader (navegador) para el modo binario.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((b) => { this.result = b; this.onloadend?.(); });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = `data:${blob.type};base64,${Buffer.from(b).toString('base64')}`;
      this.onloadend?.();
    });
  }
};

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'modelos');
mkdirSync(out, { recursive: true });

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const mat = (color, rough = 0.6, metal = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });

const M = {
  plato: mat('#e7ddca', 0.3),
  platoBorde: mat('#234536', 0.35),
  cobre: mat('#b4864a', 0.35, 0.85),
  tortilla: mat('#e3c27a', 0.85),
  tortillaDorada: mat('#c99a4a', 0.85),
  cochinita: mat('#c8581f', 0.75),
  cochinitaOscura: mat('#9c3e17', 0.8),
  cebolla: mat('#b4306a', 0.5),
  cilantro: mat('#4f8a3a', 0.7),
  limon: mat('#9fc443', 0.45),
  limonPulpa: mat('#d6e57a', 0.4),
  mole: mat('#34170d', 0.55, 0.0),
  moleBrillo: mat('#3b1c10', 0.3, 0.05, { side: THREE.DoubleSide }),
  pollo: mat('#c98b47', 0.6),
  arroz: mat('#fbf8ef', 0.7, 0, { side: THREE.DoubleSide }),
  ajonjoli: mat('#f2e6c4', 0.5),
  chile: mat('#7b2a1b', 0.6),
};

// ---- Piezas reutilizables -------------------------------------------------

/** Plato hondo/llano de cerámica por revolución. */
function plato(radio = 0.14) {
  const g = new THREE.Group();
  const perfil = [
    [0, 0.0], [radio * 0.55, 0.0], [radio * 0.62, 0.004], [radio * 0.9, 0.014],
    [radio, 0.024], [radio * 1.0, 0.028], [radio * 0.97, 0.028],
    [radio * 0.9, 0.019], [radio * 0.6, 0.011], [0, 0.011],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const cuerpo = new THREE.Mesh(new THREE.LatheGeometry(perfil, 72), M.plato);
  cuerpo.name = 'plato';
  g.add(cuerpo);
  // filete verde en el borde
  const aro = new THREE.Mesh(new THREE.TorusGeometry(radio * 0.985, 0.0016, 8, 96), M.platoBorde);
  aro.rotation.x = Math.PI / 2;
  aro.position.y = 0.0285;
  g.add(aro);
  const filete = new THREE.Mesh(new THREE.TorusGeometry(radio * 0.8, 0.0012, 8, 96), M.cobre);
  filete.rotation.x = Math.PI / 2;
  filete.position.y = 0.0155;
  g.add(filete);
  return g;
}

/** Altura de la superficie interior del plato (radio 0.15) en (x, z). */
function platoY(x, z, R = 0.15) {
  const r = Math.hypot(x, z) / R;
  if (r <= 0.6) return 0.011;
  if (r <= 0.9) return 0.011 + ((r - 0.6) / 0.3) * 0.008;
  return 0.019 + Math.min(1, (r - 0.9) / 0.07) * 0.009;
}

/** Esfera deformada con ruido continuo (sin grietas) para dar aspecto orgánico. */
function organico(radio, mate, { sx = 1, sy = 1, sz = 1, ruido = 0.18, det = 3, taper = 0 } = {}) {
  let geo = new THREE.IcosahedronGeometry(radio, det);
  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  geo = mergeVertices(geo, 1e-5);
  const [f1, f2, f3] = [0, 0, 0].map(() => 60 + rnd() * 90);
  const [p1, p2, p3] = [0, 0, 0].map(() => rnd() * 6.28);
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = Math.sin(v.x * f1 + p1) * Math.sin(v.y * f2 + p2) + Math.sin(v.z * f3 + p3) * Math.sin(v.x * f2 + p1);
    const f = 1 + n * 0.5 * ruido;
    const t = 1 - taper * ((v.x / radio + 1) / 2);
    p.setXYZ(i, v.x * sx * f, v.y * sy * f * t, v.z * sz * f * t);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, mate);
}

/** Taco: tortilla doblada (medio cilindro abierto) con relleno visible. */
function taco(largo = 0.1) {
  const g = new THREE.Group();
  const r = 0.031;
  const alto = r * 1.04; // centro del semicilindro: la base toca el plato
  const t0 = Math.PI * 0.93;
  const tl = Math.PI * 1.14;
  // Concha en "U" abierta hacia arriba (tortilla doblada).
  const concha = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, largo, 40, 1, true, t0, tl),
    new THREE.MeshStandardMaterial({ color: '#e3c27a', roughness: 0.85, side: THREE.DoubleSide }),
  );
  concha.rotation.z = Math.PI / 2;
  concha.position.y = alto;
  concha.name = 'tortilla';
  g.add(concha);
  // Borde de la tortilla en los dos extremos de la U
  for (const th of [t0, t0 + tl]) {
    const canto = new THREE.Mesh(new THREE.CapsuleGeometry(0.0032, largo, 4, 10), M.tortillaDorada);
    canto.rotation.z = Math.PI / 2;
    canto.position.set(0, alto + Math.sin(th) * r, Math.cos(th) * r);
    g.add(canto);
  }
  // Relleno: cochinita desmenuzada
  for (let i = 0; i < 44; i++) {
    const t = (i / 43 - 0.5) * (largo * 0.88);
    const trozo = organico(0.0078 + rnd() * 0.0038, i % 3 ? M.cochinita : M.cochinitaOscura, { sy: 0.8, ruido: 0.6, det: 2 });
    trozo.position.set(t, alto + 0.0 + rnd() * 0.012, (rnd() - 0.5) * 0.038);
    g.add(trozo);
  }
  // Cebolla morada en escabeche
  for (let i = 0; i < 9; i++) {
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.007 + rnd() * 0.003, 0.0013, 6, 14, Math.PI * 1.3), M.cebolla);
    aro.position.set((rnd() - 0.5) * largo * 0.75, alto + 0.012 + rnd() * 0.01, (rnd() - 0.5) * 0.028);
    aro.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    g.add(aro);
  }
  // Cilantro
  for (let i = 0; i < 12; i++) {
    const hoja = organico(0.006, M.cilantro, { sy: 0.25, ruido: 0.6, det: 1 });
    hoja.position.set((rnd() - 0.5) * largo * 0.8, alto + 0.013 + rnd() * 0.011, (rnd() - 0.5) * 0.028);
    hoja.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    g.add(hoja);
  }
  return g;
}

function gajoLimon() {
  const g = new THREE.Group();
  const cascara = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.012, 24, 1, false, 0, Math.PI * 0.62), M.limon);
  const pulpa = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0175, 0.0175, 0.0125, 24, 1, false, 0, Math.PI * 0.62), M.limonPulpa);
  g.add(cascara, pulpa);
  g.rotation.set(Math.PI / 2, 0, 0);
  g.scale.set(1, 1.5, 1);
  return g;
}

// ---- Platillo 1: Tacos de cochinita pibil ---------------------------------

function tacosCochinita() {
  const raiz = new THREE.Group();
  raiz.name = 'tacos-cochinita-pibil';
  raiz.add(plato(0.15));
  const posiciones = [
    { x: 0.0, z: -0.07, ry: 0.07 },
    { x: 0.006, z: 0.0, ry: -0.05 },
    { x: -0.004, z: 0.07, ry: 0.09 },
  ];
  for (const p of posiciones) {
    const t = taco(0.1);
    t.position.set(p.x, platoY(p.x, p.z) - 0.0005, p.z);
    t.rotation.y = p.ry;
    raiz.add(t);
  }
  const limon = gajoLimon();
  limon.position.set(0.09, platoY(0.09, 0.08) + 0.012, 0.08);
  limon.rotation.y = 0.6;
  raiz.add(limon);
  return raiz;
}

// ---- Platillo 2: Mole poblano con pollo ----------------------------------

function molePoblano() {
  const raiz = new THREE.Group();
  raiz.name = 'mole-poblano';
  raiz.add(plato(0.15));

  // Charco de mole bajo el pollo, con gotas irregulares alrededor
  const cx = -0.022;
  const charco = new THREE.Mesh(
    new THREE.LatheGeometry([[0, 0.0045], [0.058, 0.0035], [0.078, 0.0012], [0.084, 0]].map(([x, y]) => new THREE.Vector2(x, y)), 64),
    M.moleBrillo);
  charco.position.set(cx, 0.0112, -0.008);
  charco.scale.set(1.12, 1, 0.82);
  raiz.add(charco);
  for (let i = 0; i < 6; i++) {
    const a = 0.4 + i * 1.05 + rnd() * 0.3;
    const d = 0.095 + rnd() * 0.02;
    const x = cx + Math.cos(a) * d;
    const z = Math.sin(a) * d * 0.85;
    const gota = new THREE.Mesh(new THREE.CylinderGeometry(0.005 + rnd() * 0.005, 0.0058 + rnd() * 0.005, 0.0022, 18), M.moleBrillo);
    gota.position.set(x, platoY(x, z) + 0.0009, z);
    raiz.add(gota);
  }

  // Muslo de pollo: carne dorada, mole en la parte superior y hueso expuesto
  const pollo = new THREE.Group();
  const carne = organico(0.04, M.pollo, { sx: 1.5, sy: 0.82, sz: 0.95, ruido: 0.1, det: 4, taper: 0.4 });
  pollo.add(carne);
  const cobertura = organico(0.0412, M.mole, { sx: 1.38, sy: 0.62, sz: 0.88, ruido: 0.16, det: 4, taper: 0.4 });
  cobertura.position.set(-0.002, 0.012, 0);
  cobertura.name = 'mole';
  pollo.add(cobertura);
  const huesoMat = mat('#f2eadb', 0.5);
  const hueso = new THREE.Mesh(new THREE.CylinderGeometry(0.0062, 0.0072, 0.04, 16), huesoMat);
  hueso.rotation.z = Math.PI / 2;
  hueso.position.set(0.078, -0.002, 0);
  pollo.add(hueso);
  for (const dz of [-0.0058, 0.0058]) {
    const nudo = new THREE.Mesh(new THREE.SphereGeometry(0.0082, 14, 10), huesoMat);
    nudo.position.set(0.098, -0.002, dz);
    pollo.add(nudo);
  }
  // Ajonjolí sobre el mole
  for (let i = 0; i < 70; i++) {
    const u = rnd() * Math.PI * 2;
    const y = 0.3 + rnd() * 0.7;
    const rr = Math.sqrt(1 - y * y) * (0.35 + rnd() * 0.65);
    const sem = new THREE.Mesh(new THREE.SphereGeometry(0.0015, 6, 4), M.ajonjoli);
    sem.scale.set(1.4, 0.5, 0.9);
    const x = Math.cos(u) * rr * 0.0412 * 1.34;
    const z = Math.sin(u) * rr * 0.0412 * 0.85;
    const taper = 1 - 0.4 * ((x / 0.0412 + 1) / 2);
    const yy = 0.012 + Math.sqrt(Math.max(0, 1 - (x / (0.0412 * 1.38)) ** 2 - (z / (0.0412 * 0.88 * taper)) ** 2)) * 0.0412 * 0.62 * taper;
    sem.position.set(x - 0.002, yy + 0.0004, z);
    sem.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    pollo.add(sem);
  }
  pollo.position.set(cx - 0.004, 0.0108 + 0.03, -0.008);
  pollo.rotation.y = 0.32;
  raiz.add(pollo);

  // Arroz blanco: montículo con granos
  const rx = 0.0, rz = 0.082;
  const rBase = platoY(rx, rz) - 0.001;
  const monticulo = new THREE.Mesh(
    new THREE.LatheGeometry([[0, 0.03], [0.016, 0.028], [0.03, 0.018], [0.04, 0.006], [0.043, 0]].map(([x, y]) => new THREE.Vector2(x, y)), 40),
    M.arroz);
  monticulo.position.set(rx, rBase, rz);
  monticulo.scale.set(1.05, 1, 0.9);
  raiz.add(monticulo);
  for (let i = 0; i < 200; i++) {
    const a = rnd() * Math.PI * 2;
    const rr = Math.sqrt(rnd()) * 0.037;
    const h = Math.max(0, 0.03 - (rr / 0.043) ** 1.4 * 0.03);
    const grano = new THREE.Mesh(new THREE.CapsuleGeometry(0.0012, 0.0042, 2, 6), M.arroz);
    grano.position.set(rx + Math.cos(a) * rr * 1.05, rBase + h, rz + Math.sin(a) * rr * 0.9);
    grano.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    raiz.add(grano);
  }
  // Chile ancho decorativo
  const chile = organico(0.012, M.chile, { sx: 2.4, sy: 0.35, sz: 0.8, ruido: 0.25, det: 2 });
  chile.position.set(0.075, platoY(0.075, -0.07) + 0.005, -0.07);
  chile.rotation.y = -0.6;
  raiz.add(chile);

  return raiz;
}

// ---- Exportar -------------------------------------------------------------

async function exportar(nombre, objeto) {
  const escena = new THREE.Scene();
  escena.add(objeto);
  const glb = await new GLTFExporter().parseAsync(escena, { binary: true });
  writeFileSync(join(out, `${nombre}.glb`), Buffer.from(glb));
  console.log(`modelos/${nombre}.glb  ${(glb.byteLength / 1024).toFixed(0)} KB`);
}

await exportar('tacos-cochinita', tacosCochinita());
seed = 11;
await exportar('mole-poblano', molePoblano());
