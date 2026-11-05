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
  for (const n of names) sheets[n] = await readXlsx(buf, { sheet: n });
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
