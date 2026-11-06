// Напоминания: расчёт ближайших дат и ежедневная отправка в Telegram.
const crypto = require('crypto');
const { db, q } = require('./db');

const num = v => { const n = parseFloat(String(v ?? '').replace(/\s/g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
const dim = (y, m) => new Date(y, m + 1, 0).getDate();
const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

// Та же логика, что и во фронтенде (public/app.js → nextOcc)
function nextOcc(r, from) {
  const day = Math.max(1, Math.min(31, num(r.day) || 1));
  const paid = r.lastPaid ? new Date(r.lastPaid + 'T00:00:00') : null;
  const mk = (y, m) => new Date(y, m, Math.min(day, dim(y, m)));
  const since = r.since ? new Date(r.since + 'T00:00:00') : null, until = r.until ? new Date(r.until + 'T00:00:00') : null;
  const ok = d => d >= from && (!paid || d > paid) && (!since || d >= since) && (!until || d <= until);
  if (r.freq === 'weekly') {
    const a = since || from; const d = new Date(Math.max(+from, +a)); d.setHours(0, 0, 0, 0);
    const off = ((Math.round((d - a) / 864e5) % 7) + 7) % 7; if (off) d.setDate(d.getDate() + 7 - off);
    while (paid && d <= paid) d.setDate(d.getDate() + 7);
    return !until || d <= until ? d : null;
  }
  if (r.freq === 'once') { const d = r.date ? new Date(r.date + 'T00:00:00') : null; return d && (!paid || d > paid) ? d : null; }
  const step = r.freq === 'yearly' ? 12 : r.freq === 'quarterly' ? 3 : 1;
  let start = r.freq === 'monthly' ? mk(from.getFullYear(), from.getMonth() - 1) : mk(from.getFullYear() - 1, (num(r.month) || 1) - 1);
  if (r.freq === 'quarterly') start = mk(from.getFullYear() - 1, ((num(r.month) || 1) - 1) % 3);
  for (let i = 0; i < 60; i++) { const d = mk(start.getFullYear(), start.getMonth() + i * step); if (ok(d)) return d; }
  return null;
}

// Вид погашения: каждый месяц / одной суммой к дате / по графику (как loanMode в app.js)
const loanMode = l => l.mode || (Array.isArray(l.schedule) && l.schedule.length ? (l.schedule.length === 1 ? 'once' : 'plan') : 'monthly');
const ymDay = (ym, day) => { const [y, m] = ym.split('-').map(Number); return ym + '-' + String(Math.min(num(day) || 1, dim(y, m - 1))).padStart(2, '0'); };
function loanPlan(l) {
  const md = loanMode(l);
  if (md === 'once') { const d = l.due || (l.schedule?.length ? ymDay(l.schedule[l.schedule.length - 1].ym, l.day) : null); return d ? [{ date: d, amount: num(l.balance) }] : []; }
  if (md === 'plan') return (l.schedule || []).map(x => ({ date: ymDay(x.ym, x.day || l.day), amount: num(x.amount) }));
  return [];
}
function allReminders(data) {
  const lp = data.loanPaid || {}, auto = [];
  (data.loans || []).forEach((l, i) => {
    if (num(l.balance) <= 0) return;
    const title = (l.name || 'Loan') + (l.bank ? ' · ' + l.bank : '');
    if (loanMode(l) !== 'monthly') loanPlan(l).forEach((x, k) => auto.push({ id: 'loan' + i + '_' + k, title, cat: 'loan', amount: x.amount, freq: 'once', date: x.date, daysBefore: 3, lastPaid: lp[i + '_' + k] }));
    else if (num(l.payment) > 0) auto.push({ id: 'loan' + i, title, cat: 'loan', amount: num(l.payment), freq: 'monthly', day: num(l.day) || 1, daysBefore: 3, lastPaid: [lp[i], l.asOf].filter(Boolean).sort().pop() });
  });
  const ip = data.incPaid || {};
  (data.incomes || []).forEach((x, i) => {
    const f = x.freq || 'monthly';
    if (f === 'monthly' || !(num(x.amount) > 0)) return;
    auto.push({ id: 'inc' + i, title: '💰 ' + (x.name || ''), cat: 'income', amount: num(x.amount), freq: f, day: num(x.day) || 15, month: num(x.month) || 1, date: x.date, daysBefore: 3, lastPaid: ip[i] });
  });
  // налоги ИП (суммы считаются только если выручка в драмах)
  const bz = data.biz || {};
  if (bz.on) {
    const bp = data.bizPaid || {}, amd = (bz.cur || 'AMD') === 'AMD' && (data.currency || 'AMD') === 'AMD';
    const rev = amd ? num(bz.revenue) : 0, doc = num(bz.docExp);
    const ACT = { other: [10, 4.5], trade: [10, 1], manuf: [7, 3], catering: [12, 3.5], hitech: [1, 1] }, A = ACT[bz.activity] || ACT.other;
    let q = 0;
    if (bz.regime === 'turnover') q = bz.activity === 'hitech' ? rev * 0.01 : Math.max((rev - doc) * A[0] / 100, rev * A[1] / 100);
    if (bz.regime === 'general') q = Math.max(0, rev - doc) * 0.2 + (bz.vat ? Math.max(0, rev - doc) * 20 / 120 : 0);
    if (bz.regime !== 'micro') auto.push({ id: 'biztax', title: '🧾 Налоги ИП за квартал', cat: 'tax', amount: Math.round(q * 3), freq: 'quarterly', day: 20, month: 1, daysBefore: 5, lastPaid: bp.tax });
    const soc = (bz.social === false || bz.social === 'false' ? 0 : 5000) + (bz.regime === 'turnover' ? 5000 : 0);
    if (soc) auto.push({ id: 'bizsoc', title: '🧾 ИП: соцплатёж и налог на прибыль', cat: 'tax', amount: soc, freq: 'monthly', day: 15, daysBefore: 3, lastPaid: bp.soc });
    auto.push({ id: 'bizyear', title: '🧾 ИП: годовая декларация, медстраховка, гербовый сбор', cat: 'tax', amount: 0, freq: 'yearly', day: 20, month: 4, daysBefore: 14, lastPaid: bp.year });
    if (num(bz.accountant) > 0) auto.push({ id: 'bizacc', title: '👩‍💼 Бухгалтер', cat: 'tax', amount: num(bz.accountant), freq: 'monthly', day: num(bz.accDay) || 10, daysBefore: 2, lastPaid: bp.acc });
  }
  // регулярные платежи и накопления с датой начала и окончания
  const pp = data.planPaid || {};
  (data.plans || []).forEach((p, i) => {
    if (!(num(p.amount) > 0) || !p.from) return;
    const f0 = new Date(p.from + 'T00:00:00');
    auto.push({ id: 'plan' + i, title: (p.kind === 'save' ? '🎯 ' : '🔁 ') + (p.name || ''), cat: p.kind === 'save' ? 'save' : 'plan', amount: num(p.amount), freq: p.freq || 'monthly', day: f0.getDate(), month: f0.getMonth() + 1, since: p.from, until: p.to || '', daysBefore: 2, lastPaid: pp[i] });
  });
  return [...auto, ...(data.reminders || []).map((r, i) => ({ ...r, id: 'u' + i }))].filter(r => r.active !== false);
}

// Напоминания, о которых надо сообщить сегодня: за N дней и в сам день платежа
function dueToday(data, today = new Date()) {
  const t = new Date(today); t.setHours(0, 0, 0, 0);
  const out = [];
  for (const r of allReminders(data)) {
    const d = nextOcc(r, t); if (!d) continue;
    const days = Math.round((d - t) / 864e5);
    const before = Math.max(0, Math.round(num(r.daysBefore ?? 3)));
    if (days === 0 || days === before) out.push({ r, d, days });
  }
  return out;
}

const L = {
  ru: { head: '🔔 Напоминание о платежах', today: 'сегодня', in: n => `через ${n} дн.`, test: '✅ Telegram подключён к «Финансовому мозгу».', linked: '✅ Готово! Напоминания о платежах будут приходить сюда.', bad: 'Ссылка устарела. Откройте приложение и нажмите «Подключить Telegram» ещё раз.' },
  en: { head: '🔔 Payment reminder', today: 'today', in: n => `in ${n} days`, test: '✅ Telegram is connected to Finance Brain.', linked: '✅ Done! Payment reminders will arrive here.', bad: 'This link has expired. Open the app and tap “Connect Telegram” again.' },
  hy: { head: '🔔 Վճարման հիշեցում', today: 'այսօր', in: n => `${n} օրից`, test: '✅ Telegram-ը միացված է «Ֆինանսական ուղեղին»։', linked: '✅ Պատրաստ է։ Վճարումների հիշեցումները կգան այստեղ։', bad: 'Հղումը հնացել է։ Բացեք հավելվածը և կրկին սեղմեք «Միացնել Telegram»։' },
};
const fmtAmd = n => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ֏';

// ---------- Telegram ----------
const TOKEN = () => process.env.TELEGRAM_BOT_TOKEN;
let botName = null;

async function tg(method, body) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN()}/${method}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}),
  });
  const j = await r.json().catch(() => ({}));
  if (!j.ok) throw new Error(j.description || 'Telegram HTTP ' + r.status);
  return j.result;
}
const send = (chatId, text) => tg('sendMessage', { chat_id: chatId, text });

db.exec(`
CREATE TABLE IF NOT EXISTS tg_links (code TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS tg_chats (user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, chat_id TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS notif_log (user_id INTEGER NOT NULL, key TEXT NOT NULL, day TEXT NOT NULL, PRIMARY KEY (user_id, key, day));
`);
const st = {
  newLink: db.prepare('INSERT INTO tg_links (code, user_id, expires_at) VALUES (?, ?, ?)'),
  link: db.prepare('SELECT * FROM tg_links WHERE code = ? AND expires_at > ?'),
  delLink: db.prepare('DELETE FROM tg_links WHERE code = ?'),
  setChat: db.prepare('INSERT INTO tg_chats (user_id, chat_id) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET chat_id = excluded.chat_id'),
  chat: db.prepare('SELECT chat_id FROM tg_chats WHERE user_id = ?'),
  delChat: db.prepare('DELETE FROM tg_chats WHERE user_id = ?'),
  allChats: db.prepare('SELECT c.user_id, c.chat_id, b.data FROM tg_chats c JOIN budgets b ON b.user_id = c.user_id'),
  logged: db.prepare('SELECT 1 FROM notif_log WHERE user_id = ? AND key = ? AND day = ?'),
  log: db.prepare('INSERT OR IGNORE INTO notif_log (user_id, key, day) VALUES (?, ?, ?)'),
};

function createLink(userId) {
  const code = crypto.randomBytes(12).toString('hex');
  st.newLink.run(code, userId, Date.now() + 30 * 60e3);
  return botName ? `https://t.me/${botName}?start=${code}` : null;
}

// Long polling: ждём /start <code> от пользователя
let offset = 0, polling = false;
async function poll() {
  if (polling || !TOKEN()) return;
  polling = true;
  try {
    const updates = await tg('getUpdates', { offset, timeout: 25, allowed_updates: ['message'] });
    for (const u of updates) {
      offset = u.update_id + 1;
      const m = u.message; if (!m?.text) continue;
      const code = (m.text.match(/^\/start\s+([a-f0-9]{24})$/) || [])[1];
      if (!code) continue;
      const row = st.link.get(code, Date.now());
      if (!row) { await send(m.chat.id, L.ru.bad + '\n' + L.hy.bad).catch(() => {}); continue; }
      st.setChat.run(row.user_id, String(m.chat.id)); st.delLink.run(code);
      const lang = langOf(row.user_id);
      await send(m.chat.id, L[lang].linked).catch(() => {});
    }
  } catch (e) { console.error('[telegram]', e.message); await new Promise(r => setTimeout(r, 5000)); }
  finally { polling = false; }
  setImmediate(poll);
}
function langOf(userId) {
  try { const b = q.getBudget.get(userId); const l = b && JSON.parse(b.data).lang; return L[l] ? l : 'ru'; } catch { return 'ru'; }
}

async function sendDaily(today = new Date()) {
  if (!TOKEN()) return 0;
  const day = ymd(today); let sent = 0;
  for (const row of st.allChats.all()) {
    let data; try { data = JSON.parse(row.data); } catch { continue; }
    const items = dueToday(data, today).filter(x => !st.logged.get(row.user_id, x.r.id + '@' + ymd(x.d) + '#' + x.days, day));
    if (!items.length) continue;
    const t = L[L[data.lang] ? data.lang : 'ru'];
    const lines = items.map(x => `• ${x.r.title || '—'}${num(x.r.amount) ? ' — ' + fmtAmd(num(x.r.amount)) : ''} (${x.days === 0 ? t.today : t.in(x.days)}, ${x.d.getDate()}.${String(x.d.getMonth() + 1).padStart(2, '0')})`);
    try {
      await send(row.chat_id, t.head + '\n\n' + lines.join('\n'));
      items.forEach(x => st.log.run(row.user_id, x.r.id + '@' + ymd(x.d) + '#' + x.days, day));
      sent++;
    } catch (e) { console.error('[telegram] send', row.user_id, e.message); }
  }
  console.log(`[reminders] ${day}: отправлено ${sent}`);
  return sent;
}

async function start() {
  if (!TOKEN()) { console.log('Telegram выключен: добавьте TELEGRAM_BOT_TOKEN в .env'); return; }
  try { const me = await tg('getMe'); botName = me.username; console.log('Telegram-бот: @' + botName); poll(); }
  catch (e) { console.error('[telegram] токен не подошёл:', e.message); }
}

module.exports = {
  start, sendDaily, createLink, dueToday, nextOcc,
  enabled: () => !!TOKEN() && !!botName,
  chatOf: uid => st.chat.get(uid)?.chat_id || null,
  unlink: uid => st.delChat.run(uid),
  test: async uid => { const c = st.chat.get(uid); if (!c) throw new Error('not_linked'); await send(c.chat_id, L[langOf(uid)].test); },
};
