import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!user) return <Navigate to="/staff/login" replace />;
  if (requireRole && user.role !== requireRole) return <Navigate to="/staff" replace />;

  return children;
}

const styles = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
  spinner: {
    width: 40, height: 40,
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #39A3E6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};
