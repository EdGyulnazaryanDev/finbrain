#!/usr/bin/env node
// Работа с локальной базой из терминала.
//   npm run db:status                         — что лежит в базе (по каждому пользователю)
//   npm run db:status -- --email you@mail.am  — подробно по одному пользователю
//   npm run db:import -- --email you@mail.am --file ~/Downloads/plan.xlsx [--mortgage-balance 30000000 --mortgage-rate 12.9] [--dry-run] [--overwrite]
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { db, q, saveBudgetRev } = require('../db');
const { parseWorkbook, buildImport, mergeImport } = require('../importer');

const args = process.argv.slice(2);
const cmd = args[0];
const opt = k => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : undefined; };
const flag = k => args.includes('--' + k);
const amd = n => Math.round(+n || 0).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ֏';
const sum = (a, k) => (a || []).reduce((s, x) => s + (+x[k] || 0), 0);

function summary(d) {
  if (!d) return '  (бюджет ещё не сохранён — войдите в приложение хотя бы раз)';
  const L = [];
  const inc = d.incomes || [], mInc = inc.filter(x => (x.freq || 'monthly') === 'monthly'), pInc = inc.filter(x => (x.freq || 'monthly') !== 'monthly');
  L.push(`  Доходы:        ${mInc.length} шт., ${amd(sum(mInc, 'amount'))}/мес.` + (pInc.length ? ` + периодические: ${pInc.map(x => x.name + ' ' + amd(x.amount) + ' (' + ({ quarterly: 'раз в квартал', yearly: 'раз в год', once: 'однократно' }[x.freq]) + ')').join(', ')}` : ''));
  L.push(`  Расходы:       ${(d.expenses || []).length} шт., ${amd(sum(d.expenses, 'amount'))}/мес.`);
  const mode = l => l.mode || (Array.isArray(l.schedule) && l.schedule.length ? (l.schedule.length === 1 ? 'once' : 'plan') : 'monthly');
  const monthly = (d.loans || []).filter(l => mode(l) === 'monthly'), temp = (d.loans || []).filter(l => mode(l) !== 'monthly');
  L.push(`  Кредиты:       ${(d.loans || []).length} шт., долг ${amd(sum(d.loans, 'balance'))}`);
  L.push(`    ежемесячные: ${monthly.length} шт., платежи ${amd(sum(monthly, 'payment'))}/мес.`);
  L.push(`    разовые / по графику: ${temp.length} шт. на ${amd(sum(temp, 'balance'))} (к конкретным датам, не каждый месяц)`);
  L.push(`  Счета:         ${(d.accounts || []).length} шт., ${amd(sum(d.accounts, 'balance'))}`);
  L.push(`  Операции:      ${(d.ops || []).length} шт.`);
  L.push(`  Напоминания:   ${(d.reminders || []).length} шт.`);
  L.push(`  Прогноз:       ${(d.scen?.events || []).length} событий`);
  const imp = ['loans', 'incomes', 'expenses', 'accounts', 'reminders'].reduce((s, k) => s + (d[k] || []).filter(x => x.src === 'xlsx').length, 0);
  L.push(`  Из Excel:      ${imp ? imp + ' записей' : 'нет'}`);
  return L.join('\n');
}
function details(d) {
  if (!d) return '';
  const rows = [];
  for (const l of d.loans || []) { const md = l.mode || (Array.isArray(l.schedule) && l.schedule.length ? (l.schedule.length === 1 ? 'once' : 'plan') : 'monthly');
    rows.push(`    🏦 ${l.name}${l.bank ? ' (' + l.bank + ')' : ''}: ${amd(l.balance)}, ${l.rate}%, ` + (md === 'monthly' ? `${amd(l.payment)}/мес., день ${l.day}` : md === 'once' ? `одной суммой ${l.due || (l.schedule?.[0]?.ym || '?')}` : `по графику: ${(l.schedule || []).map(x => x.ym + ' ' + amd(x.amount)).join(', ')}`) + (l.src === 'xlsx' ? '  [Excel]' : '')); }
  for (const a of d.accounts || []) rows.push(`    💳 ${a.bank || a.type}: ${amd(a.balance)}${+a.rate ? ', ' + a.rate + '%' : ''}`);
  for (const x of d.incomes || []) rows.push(`    ➕ ${x.name}: ${amd(x.amount)}/мес.`);
  for (const x of d.expenses || []) rows.push(`    ➖ ${x.name}: ${amd(x.amount)}/мес.`);
  return rows.join('\n');
}
const users = () => db.prepare('SELECT u.id, u.email, b.data, b.updated_at FROM users u LEFT JOIN budgets b ON b.user_id = u.id ORDER BY u.id').all();

async function main() {
  if (cmd === 'status') {
    const email = opt('email');
    const list = users().filter(u => !email || u.email.toLowerCase() === email.toLowerCase());
    if (!list.length) { console.log(email ? `Пользователь ${email} не найден.` : 'В базе нет пользователей. Зарегистрируйтесь в приложении.'); return; }
    console.log(`База: ${process.env.DB_FILE || 'data/finbrain.db'}\n`);
    for (const u of list) {
      const d = u.data ? JSON.parse(u.data) : null;
      console.log(`👤 ${u.email}${u.updated_at ? '  (обновлено ' + u.updated_at + ' UTC)' : ''}\n${summary(d)}`);
      if (email) console.log('\n' + details(d));
      console.log('');
    }
    return;
  }
  if (cmd === 'import') {
    const email = opt('email'), file = opt('file');
    if (!email || !file) { console.log('Нужно: --email ваш@email --file путь/к/файлу.xlsx'); process.exit(1); }
    const u = users().find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u) { console.log(`Пользователь ${email} не найден. Сначала зарегистрируйтесь в приложении.`); process.exit(1); }
    const buf = fs.readFileSync(path.resolve(file.replace(/^~/, require('os').homedir())));
    const parsed = await parseWorkbook(buf);
    if (!parsed.debts.length && !parsed.settings?.salary) { console.log('В файле не нашлось ни долгов, ни настроек. Сравните со шаблоном public/samples/finbrain-template.xlsx'); process.exit(1); }
    const b = buildImport(parsed, { mortgageBalance: +opt('mortgage-balance') || 0, mortgageRate: +opt('mortgage-rate') || 0 });
    const before = u.data ? JSON.parse(u.data) : null;
    const after = mergeImport(before ? JSON.parse(JSON.stringify(before)) : null, b, { overwrite: flag('overwrite') });
    const skipped = after._skipped || []; delete after._skipped;
    console.log(`Файл: ${file}\nЛисты: ${parsed.sheets.join(', ')}\nНайдено: долгов ${parsed.debts.length} на ${amd(sum(parsed.debts, 'balance'))}, событий прогноза ${b.events.length}\n`);
    console.log('БЫЛО:\n' + summary(before) + '\n\nСТАНЕТ:\n' + summary(after) + '\n');
    if (skipped.length) {
      console.log('⚠️  Уже есть в базе — не добавлено, чтобы не было дублей (заменить: добавьте --overwrite):');
      for (const x of skipped) console.log(`   • ${x.name}: в базе ${amd(x.have.amount ?? x.have.balance)}, в файле ${amd(x.file.amount ?? x.file.balance)}`);
      console.log('');
    }
    if (parsed.settings?.mortgage && !(+opt('mortgage-balance') > 0)) console.log('ℹ️  Остаток ипотеки не указан — ипотека добавлена как ежемесячный расход. Добавьте --mortgage-balance и --mortgage-rate, чтобы она стала кредитом.\n');
    if (flag('dry-run')) { console.log('Это пробный запуск (--dry-run): база не изменена.'); return; }
    saveBudgetRev(u.id, JSON.stringify(after), null);
    console.log('✅ Записано в базу. Обновите страницу в браузере (Cmd+Shift+R).');
    return;
  }
  console.log('Команды:\n  npm run db:status [-- --email you@mail.am]\n  npm run db:import -- --email you@mail.am --file plan.xlsx [--mortgage-balance N --mortgage-rate R] [--dry-run]');
}
main().catch(e => { console.error('Ошибка:', e.message); process.exit(1); });
