require('dotenv').config();
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const { q, getMarket, saveBudgetRev } = require('./db');
const ai = require('./ai');
const market = require('./jobs/market');
const reminders = require('./reminders');
const { parseWorkbook } = require('./importer');

const PORT = +process.env.PORT || 3000;
const SESSION_DAYS = 30;
const COOKIE = 'fb_session';
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// --- базовые заголовки безопасности ---
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'same-origin',
    'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'",
  });
  next();
});
app.use(express.json({ limit: '512kb' }));

// --- простые лимиты запросов (в памяти) ---
function limiter({ windowMs, max, key }) {
  const hits = new Map();
  setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (v.reset < now) hits.delete(k); }, windowMs).unref();
  return (req, res, next) => {
    const k = key(req), now = Date.now();
    let h = hits.get(k);
    if (!h || h.reset < now) { h = { n: 0, reset: now + windowMs }; hits.set(k, h); }
    if (++h.n > max) return res.status(429).json({ error: 'too_many_requests' });
    next();
  };
}
const authLimit = limiter({ windowMs: 15 * 60e3, max: 20, key: r => r.ip });
const aiLimit = limiter({ windowMs: 60 * 60e3, max: +process.env.AI_PER_HOUR || 20, key: r => 'u' + r.user.id });

// --- сессии ---
function readCookie(req, name) {
  const m = (req.headers.cookie || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}
function setSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const exp = Date.now() + SESSION_DAYS * 864e5;
  q.createSession.run(token, userId, exp);
  res.set('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${process.env.COOKIE_SECURE === 'true' ? '; Secure' : ''}`);
}
function auth(required = true) {
  return (req, res, next) => {
    const t = readCookie(req, COOKIE);
    req.user = t ? q.sessionUser.get(t, Date.now()) : null;
    if (required && !req.user) return res.status(401).json({ error: 'unauthorized' });
    next();
  };
}
const validEmail = e => typeof e === 'string' && e.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// --- аккаунт ---
app.post('/api/register', authLimit, (req, res) => {
  const { email, password } = req.body || {};
  if (!validEmail(email)) return res.status(400).json({ error: 'bad_email' });
  if (typeof password !== 'string' || password.length < 8 || password.length > 200) return res.status(400).json({ error: 'weak_password' });
  if (q.userByEmail.get(email)) return res.status(409).json({ error: 'email_taken' });
  const info = q.createUser.run(email.trim(), bcrypt.hashSync(password, 10));
  setSession(res, info.lastInsertRowid);
  res.json({ email: email.trim() });
});
app.post('/api/login', authLimit, (req, res) => {
  const { email, password } = req.body || {};
  const u = validEmail(email) ? q.userByEmail.get(email) : null;
  if (!u || typeof password !== 'string' || !bcrypt.compareSync(password, u.pass_hash)) return res.status(401).json({ error: 'bad_credentials' });
  setSession(res, u.id);
  res.json({ email: u.email });
});
app.post('/api/logout', (req, res) => {
  const t = readCookie(req, COOKIE);
  if (t) q.deleteSession.run(t);
  res.set('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  res.json({ ok: true });
});
app.get('/api/me', auth(false), (req, res) => {
  res.json({ user: req.user ? { email: req.user.email } : null, ai: ai.aiEnabled() });
});

// --- бюджет пользователя ---
app.get('/api/budget', auth(), (req, res) => {
  const row = q.getBudget.get(req.user.id);
  res.json(row ? { data: JSON.parse(row.data), updatedAt: row.updated_at, rev: row.rev } : { data: null, rev: 0 });
});
app.put('/api/budget', auth(), (req, res) => {
  const data = req.body?.data;
  if (!data || typeof data !== 'object' || !data.profile) return res.status(400).json({ error: 'bad_data' });
  // история версий: прошлая версия сохраняется не чаще раза в 15 минут, а перед «опасными» действиями — всегда
  const prev = q.getBudget.get(req.user.id), json = JSON.stringify(data);
  if (prev && prev.data !== json) {
    const last = q.lastVersion.get(req.user.id), force = req.get('x-snapshot');
    const old = !last || Date.now() - Date.parse(last.created_at.replace(' ', 'T') + 'Z') > 15 * 60 * 1000;
    if (force || old) { q.addVersion.run(req.user.id, prev.data, force ? String(force).slice(0, 20) : 'auto'); q.pruneVersions.run(req.user.id, req.user.id); }
  }
  // вкладка со старым кодом не присылает base — считаем её устаревшей, её данные уйдут в историю версий
  const base = Number.isInteger(req.body?.base) ? req.body.base : -1;
  const r = saveBudgetRev(req.user.id, json, base);
  if (!r.ok) return res.status(409).json({ error: 'conflict', data: JSON.parse(r.data), rev: r.rev });
  res.json({ ok: true, rev: r.rev });
});

const vSummary = d => ({ loans: (d.loans || []).length, incomes: (d.incomes || []).length, expenses: (d.expenses || []).length, ops: (d.ops || []).length, accounts: (d.accounts || []).length, plans: (d.plans || []).length });
app.get('/api/budget/versions', auth(), (req, res) => {
  res.json({ versions: q.listVersions.all(req.user.id).map(v => { let d = {}; try { d = JSON.parse(v.data); } catch (_) {} return { id: v.id, at: v.created_at, reason: v.reason, ...vSummary(d) }; }) });
});
app.post('/api/budget/versions/:id/restore', auth(), (req, res) => {
  const v = q.getVersion.get(req.user.id, +req.params.id);
  if (!v) return res.status(404).json({ error: 'not_found' });
  const cur = q.getBudget.get(req.user.id);
  if (cur) q.addVersion.run(req.user.id, cur.data, 'before-restore');
  const r = saveBudgetRev(req.user.id, v.data, null);
  res.json({ ok: true, data: JSON.parse(v.data), rev: r.rev });
});

// --- рынок (только после входа) ---
app.get('/api/market', auth(), (req, res) => res.json({ market: getMarket() }));
app.get('/api/history', auth(), (req, res) => {
  const rows = q.history.all(Math.min(+req.query.limit || 120, 1000)).reverse();
  res.json({ history: rows.map(r => ({ date: r.date, USD: r.usd, EUR: r.eur, RUB: r.rub, refi: r.refi, topDeposit: r.top_deposit, sp500: r.sp500 })) });
});

// --- AI ---
app.post('/api/ai', auth(), aiLimit, async (req, res) => {
  const { messages, lang, currency, budget } = req.body || {};
  if (!Array.isArray(messages) || !messages.length) return res.status(400).json({ error: 'bad_messages' });
  const clean = messages.slice(-12)
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (!clean.length || clean[clean.length - 1].role !== 'user') return res.status(400).json({ error: 'bad_messages' });
  const m = getMarket();
  const mk = m ? { updated: m.updatedAt, cba: m.cba, inflation: m.inflation, fx: m.fx, topDeposits: (m.deposits || []).slice(0, 6), mortgages: m.mortgages, consumer: m.consumer, indices: m.indices, guarantee: m.guarantee } : null;
  const b = JSON.stringify(budget || {}).length > 60000 ? {} : (budget || {});
  try {
    const out = await ai.chat([{ role: 'system', content: ai.systemPrompt({ lang, currency: String(currency || 'AMD').slice(0, 5), budget: b, market: mk }) }, ...clean]);
    res.json(out);
  } catch (e) {
    console.error('[ai]', e.message);
    res.status(e.status || 500).json({ error: 'ai_unavailable' });
  }
});

// --- импорт из Excel (только предпросмотр, данные пользователь подтверждает сам) ---
app.post('/api/import/xlsx', auth(), express.raw({ type: () => true, limit: '5mb' }), async (req, res) => {
  if (!Buffer.isBuffer(req.body) || !req.body.length) return res.status(400).json({ error: 'bad_file' });
  try { res.json(await parseWorkbook(req.body)); }
  catch (e) { console.error('[import]', e.message); res.status(400).json({ error: 'bad_file' }); }
});

// --- Telegram-напоминания ---
app.get('/api/telegram', auth(), (req, res) => res.json({ enabled: reminders.enabled(), linked: !!reminders.chatOf(req.user.id) }));
app.post('/api/telegram/link', auth(), (req, res) => {
  if (!reminders.enabled()) return res.status(503).json({ error: 'telegram_off' });
  res.json({ url: reminders.createLink(req.user.id) });
});
app.post('/api/telegram/test', auth(), async (req, res) => {
  try { await reminders.test(req.user.id); res.json({ ok: true }); }
  catch (e) { res.status(e.message === 'not_linked' ? 400 : 502).json({ error: e.message }); }
});
app.delete('/api/telegram', auth(), (req, res) => { reminders.unlink(req.user.id); res.json({ ok: true }); });

// --- админ: ручное обновление рынка ---
function admin(req, res, next) {
  const t = req.get('x-admin-token');
  const ok = process.env.ADMIN_TOKEN && process.env.ADMIN_TOKEN !== 'change-me-to-a-long-random-string' && t &&
    t.length === process.env.ADMIN_TOKEN.length && crypto.timingSafeEqual(Buffer.from(t), Buffer.from(process.env.ADMIN_TOKEN));
  if (!ok) return res.status(403).json({ error: 'forbidden' });
  next();
}
app.post('/api/admin/send-reminders', admin, async (req, res) => res.json({ sent: await reminders.sendDaily() }));
app.post('/api/admin/refresh-market', admin, async (req, res) => {
  try { const r = await market.run(); res.json({ report: r.report }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// --- фронтенд ---
// без долгого кеша: после git pull браузер сразу получает новую версию (проверка по ETag)
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0, etag: true, setHeaders: res => res.set('Cache-Control', 'no-cache') }));
app.use('/api', (req, res) => res.status(404).json({ error: 'not_found' }));
app.use((err, req, res, next) => { console.error(err); res.status(err.status || 500).json({ error: 'server_error' }); });

// --- расписание ---
cron.schedule(process.env.MARKET_CRON || '17 8 * * *', () => market.run().catch(e => console.error('[market]', e)), { timezone: process.env.TZ_MARKET || 'Asia/Yerevan' });
cron.schedule(process.env.REMINDER_CRON || '0 9 * * *', () => reminders.sendDaily().catch(e => console.error('[reminders]', e)), { timezone: process.env.TZ_MARKET || 'Asia/Yerevan' });
setInterval(() => q.purgeSessions.run(Date.now()), 6 * 3600e3).unref();
reminders.start();

if (!getMarket()) market.run().catch(e => console.error('[market]', e)); // первый запуск

app.listen(PORT, () => {
  console.log(`Финансовый мозг: http://localhost:${PORT}`);
  if (!ai.aiEnabled()) console.log('AI выключен: добавьте GROQ_API_KEY или GEMINI_API_KEY в .env');
});
