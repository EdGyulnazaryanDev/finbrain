#!/usr/bin/env node
// Восстановление прошлых версий бюджета из файлов SQLite (finbrain.db + finbrain.db-wal).
// Работает только с КОПИЯМИ файлов, живую базу не трогает.
//
//   node scripts/recover.js --dir ~/finbrain-rescue --email you@mail.com
//       → находит все версии бюджета, сохраняет их в ~/finbrain-rescue/versions/*.json и печатает список
//   node scripts/recover.js --restore ~/finbrain-rescue/versions/07.json --email you@mail.com [--db data/finbrain.db]
//       → записывает выбранную версию обратно в базу (текущая версия перед этим сохраняется в историю версий)
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const arg = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined; };
const home = p => p && p.replace(/^~(?=$|\/)/, os.homedir());
const email = arg('email');
if (!email) { console.error('Укажите --email'); process.exit(1); }

const summary = d => {
  const n = k => (Array.isArray(d[k]) ? d[k].length : 0);
  const names = (d.loans || []).slice(0, 3).map(l => l.name).filter(Boolean).join(', ');
  return `кредитов ${n('loans')}, доходов ${n('incomes')}, расходов ${n('expenses')}, счетов ${n('accounts')}, операций ${n('ops')}, планов ${n('plans')}${names ? ' · ' + names : ''}`;
};
const looksDemo = d => (d.loans || []).some(l => /Ardshinbank|ACBA/.test((l.name || '') + (l.bank || ''))) && (d.loans || []).length <= 3 && !(d.ops || []).length;

// ---------- restore ----------
if (arg('restore')) {
  const file = home(arg('restore'));
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!data.profile) { console.error('Это не файл бюджета'); process.exit(1); }
  const dbFile = home(arg('db')) || path.join(__dirname, '..', 'data', 'finbrain.db');
  const db = new Database(dbFile);
  const u = db.prepare('SELECT id FROM users WHERE email = ? COLLATE NOCASE').get(email);
  if (!u) { console.error('Пользователь не найден:', email); process.exit(1); }
  const cur = db.prepare('SELECT data FROM budgets WHERE user_id = ?').get(u.id);
  try { if (cur) db.prepare('INSERT INTO budget_versions (user_id, data, reason) VALUES (?, ?, ?)').run(u.id, cur.data, 'before-restore'); } catch (_) {}
  // rev + 1: открытые вкладки увидят, что данные новее, и не затрут восстановленное
  const hasRev = db.prepare('PRAGMA table_info(budgets)').all().some(c => c.name === 'rev');
  db.prepare(hasRev
    ? `INSERT INTO budgets (user_id, data, updated_at, rev) VALUES (?, ?, datetime('now'), 1)
       ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at, rev = budgets.rev + 1`
    : `INSERT INTO budgets (user_id, data, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`).run(u.id, JSON.stringify(data));
  db.close();
  console.log('✓ Восстановлено:', summary(data));
  console.log('Обновите страницу в браузере (Cmd+Shift+R).');
  process.exit(0);
}

// ---------- scan ----------
const dir = home(arg('dir')) || path.join(os.homedir(), 'finbrain-rescue');
const dbName = (fs.existsSync(dir) ? fs.readdirSync(dir) : []).find(f => f.endsWith('.db')) || 'finbrain.db';
const mainFile = path.join(dir, dbName), walFile = mainFile + '-wal';
if (!fs.existsSync(mainFile)) { console.error('Нет файла', mainFile); process.exit(1); }
const main = fs.readFileSync(mainFile);
const outDir = path.join(dir, 'versions');
fs.mkdirSync(outDir, { recursive: true });
const tmp = path.join(os.tmpdir(), 'finbrain-snap-' + process.pid + '.db');
const found = new Map();

function tryImage(buf, label) {
  const img = Buffer.from(buf);
  if (img.length < 100) return;
  img[18] = 1; img[19] = 1; // rollback-journal mode, чтобы открыть без -wal/-shm
  fs.writeFileSync(tmp, img);
  let db;
  try {
    db = new Database(tmp, { readonly: true, fileMustExist: true });
    const rows = db.prepare(`SELECT b.data, b.updated_at FROM budgets b JOIN users u ON u.id = b.user_id WHERE u.email = ? COLLATE NOCASE`).all(email);
    let vers = [];
    try { vers = db.prepare(`SELECT v.data, v.created_at AS updated_at FROM budget_versions v JOIN users u ON u.id = v.user_id WHERE u.email = ? COLLATE NOCASE`).all(email); } catch (_) {}
    for (const r of [...rows, ...vers]) {
      let d; try { d = JSON.parse(r.data); } catch (_) { continue; }
      if (!d || !d.profile) continue;
      const h = crypto.createHash('sha1').update(r.data).digest('hex');
      if (!found.has(h)) found.set(h, { data: d, raw: r.data, at: r.updated_at, src: label });
    }
  } catch (_) { /* повреждённый снимок — пропускаем */ }
  finally { try { db && db.close(); } catch (_) {} }
}

tryImage(main, 'main');
if (fs.existsSync(walFile)) {
  const wal = fs.readFileSync(walFile);
  const ps = wal.readUInt32BE(8), hs1 = wal.readUInt32BE(16), hs2 = wal.readUInt32BE(20);
  const frames = [];
  for (let off = 32; off + 24 + ps <= wal.length; off += 24 + ps) {
    frames.push({ pg: wal.readUInt32BE(off), commit: wal.readUInt32BE(off + 4), s1: wal.readUInt32BE(off + 8), s2: wal.readUInt32BE(off + 12), data: wal.subarray(off + 24, off + 24 + ps) });
  }
  // группы кадров с одинаковой «солью» = одно поколение WAL
  const gens = [];
  for (const f of frames) { const g = gens[gens.length - 1]; if (g && g.s1 === f.s1 && g.s2 === f.s2) g.fr.push(f); else gens.push({ s1: f.s1, s2: f.s2, fr: [f] }); }
  gens.sort((a, b) => ((b.s1 === hs1 && b.s2 === hs2) ? 1 : 0) - ((a.s1 === hs1 && a.s2 === hs2) ? 1 : 0));
  console.log(`WAL: страница ${ps} байт, кадров ${frames.length}, поколений ${gens.length}`);
  for (const [gi, g] of gens.entries()) {
    let img = Buffer.from(main);
    for (const [fi, f] of g.fr.entries()) {
      const need = f.pg * ps;
      if (img.length < need) img = Buffer.concat([img, Buffer.alloc(need - img.length)]);
      f.data.copy(img, (f.pg - 1) * ps);
      if (f.commit) { const size = f.commit * ps; tryImage(img.length > size ? img.subarray(0, size) : img, `wal g${gi} f${fi}`); }
    }
  }
} else console.log('Файла finbrain.db-wal нет — ищу только в основной базе.');
try { fs.unlinkSync(tmp); } catch (_) {}

if (!found.size) {
  console.log('Версий бюджета не найдено. Если есть Excel — загрузите кредиты заново: npm run db:import -- --email ' + email + ' --file plan.xlsx');
  process.exit(0);
}
const list = [...found.values()].sort((a, b) => String(a.at).localeCompare(String(b.at)));
console.log(`\nНайдено версий: ${list.length}\n`);
list.forEach((v, i) => {
  const name = String(i + 1).padStart(2, '0') + '.json';
  fs.writeFileSync(path.join(outDir, name), JSON.stringify(v.data, null, 2));
  console.log(`${name}  ${v.at || '?'}  ${looksDemo(v.data) ? '[ПРИМЕР] ' : ''}${summary(v.data)}`);
});
const best = [...list.keys()].reverse().find(i => !looksDemo(list[i].data) && ((list[i].data.loans || []).length + (list[i].data.incomes || []).length) > 0);
if (best !== undefined) console.log(`\n👉 Скорее всего ваши данные: ${String(best + 1).padStart(2, '0')}.json (последняя версия, не похожая на пример)`);
console.log(`\nФайлы: ${outDir}\nВосстановить выбранную версию:\n  node scripts/recover.js --restore ${path.join(outDir, 'NN.json')} --email ${email}`);
