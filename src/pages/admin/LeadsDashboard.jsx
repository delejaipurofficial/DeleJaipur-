import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from './AdminLayout';
import { Users, Search, Filter, Phone, Mail, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['new', 'in-progress', 'enrolled', 'rejected'];

const statusBadge = (s) => ({
  new: 'badge-new',
  'in-progress': 'badge-in-progress',
  enrolled: 'badge-enrolled',
  rejected: 'badge-rejected',
}[s] || 'badge-draft');

export default function LeadsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchLeads = async () => {
    if (authLoading || !user) return;
    setLoading(true);
    if (!db) { setLoading(false); return; }
    try {
      const [leadsSnap, enrollSnap] = await Promise.all([
        getDocs(query(collection(db, 'leads'), orderBy('timestamp', 'desc'))),
        getDocs(query(collection(db, 'enrollments'), orderBy('timestamp', 'desc')))
      ]);
      
      const standardizedLeads = [
        ...leadsSnap.docs.map(d => ({ id: d.id, _collection: 'leads', ...d.data() })),
        ...enrollSnap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            _collection: 'enrollments',
            ...data,
            studentName: data.studentName || data.name,
            phone: data.phone || data.mobile,
            courseName: data.courseName || data.course
          };
        })
      ].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));

      setLeads(standardizedLeads);
    } catch { toast.error('Failed to load leads'); }
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [user, authLoading]);

  useEffect(() => {
    let result = leads;
    if (search) result = result.filter((l) =>
      l.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.courseName?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'all') result = result.filter((l) => l.status === statusFilter);
    setFiltered(result);
  }, [leads, search, statusFilter]);

  const updateStatus = async (id, status, collectionName = 'leads') => {
    try {
      await updateDoc(doc(db, collectionName, id), { status });
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
      toast.success(`Status updated to "${status}"`);
    } catch { toast.error('Failed to update status.'); }
  };

  const handleDelete = async (id, collectionName = 'leads') => {
    if (!window.confirm('Are you sure you want to permanently delete this lead?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success('Lead deleted successfully');
    } catch { 
      toast.error('Failed to delete lead.'); 
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-onSurface">Student Leads</h1>
            <p className="text-sm text-onSurfaceVariant mt-1">{filtered.length} lead{filtered.length !== 1 ? 's' : ''} shown</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads…"
                className="input-field pl-9 py-2 text-sm w-56"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pl-9 py-2 text-sm appearance-none cursor-pointer pr-8"
              >
                <option value="all">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="card-static overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-surface-high rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="w-12 h-12 text-surface-dim mx-auto mb-4" />
              <p className="text-onSurfaceVariant">No leads match your filters.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[780px]">
                  <thead>
                    <tr className="bg-surface-low border-b border-surface-high">
                      {['Student', 'Course', 'Phone', 'Date', 'Status', 'Actions'].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-onSurfaceVariant uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-high">
                    {filtered.map((lead) => (
                      <tr key={lead.id} className="hover:bg-surface-low transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-sm text-onSurface">{lead.studentName}</p>
                          <a href={`mailto:${lead.email}`} className="text-xs text-primary-container hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3" />{lead.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-onSurface max-w-36">
                          <span className="line-clamp-2">{lead.courseName || '—'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <a href={`tel:${lead.phone}`} className="text-sm text-onSurface flex items-center gap-1 hover:text-primary-container">
                            <Phone className="w-3 h-3" />{lead.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-xs text-onSurfaceVariant">
                          {lead.timestamp?.toDate?.().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={statusBadge(lead.status)}>{lead.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={lead.status}
                              onChange={(e) => updateStatus(lead.id, e.target.value, lead._collection)}
                              className="text-xs bg-surface-low border border-surface-high rounded-lg px-2 py-1.5 text-onSurface cursor-pointer hover:border-primary-container transition-colors capitalize"
                            >
                              {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                            </select>
                            <button
                              onClick={() => handleDelete(lead.id, lead._collection)}
                              className="w-7 h-7 rounded hover:bg-red-500/10 flex items-center justify-center text-onSurfaceVariant hover:text-red-500 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-surface-high">
                {filtered.map((lead) => (
                  <div key={lead.id} className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-onSurface">{lead.studentName}</p>
                        <p className="text-xs text-onSurfaceVariant">{lead.courseName || '—'}</p>
                      </div>
                      <span className={statusBadge(lead.status)}>{lead.status}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-sm text-onSurfaceVariant">
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary-container">
                        <Phone className="w-3 h-3" />{lead.phone}
                      </a>
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-primary-container">
                        <Mail className="w-3 h-3" />{lead.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-onSurfaceVariant">
                        {lead.timestamp?.toDate?.().toLocaleDateString('en-IN') || '—'}
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value, lead._collection)}
                          className="text-xs bg-surface-low border border-surface-high rounded-lg px-2 py-1.5 text-onSurface cursor-pointer"
                        >
                          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                        <button
                          onClick={() => handleDelete(lead.id, lead._collection)}
                          className="w-7 h-7 flex items-center justify-center text-onSurfaceVariant hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Status legend */}
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="text-xs text-onSurfaceVariant font-medium">Status legend:</span>
          {[
            { s: 'new', label: 'New inquiry' },
            { s: 'in-progress', label: 'Being followed up' },
            { s: 'enrolled', label: 'Student enrolled' },
            { s: 'rejected', label: 'Not interested' },
          ].map(({ s, label }) => (
            <span key={s} className="flex items-center gap-1.5 text-xs">
              <span className={statusBadge(s)}>{s}</span>
              <span className="text-onSurfaceVariant"> — {label}</span>
            </span>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
