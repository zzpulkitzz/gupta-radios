const express = require('express');
const { db } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

const TASK_JOIN = `
  SELECT t.*, u.name as assigned_to_name, a.name as assigned_by_name
  FROM tasks t
  JOIN users u ON u.id = t.assigned_to
  JOIN users a ON a.id = t.assigned_by
`;

router.get('/', async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      const { userId } = req.query;
      result = userId
        ? await db.execute({ sql: `${TASK_JOIN} WHERE t.assigned_to = ? ORDER BY t.created_at DESC`, args: [userId] })
        : await db.execute(`${TASK_JOIN} ORDER BY t.created_at DESC`);
    } else {
      result = await db.execute({ sql: `${TASK_JOIN} WHERE t.assigned_to = ? ORDER BY t.created_at DESC`, args: [req.user.id] });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  const { title, description, assigned_to, priority, due_date } = req.body;
  if (!title || !assigned_to) {
    return res.status(400).json({ error: 'title and assigned_to are required' });
  }
  try {
    const { rows } = await db.execute({ sql: 'SELECT id FROM users WHERE id = ?', args: [assigned_to] });
    if (!rows[0]) return res.status(404).json({ error: 'Assigned user not found' });

    const result = await db.execute({
      sql: `INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [title, description || null, assigned_to, req.user.id, priority || 'medium', due_date || null],
    });

    const { rows: taskRows } = await db.execute({ sql: `${TASK_JOIN} WHERE t.id = ?`, args: [result.lastInsertRowid] });
    res.status(201).json(taskRows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const { rows } = await db.execute({ sql: 'SELECT * FROM tasks WHERE id = ?', args: [req.params.id] });
    const task = rows[0];
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (req.user.role === 'staff' && Number(task.assigned_to) !== req.user.id) {
      return res.status(403).json({ error: 'Not your task' });
    }
    const newCompleted = task.completed ? 0 : 1;
    await db.execute({
      sql: 'UPDATE tasks SET completed = ?, completed_at = ? WHERE id = ?',
      args: [newCompleted, newCompleted ? new Date().toISOString() : null, task.id],
    });
    res.json({ ...task, completed: newCompleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { rows } = await db.execute({ sql: 'SELECT * FROM tasks WHERE id = ?', args: [req.params.id] });
    const task = rows[0];
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const { title, description, assigned_to, priority, due_date } = req.body;
    await db.execute({
      sql: `UPDATE tasks SET title = ?, description = ?, assigned_to = ?, priority = ?, due_date = ? WHERE id = ?`,
      args: [
        title ?? task.title,
        description ?? task.description,
        assigned_to ?? task.assigned_to,
        priority ?? task.priority,
        due_date ?? task.due_date,
        task.id,
      ],
    });

    const { rows: updated } = await db.execute({ sql: `${TASK_JOIN} WHERE t.id = ?`, args: [task.id] });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const result = await db.execute({ sql: 'DELETE FROM tasks WHERE id = ?', args: [req.params.id] });
    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
