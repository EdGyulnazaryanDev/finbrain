// Ядро «денежного мозга»: лента записей, прокрутка по дням, вердикт.
const test = require('node:test');
const assert = require('node:assert');
const L = require('../public/ledger.js');

const TODAY = '2026-11-06';
const fixture = () => JSON.parse(JSON.stringify(require('./fixtures/budget-2026-11-06.json')));
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (±${tol})`);
const entries = (b, to = '2028-12-31', extra = {}) => L.buildEntries(b, { from: TODAY, to, today: TODAY, ...extra });

test('buildEntries: ипотека 16-го', () => {
  const b = fixture(), mi = b.loans.findIndex(l => l.type === 'mortgage');
  const e = entries(b).filter(x => x.kind === 'loan' && x.src.i === mi && x.date.startsWith('2026-11'));
  assert.strictEqual(e.length, 1);
  assert.strictEqual(e[0].date, '2026-11-16');
  assert.strictEqual(e[0].amount, -378612);
  assert.strictEqual(e[0].loan, mi);
});

test('buildEntries: годовой налог на машину целиком в декабре', () => {
  const e = entries(fixture()).filter(x => x.kind === 'yearly' && x.src.k === 'car.tax');
  const in2027 = e.filter(x => x.date >= '2027-01-01' && x.date <= '2027-11-30');
  assert.deepStrictEqual(e.filter(x => x.date.startsWith('2026-12')).map(x => [x.date, x.amount]), [['2026-12-01', -70000]]);
  assert.strictEqual(in2027.length, 0);
});

test('buildEntries: запланированная операция идёт в свой день, прошедшая — нет', () => {
  const b = fixture();
  b.ops.push({ id: 2, type: 'out', amount: 5000, cat: 'food', date: '2026-11-02', acc: 2 });
  const ops = entries(b).filter(x => x.kind === 'op');
  assert.deepStrictEqual(ops.map(x => [x.date, x.amount, x.acc]), [['2026-11-15', -700000, 1]]);
});

test('buildEntries: платёж, отмеченный оплаченным раньше срока, не повторяется', () => {
  const b = fixture(), mi = b.loans.findIndex(l => l.type === 'mortgage');
  b.loanPaid = { [mi]: '2026-11-06' };
  const e = entries(b).filter(x => x.kind === 'loan' && x.src.i === mi);
  assert.ok(!e.some(x => x.date.startsWith('2026-11')), 'ноябрь не должен остаться');
  assert.ok(e.some(x => x.date === '2026-12-16'), 'декабрь должен быть');
});

test('buildEntries: день 31 в феврале — последний день месяца', () => {
  const b = fixture();
  b.incomes.push({ name: 'Salary', amount: 100, freq: 'monthly', day: 31 });
  const e = entries(b).filter(x => x.kind === 'income' && x.label === 'Salary');
  assert.ok(e.some(x => x.date === '2027-02-28'));
  assert.ok(!e.some(x => x.date.startsWith('2027-03-0')), 'не уезжает в март');
});

test('buildEntries: доход в другой валюте переводится через fx', () => {
  const b = fixture();
  b.incomes.push({ name: 'USD job', amount: 1000, cur: 'USD', freq: 'monthly', day: 10 });
  const e = entries(b, '2026-12-31', { fx: c => (c === 'USD' ? 400 : 1) }).find(x => x.label === 'USD job');
  assert.strictEqual(e.amount, 400000);
});

test('buildEntries: закрытый кредит не даёт платежей', () => {
  const b = fixture();
  b.loans = [{ name: 'Closed', type: 'consumer', balance: 0, rate: 10, payment: 5000, day: 5, mode: 'monthly' }];
  assert.strictEqual(entries(b).filter(x => x.kind === 'loan').length, 0);
});

test('buildEntries: расходы на жизнь распределяются по дням', () => {
  const sum = entries(fixture(), '2026-11-30').filter(x => x.kind === 'living').reduce((a, x) => a + x.amount, 0);
  // 7–30 ноября = 24 дня из 30: сигареты 25 000 + еда 30 000 + бензин 40 000 + парковка 2 000
  near(sum, -(25000 + 30000 + 40000 + 2000) * 24 / 30, 1, 'жизнь за 7–30 ноября');
});
