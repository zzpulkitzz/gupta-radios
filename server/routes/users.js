const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireAdmin);

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.execute("SELECT id, name, username, role, created_at FROM users ORDER BY role, name");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, username, password, role } = req.body;
  if (!name || !username || !password || !role) {
    return res.status(400).json({ error: 'name, username, password and role are required' });
  }
  if (!['admin', 'staff'].includes(role)) {
    return res.status(400).json({ error: 'role must be admin or staff' });
  }
  try {
    const { rows } = await db.execute({ sql: 'SELECT id FROM users WHERE username = ?', args: [username] });
    if (rows[0]) return res.status(409).json({ error: 'Username already taken' });

    const hash = bcrypt.hashSync(password, 10);
    const result = await db.execute({
      sql: "INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)",
      args: [name, username, hash, role],
    });
    res.status(201).json({ id: Number(result.lastInsertRowid), name, username, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { name, username, password, role } = req.body;
  try {
    const { rows } = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [req.params.id] });
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username && username !== user.username) {
      const { rows: taken } = await db.execute({ sql: 'SELECT id FROM users WHERE username = ? AND id != ?', args: [username, user.id] });
      if (taken[0]) return res.status(409).json({ error: 'Username already taken' });
    }

    const updatedName = name || user.name;
    const updatedUsername = username || user.username;
    const updatedRole = role || user.role;
    const updatedPassword = password ? bcrypt.hashSync(password, 10) : user.password;

    await db.execute({
      sql: 'UPDATE users SET name = ?, username = ?, password = ?, role = ? WHERE id = ?',
      args: [updatedName, updatedUsername, updatedPassword, updatedRole, user.id],
    });
    res.json({ id: Number(user.id), name: updatedName, username: updatedUsername, role: updatedRole });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ error: "You can't delete yourself" });
  }
  try {
    const result = await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [req.params.id] });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
