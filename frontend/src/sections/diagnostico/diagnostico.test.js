const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, 'diagnostico.js'), 'utf8');
const context = { window: {}, console };
vm.runInNewContext(source, context);
const diagnostic = context.window.TL.diagnostic;

assert.equal(diagnostic.problems.length, 8);
const answers = {
  problems: ['no consigo suficientes clientes', 'publico pero no sé si funciona', 'conocer mejor mis ventas'],
  business: 'Restaurante o alimentos',
  connection: 'Tengo presencia básica'
};
assert.equal(diagnostic.validate(answers).valid, true);
assert.equal(diagnostic.validate({ ...answers, problems: ['problema inventado'] }).valid, false);
assert.equal(diagnostic.validate({ ...answers, business: 'Empresa inventada' }).valid, false);
const result = diagnostic.compute(answers);
assert.ok(result.modules.length >= 2);
assert.match(result.firstLever, /Analítica|Presencia|Marketing/);
const message = diagnostic.buildMessage(answers, result);
assert.match(message, /Restaurante o alimentos/);
assert.match(message, /publico pero no sé si funciona/);
assert.match(message, /Primera palanca/);
assert.match(diagnostic.whatsappUrl(message), /525539761846/);
assert.match(decodeURIComponent(diagnostic.whatsappUrl(message)), /sé/);
diagnostic.invalidate();
assert.equal(diagnostic.getState(), null);
console.log('diagnostico: ok');
