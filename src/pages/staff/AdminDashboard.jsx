import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import LOGO from '../../assets/images/logo.png';

const PRIORITY_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
const PRIORITY_BG = { high: '#fef2f2', medium: '#fffbeb', low: '#f0fdf4' };

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('tasks'); // tasks | staff
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try {
      const [u, t] = await Promise.all([api.getUsers(), api.getTasks()]);
      setUsers(u);
      setTasks(t);
    } catch { logout(); }
    finally { setLoading(false); }
  }, [logout]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const staffOnly = users.filter(u => u.role === 'staff');
  const displayTasks = selectedUser
    ? tasks.filter(t => t.assigned_to === selectedUser.id)
    : tasks;

  async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function deleteUser(id) {
    if (!confirm('Delete this staff member? Their tasks will also be deleted.')) return;
    await api.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
    setTasks(prev => prev.filter(t => t.assigned_to !== id));
    if (selectedUser?.id === id) setSelectedUser(null);
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <img src={LOGO} alt="Gupta Radios" style={styles.logo} />
          <div>
            <span style={styles.siteName}>Gupta Radios</span>
            <span style={styles.adminBadge}>Admin Panel</span>
          </div>
        </div>
        <div style={styles.userBar}>
          <span style={styles.greeting}>Hi, {user?.name}</span>
          <button style={styles.staffBtn} onClick={() => navigate('/staff')}>My Tasks</button>
          <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/staff/login'); }}>
            Sign out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={tab === 'tasks' ? styles.tabActive : styles.tab} onClick={() => setTab('tasks')}>
            Tasks
          </button>
          <button style={tab === 'staff' ? styles.tabActive : styles.tab} onClick={() => setTab('staff')}>
            Staff Members
          </button>
        </div>

        {loading ? (
          <div style={styles.center}><div style={styles.spinner} /></div>
        ) : tab === 'tasks' ? (
          <TasksTab
            tasks={displayTasks}
            allTasks={tasks}
            staff={staffOnly}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            onNewTask={() => { setEditingTask(null); setShowTaskModal(true); }}
            onEditTask={(t) => { setEditingTask(t); setShowTaskModal(true); }}
            onDeleteTask={deleteTask}
          />
        ) : (
          <StaffTab
            staff={staffOnly}
            tasks={tasks}
            onNewStaff={() => { setEditingUser(null); setShowUserModal(true); }}
            onEditStaff={(u) => { setEditingUser(u); setShowUserModal(true); }}
            onDeleteStaff={deleteUser}
            onViewTasks={(u) => { setSelectedUser(u); setTab('tasks'); }}
          />
        )}
      </main>

      {showTaskModal && (
        <TaskModal
          staff={staffOnly}
          editing={editingTask}
          onClose={() => setShowTaskModal(false)}
          onSaved={(task) => {
            if (editingTask) {
              setTasks(prev => prev.map(t => t.id === task.id ? task : t));
            } else {
              setTasks(prev => [task, ...prev]);
            }
            setShowTaskModal(false);
          }}
        />
      )}

      {showUserModal && (
        <UserModal
          editing={editingUser}
          onClose={() => setShowUserModal(false)}
          onSaved={(u) => {
            if (editingUser) {
              setUsers(prev => prev.map(x => x.id === u.id ? u : x));
            } else {
              setUsers(prev => [...prev, u]);
            }
            setShowUserModal(false);
          }}
        />
      )}
    </div>
  );
}

/* ── Tasks Tab ─────────────────────────────────────────────────── */
function TasksTab({ tasks, staff, selectedUser, onSelectUser, onNewTask, onEditTask, onDeleteTask }) {
  const done = tasks.filter(t => t.completed).length;

  return (
    <div>
      <div style={styles.rowBetween}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            style={!selectedUser ? styles.filterActive : styles.filterBtn}
            onClick={() => onSelectUser(null)}
          >
            All Staff
          </button>
          {staff.map(u => (
            <button
              key={u.id}
              style={selectedUser?.id === u.id ? styles.filterActive : styles.filterBtn}
              onClick={() => onSelectUser(u)}
            >
              {u.name}
            </button>
          ))}
        </div>
        <button style={styles.primaryBtn} onClick={onNewTask}>+ Assign Task</button>
      </div>

      <p style={styles.hint}>{done}/{tasks.length} completed{selectedUser ? ` for ${selectedUser.name}` : ''}</p>

      {tasks.length === 0 ? (
        <div style={styles.empty}>No tasks yet. Assign one!</div>
      ) : (
        <div style={styles.list}>
          {tasks.map(task => (
            <AdminTaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminTaskCard({ task, onEdit, onDelete }) {
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${PRIORITY_COLOR[task.priority]}` }}>
      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <span style={{
            ...styles.cardTitle,
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#94a3b8' : '#1e293b',
          }}>
            {task.title}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ ...styles.priorityBadge, color: PRIORITY_COLOR[task.priority], background: PRIORITY_BG[task.priority] }}>
              {task.priority}
            </span>
            <span style={task.completed ? styles.doneBadge : styles.pendingBadge}>
              {task.completed ? 'Done' : 'Pending'}
            </span>
          </div>
        </div>
        {task.description && <p style={styles.desc}>{task.description}</p>}
        <div style={styles.meta}>
          <span>→ {task.assigned_to_name}</span>
          {task.due_date && <span>Due: {formatDate(task.due_date)}</span>}
        </div>
      </div>
      <div style={styles.actions}>
        <button style={styles.editBtn} onClick={onEdit}>Edit</button>
        <button style={styles.deleteBtn} onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

/* ── Staff Tab ─────────────────────────────────────────────────── */
function StaffTab({ staff, tasks, onNewStaff, onEditStaff, onDeleteStaff, onViewTasks }) {
  return (
    <div>
      <div style={styles.rowBetween}>
        <h2 style={styles.sectionHeading}>Staff Members ({staff.length})</h2>
        <button style={styles.primaryBtn} onClick={onNewStaff}>+ Add Staff</button>
      </div>
      {staff.length === 0 ? (
        <div style={styles.empty}>No staff members yet.</div>
      ) : (
        <div style={styles.staffGrid}>
          {staff.map(u => {
            const myTasks = tasks.filter(t => t.assigned_to === u.id);
            const done = myTasks.filter(t => t.completed).length;
            return (
              <div key={u.id} style={styles.staffCard}>
                <div style={styles.avatar}>{u.name[0].toUpperCase()}</div>
                <div style={styles.staffInfo}>
                  <span style={styles.staffName}>{u.name}</span>
                  <span style={styles.staffUsername}>@{u.username}</span>
                  <span style={styles.staffStats}>{done}/{myTasks.length} tasks done</span>
                </div>
                <div style={styles.staffActions}>
                  <button style={styles.viewBtn} onClick={() => onViewTasks(u)}>View Tasks</button>
                  <button style={styles.editBtn} onClick={() => onEditStaff(u)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => onDeleteStaff(u.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Task Modal ────────────────────────────────────────────────── */
function TaskModal({ staff, editing, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: editing?.title || '',
    description: editing?.description || '',
    assigned_to: editing?.assigned_to || (staff[0]?.id ?? ''),
    priority: editing?.priority || 'medium',
    due_date: editing?.due_date ? editing.due_date.slice(0, 10) : '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, assigned_to: Number(form.assigned_to) };
      const task = editing ? await api.updateTask(editing.id, payload) : await api.createTask(payload);
      onSaved(task);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <h2 style={styles.modalTitle}>{editing ? 'Edit Task' : 'Assign New Task'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <Field label="Title">
          <input style={styles.input} value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        </Field>
        <Field label="Description (optional)">
          <textarea style={{ ...styles.input, height: '80px', resize: 'vertical' }}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </Field>
        <Field label="Assign to">
          <select style={styles.input} value={form.assigned_to}
            onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}>
            {staff.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </Field>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Field label="Priority" style={{ flex: 1 }}>
            <select style={styles.input} value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
          <Field label="Due Date (optional)" style={{ flex: 1 }}>
            <input style={styles.input} type="date" value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
          </Field>
        </div>
        {error && <p style={styles.errorMsg}>{error}</p>}
        <div style={styles.modalFooter}>
          <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="submit" style={styles.primaryBtn} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Assign Task'}
          </button>
        </div>
      </form>
    </Overlay>
  );
}

/* ── User Modal ────────────────────────────────────────────────── */
function UserModal({ editing, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: editing?.name || '',
    username: editing?.username || '',
    password: '',
    role: editing?.role || 'staff',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      const u = editing ? await api.updateUser(editing.id, payload) : await api.createUser(payload);
      onSaved(u);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <h2 style={styles.modalTitle}>{editing ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <Field label="Full Name">
          <input style={styles.input} value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </Field>
        <Field label="Username">
          <input style={styles.input} value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
        </Field>
        <Field label={editing ? 'New Password (leave blank to keep)' : 'Password'}>
          <input style={styles.input} type="password" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required={!editing} />
        </Field>
        <Field label="Role">
          <select style={styles.input} value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        {error && <p style={styles.errorMsg}>{error}</p>}
        <div style={styles.modalFooter}>
          <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="submit" style={styles.primaryBtn} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </Overlay>
  );
}

/* ── Shared helpers ─────────────────────────────────────────────── */
function Overlay({ children, onClose }) {
  return (
    <div style={styles.overlayBg} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>{children}</div>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Styles ─────────────────────────────────────────────────────── */
const styles = {
  page: { minHeight: '100vh', background: '#f8fafc' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2rem', height: '64px',
    background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    position: 'sticky', top: 0, zIndex: 100,
    flexWrap: 'wrap', gap: '8px',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { height: '36px', width: 'auto' },
  siteName: { fontWeight: 700, fontSize: '16px', color: '#1e293b', display: 'block' },
  adminBadge: {
    fontSize: '11px', background: '#1e293b', color: '#fff',
    padding: '2px 8px', borderRadius: '20px', fontWeight: 600,
  },
  userBar: { display: 'flex', alignItems: 'center', gap: '12px' },
  greeting: { fontSize: '14px', color: '#64748b', fontWeight: 500 },
  staffBtn: {
    padding: '6px 14px', background: '#eef7fd', color: '#39A3E6',
    border: '1.5px solid #39A3E6', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
  },
  logoutBtn: {
    padding: '6px 14px', background: 'none', color: '#64748b',
    border: '1.5px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
  },
  main: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  tabs: { display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0' },
  tab: {
    padding: '10px 20px', border: 'none', background: 'none',
    fontSize: '15px', cursor: 'pointer', color: '#64748b', fontWeight: 500,
    borderBottom: '2px solid transparent', marginBottom: '-2px',
  },
  tabActive: {
    padding: '10px 20px', border: 'none', background: 'none',
    fontSize: '15px', cursor: 'pointer', color: '#39A3E6', fontWeight: 700,
    borderBottom: '2px solid #39A3E6', marginBottom: '-2px',
  },
  rowBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' },
  hint: { fontSize: '13px', color: '#94a3b8', marginBottom: '16px' },
  sectionHeading: { fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 },
  filterBtn: {
    padding: '5px 14px', border: '1.5px solid #e2e8f0', borderRadius: '20px',
    background: '#fff', color: '#64748b', fontSize: '13px', cursor: 'pointer',
  },
  filterActive: {
    padding: '5px 14px', border: '1.5px solid #39A3E6', borderRadius: '20px',
    background: '#eef7fd', color: '#39A3E6', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
  },
  primaryBtn: {
    padding: '8px 18px', background: '#39A3E6', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: 600,
  },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: {
    display: 'flex', gap: '12px', alignItems: 'flex-start',
    background: '#fff', borderRadius: '12px', padding: '14px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' },
  cardTitle: { fontWeight: 600, fontSize: '15px', flex: 1 },
  priorityBadge: {
    fontSize: '11px', fontWeight: 700, padding: '2px 8px',
    borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  doneBadge: {
    fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px',
    background: '#f0fdf4', color: '#22c55e',
  },
  pendingBadge: {
    fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px',
    background: '#fffbeb', color: '#f59e0b',
  },
  desc: { fontSize: '14px', color: '#64748b', marginTop: '4px', lineHeight: 1.5 },
  meta: { display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8', marginTop: '8px' },
  actions: { display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 },
  editBtn: {
    padding: '4px 12px', background: '#f1f5f9', color: '#334155',
    border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 500,
  },
  deleteBtn: {
    padding: '4px 12px', background: '#fef2f2', color: '#dc2626',
    border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 500,
  },
  viewBtn: {
    padding: '4px 12px', background: '#eef7fd', color: '#39A3E6',
    border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 500,
  },
  staffGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  staffCard: {
    display: 'flex', alignItems: 'center', gap: '16px',
    background: '#fff', borderRadius: '12px', padding: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)', flexWrap: 'wrap',
  },
  avatar: {
    width: '44px', height: '44px', background: '#39A3E6', color: '#fff',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', fontWeight: 700, flexShrink: 0,
  },
  staffInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  staffName: { fontWeight: 600, fontSize: '15px', color: '#1e293b' },
  staffUsername: { fontSize: '13px', color: '#64748b' },
  staffStats: { fontSize: '12px', color: '#94a3b8' },
  staffActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  center: { display: 'flex', justifyContent: 'center', padding: '4rem' },
  spinner: {
    width: 36, height: 36,
    border: '4px solid #e2e8f0', borderTop: '4px solid #39A3E6',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  empty: { textAlign: 'center', color: '#94a3b8', padding: '4rem 0', fontSize: '15px' },
  overlayBg: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem',
  },
  modal: {
    background: '#fff', borderRadius: '16px', padding: '2rem',
    width: '100%', maxWidth: '500px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    maxHeight: '90vh', overflowY: 'auto',
  },
  modalTitle: { fontSize: '20px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: { fontSize: '13px', fontWeight: 600, color: '#374151' },
  input: {
    padding: '9px 13px', border: '1.5px solid #e2e8f0', borderRadius: '8px',
    fontSize: '14px', outline: 'none', width: '100%',
  },
  errorMsg: {
    background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
    borderRadius: '8px', padding: '10px 14px', fontSize: '14px',
  },
  modalFooter: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: {
    padding: '8px 18px', background: '#f1f5f9', color: '#334155',
    border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
  },
};
