const express = require('express');
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Staff see their own tasks; admin sees all (or filtered by ?userId=)
router.get('/', (req, res) => {
  if (req.user.role === 'admin') {
    const { userId } = req.query;
    const tasks = userId
      ? db.prepare(`
          SELECT t.*, u.name as assigned_to_name, a.name as assigned_by_name
          FROM tasks t
          JOIN users u ON u.id = t.assigned_to
          JOIN users a ON a.id = t.assigned_by
          WHERE t.assigned_to = ?
          ORDER BY t.created_at DESC
        `).all(userId)
      : db.prepare(`
          SELECT t.*, u.name as assigned_to_name, a.name as assigned_by_name
          FROM tasks t
          JOIN users u ON u.id = t.assigned_to
          JOIN users a ON a.id = t.assigned_by
          ORDER BY t.created_at DESC
        `).all();
    return res.json(tasks);
  }

  // Staff: own tasks only
  const tasks = db.prepare(`
    SELECT t.*, u.name as assigned_to_name, a.name as assigned_by_name
    FROM tasks t
    JOIN users u ON u.id = t.assigned_to
    JOIN users a ON a.id = t.assigned_by
    WHERE t.assigned_to = ?
    ORDER BY t.created_at DESC
  `).all(req.user.id);
  res.json(tasks);
});

// Admin only: create task
router.post('/', requireAdmin, (req, res) => {
  const { title, description, assigned_to, priority, due_date } = req.body;
  if (!title || !assigned_to) {
    return res.status(400).json({ error: 'title and assigned_to are required' });
  }
  const assignee = db.prepare('SELECT id FROM users WHERE id = ?').get(assigned_to);
  if (!assignee) return res.status(404).json({ error: 'Assigned user not found' });

  const result = db.prepare(`
    INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, description || null, assigned_to, req.user.id, priority || 'medium', due_date || null);

  const task = db.prepare(`
    SELECT t.*, u.name as assigned_to_name, a.name as assigned_by_name
    FROM tasks t
    JOIN users u ON u.id = t.assigned_to
    JOIN users a ON a.id = t.assigned_by
    WHERE t.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(task);
});

// Toggle complete (staff can do own; admin can do any)
router.patch('/:id/toggle', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (req.user.role === 'staff' && task.assigned_to !== req.user.id) {
    return res.status(403).json({ error: 'Not your task' });
  }
  const newCompleted = task.completed ? 0 : 1;
  db.prepare(
    'UPDATE tasks SET completed = ?, completed_at = ? WHERE id = ?'
  ).run(newCompleted, newCompleted ? new Date().toISOString() : null, task.id);

  res.json({ ...task, completed: newCompleted });
});

// Admin only: edit task
router.put('/:id', requireAdmin, (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { title, description, assigned_to, priority, due_date } = req.body;
  db.prepare(`
    UPDATE tasks SET title = ?, description = ?, assigned_to = ?, priority = ?, due_date = ?
    WHERE id = ?
  `).run(
    title ?? task.title,
    description ?? task.description,
    assigned_to ?? task.assigned_to,
    priority ?? task.priority,
    due_date ?? task.due_date,
    task.id
  );

  const updated = db.prepare(`
    SELECT t.*, u.name as assigned_to_name, a.name as assigned_by_name
    FROM tasks t JOIN users u ON u.id = t.assigned_to JOIN users a ON a.id = t.assigned_by
    WHERE t.id = ?
  `).get(task.id);
  res.json(updated);
});

// Admin only: delete task
router.delete('/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true });
});

module.exports = router;
