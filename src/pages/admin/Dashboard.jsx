import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from './AdminLayout';
import { BookOpen, Users, Calendar, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ courses: 0, leads: 0, exams: 0, newLeads: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for Firebase to finish authorizing the user session
    if (authLoading || !user) return;

    const fetchStats = async () => {
      if (!db) { setLoading(false); return; }
      try {
        const [courseSnap, leadSnap, enrollSnap, examSnap, newLeadSnap, newEnrollSnap] = await Promise.all([
          getDocs(query(collection(db, 'courses'), where('status', '==', 'active'))),
          getDocs(collection(db, 'leads')),
          getDocs(collection(db, 'enrollments')),
          getDocs(collection(db, 'exams')),
          getDocs(query(collection(db, 'leads'), where('status', '==', 'new'))),
          getDocs(query(collection(db, 'enrollments'), where('status', '==', 'new'))),
        ]);
        
        setStats({
          courses: courseSnap.size,
          leads: leadSnap.size + enrollSnap.size,
          exams: examSnap.size,
          newLeads: newLeadSnap.size + newEnrollSnap.size,
        });

        // Recent 5 leads
        const allLeads = [
          ...leadSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          ...enrollSnap.docs.map((d) => {
             const data = d.data();
             return {
                id: d.id,
                ...data,
                studentName: data.studentName || data.name,
                phone: data.phone || data.mobile,
                courseName: data.courseName || data.course
             };
          })
        ];
        allLeads.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setRecentLeads(allLeads.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, authLoading]);

  const cards = [
    { label: 'Active Courses', value: stats.courses, icon: BookOpen, color: 'hero-gradient', link: '/admin-portal/courses' },
    { label: 'Total Leads', value: stats.leads, icon: Users, color: 'bg-blue-500', link: '/admin-portal/leads' },
    { label: 'New Leads', value: stats.newLeads, icon: TrendingUp, color: 'bg-amber-500', link: '/admin-portal/leads' },
    { label: 'Exam Sessions', value: stats.exams, icon: Calendar, color: 'bg-purple-500', link: '/admin-portal/exams' },
  ];

  const statusBadge = (status) => {
    const map = {
      new: 'badge-new',
      'in-progress': 'badge-in-progress',
      enrolled: 'badge-enrolled',
      rejected: 'badge-rejected',
    };
    return map[status] || 'badge-draft';
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-onSurface">Dashboard</h1>
            <p className="text-sm text-onSurfaceVariant mt-1">Welcome back — here's what's happening today.</p>
          </div>
          <button onClick={() => window.location.reload()} className="btn-secondary text-sm py-2 px-4">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="card p-5 block">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-display font-extrabold text-3xl text-onSurface">
                {loading ? '—' : value}
              </p>
              <p className="text-xs text-onSurfaceVariant mt-1">{label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Leads */}
        <div className="card-static">
          <div className="flex items-center justify-between p-6 border-b border-surface-high">
            <h2 className="font-display font-bold text-lg text-onSurface">Recent Leads</h2>
            <Link to="/admin-portal/leads" className="text-sm text-primary-container hover:text-primary flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-surface-high rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentLeads.length === 0 ? (
            <div className="p-12 text-center text-onSurfaceVariant">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No leads yet. They'll appear here when students inquire.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-high bg-surface-low">
                    {['Student', 'Course', 'Phone', 'Date', 'Status'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-onSurfaceVariant uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-high">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-surface-low transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm text-onSurface">{lead.studentName}</p>
                        <p className="text-xs text-onSurfaceVariant">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-onSurface">{lead.courseName || '—'}</td>
                      <td className="px-6 py-4 text-sm text-onSurfaceVariant">{lead.phone}</td>
                      <td className="px-6 py-4 text-xs text-onSurfaceVariant">
                        {lead.timestamp?.toDate?.().toLocaleDateString('en-IN') || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={statusBadge(lead.status)}>{lead.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { label: 'Add New Course', desc: 'Publish a course to the website', to: '/admin-portal/courses', color: 'hero-gradient' },
            { label: 'Add Exam Date', desc: 'Schedule a DELE exam session', to: '/admin-portal/exams', color: 'bg-purple-500' },
            { label: 'View All Leads', desc: 'Manage student inquiries', to: '/admin-portal/leads', color: 'bg-blue-500' },
          ].map(({ label, desc, to, color }) => (
            <Link key={label} to={to} className="card p-5 flex items-center gap-4 group">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <p className="font-semibold text-sm text-onSurface">{label}</p>
                <p className="text-xs text-onSurfaceVariant">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
