const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDb() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'staff')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      assigned_to INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      assigned_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
      due_date TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const { rows } = await db.execute("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
  if (rows.length === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    await db.execute({
      sql: "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, 'admin')",
      args: ['Admin', 'admin', hash],
    });
    console.log('Default admin created — username: admin, password: admin123');
  }
}

module.exports = { db, initDb };
