// SQLite: один файл базы, без отдельного сервера.
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const file = process.env.DB_FILE || path.join(__dirname, 'data', 'finbrain.db');
fs.mkdirSync(path.dirname(file), { recursive: true });

const db = new Database(file);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  pass_hash  TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS budgets (
  user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data       TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS budget_versions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data       TEXT NOT NULL,
  reason     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS budget_versions_user ON budget_versions(user_id, id);
CREATE TABLE IF NOT EXISTS market (
  id         INTEGER PRIMARY KEY CHECK (id = 1),
  data       TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS history (
  date        TEXT PRIMARY KEY,
  usd         REAL, eur REAL, rub REAL,
  refi        REAL,
  top_deposit REAL,
  sp500       REAL
);
`);

const q = {
  userByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  createUser: db.prepare('INSERT INTO users (email, pass_hash) VALUES (?, ?)'),
  createSession: db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)'),
  sessionUser: db.prepare(`SELECT u.id, u.email FROM sessions s JOIN users u ON u.id = s.user_id
                           WHERE s.token = ? AND s.expires_at > ?`),
  deleteSession: db.prepare('DELETE FROM sessions WHERE token = ?'),
  purgeSessions: db.prepare('DELETE FROM sessions WHERE expires_at <= ?'),
  getBudget: db.prepare('SELECT data, updated_at FROM budgets WHERE user_id = ?'),
  saveBudget: db.prepare(`INSERT INTO budgets (user_id, data, updated_at) VALUES (?, ?, datetime('now'))
                          ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`),
  addVersion: db.prepare('INSERT INTO budget_versions (user_id, data, reason) VALUES (?, ?, ?)'),
  lastVersion: db.prepare('SELECT id, created_at FROM budget_versions WHERE user_id = ? ORDER BY id DESC LIMIT 1'),
  listVersions: db.prepare('SELECT id, data, reason, created_at FROM budget_versions WHERE user_id = ? ORDER BY id DESC LIMIT 60'),
  getVersion: db.prepare('SELECT data FROM budget_versions WHERE user_id = ? AND id = ?'),
  pruneVersions: db.prepare('DELETE FROM budget_versions WHERE user_id = ? AND id NOT IN (SELECT id FROM budget_versions WHERE user_id = ? ORDER BY id DESC LIMIT 200)'),
  getMarket: db.prepare('SELECT data, updated_at FROM market WHERE id = 1'),
  saveMarket: db.prepare(`INSERT INTO market (id, data, updated_at) VALUES (1, ?, datetime('now'))
                          ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`),
  upsertHistory: db.prepare(`INSERT INTO history (date, usd, eur, rub, refi, top_deposit, sp500)
                             VALUES (@date, @usd, @eur, @rub, @refi, @top_deposit, @sp500)
                             ON CONFLICT(date) DO UPDATE SET usd=excluded.usd, eur=excluded.eur, rub=excluded.rub,
                               refi=excluded.refi, top_deposit=excluded.top_deposit, sp500=excluded.sp500`),
  history: db.prepare('SELECT * FROM history ORDER BY date DESC LIMIT ?'),
};

function getMarket() {
  const row = q.getMarket.get();
  return row ? JSON.parse(row.data) : null;
}
function saveMarket(data) {
  q.saveMarket.run(JSON.stringify(data));
}

module.exports = { db, q, getMarket, saveMarket };
