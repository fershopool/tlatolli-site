const assert = require('node:assert/strict');
const { periods, productTotal } = require('./analitica.js');

for (const period of Object.values(periods)) {
  assert.equal(period.values.reduce((sum, value) => sum + value, 0), period.kpis[1]);
  assert.equal(period.labels.length, period.values.length);
  assert.equal(productTotal(period), period.kpis[2]);
}
assert.ok(periods.month.labels.length <= 5);
console.log('analitica dataset: ok');
