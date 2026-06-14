import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import {
  Globe, LayoutDashboard, BookOpen, Calendar, Users,
  LogOut, Menu, X, ChevronRight, MessageSquareQuote, UserCircle, Database
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin-portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin-portal/courses', icon: BookOpen, label: 'Course Manager' },
  { to: '/admin-portal/exams', icon: Calendar, label: 'Exam Tracker' },
  { to: '/admin-portal/leads', icon: Users, label: 'Student Leads' },
  { to: '/admin-portal/testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
  { to: '/admin-portal/team', icon: UserCircle, label: 'Team Manager' },
  { to: '/admin-portal/seeder', icon: Database, label: 'Database Seeder' },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { demoMode, demoLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    if (demoMode) {
      demoLogout();
    } else if (auth) {
      await signOut(auth);
    }
    toast.success('Signed out');
    navigate('/admin-portal');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-surface-high">
        <div className="flex items-center gap-3">
          <img src="/dele-logo.png" alt="Dele Jaipur" className="w-10 h-auto object-contain" style={{ border: '1px solid #CC0000' }} />
          <div>
            <p className="font-display font-extrabold text-onSurface">
              Dele<span className="text-primary-container">Jaipur</span>
            </p>
            <p className="text-[9px] uppercase tracking-widest text-onSurfaceVariant">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-primary-light/20 text-primary-container'
                  : 'text-onSurfaceVariant hover:bg-surface-low hover:text-onSurface'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary-container' : ''}`} />
              {label}
              {active && <ChevronRight className="w-4 h-4 ml-auto text-primary-container" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-surface-high">
        <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-onSurfaceVariant hover:bg-surface-low transition-colors mb-1">
          <Globe className="w-4 h-4" /> View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-primary-container hover:bg-primary-light/20 transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-lowest shadow-soft border-r border-surface-high flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-surface-lowest shadow-float flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-low"
            >
              <X className="w-4 h-4" />
            </button>
            <Sidebar />
          </div>
          <div className="flex-1 bg-onSurface/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-4 px-4 py-4 bg-surface-lowest border-b border-surface-high">
          <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-low">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-bold text-onSurface">Admin Portal</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
