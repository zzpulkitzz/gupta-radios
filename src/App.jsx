import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import WhatsAppButton from './components/WhatsAppButton'
import Footer from './components/Footer'
import ProtectedRoute from './components/staff/ProtectedRoute'
import Login from './pages/staff/Login'
import StaffDashboard from './pages/staff/StaffDashboard'
import AdminDashboard from './pages/staff/AdminDashboard'
import LOGO_URL from './assets/images/logo.png'

function MainSite() {
  const [active, setActive] = useState('legacy')
  const [open, setOpen] = useState(false)

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <button
          style={styles.menuBtn}
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
        <div style={styles.brandContainer}>
          <img src={LOGO_URL} alt="Gupta Radios Logo" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Gupta Radios</h1>
            <p style={styles.subtitle}>Electronics & Electricals</p>
          </div>
        </div>
      </header>

      <Sidebar active={active} setActive={setActive} open={open} setOpen={setOpen} />
      <Content active={active} />
      <WhatsAppButton />
      <Footer setActive={setActive} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/staff/login" element={<Login />} />
      <Route
        path="/staff/admin"
        element={
          <ProtectedRoute requireRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<MainSite />} />
    </Routes>
  )
}

const styles = {
  app: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  header: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    padding: '0.8rem 2rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  subtitle: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
    marginTop: '2px',
    letterSpacing: '0.4px',
    lineHeight: '1.2',
  },
  menuBtn: {
    fontSize: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginRight: '16px',
  },
  brandContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { height: '48px', width: 'auto', objectFit: 'contain', borderRadius: '6px' },
  title: { fontSize: '20px', margin: 0 },
}
