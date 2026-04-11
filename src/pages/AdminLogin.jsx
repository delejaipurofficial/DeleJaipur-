import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Globe, Mail, Lock, Eye, EyeOff, LogIn, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { user, loading, demoMode, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/admin-portal/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Demo mode (no Firebase)
    if (demoMode) {
      const ok = demoLogin(form.email, form.password);
      if (ok) {
        toast.success('Welcome back, Admin! (Demo mode)');
        navigate('/admin-portal/dashboard');
      } else {
        toast.error('Invalid demo credentials. Use admin@delejaipur.com / admin123');
      }
      setSubmitting(false);
      return;
    }

    // Firebase mode
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success('Welcome back, Admin!');
      navigate('/admin-portal/dashboard');
    } catch {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img src="/8.jpg" alt="Dele Jaipur Logo" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-onSurface">
            Dele<span className="text-primary-container">Jaipur</span> Admin
          </h1>
          <p className="text-sm text-onSurfaceVariant mt-1">Restricted access — authorized personnel only</p>
        </div>

        {/* Demo Mode Banner */}
        {demoMode && (
          <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 items-start">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-800">Demo Mode — Firebase not configured</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Use: <strong>admin@delejaipur.com</strong> / <strong>admin123</strong>
              </p>
            </div>
          </div>
        )}

        <div className="card-static p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="Admin Email"
                className="input-field pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Password"
                className="input-field pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-onSurfaceVariant hover:text-onSurface"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center py-4 disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <><LogIn className="w-4 h-4" /> Sign In</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
