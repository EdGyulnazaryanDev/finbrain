// «Денежный мозг»: одна лента денег из всего бюджета, прокрутка по дням, вердикт «можно / нельзя».
// Чистые функции: без DOM, без глобального S, «сегодня» приходит параметром. Работает в браузере (window.Ledger) и в Node.
(function (root) {
  'use strict';
  const num = v => { const n = parseFloat(String(v ?? '').replace(/\s/g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const dim = (y, m0) => new Date(y, m0 + 1, 0).getDate();
  const ymDay = (ym, day) => { const [y, m] = ym.split('-').map(Number); return ym + '-' + pad(Math.min(Math.max(1, num(day) || 1), dim(y, m - 1))); };
  const parse = ds => { const [y, m, d] = ds.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (ds, n) => { const d = parse(ds); d.setDate(d.getDate() + n); return ymd(d); };
  const ymAdd = (ym, k) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + k, 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); };
  const ymDiff = (a, b) => { const [y1, m1] = a.split('-').map(Number), [y2, m2] = b.split('-').map(Number); return (y2 - y1) * 12 + (m2 - m1); };
  const daysIn = ym => { const [y, m] = ym.split('-').map(Number); return dim(y, m - 1); };

  /* ---- кредиты, доходы, регулярные: те же правила, что и в app.js (app.js берёт их отсюда) ---- */
  const loanMode = l => l.mode || (Array.isArray(l.schedule) && l.schedule.length ? (l.schedule.length === 1 ? 'once' : 'plan') : 'monthly');
  const isTemp = l => loanMode(l) !== 'monthly';
  const loanDue = l => l.due ? l.due : Array.isArray(l.schedule) && l.schedule.length ? ymDay(l.schedule[l.schedule.length - 1].ym, l.day) : null;
  function loanPlan(l) {
    const md = loanMode(l);
    if (md === 'once') { const d = loanDue(l); return d ? [{ date: d, amount: num(l.balance) }] : []; }
    if (md === 'plan') return (l.schedule || []).map(x => ({ date: ymDay(x.ym, l.day), amount: num(x.amount) })).sort((a, b) => a.date.localeCompare(b.date));
    return [];
  }
  const activeIn = (x, ym) => (!x.from || x.from.slice(0, 7) <= ym) && (!x.to || x.to.slice(0, 7) >= ym);
  const incFreq = x => x.freq || 'monthly';
  const quarterMonths = x => { const st = num(x.month) || 1; return [0, 3, 6, 9].map(k => ((st - 1 + k) % 12) + 1).sort((a, b) => a - b); };
  function incomeInMonth(x, ds) { // сумма дохода x в месяце даты ds
    const f = incFreq(x), ym = ds.slice(0, 7), mo = +ds.slice(5, 7);
    if (f !== 'once' && !activeIn(x, ym)) return 0;
    if (f === 'monthly') return num(x.amount);
    if (f === 'quarterly') return quarterMonths(x).includes(mo) ? num(x.amount) : 0;
    if (f === 'yearly') return mo === (num(x.month) || 1) ? num(x.amount) : 0;
    if (f === 'once') return x.date && x.date.slice(0, 7) === ym ? num(x.amount) : 0;
    return 0;
  }
  function planOccIn(p, ym, uptoDay) { // сумма регулярного платежа p в месяце ym (до дня uptoDay)
    const a = num(p.amount); if (!a || !activeIn(p, ym)) return 0; const f = p.freq || 'monthly';
    const [y, m] = ym.split('-').map(Number), f0 = p.from ? parse(p.from) : null, day0 = f0 ? f0.getDate() : 1, lastD = uptoDay || 31;
    const end = p.to ? parse(p.to) : null;
    if (f === 'weekly') { const anchor = f0 || new Date(y, m - 1, 1); let n = 0; for (let d = 1; d <= Math.min(lastD, dim(y, m - 1)); d++) { const dt = new Date(y, m - 1, d), k = Math.round((dt - anchor) / 864e5); if (k >= 0 && k % 7 === 0 && (!end || dt <= end)) n++; } return n * a; }
    const dd = Math.min(day0, dim(y, m - 1)); if (dd > lastD) return 0;
    const dt = new Date(y, m - 1, dd); if (f0 && dt < f0) return 0; if (end && dt > end) return 0;
    const m0 = f0 ? f0.getMonth() + 1 : 1;
    if (f === 'monthly') return a;
    if (f === 'quarterly') return ((m - m0) % 3 + 3) % 3 === 0 ? a : 0;
    if (f === 'yearly') return m === m0 ? a : 0;
    return 0;
  }
  const BIZ_ACT = { other: [10, 4.5], trade: [10, 1], manuf: [7, 3], catering: [12, 3.5], hitech: [1, 1] };
  function bizAmounts(b, fx) { // налоги ИП в месяц, в валюте бюджета (как bizCalc в app.js)
    const amd = x => x * fx('AMD'), rev = num(b.revenue) * fx(b.cur || 'AMD'), docE = num(b.docExp), yearAMD = rev * 12 / fx('AMD'), A = BIZ_ACT[b.activity] || BIZ_ACT.other;
    let tt = 0, inc = 0, vat = 0, profit = 0;
    if (b.regime === 'turnover') { tt = b.activity === 'hitech' ? rev * 0.01 : Math.max(rev * A[0] / 100 - docE * A[0] / 100, rev * A[1] / 100); profit = amd(5000); }
    else if (b.regime !== 'micro') { inc = Math.max(0, rev - docE) * 0.2; if (String(b.vat) === 'true') vat = Math.max(0, rev - docE) * 20 / 120; }
    const social = String(b.social) !== 'false' ? amd(5000) : 0;
    const health = b.health === 'on' || (b.health === 'auto' && yearAMD >= 2400001) ? amd(129600 / 12) : 0;
    const stamp = amd((yearAMD <= 12e6 ? 12000 : 120000) / 12);
    return { rev, quarter: (tt + inc + vat) * 3, monthly: social + profit, year: (health + stamp) * 12, acc: num(b.accountant) };
  }

  /* ---- лента ---- */
  const KIND_ORDER = { income: 0 };
  function sortEntries(a) { return a.sort((x, y) => x.date < y.date ? -1 : x.date > y.date ? 1 : ((x.amount >= 0 ? 0 : 1) - (y.amount >= 0 ? 0 : 1)) || (Math.abs(x.amount) - Math.abs(y.amount))); }

  // Все записи бюджета с датой в (from, to]. Суммы в валюте бюджета: + приход, − расход.
  function buildEntries(b, opts) {
    const { from, to } = opts, today = opts.today || from, T = opts.T || (r => r), fx = opts.fx || (() => 1);
    const out = [], inRange = ds => ds > from && ds <= to;
    const push = (date, amount, kind, src, label, extra) => { if (amount && inRange(date)) out.push({ date, amount: Math.round(amount * 100) / 100, acc: -1, kind, src, label, ...extra }); };
    const paid = (map, key, ym) => String(((b[map] || {})[key]) || '').slice(0, 7) === ym;
    const p = b.profile || {}, car = p.car || {}, biz = b.biz || {}, tYm = today.slice(0, 7);
    const months = []; for (let ym = from.slice(0, 7); ym <= to.slice(0, 7); ym = ymAdd(ym, 1)) months.push(ym);
    const yearlyItems = [];
    if (car.has) [['car.tax', car.tax, car.taxMonth, T('Машина: налог (գույքահարկ)', 'Car: property tax', 'Մեքենա՝ գույքահարկ')], ['car.insurance', car.insurance, car.insMonth, T('Машина: страховка', 'Car: insurance', 'Մեքենա՝ ապահովագրություն')], ['car.service', car.service, car.serviceMonth, T('Машина: обслуживание', 'Car: service', 'Մեքենա՝ սպասարկում')]].forEach(x => yearlyItems.push(x));
    (p.kids || []).forEach((k, i) => yearlyItems.push(['kids.' + i + '.tuition', k.tuitionYear, k.tuitionMonth, T('Учёба ребёнка', 'Child’s tuition', 'Երեխայի ուսում')]));
    for (const ym of months) {
      // доходы
      (b.incomes || []).forEach((x, i) => {
        if (paid('incPaid', i, ym) && incFreq(x) !== 'monthly') return;
        const a = incomeInMonth(x, ym + '-01'); if (!a) return;
        const date = incFreq(x) === 'once' && x.date ? x.date : ymDay(ym, x.day || 1);
        push(date, a * fx(x.cur || b.currency || 'AMD') / fx(b.currency || 'AMD'), 'income', { type: 'income', i }, x.name || T('Доход', 'Income', 'Եկամուտ'), { acc: x.acc ?? -1 });
      });
      if (p.married && num(p.partnerIncome)) push(ymDay(ym, 1), num(p.partnerIncome), 'income', { type: 'partner' }, T('Доход супруга(и)', 'Partner income', 'Զուգընկերոջ եկամուտ'));
      if (biz.on && activeIn(biz, ym)) {
        const z = bizAmounts(biz, fx), m = +ym.slice(5);
        push(ymDay(ym, biz.revDay || 1), z.rev, 'income', { type: 'biz', k: 'rev' }, T('Выручка ИП', 'Business revenue', 'ԱՁ հասույթ'));
        if ([1, 4, 7, 10].includes(m) && z.quarter > 0 && !paid('bizPaid', 'tax', ym)) push(ymDay(ym, 20), -z.quarter, 'tax', { type: 'biz', k: 'tax' }, T('Налоги ИП за квартал', 'Quarterly business taxes', 'Եռամսյակային ԱՁ հարկեր'));
        if (z.monthly > 0 && !paid('bizPaid', 'soc', ym)) push(ymDay(ym, 15), -z.monthly, 'tax', { type: 'biz', k: 'soc' }, T('ИП: соцплатёж и налог на прибыль', 'Business: social payment and profit tax', 'ԱՁ՝ սոցվճար և շահութահարկ'));
        if (m === 4 && z.year > 0 && !paid('bizPaid', 'year', ym)) push(ymDay(ym, 20), -z.year, 'tax', { type: 'biz', k: 'year' }, T('ИП: годовая декларация, медстраховка, гербовый сбор', 'Business: annual return, health insurance, stamp duty', 'ԱՁ՝ տարեկան հաշվետվություն'));
        if (z.acc > 0 && !paid('bizPaid', 'acc', ym)) push(ymDay(ym, biz.accDay || 10), -z.acc, 'tax', { type: 'biz', k: 'acc' }, T('Бухгалтер', 'Accountant', 'Հաշվապահ'));
      }
      // жизнь: равномерно по дням (одна запись в день), счета на дату — одним платежом
      let living = 0;
      (b.expenses || []).forEach((e, i) => { if (!activeIn(e, ym) || !num(e.amount)) return; if (e.day) push(ymDay(ym, e.day), -num(e.amount), 'bill', { type: 'expense', i }, e.name || ''); else living += num(e.amount); });
      if (car.has) living += num(car.fuel) + num(car.parking);
      (p.kids || []).forEach(k => { living += num(k.monthly); });
      if (living) { const D = daysIn(ym); for (let d = 1; d <= D; d++) push(ym + '-' + pad(d), -living / D, 'living', { type: 'living' }, T('Жизнь: еда, транспорт и прочее', 'Living costs', 'Կենցաղային ծախսեր')); }
      const util = Object.values(p.util || {}).reduce((s, v) => s + num(v), 0);
      if (util) push(ymDay(ym, p.utilDay || 10), -util, 'bill', { type: 'util' }, T('Коммунальные', 'Utilities', 'Կոմունալ'));
      const h = p.housing || {}, hs = h.type === 'rent' ? num(h.rent) : num(h.maint);
      if (hs) push(ymDay(ym, h.day || 10), -hs, 'bill', { type: 'housing' }, h.type === 'rent' ? T('Аренда', 'Rent', 'Վարձ') : T('Обслуживание жилья', 'Home maintenance', 'Բնակարանի սպասարկում'));
      yearlyItems.forEach(([k, amt, mon, label]) => {
        if (!num(amt)) return;
        if (num(mon) >= 1) { if (+ym.slice(5) === num(mon)) push(ymDay(ym, 1), -num(amt), 'yearly', { type: 'profile', k }, label); }
        else push(ymDay(ym, 1), -num(amt) / 12, 'yearly', { type: 'profile', k, spread: true }, label + ' · ' + T('укажите месяц оплаты', 'set the payment month', 'նշեք վճարման ամիսը'));
      });
      // кредиты
      (b.loans || []).forEach((l, i) => {
        if (num(l.balance) <= 0) return;
        if (isTemp(l)) loanPlan(l).forEach((x, k) => { if (x.date.slice(0, 7) === ym && !paid('loanPaid', i + '_' + k, ym)) push(x.date, -x.amount, 'loan', { type: 'loan', i, k }, l.name || '', { loan: i }); });
        else if (num(l.payment) > 0 && activeIn(l, ym) && !paid('loanPaid', i, ym)) push(ymDay(ym, l.day || 1), -num(l.payment), 'loan', { type: 'loan', i }, l.name || '', { loan: i });
      });
      // регулярные платежи и накопления на цели
      (b.plans || []).forEach((pl, i) => {
        const a = planOccIn(pl, ym); if (!a || paid('planPaid', i, ym)) return;
        const date = ymDay(ym, pl.from ? +pl.from.slice(8) : 1);
        if (pl.kind === 'save') push(date, -a, 'save', { type: 'plan', i }, pl.name || '', { toAcc: num(pl.acc) });
        else push(date, -a, 'plan', { type: 'plan', i }, pl.name || '');
      });
      // события прогноза
      ((b.scen || {}).events || []).forEach((ev, i) => {
        const m = Math.round(num(ev.month)) || 1, evYm = ev.date ? ev.date.slice(0, 7) : ymAdd(tYm, m - 1), amt = Math.abs(num(ev.amount)), date = ev.date || ymDay(evYm, 1);
        const src = { type: 'event', i }, label = ev.note || '';
        if (evYm === ym) {
          if (ev.type === 'oneIncome') push(date, amt, 'event', src, label, { acc: ev.acc === undefined || ev.acc === '' ? -1 : num(ev.acc) });
          if (ev.type === 'oneExpense') push(date, -amt, 'event', src, label, { acc: ev.acc === undefined || ev.acc === '' ? -1 : num(ev.acc) });
          if ((ev.type === 'prepay' || ev.type === 'payoff') && b.loans && b.loans[num(ev.loan)]) out.push({ date, amount: ev.type === 'payoff' ? -Infinity : -amt, acc: -1, kind: 'event', src, label: label || (b.loans[num(ev.loan)].name || ''), loan: num(ev.loan), prepay: ev.type, mode: ev.mode || 'term' });
          if (ev.type === 'rate' && inRange(date)) out.push({ date, amount: 0, acc: -1, kind: 'rate', src, label, target: ev.target, rate: num(ev.rate) });
          if (ev.type === 'newLoan' && amt && ev.use !== 'spend') push(date, amt, 'event', src, label || T('Новый кредит', 'New loan', 'Նոր վարկ'));
        }
        if (ym >= evYm && (ev.type === 'incomeDelta' || ev.type === 'expenseDelta') && num(ev.amount)) push(ymDay(ym, 1), ev.type === 'incomeDelta' ? num(ev.amount) : -num(ev.amount), ev.type === 'incomeDelta' ? 'income' : 'bill', src, label);
        if (ev.type === 'newLoan' && amt && ym > evYm) {
          const n = Math.max(1, Math.round(num(ev.months) || 12)), k = ymDiff(evYm, ym), r = num(ev.rate) / 1200;
          if (k <= n) push(ymDay(ym, +date.slice(8)), -(r ? amt * r / (1 - Math.pow(1 + r, -n)) : amt / n), 'loan', src, label || T('Новый кредит', 'New loan', 'Նոր վարկ'));
        }
      });
    }
    // запланированные (будущие) операции
    (b.ops || []).forEach(o => { if (o.pending) push(o.date, o.type === 'in' ? num(o.amount) : -num(o.amount), 'op', { type: 'op', id: o.id }, o.note || '', { acc: o.acc ?? -1, ...(o.loan >= 0 ? { loan: o.loan } : {}) }); });
    return sortEntries(out);
  }

  /* ---- прокрутка по дням ---- */
  const ORDER = { cash: 0, current: 1, savings: 2, deposit: 3, invest: 4 };
  const annuity = (B, r, n) => n <= 0 ? B : r === 0 ? B / n : B * r / (1 - Math.pow(1 + r, -n));
  const remainN = (b, r, p) => b <= 0.5 ? 0 : r === 0 ? Math.ceil(b / Math.max(1, p)) : p <= b * r ? 600 : Math.ceil(-Math.log(1 - r * b / p) / Math.log(1 + r));
  const EXP_KINDS = { living: 1, bill: 1, yearly: 1, plan: 1, tax: 1 };

  // Остатки на каждый день от завтра на opts.days дней, итоги по месяцам, самая низкая точка, первая нехватка, цели.
  function project(b, opts) {
    const today = opts.today, days = opts.days || 730, end = addDays(today, days), set = b.set || {}, scen = b.scen || {};
    const entries = sortEntries([...buildEntries(b, { ...opts, from: today, to: end }), ...(opts.extra || [])]);
    const accs = (b.accounts || []).map(a => ({ b: num(a.balance), r: num(a.rate) / 1200, inv: a.type === 'invest' }));
    if (!accs.length) accs.push({ b: 0, r: 0, inv: false });
    const order = accs.map((a, i) => i).sort((x, y) => (ORDER[(b.accounts[x] || {}).type] ?? 5) - (ORDER[(b.accounts[y] || {}).type] ?? 5));
    let main = num(scen.target); if (!(main >= 0 && accs[main] && !accs[main].inv)) main = order.find(i => !accs[i].inv) ?? 0;
    const loans = (b.loans || []).map(l => ({ b: num(l.balance), r: isTemp(l) ? 0 : num(l.rate) / 1200, p: num(l.payment), temp: isTemp(l), name: l.name || '', closed: null }));
    const tax = 1 - num(set.tax) / 100, infl = scen.infl === false ? 0 : num(set.infl) / 100, growth = num(scen.growth) / 100, tYm = today.slice(0, 7);
    const take = (x, from) => { let left = x; const seq = from >= 0 && accs[from] ? [from, ...order.filter(i => i !== from)] : order;
      for (const i of seq) { if (left <= 0) break; const t = Math.min(Math.max(0, accs[i].b), left); accs[i].b -= t; left -= t; } if (left > 0) accs[main].b -= left; };
    const free = () => accs.reduce((s, a) => s + (a.inv ? 0 : a.b), 0);
    const debt = () => loans.reduce((s, l) => s + Math.max(0, l.b), 0);
    const goalsDef = (b.plans || []).map((p, i) => ({ p, i })).filter(({ p }) => p.kind === 'save' && num(p.goal) > 0 && p.to && p.to > today && accs[num(p.acc)]);
    const goalBal = {};
    const out = { days: [], months: [], low: null, firstShort: null, goals: [], reserve: opts.reserve ?? num(set.reserve) };
    let mo = null, k = 0, ei = 0;
    const newMonth = ym => { mo = { ym, income: 0, expenses: 0, payments: 0, interest: 0, one: 0, net: 0, endFree: 0, debt: 0, worth: 0, notes: [], closed: [] }; out.months.push(mo); };
    newMonth(tYm);
    for (let d = addDays(today, 1); d <= end; d = addDays(d, 1)) {
      const ym = d.slice(0, 7);
      if (ym !== mo.ym) newMonth(ym);
      const kk = ymDiff(tYm, ym), fInfl = Math.pow(1 + infl, kk / 12), fGrow = Math.pow(1 + growth, Math.floor(kk / 12));
      let worst = null;
      for (; ei < entries.length && entries[ei].date <= d; ei++) {
        const e = entries[ei]; if (e.date < d) continue;
        let amt = e.amount;
        if (e.kind === 'rate') { const [t, j] = String(e.target || '').split(':'); if (t === 'loan' && loans[+j]) { const l = loans[+j], n = remainN(l.b, l.r, l.p); l.r = e.rate / 1200; if (n > 0 && l.b > 0.5) l.p = annuity(l.b, l.r, n); } if (t === 'acc' && accs[+j]) accs[+j].r = e.rate / 1200; mo.notes.push('％ ' + e.label); continue; }
        if (e.loan >= 0 && loans[e.loan]) {
          const l = loans[e.loan]; if (l.b <= 0.5) continue;
          if (e.prepay) { const x = Math.min(l.b, -amt); const n = remainN(l.b, l.r, l.p); l.b -= x; take(x, -1); mo.one -= x; mo.notes.push(e.label + ' −' + Math.round(x));
            if (e.mode === 'payment' && l.b > 0.5 && n > 0) l.p = annuity(l.b, l.r, n); if (l.b <= 0.5) { l.b = 0; l.closed = ym; mo.closed.push(l.name); } amt = -x; }
          else if (e.kind === 'op') { const x = Math.min(l.b, -amt); l.b -= x; take(-amt, e.acc); mo.one += amt; }
          else { const i = l.b * l.r, due = l.temp ? -amt : (l.p || -amt), pay = Math.min(due, l.b + i); l.b = l.b + i - pay; take(pay, e.acc); mo.payments += pay; mo.interest += i; amt = -pay;
            if (l.b <= 0.5) { l.b = 0; l.closed = ym; mo.closed.push(l.name); } }
        } else {
          if (e.kind === 'income' || EXP_KINDS[e.kind]) amt *= e.kind === 'income' ? fGrow : (e.kind === 'plan' ? 1 : fInfl);
          if (e.kind === 'save') { const x = -amt; take(x, main); const t = e.toAcc; if (accs[t]) accs[t].b += x; else accs[main].b += x; continue; }
          if (amt > 0) accs[e.acc >= 0 && accs[e.acc] ? e.acc : main].b += amt; else take(-amt, e.acc);
          if (e.kind === 'income') mo.income += amt; else if (EXP_KINDS[e.kind]) mo.expenses -= amt; else if (e.kind === 'loan') mo.payments -= amt; else mo.one += amt;
          if (e.kind === 'event' || e.kind === 'op' || e.kind === 'yearly' || (e.kind === 'tax' && -amt > 50000)) mo.notes.push(e.label + ' ' + (amt >= 0 ? '+' : '−') + Math.round(Math.abs(amt)));
        }
        const f = free();
        if (amt < 0 && (!worst || amt < worst.amount)) worst = { ...e, amount: amt };
        if (f < -0.5 && !out.firstShort) out.firstShort = { date: d, entry: { ...e, amount: amt }, short: Math.round(Math.min(-f, -amt)) };
      }
      if (d.slice(8) === String(daysIn(ym))) { for (const a of accs) if (a.b > 0 && a.r > 0) a.b += a.b * a.r * tax; }
      const f = free(), snapshot = accs.map(a => Math.round(a.b));
      out.days.push({ date: d, free: f, accs: snapshot });
      if (!out.low || f < out.low.value) out.low = { date: d, value: f, entry: worst };
      for (const g of goalsDef) { if (d === g.p.to) goalBal[g.i] = accs[num(g.p.acc)].b; if (d > g.p.to && goalBal[g.i + 'late'] === undefined && accs[num(g.p.acc)].b >= num(g.p.goal) && goalBal[g.i] < num(g.p.goal)) goalBal[g.i + 'late'] = ymDiff(g.p.to.slice(0, 7), ym) || 1; }
      mo.endFree = f; mo.debt = debt(); mo.worth = accs.reduce((s, a) => s + a.b, 0) - mo.debt; mo.net = mo.income + mo.one - mo.expenses - mo.payments;
      k++;
    }
    out.goals = goalsDef.map(({ p, i }) => { const atDue = goalBal[i] ?? (accs[num(p.acc)] || {}).b ?? 0, ok = atDue >= num(p.goal) - 0.5;
      return { i, name: p.name || '', goal: num(p.goal), due: p.to, atDue, ok, lateMonths: ok ? 0 : (goalBal[i + 'late'] ?? Infinity) }; });
    out.loans = loans;
    return out;
  }

  const Ledger = { project, annuity, num, ymd, dim, ymDay, addDays, ymAdd, ymDiff, parse, loanMode, isTemp, loanDue, loanPlan, activeIn, incFreq, quarterMonths, incomeInMonth, planOccIn, bizAmounts, buildEntries, sortEntries };
  root.Ledger = Ledger;
  if (typeof module !== 'undefined' && module.exports) module.exports = Ledger;
})(typeof window !== 'undefined' ? window : globalThis);
