// Ежедневное обновление данных рынка.
// Автоматически: курсы ЦБ Армении (официальный API), биржевые индексы (Finnhub, если есть ключ).
// Из файла data/banks.json: ставка ЦБ, вклады, ипотека, потребкредиты (у банков нет открытого API).
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { q, getMarket, saveMarket } = require('../db');

const BANKS_FILE = path.join(__dirname, '..', 'data', 'banks.json');
const TIMEOUT = 15000;

function loadBanks() {
  const j = JSON.parse(fs.readFileSync(BANKS_FILE, 'utf8'));
  delete j._comment;
  return j;
}

async function fetchWithTimeout(url, opts = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT);
  try { return await fetch(url, { ...opts, signal: ctl.signal }); }
  finally { clearTimeout(t); }
}

// Официальный SOAP-сервис ЦБ Армении
async function fetchCbaRates() {
  const body = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ExchangeRatesLatest xmlns="http://www.cba.am/" /></soap:Body></soap:Envelope>`;
  const res = await fetchWithTimeout('https://api.cba.am/exchangerates.asmx', {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: 'http://www.cba.am/ExchangeRatesLatest' },
    body,
  });
  if (!res.ok) throw new Error('CBA HTTP ' + res.status);
  return parseCbaXml(await res.text());
}

function parseCbaXml(xml) {
  const tag = (s, n) => (s.match(new RegExp(`<${n}>([^<]*)</${n}>`)) || [])[1];
  const date = (tag(xml, 'CurrentDate') || '').slice(0, 10);
  const out = { date };
  for (const block of xml.match(/<ExchangeRate>[\s\S]*?<\/ExchangeRate>/g) || []) {
    const iso = tag(block, 'ISO'), amount = parseFloat(tag(block, 'Amount')) || 1, rate = parseFloat(tag(block, 'Rate'));
    if (iso && isFinite(rate)) out[iso] = +(rate / amount).toFixed(4);
  }
  if (!out.USD) throw new Error('CBA: no USD in response');
  return out;
}

// Биржа через ETF-аналоги индексов (бесплатный тариф Finnhub отдаёт котировки акций/ETF США)
const ETFS = [
  ['SPY', 'S&P 500 (SPY)'],
  ['DIA', 'Dow Jones (DIA)'],
  ['QQQ', 'Nasdaq 100 (QQQ)'],
  ['IWM', 'Russell 2000 (IWM)'],
];
async function fetchIndices() {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return null;
  const list = [];
  let ts = 0;
  for (const [sym, name] of ETFS) {
    const r = await fetchWithTimeout(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${encodeURIComponent(key)}`);
    if (!r.ok) throw new Error('Finnhub HTTP ' + r.status);
    const j = await r.json();
    if (!j.c) continue;
    list.push({ name, value: j.c, chg: +(j.dp || 0).toFixed(2) });
    ts = Math.max(ts, j.t || 0);
  }
  if (!list.length) return null;
  return { indices: list, indicesDate: new Date(ts * 1000).toISOString().slice(0, 10) };
}

const f2 = n => (Math.round(n * 100) / 100).toString();
function buildSummary(m, prev) {
  const top = [...(m.deposits || [])].sort((a, b) => b.rate - a.rate)[0];
  const dUsd = prev?.fx?.USD ? m.fx.USD - prev.fx.USD : 0;
  const dir = (d, ru, en, hy) => (Math.abs(d) < 0.005 ? ru[0] : d > 0 ? ru[1] : ru[2]);
  const sp = (m.indices || [])[0];
  const ru = [
    `Ставка ЦБ Армении — ${m.cba.refi}% (решение от ${m.cba.date}).`,
    `Доллар — ${f2(m.fx.USD)} ֏ (${dir(dUsd, ['без изменений', `+${f2(dUsd)}`, f2(dUsd)])}), евро — ${f2(m.fx.EUR)} ֏.`,
    top ? `Лучший вклад в драмах: ${top.bank}, ${top.rate}%.` : '',
    sp ? `${sp.name}: ${sp.chg >= 0 ? '+' : ''}${sp.chg}% за день.` : '',
  ].filter(Boolean).join(' ');
  const en = [
    `CBA policy rate: ${m.cba.refi}% (decision of ${m.cba.date}).`,
    `USD ${f2(m.fx.USD)} ֏ (${dir(dUsd, ['unchanged', `+${f2(dUsd)}`, f2(dUsd)])}), EUR ${f2(m.fx.EUR)} ֏.`,
    top ? `Best AMD deposit: ${top.bank}, ${top.rate}%.` : '',
    sp ? `${sp.name}: ${sp.chg >= 0 ? '+' : ''}${sp.chg}% on the day.` : '',
  ].filter(Boolean).join(' ');
  const hy = [
    `ՀՀ ԿԲ վերաֆինանսավորման տոկոսադրույքը՝ ${m.cba.refi}% (որոշում՝ ${m.cba.date})։`,
    `Դոլար՝ ${f2(m.fx.USD)} ֏ (${dir(dUsd, ['անփոփոխ', `+${f2(dUsd)}`, f2(dUsd)])}), եվրո՝ ${f2(m.fx.EUR)} ֏։`,
    top ? `Լավագույն դրամային ավանդը՝ ${top.bank}, ${top.rate}%։` : '',
    sp ? `${sp.name}. ${sp.chg >= 0 ? '+' : ''}${sp.chg}% օրվա ընթացքում։` : '',
  ].filter(Boolean).join(' ');
  return { ru, en, hy };
}

async function run({ log = console.log } = {}) {
  const prev = getMarket();
  const banks = loadBanks();
  const { fxFallback, indicesFallback, ...bankData } = banks;
  const m = { ...(prev || {}), ...bankData };
  if (!m.fx && fxFallback) m.fx = fxFallback;
  if (!m.indices && indicesFallback) Object.assign(m, indicesFallback);
  const report = [];

  try { m.fx = { ...(prev?.fx || {}), ...(await fetchCbaRates()) }; report.push('курсы ЦБ: ok'); }
  catch (e) { report.push('курсы ЦБ: ошибка (' + e.message + '), оставлены прежние'); }

  try {
    const ix = await fetchIndices();
    if (ix) { Object.assign(m, ix); report.push('биржа: ok'); }
    else report.push('биржа: нет FINNHUB_API_KEY, пропущено');
  } catch (e) { report.push('биржа: ошибка (' + e.message + '), оставлены прежние'); }

  if (!m.fx) m.fx = { date: null, USD: null, EUR: null, RUB: null };
  m.updatedAt = new Date().toISOString();
  m.summary = m.fx.USD ? buildSummary(m, prev) : null;
  saveMarket(m);

  if (m.fx.date && m.fx.USD) {
    const top = Math.max(0, ...(m.deposits || []).map(d => d.rate));
    q.upsertHistory.run({
      date: m.fx.date, usd: m.fx.USD, eur: m.fx.EUR ?? null, rub: m.fx.RUB ?? null,
      refi: m.cba?.refi ?? null, top_deposit: top || null, sp500: m.indices?.[0]?.value ?? null,
    });
  }
  log('[market] ' + report.join('; '));
  return { report, market: m };
}

module.exports = { run, parseCbaXml, buildSummary };

if (require.main === module) {
  run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
