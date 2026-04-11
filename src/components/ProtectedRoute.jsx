import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 hero-gradient rounded-2xl animate-pulse-slow" />
          <p className="text-sm text-onSurfaceVariant">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-portal" replace />;
  }

  return children;
}
