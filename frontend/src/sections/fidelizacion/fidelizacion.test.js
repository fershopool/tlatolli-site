const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'fidelizacion.js'), 'utf8');
const context = { window: {}, console };
vm.runInNewContext(source, context);
const fidelity = context.window.TL.fidelizacion;
const before = fidelity.initialState();
const after = fidelity.simulateVisit(before);
assert.equal(before.visits, 2);
assert.equal(after.visits, 3);
assert.equal(after.balance, 3);
assert.equal(after.qrVersion, 2);
assert.equal(after.last, 'Visita simulada · actualización compartida');
console.log('fidelizacion: ok');
