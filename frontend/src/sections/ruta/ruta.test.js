const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { window: {}, console };
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, 'ruta.js'), 'utf8'), context);
const ruta = context.window.TL.ruta;

const result = ruta.compute({ needs: ['web', 'encontrar', 'inventada'], start: 'cero' });
assert.deepEqual(Array.from(result.answers.needs), ['web', 'encontrar']);
assert.equal(result.services[0].id, 'seo');
assert.ok(result.services.some((service) => service.id === 'web'));
assert.equal(ruta.compute({ needs: [] }).services.length, 0);
assert.equal(ruta.compute({ needs: ['marca'], start: 'otra' }).answers.start, 'nose');
const message = ruta.buildMessage({ needs: ['web'], start: 'mejora' });
assert.match(message, /Ya tengo algo y quiero mejorarlo/);
assert.match(message, /Diseño web/);
assert.doesNotMatch(message, /\$|MXN|precio de/i);
assert.match(decodeURIComponent(ruta.whatsappUrl(message)), /armé mi ruta/);
console.log('ruta: ok');
