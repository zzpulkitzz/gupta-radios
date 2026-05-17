const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All user routes require admin
router.use(authenticate, requireAdmin);

router.get('/', (req, res) => {
  const users = db.prepare("SELECT id, name, username, role, created_at FROM users ORDER BY role, name").all();
  res.json(users);
});

router.post('/', (req, res) => {
  const { name, username, password, role } = req.body;
  if (!name || !username || !password || !role) {
    return res.status(400).json({ error: 'name, username, password and role are required' });
  }
  if (!['admin', 'staff'].includes(role)) {
    return res.status(400).json({ error: 'role must be admin or staff' });
  }
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (exists) return res.status(409).json({ error: 'Username already taken' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)"
  ).run(name, username, hash, role);

  res.status(201).json({ id: result.lastInsertRowid, name, username, role });
});

router.put('/:id', (req, res) => {
  const { name, username, password, role } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (username && username !== user.username) {
    const taken = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, user.id);
    if (taken) return res.status(409).json({ error: 'Username already taken' });
  }

  const updatedName = name || user.name;
  const updatedUsername = username || user.username;
  const updatedRole = role || user.role;
  const updatedPassword = password ? bcrypt.hashSync(password, 10) : user.password;

  db.prepare(
    'UPDATE users SET name = ?, username = ?, password = ?, role = ? WHERE id = ?'
  ).run(updatedName, updatedUsername, updatedPassword, updatedRole, user.id);

  res.json({ id: user.id, name: updatedName, username: updatedUsername, role: updatedRole });
});

router.delete('/:id', (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ error: "You can't delete yourself" });
  }
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true });
});

module.exports = router;
