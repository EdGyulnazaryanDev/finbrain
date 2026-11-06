// Ревизия бюджета: устаревшая вкладка не может затереть более новые данные.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'finbrain-rev-'));
process.env.DB_FILE = path.join(dir, 'test.db');
const { db, q, saveBudgetRev } = require('../db');

test('saveBudgetRev: counter grows, stale base is rejected and kept as a version', () => {
  const id = q.createUser.run('rev@example.test', 'x').lastInsertRowid;
  assert.deepStrictEqual(saveBudgetRev(id, '{"a":1}', null), { ok: true, rev: 1 });
  assert.deepStrictEqual(saveBudgetRev(id, '{"a":2}', 1), { ok: true, rev: 2 });
  assert.deepStrictEqual(saveBudgetRev(id, '{"a":3}', 1), { ok: false, rev: 2, data: '{"a":2}' });
  const v = db.prepare("SELECT data FROM budget_versions WHERE user_id = ? AND reason = 'conflict'").get(id);
  assert.strictEqual(v.data, '{"a":3}');
  assert.strictEqual(q.getBudget.get(id).data, '{"a":2}');
});
