import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from './AdminLayout';
import { MessageSquareQuote, CheckCircle, Clock, Trash2, Globe, Pencil, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestimonialsManager() {
  const { user, demoMode, loading: authLoading } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    if (!db) { setLoading(false); return; }
    try {
      const snap = await getDocs(query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')));
      setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      toast.error('Failed to load testimonials');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && (user || demoMode)) {
      fetchTestimonials();
    }
  }, [user, demoMode, authLoading]);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
      await updateDoc(doc(db, 'testimonials', id), { status: newStatus });
      toast.success(newStatus === 'approved' ? 'Published to homepage!' : 'Hidden from homepage.');
      fetchTestimonials();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this feedback?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast.success('Deleted successfully');
      if (editingId === id) { setEditingId(null); setEditForm({}); }
      fetchTestimonials();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditForm({
      studentName: t.studentName || '',
      track: t.track || '',
      country: t.country || '',
      quote: t.quote || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    if (!editForm.studentName.trim() || !editForm.quote.trim()) {
      toast.error('Name and feedback are required.');
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        studentName: editForm.studentName.trim(),
        track: editForm.track.trim(),
        country: editForm.country.trim(),
        quote: editForm.quote.trim(),
      });
      toast.success('Feedback updated!');
      setEditingId(null);
      setEditForm({});
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes');
    }
    setSaving(false);
  };

  const copyFormLink = () => {
    const url = `${window.location.origin}/feedback`;
    navigator.clipboard.writeText(url);
    toast.success('Feedback form link copied!');
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-onSurface">Student Testimonials</h1>
            <p className="text-sm text-onSurfaceVariant mt-1">Review, edit and publish student feedback to the homepage</p>
          </div>
          <button onClick={copyFormLink} className="btn-secondary text-sm bg-white">
            <Globe className="w-4 h-4" /> Copy Form Link to Share
          </button>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-20 bg-surface-high rounded-2xl w-full"></div>
                <div className="h-20 bg-surface-high rounded-2xl w-full"></div>
              </div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-card">
              <MessageSquareQuote className="w-16 h-16 text-surface-high mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2">No feedback yet</h3>
              <p className="text-onSurfaceVariant text-sm mb-4">Share the feedback form link with students to gather reviews.</p>
              <button onClick={copyFormLink} className="btn-primary text-sm mx-auto">Copy Link</button>
            </div>
          ) : (
            testimonials.map(t => (
              <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-surface-high overflow-hidden">

                {editingId === t.id ? (
                  /* ── EDIT MODE ── */
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-display font-bold text-base text-onSurface flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-primary-container" /> Editing Testimonial
                      </h3>
                      <button onClick={cancelEdit} className="text-onSurfaceVariant hover:text-onSurface transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-onSurfaceVariant uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={editForm.studentName}
                          onChange={e => setEditForm({ ...editForm, studentName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-high text-sm text-onSurface outline-none focus:border-primary-container transition-colors"
                          placeholder="Student name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-onSurfaceVariant uppercase tracking-wider mb-1">
                          Course Taken
                        </label>
                        <input
                          type="text"
                          value={editForm.track}
                          onChange={e => setEditForm({ ...editForm, track: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-high text-sm text-onSurface outline-none focus:border-primary-container transition-colors"
                          placeholder="e.g. DELE B2, IELTS"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-onSurfaceVariant uppercase tracking-wider mb-1">
                          Country / City
                        </label>
                        <input
                          type="text"
                          value={editForm.country}
                          onChange={e => setEditForm({ ...editForm, country: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-surface-high text-sm text-onSurface outline-none focus:border-primary-container transition-colors"
                          placeholder="e.g. India"
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-xs font-bold text-onSurfaceVariant uppercase tracking-wider mb-1">
                        Feedback / Quote *
                      </label>
                      <textarea
                        rows={4}
                        value={editForm.quote}
                        onChange={e => setEditForm({ ...editForm, quote: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-surface-high text-sm text-onSurface outline-none focus:border-primary-container transition-colors resize-none"
                        placeholder="Student's feedback…"
                      />
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-onSurfaceVariant border border-surface-high hover:bg-surface-low transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(t.id)}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-primary-container text-white hover:bg-primary transition-colors disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── VIEW MODE ── */
                  <div className="p-6 flex flex-col md:flex-row gap-6 items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        {t.imageURL ? (
                          <img src={t.imageURL} alt={t.studentName} className="w-12 h-12 rounded-full object-cover border-2 border-surface-high" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center font-bold text-primary-container text-lg">
                            {t.studentName?.[0] || '?'}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{t.studentName}</h3>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {t.track && <span className="text-xs font-semibold text-onSurfaceVariant px-2 py-0.5 rounded-md bg-surface-low">{t.track}</span>}
                            {t.country && <span className="text-xs font-semibold text-onSurfaceVariant px-2 py-0.5 rounded-md bg-surface-low">{t.country}</span>}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-onSurface leading-relaxed italic border-l-4 border-surface-high pl-4 py-1">"{t.quote}"</p>
                      <p className="text-xs text-onSurfaceVariant mt-3">
                        Submitted: {t.createdAt?.toDate ? t.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        {' · '}
                        <span className={`font-semibold ${t.status === 'approved' ? 'text-green-600' : 'text-orange-500'}`}>
                          {t.status === 'approved' ? 'Published' : 'Pending'}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-stretch gap-2 w-full md:w-48 mt-4 md:mt-0 border-t border-surface-high md:border-t-0 pt-4 md:pt-0">
                      {/* Edit */}
                      <button
                        onClick={() => startEdit(t)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>

                      {/* Publish / Unpublish */}
                      {t.status === 'approved' ? (
                        <button
                          onClick={() => toggleStatus(t.id, t.status)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                        >
                          <Clock className="w-4 h-4" /> Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus(t.id, t.status)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors bg-green-500 text-white hover:bg-green-600 shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" /> Publish to Home
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-lowest border border-surface-high text-onSurfaceVariant font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
