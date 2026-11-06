# Единый денежный мозг — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Одна лента денег и один дневной расчёт на 24 месяца вперёд, из которых берут цифры все экраны. Плюс вердикт «можно / можно, но / нельзя» на каждую денежную запись.

**Architecture:** Новый файл `public/ledger.js` без DOM и без глобального `S`. Он превращает бюджет в датированные записи, прокручивает их по дням и выносит вердикт. В браузере он подключается через `<script>` как `window.Ledger`, в Node — через `require`. `app.js` вызывает его и показывает результат. Сервер получает счётчик ревизий бюджета, чтобы устаревшая вкладка не затирала данные.

**Tech Stack:** Node ≥18.17, Express, better-sqlite3, чистый JS в браузере (без сборки), тесты на `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-06-money-brain-design.md`

## Global Constraints

- Тексты интерфейса — на трёх языках через `T(ru,en,hy)`, суммы — через `fmt()`.
- `ledger.js` меньше 500 строк, не читает `S`, не трогает DOM, не вызывает `new Date()` без аргумента: «сегодня» приходит параметром `today` ('YYYY-MM-DD').
- Горизонт расчёта — 24 месяца (730 дней). Расчёт ≤ 30 мс на фикстуре.
- Свободный остаток = все счета, кроме `type==='invest'`.
- Подушка: `S.set.reserve`, если > 0, иначе `calc().essential`.
- Порядок списания без счёта: cash → current → savings → deposit → invest. Если не хватает, основной счёт уходит в минус.
- В один день сначала доходы, потом платежи по возрастанию суммы.
- Вердикт никогда не блокирует сохранение. При ❌ кнопка подписана «Всё равно записать».
- Записи с датой ≤ сегодня в будущее не идут: они уже в остатках или догоняются через `rollAccounts`.
- После каждой задачи `npm test` зелёный, приложение открывается без ошибок в консоли.

## Review Focus

- Нет ни одного счёта или все остатки 0. Расчёт не падает, свободный остаток считается от 0, вердикт ❌ говорит, на что не хватит. → тест в Task 3.
- День платежа 29–31 в коротком месяце. Платёж ставится на последний день месяца, не теряется и не уезжает в следующий. → тест в Task 2.
- Доход или счёт в валюте, отличной от валюты бюджета. Суммы переводятся через `fx`, а не складываются как есть. → тест в Task 2.
- Повторная загрузка в тот же день. `rollAccounts` не применяет записи второй раз. → тест в Task 4.
- Кредит с нулевым остатком или исчерпанным графиком. Платежей по нему в ленте нет. → тест в Task 2.

---

## Файлы

- Create: `public/ledger.js` — чистое ядро: помощники дат, `buildEntries`, `project`, `rollAccounts`, `verdict`.
- Create: `tests/ledger.test.js`, `tests/server-rev.test.js`, `tests/fixtures/budget-2026-11-06.json`.
- Modify: `db.js` — колонка `rev`, функция `saveBudgetRev`.
- Modify: `server.js` — GET/PUT `/api/budget` с ревизией, восстановление версии через `saveBudgetRev`.
- Modify: `scripts/db.js`, `scripts/recover.js` — запись через `saveBudgetRev`.
- Modify: `public/index.html` — `<script src="/ledger.js">` перед `app.js`.
- Modify: `public/app.js` — синхронизация с ревизией, адаптер `LG()`, карточка месяца, KPI, панели вердикта, поля дат и месяцев, прогноз, ближайшие платежи, советы.
- Modify: `package.json` — `"test": "node --test tests/"`.

---

### Task 1: Ревизия бюджета и защита от устаревшей вкладки

**Files:**
- Modify: `db.js`, `server.js:96-124`, `scripts/db.js:85`, `scripts/recover.js`, `public/app.js:54-61` (`save`, `pushBudget`, `afterLogin`), `package.json`
- Test: `tests/server-rev.test.js`

**Interfaces:**
- Produces: `saveBudgetRev(userId:number, json:string, base:number|null, reason?:string) -> {ok:true, rev:number} | {ok:false, rev:number, data:string}` в `db.js`. Если `base` равен `null`, запись идёт без проверки: это для скриптов и восстановления. Каждая успешная запись делает `rev+1`.
- Produces: `GET /api/budget` → `{data, updatedAt, rev}`. `PUT /api/budget` с телом `{data, base}` → `{ok:true, rev}` или `409 {error:'conflict', data, rev}`.
- Produces (клиент): глобальная `REV` в app.js. Сохранения уходят по одному, следующее ждёт ответа на предыдущее.

- [ ] **Step 1: Write the failing test** `tests/server-rev.test.js`. Сначала `process.env.DB_FILE` во временный файл, потом `require('../db')`. Создаём пользователя, затем:
  - `saveBudgetRev(id,'{"a":1}',null)` → `{ok:true,rev:1}`;
  - `saveBudgetRev(id,'{"a":2}',1)` → `{ok:true,rev:2}`;
  - `saveBudgetRev(id,'{"a":3}',1)` → `{ok:false,rev:2,data:'{"a":2}'}`, а в `budget_versions` появилась строка с `reason==='conflict'` и `data==='{"a":3}'`.
- [ ] **Step 2: Run** `npm test` → FAIL (`saveBudgetRev is not a function`; скрипта `test` ещё нет — добавить в `package.json` в этом же шаге).
- [ ] **Step 3: Implement.**
  - `db.js`: миграция `ALTER TABLE budgets ADD COLUMN rev INTEGER NOT NULL DEFAULT 0`, если колонки нет (проверка через `PRAGMA table_info`). `saveBudgetRev` — в одной транзакции.
  - `server.js`: GET отдаёт `rev`, PUT зовёт `saveBudgetRev(id,json,body.base??null)`, на `ok:false` → 409. Логика «версия раз в 15 минут» остаётся до записи. Restore использует `saveBudgetRev(...,null)`.
  - `scripts/db.js` и `scripts/recover.js`: везде, где пишут бюджет, — `saveBudgetRev(..., null)`.
- [ ] **Step 4: Implement client.**
  - `afterLogin` сохраняет `REV=r.rev`, `pushBudget` шлёт `{data, base:REV}` и на успех ставит `REV=r.rev`.
  - На 409: `S=normalize(e.data)`, `REV=e.rev`, `render()`, показать в `#syncst` или тосте: «Данные изменились в другом окне или из терминала — загружена свежая версия. Ваше последнее изменение сохранено в истории версий.»
  - `api()` при 409 кладёт в ошибку `e.data` и `e.rev` из тела ответа.
  - Пока запрос в полёте, новый `pushBudget` ставится в очередь, одна отложенная отправка.
- [ ] **Step 5: Run** `npm test` → PASS. Ручная проверка: две вкладки, правка в первой, потом во второй → вторая показывает сообщение и свежие данные, в «Версиях» появляется `conflict`.
- [ ] **Step 6: Commit** `feat: budget revision counter, 409 on stale tab`

### Task 2: ledger.js — помощники и buildEntries

**Files:**
- Create: `public/ledger.js`, `tests/ledger.test.js`, `tests/fixtures/budget-2026-11-06.json`
- Modify: `public/index.html:41`, `public/app.js` — дублирующие помощники заменить ссылками на `Ledger.*`

**Interfaces:**
- Produces, `Ledger.*`:
  - даты: `ymd(Date)->string`, `dim(y,m0)->number`, `ymDay(ym,day)->string` (день обрезается до конца месяца), `addDays(ds,n)->string`;
  - перенесённые из app.js без изменений поведения: `loanMode(l)`, `loanPlan(l)`, `activeIn(x,ym)`, `incomeInMonth(x,dateStr)`, `planOccIn(p,ym,uptoDay?)`;
  - `bizSchedule(biz, fromDs, toDs, opts)->[{date,amount,label,kind:'tax'|'acc'}]` — те же правила, что `bizCalc` / `bizPayments` (квартальные 20-го в 1/4/7/10, соцплатёж и налог на прибыль 15-го, годовые в апреле, бухгалтер в `accDay`);
  - `buildEntries(budget, {from, to, today, T, fx}) -> Entry[]`.
- `Entry = {date:'YYYY-MM-DD', amount:number /* + приход, − расход, в валюте бюджета */, acc:number /* -1 = по порядку */, toAcc?:number, kind:'income'|'living'|'bill'|'loan'|'tax'|'yearly'|'plan'|'save'|'op'|'event', src:{type:string, i?:number, k?:string, id?:number}, label:string, loan?:number}`.
- `opts.fx(cur)->number` — курс к валюте бюджета (по умолчанию `()=>1`). `opts.T` — переводчик (по умолчанию `(ru)=>ru`).
- Новые необязательные поля бюджета, которые читает `buildEntries`:
  - `incomes[].day`, `incomes[].acc`, `biz.revDay`;
  - `expenses[].day` — есть → `bill` в этот день, нет → `living` по дням;
  - `profile.utilDay`, `profile.housing.day` (по умолчанию 10);
  - `profile.car.taxMonth|insMonth|serviceMonth`, `kids[].tuitionMonth` (1–12; нет → сумма/12 каждый месяц 1-го числа, `label` с пометкой «укажите месяц оплаты»);
  - `scen.events[].date`.
- Правила разворота — по таблице 5.2 спеки. Записи строятся только для дат в `(today, to]`, кроме случая `from<today` (для `rollAccounts`).
- Платежи, отмеченные оплаченными, пропускаются: `loanPaid[i]`, `planPaid[i]`, `bizPaid[k]`, `incPaid[i]` с датой в том же месяце, что и запись.

- [ ] **Step 1: Create the fixture.** Снимок текущего бюджета пользователя: `node -e` читает `budgets.data` из `data/finbrain.db` основного checkout. Названия кредитов, счетов и операций заменить на общие («Loan A»…, «Bank 1»…), суммы, даты, дни и `pending` сохранить. Проверить по спеке: счета 50 000 / 1 300 000 / 30 000, ремонт 700 000 `pending` на 2026-11-15, ипотека 378 612 день 16, ВТБ по графику 154 303 (2026-11) и 136 156 (2026-12), `biz.revenue` 900 000, `bizPaid` за ноябрь. Добавить `biz.revDay:1`, `accounts[].asOf:'2026-11-06'`, `profile.car.taxMonth:12`, `profile.car.insMonth:3`.
- [ ] **Step 2: Write failing tests** в `tests/ledger.test.js` (`today='2026-11-06'`):
  - `buildEntries: ипотека 16-го` — запись `kind:'loan'`, `date:'2026-11-16'`, `amount:-378612`;
  - `buildEntries: годовой налог целиком в декабре` — `profile.car.tax` даёт одну запись −70 000 на 2026-12-01 и ни одной в 2027-01…2027-11;
  - `buildEntries: запланированная операция` — `kind:'op'`, `date:'2026-11-15'`, `amount:-700000`, `acc:1`; прошедшая операция в ленту не попадает;
  - `buildEntries: оплачено раньше срока` — при `loanPaid[i]='2026-11-06'` ноябрьского платежа по кредиту i нет, декабрьский есть;
  - `buildEntries: 31-е в феврале` — доход `day:31` даёт запись 2027-02-28;
  - `buildEntries: валюта` — доход 1 000 USD при `fx('USD')=400` даёт +400 000;
  - `buildEntries: закрытый кредит` — `balance:0` → ноль записей по нему;
  - `buildEntries: жизнь по дням` — сумма `living` за 7–30 ноября = (25 000 + 30 000 + 40 000 + 2 000) × 24 / 30 ± 1.
- [ ] **Step 3: Run** `npm test` → FAIL.
- [ ] **Step 4: Implement** `public/ledger.js` (IIFE: `window.Ledger = …`, внизу `if(typeof module!=='undefined')module.exports=Ledger`). Подключить в `index.html` перед `app.js`. В `app.js` старые `ymd`, `dim`, `ymDay`, `loanMode`, `loanPlan`, `activeIn`, `incomeInMonth`, `planOccIn` заменить на тонкие обёртки над `Ledger.*`, чтобы логика жила в одном месте.
- [ ] **Step 5: Run** `npm test` → PASS. Открыть приложение: «Кредиты», «Регулярные», «Напоминания» показывают те же даты, что и раньше.
- [ ] **Step 6: Commit** `feat(ledger): buildEntries from budget`

### Task 3: ledger.js — project

**Files:**
- Modify: `public/ledger.js`
- Test: `tests/ledger.test.js`

**Interfaces:**
- Consumes: `buildEntries`.
- Produces: `project(budget, {today, days=730, T, fx, extra=[]}) -> Projection`. Параметр `extra` — дополнительные записи для вердикта.
- `Projection`:
  - `days`: `[{date, free, accs:number[]}]` — по одному на день от `today+1`;
  - `months`: `[{ym, income, expenses, payments, interest, one, net, endFree, debt, worth, notes:string[]}]`. Месяц `today` содержит только записи после `today`;
  - `low`: `{date, value, entry}` — минимум свободного остатка;
  - `firstShort`: `{date, entry, short}` или `null` — первая запись, после которой свободный остаток < 0, `short` = на сколько не хватило;
  - `goals`: `[{i, name, goal, due, atDue, ok, lateMonths}]`;
  - `reserve`: подушка.
- Механика:
  - стартовые остатки — `accounts[].balance`;
  - списание и пополнение — по Global Constraints;
  - проценты по счетам — в последний день месяца: `b*rate/1200*(1-set.tax/100)`;
  - кредиты: остаток уменьшается на тело платежа, проценты `b*rate/1200` на дату платежа;
  - инфляция `set.infl` и рост `scen.growth` — множитель к суммам `living`, `bill`, `income` в месяце k: `(1+infl)^(k/12)`;
  - цели: `plans[kind='save']` с `goal>0` и `to`. `atDue` = остаток счёта цели на дату `to`. `ok` = `atDue≥goal`. `lateMonths` — сколько месяцев после `to` нужно, чтобы остаток дошёл до `goal` (до конца горизонта, иначе `Infinity`).

- [ ] **Step 1: Write failing tests:**
  - `project: конец ноября без траты` — `months[0].endFree` ≈ 1 380 000 − 700 000 − 378 612 − 154 303 − 12 086 − жизнь за 7–30 ноября (± 1 000; расчёт в комментарии);
  - `project: ноль счетов` — `accounts:[]`: не падает, `firstShort.entry.kind==='op'` для ремонта;
  - `project: проценты` — счёт 1 000 000 под 12% без расходов → через месяц +10 000×(1−0,1);
  - `project: цель` — цель 3 000 000 к 2028-06-01 с взносом 100 000/мес: `ok`, `atDue` ≈ сумме взносов;
  - `project: скорость` — фикстура, 730 дней, медиана из 5 прогонов < 30 мс.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement `project`.** Записи сортируются один раз, дни проходятся одним циклом, без пересоздания массивов внутри.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat(ledger): daily projection`

### Task 4: Счета догоняют план (rollAccounts)

**Files:**
- Modify: `public/ledger.js`, `public/app.js` (`afterLogin`, поле остатка в `accOut`, `renderKpis`, `vAccounts`)
- Test: `tests/ledger.test.js`

**Interfaces:**
- Produces: `rollAccounts(budget, {today, T, fx}) -> {changed:boolean, log:[{date, amount, label, acc}]}`.
  - Мутирует `budget.accounts[].balance` и `asOf`.
  - Дописывает `log` в `budget.autoLog`: последние 100 записей, у каждой флаг `seen:false`.
  - Счёт без `asOf` получает `asOf=today` без применения.
  - Обрабатываются записи из `buildEntries(budget,{from:asOf, to:today})` с датой в `(asOf, today]`. Прошедшие `ops` в эту выборку не входят.
  - `living` за пропущенные дни применяется одной суммой.
- Produces (app.js): правка поля остатка счёта ставит `accounts[i].asOf=todayStr()`. Это обработчик `change` для путей `accounts.N.balance`.

- [ ] **Step 1: Write failing tests:**
  - `rollAccounts: зарплата 5-го` — `asOf='2026-11-01'`, `today='2026-11-06'`, доход 900 000 с `day:5` → +900 000 на счёте, в `log` одна запись `income`;
  - `rollAccounts: повторно в тот же день` — второй вызов → `changed:false`, остатки не меняются;
  - `rollAccounts: оплачено вручную` — ипотека с `loanPaid` в этом месяце не списывается.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** `rollAccounts`. В `afterLogin`: `if(migrateRefund()|rollLoans()|rollOps()|LG.roll())pushBudget()`. Адаптер `LG` — см. Task 5, здесь можно вызвать `Ledger.rollAccounts(S,{today:todayStr(),T,fx:fxRate})` напрямую.
- [ ] **Step 4: Implement the banner.** Если в `S.autoLog` есть записи с `seen:false`, под KPI и вверху «Счета» показывается `tip`: «Обновлено по плану: {label} {±сумма} ({дата}), … Если что-то пришло не так — поправьте остаток.» Кнопка ✕ ставит всем записям `seen:true`.
- [ ] **Step 5: Run** → PASS. В приложении: поменять остаток счёта → `asOf` = сегодня (видно через `npm run db:status -- --email …`).
- [ ] **Step 6: Commit** `feat(ledger): accounts catch up with the plan`

### Task 5: «Этот месяц» и KPI из расчёта

**Files:**
- Modify: `public/app.js` (`monthNow`, `monthCard`, `renderKpis`, новый адаптер `LG`)

**Interfaces:**
- Produces: адаптер `LG` в app.js:
  - `LG.opts()` → `{today:todayStr(), T, fx:fxRate}`;
  - `LG.proj()` → `Ledger.project(S,LG.opts())`, с кэшем по ревизии `SREV` (увеличивается в `save()` и в обработчике `input`);
  - `LG.verdict(after)` → `Ledger.verdict(S,after,LG.opts())`;
  - `LG.roll()`.
- Карточка месяца:
  - главная цифра «Останется на счетах к концу месяца» = `LG.proj().months[0].endFree`;
  - рядом «Месяц в плюс / в минус» = доход месяца − расходы месяца (прошедшая часть из `ops`, напоминаний и уже оплаченного, будущая — из `months[0]`);
  - строка вывода: если нетто < 0 — «В {месяц} вы тратите из накоплений {сумма}: {3 самые крупные записи месяца}». Если есть месяц, после которого нетто ≥ 0, — «с {месяц} месяц снова в плюс»;
  - на шкале дней — метка дня `low`, если `low.value < reserve`.
- KPI «Остаётся» = нетто текущего месяца из расчёта. Под KPI — `low`, если он ниже подушки: «Самая низкая точка — {дата}: {сумма}».

- [ ] **Step 1: Implement** `LG`, затем переписать `monthNow` на `LG.proj()`. Возвращаемые поля, которые читает `monthCard`, сохранить или переименовать вместе с ним.
- [ ] **Step 2: Run** `npm test` → PASS (ядро не менялось).
- [ ] **Step 3: Verify in app** на тестовом сервере с фикстурой: `DB_FILE=<tmp> PORT=3011`, загрузить фикстуру через PUT. Карточка: «Останется к концу месяца» совпадает с тестом «конец ноября без траты» (±1 000), «Месяц в минус» ≈ −515 000, есть строка вывода.
- [ ] **Step 4: Commit** `feat: month card and KPIs from the ledger`

### Task 6: Вердикт и панель в «Операциях»

**Files:**
- Modify: `public/ledger.js`, `public/app.js` (`vOps`, `opSave`), `public/style.css`
- Test: `tests/ledger.test.js`

**Interfaces:**
- Produces: `verdict(before, after, {today, T, fx}) -> {level:'ok'|'warn'|'no', title:string, reasons:[{code:'short'|'reserve'|'goal'|'heavyMonth', text:string}], low, firstShort, waitUntil:'YYYY-MM'|null, split:{n:number, each:number}|null}`.
  - `no`: у `after` есть `firstShort`. Заголовок: «{дата} не хватит {short} на {entry.label}».
  - `warn`: `after.low.value < reserve`, или у цели `ok` было `true` и стало `false` / `lateMonths` вырос, или в месяце кандидата есть `yearly` / `tax` / `loan`-запись > `reserve`.
  - `ok`: «Можно. Самая низкая точка — {дата}: останется {сумма}».
  - `waitUntil`: кандидат — это разница `after` против `before` по `ops` / `scen.events` / `plans` / `loans`. Его дата сдвигается на +1…+24 месяца, пока уровень не станет `ok`. Сдвиг реализует функция `shift(after, before, k)`, которая знает эти четыре типа и меняет только новые или изменённые элементы.
  - `split`: только для разовой траты больше среднего месячного `net>0` в горизонте. `n` = минимальное число равных месячных частей, при котором уровень `ok` (до 12).
- App: под формой операции — `<div id="opverdict">`, который перерисовывается на каждый `input` черновика. Черновик ещё не в `S`, поэтому `after` = клон `S` с применённым `opSave`-эквивалентом без побочных эффектов: функция `opPreview(S, draft) -> S'`, вынесенная из `opSave`.
  - Цвета: `.good` / `.warn` / `.bad`.
  - При `no` кнопка «✓ Записать» становится «Всё равно записать».

- [ ] **Step 1: Write failing tests:**
  - `verdict: 300 000 на 10 ноября` — фикстура + `pending`-операция −300 000 на 2026-11-10 → `level:'no'`, `firstShort.date==='2026-11-16'`, `short` = расчёт в комментарии (± 1 000);
  - `verdict: 10 000` — та же операция на 10 000 → не `no`;
  - `verdict: waitUntil` — для 300 000 `waitUntil` — первый месяц, где `ok` (значение — расчёт в комментарии);
  - `verdict: доход` — +100 000 → `ok`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** `verdict`, `shift`, `split` в ledger.js.
- [ ] **Step 4: Implement** `opPreview` и панель в app.js.
- [ ] **Step 5: Run** `npm test` → PASS. В приложении на тестовом сервере: ввести 300 000 на 10.11 → красная панель «16 нояб. не хватит … на …», «подождите до …».
- [ ] **Step 6: Commit** `feat: affordability verdict for transactions`

### Task 7: Даты поступлений и платежей, годовые платежи в своём месяце, подушка

**Files:**
- Modify: `public/app.js`:
  - `vMoney` — у дохода «день поступления» и «на какой счёт», у расхода необязательный «день оплаты»;
  - `vTaxes` — «день поступления выручки» `biz.revDay`;
  - `vProfile` — коммуналка `utilDay`, жильё `housing.day`, машина, дети;
  - настройки — `set.reserve` «Запас на непредвиденное», по умолчанию пусто = обязательные расходы месяца;
  - `calc()` — подпись среднего;
  - `brain()`.

**Interfaces:**
- Consumes: `buildEntries` уже читает `taxMonth` / `insMonth` / `serviceMonth` / `tuitionMonth` (Task 2).
- UI:
  - рядом с «Машина: налог», «страховка», «обслуживание», «учёба ребёнка» — `sel` «Месяц оплаты» (12 месяцев + «не знаю»);
  - пока месяц не выбран, под полем подсказка «Укажите месяц — тогда мозг поставит всю сумму в этот месяц»;
  - для налога на машину — подсказка «гույքահարկ платят раз в год», без выбранного по умолчанию месяца.
- `brain()`: совет `yearlySoon`, если в ближайшие 60 дней есть `yearly`-запись. Текст: «В {месяц} {label} {сумма} — крупные траты на этот месяц лучше не планировать».

- [ ] **Step 1: Implement** поля дней и счёта (`inp(...,'num')` для дней 1–31 с обрезкой, `sel` счетов как в операциях), поле `set.reserve`, поля месяцев, совет.
- [ ] **Step 2: Run** `npm test` → PASS.
- [ ] **Step 3: Verify in app:**
  - поставить выручке ИП день 5 → в «Ближайших платежах» и в карточке месяца поступление 5-го;
  - подушка 100 000 → вердикт на 300 000 учитывает её (⚠️ / ❌ меняется по порогу);
  - выбрать декабрь для налога 70 000 → прогноз декабря −70 000 одной суммой, в другие месяцы налога нет. В «Мозг советует» есть совет (если до декабря меньше 60 дней).
- [ ] **Step 4: Commit** `feat: yearly payments land in their month`

### Task 8: Цели в вердикте

**Files:**
- Modify: `public/ledger.js` (`verdict` — причина `goal`), `public/app.js` (`planCard`: строка траектории)
- Test: `tests/ledger.test.js`

**Interfaces:**
- Consumes: `Projection.goals`.
- Текст причины `goal`: «{name} к {due} не успеете: соберёте {atDue} из {goal}» или «цель сдвинется на {lateMonths} мес.».
- `planCard` для `kind==='save'` с `goal`: «По расчёту к {due}: {atDue} из {goal} ✓» или «…не хватит {goal−atDue}».

- [ ] **Step 1: Write failing test** `verdict: цель сдвигается` — фикстура + цель «Ремонт» 3 000 000 к 2028-06-01 со счётом 1 и взносом, при котором без траты `ok`. Трата 300 000 → `level:'warn'`, причина `goal`, `lateMonths` = расчёт в комментарии.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement.** **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: goals in verdict and plan cards`

### Task 9: Вердикт во всех формах

**Files:**
- Modify: `public/app.js`: события прогноза (`vForecast` / `addEvent`), «Новый кредит» (`vNewLoan` / `takeLoan`), «Регулярные и цели» (`vPlans`), строки доходов и расходов (`vMoney`), «Семья» (`vProfile`), «Налоги и ИП» (`vTaxes`)

**Interfaces:**
- Consumes: `LG.verdict(after)`, рендер панели из Task 6 — вынести в `verdictHtml(v)->string`.
- Формы с кнопкой (новый кредит, добавление события, добавление регулярного): панель под формой, `after` = клон `S` с применённым черновиком.
- Поля с мгновенным сохранением (существующие события, регулярные, доходы, расходы, «Семья», ИП):
  - на `focusin` поля с `data-k` запоминается `VBEFORE=structuredClone(S)`;
  - на `change` считается `LG.verdict` против `VBEFORE`;
  - если уровень `warn` / `no` — плашка-тост `verdictHtml` + кнопка «Отменить» (`S=VBEFORE; save(); render()`);
  - при `ok` тоста нет.
- Изменение `set.reserve` вердикт не вызывает.

- [ ] **Step 1: Implement** `verdictHtml`, тост, панели в трёх формах.
- [ ] **Step 2: Run** `npm test` → PASS.
- [ ] **Step 3: Verify in app** на фикстуре:
  - событие «Крупная покупка» 500 000 в ноябре → панель ❌;
  - доход Зарплата уменьшить до 300 000 → тост ⚠️/❌ с «Отменить», «Отменить» возвращает 900 000;
  - новый кредит 1 000 000 → панель показывает эффект.
- [ ] **Step 4: Commit** `feat: verdict in every money form`

### Task 10: Прогноз, ближайшие платежи и старые советы — на ленту

**Files:**
- Modify: `public/app.js`: `fcSim`, `fcOut`, `homeOut` (графики с прогнозом), `upcoming`, `allReminders` (только авто-записи), `brain()` / `insights()` / `advOut()` — места, где используются `c.fcf`, `c.cushion`, `c.soonPay` как ответ «хватит или нет»

**Interfaces:**
- `fcSim(events,M)` становится обёрткой. Она строит `after` = клон `S` с `scen.events=events` и возвращает `{rows, loans, accs, main}` из `Ledger.project(after,…).months`, сохраняя поля `rows[]`, которые читают `fcOut` / `homeOut`: `m, income, expenses, payments, interest, principal, one, net, sav, debt, worth, notes, closed`. Строка `m:0` — сегодняшнее состояние. Базовый вариант «ничего не менять» = `fcSim([],M)`.
- `upcoming(days)` берёт будущие записи `kind ∈ {loan, tax, bill, yearly, plan, op, income}` из `Ledger.buildEntries(S,{from:today,to:today+days})`. Ручные напоминания пользователя (`remList()`) добавляются как сейчас. Формат элементов, который читает `remOut`, сохраняется.
- Советы и тексты «хватит ли денег» берут `LG.proj()`: «вам не хватает X каждый месяц» → «в {месяц} нетто {net}», подушка в месяцах → `low` против `reserve`. `calc()` остаётся для долей, DTI и оценки здоровья. Средние подписаны «в среднем в месяц».
- Удалить код, который больше никто не вызывает: старое тело `fcSim`, `skip1`, `pendingOpEvents`. Проверка: `grep` по именам → ноль вызовов.

- [ ] **Step 1: Implement** обёртку `fcSim` и проверить прогноз на фикстуре: декабрь −70 000 налог (если `taxMonth:12`), ноябрь −700 000 ремонт.
- [ ] **Step 2: Implement** `upcoming` из ленты. Проверить: «Ближайшие платежи» содержит ипотеку 16.11, ВТБ 16.11, ремонт 15.11.
- [ ] **Step 3: Implement** перевод советов. Проверить: нет совета «вам не хватает каждый месяц», если ноябрь в минусе только из-за разовых трат, а с февраля плюс.
- [ ] **Step 4: Run** `npm test` → PASS, консоль браузера без ошибок на всех вкладках.
- [ ] **Step 5: Commit** `refactor: forecast, upcoming and advice read the ledger`

### Task 11: Советы мозга из ленты

**Files:**
- Modify: `public/app.js` (`brain()`)

**Interfaces:**
- Consumes: `LG.proj()`.
- Новые советы (id, когда, текст):
  - `lowPoint` — `low.value < reserve`: «{дата} на счетах останется {сумма} — меньше подушки {reserve}. Перенесите крупные траты после {первый день, когда free ≥ reserve}»;
  - `livingOnSavings` — два и более месяца подряд с `net<0`: «{n} мес. подряд вы живёте за счёт накоплений: {месяцы}. Причина — {крупнейшие записи}»;
  - `goalRisk` — у цели `!ok`: текст причины `goal` из Task 8;
  - `idleVsDebt` — свободный остаток > 2×reserve и есть кредит со ставкой > ставки счёта + 5: «На {счёт} лежит {сумма} под {r}%, а {кредит} стоит {R}% — сравните варианты в Калькуляторах». Только факт, без рекомендации.
- Все советы с кнопкой «Не актуально» (существующий `brainHide`).

- [ ] **Step 1: Implement.** **Step 2:** `npm test` → PASS. **Step 3: Verify in app** на фикстуре: видны `lowPoint` (если ниже подушки) и `idleVsDebt` (накопительный 3% против Rocket line 21,7%).
- [ ] **Step 4: Commit** `feat: brain advice from the ledger`

---

**Вне этого плана:** Telegram-рассылка (`reminders.js`) пока считает даты по-старому. Перевод её на `ledger.js` через `require` — отдельный шаг после Task 10 (спека, п. 8).
