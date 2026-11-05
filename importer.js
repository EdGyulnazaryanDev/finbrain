// Импорт плана долгов из Excel (.xlsx).
// Понимает листы вида «Долги» (договор, тип, срок, сумма к закрытию, платежи по месяцам),
// «Настройки» (подписи в колонке A, значения в колонке B) и «План» (разовые траты по месяцам).
// Ничего не записывает сам — возвращает предпросмотр, который пользователь подтверждает в приложении.
const readXlsx = require('read-excel-file/node');

const isDate = v => v instanceof Date && !isNaN(v);
const ym = d => d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0');
const num = v => (typeof v === 'number' && isFinite(v) ? v : typeof v === 'string' && /^[\d\s.,-]+$/.test(v) ? parseFloat(v.replace(/\s/g, '').replace(',', '.')) || 0 : 0);
const txt = v => (v == null ? '' : String(v).trim());

function findHeader(rows, test) {
  for (let i = 0; i < Math.min(rows.length, 15); i++) if (test(rows[i].map(txt).join(' | ').toLowerCase(), rows[i])) return i;
  return -1;
}

function parseDebts(rows, notes) {
  const h = findHeader(rows, s => /договор|кредит|заём|займ|loan/.test(s) && /сумм|остат|balance/.test(s));
  if (h < 0) return [];
  const head = rows[h].map(txt).map(s => s.toLowerCase());
  const col = re => head.findIndex(s => re.test(s));
  const cName = col(/договор|назван|кредит|loan|name/), cType = col(/^тип|type/), cDue = col(/срок|дата|due/),
    cBal = col(/к закрытию|остаток|сумма|balance/), cRate = col(/ставк|%|rate/), cPay = col(/платёж|платеж|payment/);
  const months = rows[h].map((v, i) => (isDate(v) ? { i, ym: ym(v) } : null)).filter(Boolean);
  // ставка Rocket line из примечания, если есть (например «≈21,7% годовых»)
  const noteRate = (notes.join(' ').match(/≈\s*(\d+[.,]?\d*)\s*%/) || [])[1];
  const out = [];
  for (const r of rows.slice(h + 1)) {
    const name = txt(r[cName]);
    if (!name || /итого|total/i.test(name)) { if (/итого|total/i.test(name)) break; continue; }
    const balance = num(r[cBal]);
    if (balance <= 0) continue;
    const type = cType >= 0 ? txt(r[cType]) : '';
    let rate = cRate >= 0 ? num(r[cRate]) : 0;
    if (rate > 0 && rate < 1) rate *= 100;
    if (!rate) { const m = type.match(/(\d+[.,]?\d*)\s*%/); if (m) rate = parseFloat(m[1].replace(',', '.')); }
    if (!rate && /rocket/i.test(type) && noteRate) rate = parseFloat(noteRate.replace(',', '.'));
    const schedule = months.map(m => ({ ym: m.ym, amount: num(r[m.i]) })).filter(x => x.amount > 0);
    out.push({
      contract: name, type, rate: Math.round(rate * 100) / 100, balance,
      due: cDue >= 0 && isDate(r[cDue]) ? r[cDue].toISOString().slice(0, 10) : null,
      payment: cPay >= 0 ? num(r[cPay]) : 0, schedule,
    });
  }
  return out;
}

function parseSettings(rows) {
  const s = { expenses: [] };
  for (const r of rows) {
    const label = txt(r[0]), v = r[1];
    if (!label || v == null || v === '') continue;
    const l = label.toLowerCase();
    if (/зарплат|доход|salary/.test(l) && num(v)) s.salary = num(v);
    else if (/ипотек|mortgage/.test(l) && num(v)) s.mortgage = { name: label.replace(/\s*в месяц.*$/i, ''), payment: num(v) };
    else if (/наличн|на счету сейчас|cash/.test(l) && num(v)) s.cash = num(v);
    else if (/возврат налога|tax refund/.test(l) && num(v)) {
      const map = { янв: 1, фев: 2, мар: 3, апр: 4, мая: 5, май: 5, июн: 6, июл: 7, авг: 8, сен: 9, окт: 10, ноя: 11, дек: 12 };
      const ms = [...l.matchAll(/(янв|фев|мар|апр|ма[йя]|июн|июл|авг|сен|окт|ноя|дек)/g)].map(m => map[m[1]]);
      s.taxRefund = { amount: num(v), months: ms.length ? ms : [1, 4, 7, 10] };
    }
    else if (/запас|резерв|reserve/.test(l) && num(v)) s.reserve = num(v);
    else if (/ставка по вкладу|deposit rate/.test(l) && num(v)) s.depositRate = num(v) < 1 ? num(v) * 100 : num(v);
    else if (/комисси/.test(l)) continue;
    else if (/вклад открыт/.test(l) && isDate(v)) s.depositFrom = v.toISOString().slice(0, 10);
    else if (/сдают|сдач|срок ремонт/.test(l) && isDate(v)) s.goalDate = v.toISOString().slice(0, 10), s.goalLabel = label.replace(/\s*\(.*$/, '');
    else if (/в месяц/.test(l) && num(v)) {
      const name = label.replace(/\s*в месяц.*$/i, '');
      const cat = /еда|продукт/.test(l) ? 'food' : /бензин|газ|транспорт|такси/.test(l) ? 'transport' : /кафе|развлеч/.test(l) ? 'fun' : /врач|аптек|здоров/.test(l) ? 'health' : /одежд/.test(l) ? 'clothes' : 'other';
      s.expenses.push({ name, amount: num(v), cat });
    }
  }
  return s;
}

function parsePlan(rows) {
  const h = findHeader(rows, (s, r) => r.filter(isDate).length >= 3);
  if (h < 0) return [];
  const months = rows[h].map((v, i) => (isDate(v) ? { i, ym: ym(v) } : null)).filter(Boolean);
  const skip = /остаток|зарплат|возврат|ипотек|бензин|сигарет|бухгалт|еда|платежи по долгам|долг|закрыт|вклад|процент|накоплен|комисс/i;
  const out = [];
  for (const r of rows.slice(h + 1)) {
    const label = txt(r[0]);
    if (!label || skip.test(label)) continue;
    for (const m of months) { const a = num(r[m.i]); if (a > 0) out.push({ ym: m.ym, amount: a, note: label }); }
  }
  return out;
}

async function parseWorkbook(buf) {
  const names = await readXlsx.readSheetNames(buf);
  const sheets = {};
  for (const n of names) { try { sheets[n] = await readXlsx(buf, { sheet: n }); } catch (e) { sheets[n] = []; } }
  const notes = Object.values(sheets).flat().map(r => r.map(txt).join(' ')).filter(s => s.length > 40);
  let debts = [], settings = { expenses: [] }, plan = [];
  for (const [n, rows] of Object.entries(sheets)) {
    const low = n.toLowerCase();
    if (!debts.length) { const d = parseDebts(rows, notes); if (d.length) debts = d; }
    if (/настройк|settings/.test(low)) settings = parseSettings(rows);
    if (/^план|plan/.test(low)) plan = parsePlan(rows);
  }
  return { sheets: names, debts, settings, plan };
}

module.exports = { parseWorkbook };

// ---- То же преобразование, что и в приложении (public/app.js → impBuild), для командной строки ----
function emptyBudget() {
  return {
    currency: 'AMD',
    profile: { married: false, partnerIncome: 0, kids: [], car: { has: false, fuel: 0, parking: 0, insurance: 0, service: 0, tax: 0 }, housing: { type: 'own', rent: 0, maint: 0 }, util: { electricity: 0, gas: 0, water: 0, internet: 0, phone: 0, building: 0 } },
    incomes: [], expenses: [], loans: [], accounts: [], reminders: [],
    set: { dep: 9, inv: 8, tax: 10, infl: 4 }, adv: { amount: 0, mode: 'once', horizon: 0 },
  };
}
const ymDay = (ym, day) => { const [y, m] = ym.split('-').map(Number); return ym + '-' + String(Math.min(day || 1, new Date(y, m, 0).getDate())).padStart(2, '0'); };
const BANKS_RE = /ameriabank|ardshinbank|acba|inecobank|evocabank|idbank|unibank|araratbank|amio bank|fast bank|vtb|converse bank|armeconombank/i;
function buildImport(r, { mortgageBalance = 0, mortgageRate = 0, now = new Date() } = {}) {
  const src = 'xlsx', b = { loans: [], incomes: [], expenses: [], accounts: [], events: [], reminders: [], depositTarget: false };
  const short = c => (String(c).length > 9 ? '…' + String(c).slice(-4) : String(c));
  const kind = t => (/ипотек|mortgage/i.test(t) ? 'mortgage' : /авто|car/i.test(t) ? 'car' : /карт|card|rocket|line/i.test(t) ? 'card' : /микро|payday|онлайн-?займ/i.test(t) ? 'short' : /знаком|друг|брат|сестр|родител|friend/i.test(t) ? 'other' : 'consumer');
  const human = c => /[a-zа-яё]{3,}\s/i.test(String(c)) && !/\d{5,}/.test(String(c));
  for (const d of r.debts) {
    const n = Math.max(1, d.schedule.length), rocket = /rocket|line/i.test(d.type);
    const tclean = d.type.replace(/\s*\d+[.,]?\d*\s*%/, '').replace(/,\s*$/, '').trim();
    b.loans.push({ name: human(d.contract) ? d.contract : (tclean || 'Кредит') + ' · ' + short(d.contract), bank: rocket ? 'Rocket Line' : ((d.contract + ' ' + d.type).match(BANKS_RE) || [''])[0], type: kind(d.type + ' ' + d.contract), balance: Math.round(d.balance * 100) / 100, rate: d.rate, payment: Math.ceil(d.balance / n * (1 + d.rate / 1200)), day: d.due ? +d.due.slice(8, 10) : 1, contract: d.contract, schedule: d.schedule,
      mode: d.schedule.length > 1 ? 'plan' : d.schedule.length === 1 || d.due ? 'once' : 'monthly',
      due: d.schedule.length === 1 ? ymDay(d.schedule[0].ym, d.due ? +d.due.slice(8, 10) : 1) : d.schedule.length ? undefined : d.due || undefined,
      deadline: d.due || undefined, src });
  }
  const s = r.settings || {};
  if (s.salary) b.incomes.push({ name: 'Зарплата', amount: s.salary, src });
  (s.expenses || []).forEach(e => b.expenses.push({ name: e.name, cat: e.cat, amount: e.amount, src }));
  if (s.mortgage) {
    if (mortgageBalance > 0) b.loans.push({ name: s.mortgage.name, bank: (s.mortgage.name.match(BANKS_RE) || [''])[0], type: 'mortgage', balance: mortgageBalance, rate: mortgageRate, payment: s.mortgage.payment, day: 1, src });
    else b.expenses.push({ name: s.mortgage.name + ' · платёж', cat: 'other', amount: s.mortgage.payment, src });
  }
  if (s.cash) b.accounts.push({ bank: 'Наличные', type: 'cash', balance: s.cash, rate: 0, src });
  if (s.depositRate) { b.accounts.push({ bank: 'Вклад на цель', type: 'deposit', balance: 0, rate: s.depositRate, src }); b.depositTarget = true; }
  if (s.taxRefund) b.incomes.push({ name: 'Возврат налога (ипотека)', amount: s.taxRefund.amount, freq: 'quarterly', month: ((Math.min(...s.taxRefund.months) - 1) % 3) + 1, day: 20, src });
  for (const p of r.plan || []) { const [y, m] = p.ym.split('-').map(Number); b.events.push({ month: Math.max(1, (y - now.getFullYear()) * 12 + (m - 1 - now.getMonth()) + 1), type: 'oneExpense', amount: p.amount, acc: -1, note: p.note, src }); }
  if (s.goalDate) b.reminders.push({ title: s.goalLabel || 'Цель', cat: 'home', amount: 0, freq: 'once', date: s.goalDate, day: 1, month: 1, daysBefore: 30, active: true, src });
  return b;
}
function mergeImport(data, b, { overwrite = false } = {}) {
  const d = data && data.profile ? data : emptyBudget();
  const skipped = [];
  const norm = x => String(x || '').trim().toLowerCase();
  for (const k of ['loans', 'incomes', 'expenses', 'reminders']) {
    d[k] = (d[k] || []).filter(x => x.src !== 'xlsx');
    for (const item of b[k]) {
      const key = k === 'loans' ? item.contract || item.name : item.name || item.title;
      const same = d[k].findIndex(x => norm(k === 'loans' ? x.contract || x.name : x.name || x.title) === norm(key));
      if (same >= 0 && !overwrite) { skipped.push({ k, name: key, have: d[k][same], file: item }); continue; }
      if (same >= 0) d[k].splice(same, 1);
      d[k].push(item);
    }
  }
  d.accounts = d.accounts || [];
  for (let i = b.accounts.length - 1; i >= 0; i--) {
    const a = b.accounts[i];
    const same = d.accounts.findIndex(x => x.src !== 'xlsx' && (a.type === 'cash' ? x.type === 'cash' : norm(x.bank) === norm(a.bank)));
    if (same >= 0 && !overwrite) { skipped.push({ k: 'accounts', name: a.bank, have: d.accounts[same], file: a }); b.accounts.splice(i, 1); }
  }
  d.scen = d.scen || { events: [], infl: true, growth: 0, horizon: 24, target: -1 };
  d.scen.events = (d.scen.events || []).filter(x => x.src !== 'xlsx').concat(b.events);
  b.accounts.forEach((a, i) => {
    const ex = d.accounts.findIndex(x => x.src === 'xlsx' && x.type === a.type && x.bank === a.bank);
    let idx; if (ex >= 0) { Object.assign(d.accounts[ex], a); idx = ex; } else { d.accounts.push(a); idx = d.accounts.length - 1; }
    if (b.depositTarget && a.type === 'deposit') d.scen.target = idx;
  });
  d._skipped = skipped;
  return d;
}
module.exports.buildImport = buildImport;
module.exports.mergeImport = mergeImport;
module.exports.emptyBudget = emptyBudget;
