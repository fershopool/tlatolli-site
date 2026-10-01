const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'marketing.js'), 'utf8');
const context = { window: {}, Intl, console };
vm.runInNewContext(source, context);
const marketing = context.window.TL.marketing;
assert.equal(marketing.dateEvent(10, 1).days.join(','), '1,2');
assert.equal(marketing.dateEvent(11, 12).label, 'Día de la Virgen de Guadalupe');
assert.equal(marketing.dateEvent(1, 14).label, 'San Valentín');
assert.equal(marketing.monthEvents(10).length, 1);
assert.match(marketing.monthTitle(2026, 9), /Octubre(?: de)? 2026/);
console.log('marketing: ok');
