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

const proj = (b, o = {}) => L.project(b, { today: TODAY, ...o });

test('project: конец ноября без новой траты', () => {
  const p = proj(fixture());
  // 1 380 000 − ремонт 700 000 − ипотека 378 612 − ВТБ 154 302,6 − Rocket line 5 246,6 + 1 291,8 + 5 547
  // − жизнь 97 000 × 24/30 = 77 600 − коммуналка 38 500 = 18 900 (+ ~40 ֏ процентов на остаток накопительного)
  assert.strictEqual(p.months[0].ym, '2026-11');
  near(p.months[0].endFree, 18900, 1000, 'конец ноября');
  // в ноябре денег хватает; первая нехватка — в декабре (подарки 150 000 + налог на машину 70 000 + кредиты)
  assert.ok(p.firstShort && p.firstShort.date >= '2026-12-01', 'в ноябре нехватки нет');
});

test('project: нет ни одного счёта — не падает, первая нехватка в первый же день трат', () => {
  const b = fixture(); b.accounts = [];
  const p = proj(b);
  assert.ok(p.firstShort);
  assert.strictEqual(p.firstShort.date, '2026-11-07');
});

test('project: проценты по счёту начисляются в конце месяца после налога', () => {
  const b = { profile: {}, accounts: [{ type: 'savings', balance: 1000000, rate: 12 }], set: { tax: 10, infl: 0 }, scen: { events: [] } };
  const d = proj(b).days.find(x => x.date === '2026-11-30');
  near(d.free, 1000000 + 10000 * 0.9, 1, 'после процентов');
});

test('project: цель собирается к сроку', () => {
  const b = { profile: {}, set: { tax: 10, infl: 0 }, scen: { events: [] },
    accounts: [{ type: 'current', balance: 5000000, rate: 0 }, { type: 'savings', balance: 0, rate: 0 }],
    plans: [{ kind: 'save', name: 'Renovation', amount: 100000, freq: 'monthly', from: '2026-12-01', to: '2028-06-01', acc: 1, goal: 1800000 }] };
  const g = proj(b).goals[0];
  assert.strictEqual(g.name, 'Renovation');
  near(g.atDue, 1900000, 1, 'собрано к 1 июня 2028 (19 взносов)');
  assert.strictEqual(g.ok, true);
});

test('project: укладывается в 30 мс на 24 месяца', () => {
  const b = fixture(), t = [];
  for (let i = 0; i < 5; i++) { const s = process.hrtime.bigint(); proj(b); t.push(Number(process.hrtime.bigint() - s) / 1e6); }
  t.sort((a, c) => a - c);
  assert.ok(t[2] < 30, 'медиана ' + t[2].toFixed(1) + ' мс');
});

const small = () => ({ profile: {}, set: { tax: 10, infl: 0 }, scen: { events: [] },
  accounts: [{ type: 'current', balance: 100000, rate: 0, asOf: '2026-11-01' }],
  incomes: [{ name: 'Salary', amount: 900000, freq: 'monthly', day: 5 }],
  loans: [{ name: 'Loan', type: 'consumer', balance: 1000000, rate: 12, payment: 50000, day: 3, mode: 'monthly' }] });

test('rollAccounts: зарплата 5-го и платёж 3-го догоняют остаток', () => {
  const b = small(), r = L.rollAccounts(b, { today: TODAY });
  assert.strictEqual(r.changed, true);
  assert.strictEqual(b.accounts[0].balance, 100000 + 900000 - 50000);
  assert.strictEqual(b.accounts[0].asOf, TODAY);
  assert.deepStrictEqual(r.log.map(x => [x.date, x.amount, x.label]), [['2026-11-03', -50000, 'Loan'], ['2026-11-05', 900000, 'Salary']]);
  assert.strictEqual(b.autoLog.length, 2);
});

test('rollAccounts: второй раз в тот же день ничего не меняет', () => {
  const b = small(); L.rollAccounts(b, { today: TODAY });
  const r = L.rollAccounts(b, { today: TODAY });
  assert.strictEqual(r.changed, false);
  assert.strictEqual(b.accounts[0].balance, 950000);
});

test('rollAccounts: платёж, отмеченный оплаченным, не списывается', () => {
  const b = small(); b.loanPaid = { 0: '2026-11-02' };
  L.rollAccounts(b, { today: TODAY });
  assert.strictEqual(b.accounts[0].balance, 1000000);
});

test('rollAccounts: счёт без даты получает сегодняшнюю и не меняется', () => {
  const b = small(); delete b.accounts[0].asOf;
  const r = L.rollAccounts(b, { today: TODAY });
  assert.strictEqual(b.accounts[0].balance, 100000);
  assert.strictEqual(b.accounts[0].asOf, TODAY);
  assert.strictEqual(r.log.length, 0);
});

test('buildEntries: событие прогноза на текущий месяц без даты ставится на завтра, а не в прошлое', () => {
  const b = fixture(); b.scen.events = [{ month: 1, type: 'oneExpense', amount: 50000, acc: -1, note: 'Now' }];
  const e = entries(b).filter(x => x.label === 'Now');
  assert.deepStrictEqual(e.map(x => [x.date, x.amount]), [['2026-11-07', -50000]]);
});

const withOp = (b, amount, date, extra = {}) => { const a = JSON.parse(JSON.stringify(b)); a.ops.push({ id: 99, type: amount < 0 ? 'out' : 'in', amount: Math.abs(amount), cat: 'other', date, acc: 1, pending: 1, note: 'Test', ...extra }); return a; };
const verdict = (b, a) => L.verdict(b, a, { today: TODAY });

test('verdict: трата 300 000 на 10 ноября — нельзя, 16 ноября не хватит на ипотеку', () => {
  const b = fixture(), v = verdict(b, withOp(b, -300000, '2026-11-10'));
  // 1 380 000 − жизнь 7–16 нояб. (10 дн. × 3 233,33) − коммуналка 38 500 − 300 000 − ремонт 700 000 − ВТБ 154 302,6 − ипотека 378 612 = −223 748
  assert.strictEqual(v.level, 'no');
  assert.strictEqual(v.firstShort.date, '2026-11-16');
  assert.strictEqual(v.firstShort.entry.kind, 'loan');
  near(v.firstShort.short, 223748, 1000, 'нехватка');
});

test('verdict: небольшая трата, когда денег хватает, — не «нельзя»', () => {
  const b = fixture(); b.scen.events = []; // без подарков декабрь сходится
  const v = verdict(b, withOp(b, -10000, '2026-11-10'));
  assert.notStrictEqual(v.level, 'no');
});

test('verdict: если и без траты в декабре не хватает, даже небольшая трата — «нельзя», и это сказано', () => {
  const b = fixture(), v = verdict(b, withOp(b, -10000, '2026-11-10'));
  assert.strictEqual(v.level, 'no');
  assert.ok(v.reasons.some(r => r.code === 'short' && r.worse), 'отмечено, что трата усугубляет уже существующую нехватку');
});

test('verdict: для «нельзя» ищется месяц, когда можно', () => {
  const b = fixture(); b.scen.events = [];
  const v = verdict(b, withOp(b, -300000, '2026-11-10'));
  assert.strictEqual(v.level, 'no');
  assert.match(v.waitUntil, /^20\d\d-\d\d$/);
  assert.ok(v.waitUntil > '2026-11');
  const later = withOp(b, -300000, v.waitUntil + '-10');
  assert.notStrictEqual(verdict(b, later).level, 'no', 'в найденном месяце действительно не «нельзя»');
});

test('verdict: доход — можно', () => {
  const b = fixture(); b.scen.events = [];
  assert.strictEqual(verdict(b, withOp(b, 100000, '2026-11-10')).level, 'ok');
});

test('verdict: подушка проверяется в каждый день, а не только в самой низкой точке', () => {
  const b = fixture(); b.scen.events = [];
  const a = withOp(b, -10000, '2027-05-10');
  assert.strictEqual(L.verdict(b, a, { today: TODAY, reserve: 1 }).level, 'ok');
  const v = L.verdict(b, a, { today: TODAY, reserve: 3000000 });
  assert.strictEqual(v.level, 'warn');
  assert.ok(v.reasons.some(r => r.code === 'reserve'));
});

test('verdict: трата сдвигает цель — «можно, но» с причиной про цель', () => {
  const b = fixture(); b.scen.events = [];
  b.plans = [{ kind: 'save', name: 'Ремонт', amount: 100000, freq: 'monthly', from: '2026-12-05', to: '2028-06-01', acc: 1, goal: 1 }];
  const atDue = L.project(b, { today: TODAY }).goals[0].atDue;
  b.plans[0].goal = Math.round(atDue - 100000); // без траты цель успевает с запасом 100 000
  assert.strictEqual(L.project(b, { today: TODAY }).goals[0].ok, true);
  const v = L.verdict(b, withOp(b, -300000, '2027-05-10'), { today: TODAY, reserve: 0 });
  assert.strictEqual(v.level, 'warn');
  const g = v.reasons.find(r => r.code === 'goal');
  assert.ok(g, 'есть причина про цель');
  assert.match(g.text, /Ремонт/);
  assert.strictEqual(v.after.goals[0].ok, false);
  near(v.after.goals[0].atDue, atDue - 300000, 15000, 'к сроку соберётся на 300 000 меньше (± проценты на эти деньги за 13 мес.)');
});

test('canSpendNow: сегодняшняя трата больше, чем на счёте, невозможна', () => {
  const b = fixture(); // на счёте 1 лежит 1 300 000, всего 1 380 000
  const op = { type: 'out', amount: 10000000, date: TODAY, acc: 1 };
  const r = L.canSpendNow(b, op, { today: TODAY });
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.available, 1300000);
  assert.strictEqual(L.canSpendNow(b, { ...op, amount: 1300000 }, { today: TODAY }).ok, true);
});

test('canSpendNow: без выбранного счёта считается всё, что есть; будущая трата не проверяется', () => {
  const b = fixture();
  assert.strictEqual(L.canSpendNow(b, { type: 'out', amount: 1400000, date: TODAY, acc: -1 }, { today: TODAY }).ok, false);
  assert.strictEqual(L.canSpendNow(b, { type: 'out', amount: 1380000, date: TODAY, acc: -1 }, { today: TODAY }).ok, true);
  assert.strictEqual(L.canSpendNow(b, { type: 'out', amount: 10000000, date: '2026-12-01', acc: 1 }, { today: TODAY }).ok, true);
  assert.strictEqual(L.canSpendNow(b, { type: 'in', amount: 10000000, date: TODAY, acc: 1 }, { today: TODAY }).ok, true);
});

/* ---- по итогам ревью ---- */
test('ревью #2: новая отдельная нехватка при уже существующей — «нельзя»', () => {
  const b = fixture(); // и так не хватает 22 декабря
  const v = L.verdict(b, withOp(b, -840000, '2027-03-10'), { today: TODAY, reserve: 0 });
  assert.strictEqual(v.level, 'no');
  assert.ok(v.reasons.some(r => r.code === 'short'));
});

test('ревью #3: «тяжёлый месяц» — только когда платёж больше подушки и не размазанный', () => {
  const b = { profile: { car: { has: true, tax: 70000, insurance: 45000 } }, set: { tax: 10, infl: 0 }, scen: { events: [] }, ops: [],
    accounts: [{ type: 'current', balance: 5000000, rate: 0 }] };
  const a = JSON.parse(JSON.stringify(b)); a.ops.push({ id: 1, type: 'out', amount: 1000, date: '2026-12-10', acc: 0, pending: 1, note: 'Coffee' });
  assert.strictEqual(L.verdict(b, a, { today: TODAY, reserve: 100000 }).level, 'ok', 'без месяца оплаты — не предупреждаем');
  b.profile.car.taxMonth = 12; a.profile.car.taxMonth = 12;
  assert.strictEqual(L.verdict(b, a, { today: TODAY, reserve: 100000 }).level, 'ok', 'налог 70 000 меньше подушки 100 000');
  assert.strictEqual(L.verdict(b, a, { today: TODAY, reserve: 50000 }).level, 'warn', 'налог 70 000 больше подушки 50 000');
});

test('ревью #4: досрочное погашение целиком — конечная сумма, без бесконечности', () => {
  const b = fixture(), mi = b.loans.findIndex(l => l.type === 'mortgage');
  b.scen.events = [{ month: 2, type: 'payoff', loan: mi, amount: 0 }];
  const e = entries(b).filter(x => x.prepay);
  assert.strictEqual(e.length, 1);
  assert.ok(Number.isFinite(e[0].amount));
  assert.strictEqual(e[0].amount, -29207612);
});

test('ревью #6: инвестиции не оплачивают траты в расчёте', () => {
  const b = { profile: {}, set: { tax: 10, infl: 0 }, scen: { events: [] },
    accounts: [{ type: 'cash', balance: 10000, rate: 0 }, { type: 'invest', balance: 1000000, rate: 0 }],
    ops: [{ id: 1, type: 'out', amount: 500000, date: '2026-11-10', acc: -1, pending: 1, note: 'TV' }] };
  const p = L.project(b, { today: TODAY });
  assert.strictEqual(p.firstShort.date, '2026-11-10');
});

test('ревью #1: прошедшие платежи по графику и разовые списываются со счёта', () => {
  const b = { profile: {}, set: { tax: 10, infl: 0 }, scen: { events: [] },
    accounts: [{ type: 'current', balance: 100000, rate: 0, asOf: '2026-11-01' }],
    loans: [{ name: 'Plan', type: 'card', balance: 20000, rate: 0, day: 3, mode: 'plan', schedule: [{ ym: '2026-11', amount: 10000 }, { ym: '2026-12', amount: 10000 }] },
      { name: 'Once', type: 'card', balance: 5000, rate: 0, mode: 'once', due: '2026-11-04' }] };
  L.rollAccounts(b, { today: TODAY });
  assert.strictEqual(b.accounts[0].balance, 85000);
});
