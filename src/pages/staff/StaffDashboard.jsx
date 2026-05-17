import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import LOGO from '../../assets/images/logo.png';

const PRIORITY_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };
const PRIORITY_BG = { high: '#fef2f2', medium: '#fffbeb', low: '#f0fdf4' };

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | done

  const fetchTasks = useCallback(async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch {
      // token expired
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  async function toggleTask(id) {
    await api.toggleTask(id);
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: t.completed ? 0 : 1 } : t
    ));
  }

  const filtered = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  const done = tasks.filter(t => t.completed).length;
  const total = tasks.length;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <img src={LOGO} alt="Gupta Radios" style={styles.logo} />
          <div>
            <span style={styles.siteName}>Gupta Radios</span>
            <span style={styles.portalBadge}>Staff Portal</span>
          </div>
        </div>
        <div style={styles.userBar}>
          <span style={styles.greeting}>Hi, {user?.name}</span>
          {user?.role === 'admin' && (
            <button style={styles.adminBtn} onClick={() => navigate('/staff/admin')}>
              Admin Panel
            </button>
          )}
          <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/staff/login'); }}>
            Sign out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.topRow}>
          <div>
            <h1 style={styles.heading}>My Tasks</h1>
            <p style={styles.progress}>{done} of {total} completed</p>
          </div>
          <div style={styles.filters}>
            {['all', 'pending', 'done'].map(f => (
              <button
                key={f}
                style={filter === f ? styles.filterActive : styles.filterBtn}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {total > 0 && (
          <div style={styles.progressBarWrap}>
            <div style={{ ...styles.progressBar, width: `${total ? (done / total) * 100 : 0}%` }} />
          </div>
        )}

        {loading ? (
          <div style={styles.center}><div style={styles.spinner} /></div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            {filter === 'done' ? 'No completed tasks yet.' :
             filter === 'pending' ? 'All caught up! No pending tasks.' :
             'No tasks assigned yet.'}
          </div>
        ) : (
          <div style={styles.list}>
            {filtered.map(task => (
              <TaskCard key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function TaskCard({ task, onToggle }) {
  const [toggling, setToggling] = useState(false);

  async function handleToggle() {
    setToggling(true);
    await onToggle(task.id);
    setToggling(false);
  }

  return (
    <div style={{
      ...styles.card,
      opacity: task.completed ? 0.72 : 1,
      borderLeft: `4px solid ${PRIORITY_COLOR[task.priority]}`,
    }}>
      <button
        style={{
          ...styles.checkbox,
          background: task.completed ? '#39A3E6' : '#fff',
          borderColor: task.completed ? '#39A3E6' : '#cbd5e1',
        }}
        onClick={handleToggle}
        disabled={toggling}
        aria-label="Toggle complete"
      >
        {task.completed && <span style={styles.check}>✓</span>}
      </button>

      <div style={styles.cardBody}>
        <div style={styles.cardTop}>
          <span style={{
            ...styles.title,
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#94a3b8' : '#1e293b',
          }}>
            {task.title}
          </span>
          <span style={{
            ...styles.priorityBadge,
            color: PRIORITY_COLOR[task.priority],
            background: PRIORITY_BG[task.priority],
          }}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p style={styles.desc}>{task.description}</p>
        )}

        <div style={styles.meta}>
          <span>Assigned by {task.assigned_by_name}</span>
          {task.due_date && (
            <span style={isPast(task.due_date) && !task.completed ? styles.overdue : {}}>
              Due: {formatDate(task.due_date)}
            </span>
          )}
          {task.completed && task.completed_at && (
            <span style={styles.completedAt}>Done {formatDate(task.completed_at)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isPast(d) {
  return new Date(d) < new Date();
}

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
  logo: { height: '44px', width: 'auto', borderRadius: '4px' },
  siteName: { fontWeight: 700, fontSize: '16px', color: '#1e293b', display: 'block' },
  portalBadge: {
    fontSize: '11px', background: '#eef7fd', color: '#39A3E6',
    padding: '2px 8px', borderRadius: '20px', fontWeight: 600,
  },
  userBar: { display: 'flex', alignItems: 'center', gap: '12px' },
  greeting: { fontSize: '14px', color: '#64748b', fontWeight: 500 },
  adminBtn: {
    padding: '6px 14px', background: '#1e293b', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
  },
  logoutBtn: {
    padding: '6px 14px', background: 'none', color: '#64748b',
    border: '1.5px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
  },
  main: { maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' },
  heading: { fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 },
  progress: { fontSize: '14px', color: '#64748b', marginTop: '4px' },
  filters: { display: 'flex', gap: '8px' },
  filterBtn: {
    padding: '6px 16px', border: '1.5px solid #e2e8f0', borderRadius: '20px',
    background: '#fff', color: '#64748b', fontSize: '13px', cursor: 'pointer', fontWeight: 500,
  },
  filterActive: {
    padding: '6px 16px', border: '1.5px solid #39A3E6', borderRadius: '20px',
    background: '#eef7fd', color: '#39A3E6', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
  },
  progressBarWrap: {
    height: '6px', background: '#e2e8f0', borderRadius: '99px', marginBottom: '24px', overflow: 'hidden',
  },
  progressBar: { height: '100%', background: '#39A3E6', borderRadius: '99px', transition: 'width 0.4s ease' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  center: { display: 'flex', justifyContent: 'center', padding: '4rem' },
  spinner: {
    width: 36, height: 36,
    border: '4px solid #e2e8f0', borderTop: '4px solid #39A3E6',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  empty: {
    textAlign: 'center', color: '#94a3b8', padding: '4rem 0', fontSize: '15px',
  },
  card: {
    display: 'flex', gap: '16px', alignItems: 'flex-start',
    background: '#fff', borderRadius: '12px',
    padding: '16px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    transition: 'opacity 0.3s',
  },
  checkbox: {
    flexShrink: 0,
    width: '24px', height: '24px',
    borderRadius: '50%', border: '2px solid',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
  },
  check: { color: '#fff', fontSize: '13px', fontWeight: 700, lineHeight: 1 },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' },
  title: { fontWeight: 600, fontSize: '15px', flex: 1 },
  priorityBadge: {
    fontSize: '11px', fontWeight: 700, padding: '2px 8px',
    borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0,
  },
  desc: { fontSize: '14px', color: '#64748b', marginTop: '6px', lineHeight: 1.5 },
  meta: {
    display: 'flex', gap: '16px', flexWrap: 'wrap',
    fontSize: '12px', color: '#94a3b8', marginTop: '10px',
  },
  overdue: { color: '#ef4444', fontWeight: 600 },
  completedAt: { color: '#22c55e' },
};
