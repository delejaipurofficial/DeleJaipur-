import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, getDoc, setDoc
} from 'firebase/firestore';
import AdminLayout from './AdminLayout';
import ImageUploader from '../../components/ImageUploader';
import { Plus, Edit2, Trash2, X, Save, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LEVELS_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const EMPTY_FORM = { date: '', deadline: '', levels: [], year: new Date().getFullYear(), description: '', link: '' };

function AutoStatusBadge({ deadline }) {
  const isOpen = new Date() < new Date(deadline);
  return isOpen ? (
    <span className="badge-active flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Open</span>
  ) : (
    <span className="badge-new flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Closed</span>
  );
}

export default function ExamTracker() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [calendarImg, setCalendarImg] = useState('');

  const fetchSettings = async () => {
    if (!db) return;
    try {
      const snap = await getDoc(doc(db, 'settings', 'exams'));
      if (snap.exists()) setCalendarImg(snap.data().calendarImageURL || '');
    } catch {}
  };

  const fetchExams = async () => {
    setLoading(true);
    if (!db) { setLoading(false); return; }
    try {
      const snap = await getDocs(query(collection(db, 'exams'), orderBy('deadline')));
      setExams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch { toast.error('Failed to load exams'); }
    setLoading(false);
  };

  useEffect(() => { fetchExams(); fetchSettings(); }, []);

  const handleSettingsSave = async (url) => {
    try {
      console.log('[ExamTracker] Saving calendar image URL to Firestore:', url);
      await setDoc(doc(db, 'settings', 'exams'), { calendarImageURL: url }, { merge: true });
      setCalendarImg(url);
      toast.success('Calendar image updated!');
    } catch (err) {
      console.error('[ExamTracker] Firestore save error:', err?.code, err?.message, err);
      toast.error('Failed to update calendar image.');
    }
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (exam) => { setForm({ ...exam }); setEditId(exam.id); setShowModal(true); };

  const toggleLevel = (l) => {
    setForm((p) => ({
      ...p,
      levels: p.levels.includes(l) ? p.levels.filter((x) => x !== l) : [...p.levels, l],
    }));
  };

  const handleSave = async () => {
    if (!form.date || !form.deadline) { toast.error('Date and deadline are required.'); return; }
    setSaving(true);
    try {
      const data = { ...form, year: Number(form.year), updatedAt: serverTimestamp() };
      if (editId) {
        await updateDoc(doc(db, 'exams', editId), data);
        toast.success('Exam updated!');
      } else {
        await addDoc(collection(db, 'exams'), { ...data, createdAt: serverTimestamp() });
        toast.success('Exam session added!');
      }
      setShowModal(false);
      fetchExams();
    } catch { toast.error('Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam session?')) return;
    await deleteDoc(doc(db, 'exams', id));
    toast.success('Deleted');
    fetchExams();
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-onSurface">Exam Tracker</h1>
            <p className="text-sm text-onSurfaceVariant mt-1">Manage DELE exam sessions and registration windows</p>
          </div>
          <button onClick={openAdd} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Add Session
          </button>
        </div>

        {/* Global Settings */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
             <h2 className="font-display font-bold text-lg text-onSurface mb-2">Calendar Image</h2>
             <p className="text-sm text-onSurfaceVariant mb-4 max-w-md">Upload an image to display above the exam session cards on the public page.</p>
             <ImageUploader label="Upload Image" folder="settings" onUploadComplete={handleSettingsSave} />
          </div>
          {calendarImg && (
             <div className="w-full md:w-64 h-32 rounded-xl border border-surface-high overflow-hidden bg-surface-high flex-shrink-0">
               <img src={calendarImg} alt="Global Calendar" className="w-full h-full object-cover" />
             </div>
          )}
        </div>

        <div className="card-static overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-surface-high rounded-xl animate-pulse" />)}
            </div>
          ) : exams.length === 0 ? (
            <div className="p-16 text-center">
              <Calendar className="w-12 h-12 text-surface-dim mx-auto mb-4" />
              <p className="text-onSurfaceVariant">No exam sessions added yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-surface-low border-b border-surface-high">
                    {['Session', 'Registration Deadline', 'Levels', 'Auto-Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-onSurfaceVariant uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-high">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-surface-low transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm text-onSurface">{exam.date}</p>
                        <p className="text-xs text-onSurfaceVariant">{exam.description}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-onSurface">
                        {exam.deadline ? new Date(exam.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {exam.levels?.map((l) => (
                            <span key={l} className="px-2 py-0.5 bg-primary-light/30 text-primary-dark text-xs font-bold rounded">{l}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <AutoStatusBadge deadline={exam.deadline} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(exam)} className="w-8 h-8 rounded-lg hover:bg-surface-low flex items-center justify-center transition-colors">
                            <Edit2 className="w-4 h-4 text-onSurfaceVariant" />
                          </button>
                          <button onClick={() => handleDelete(exam.id)} className="w-8 h-8 rounded-lg hover:bg-primary-light/20 flex items-center justify-center transition-colors">
                            <Trash2 className="w-4 h-4 text-primary-container" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-onSurface/40 backdrop-blur-sm">
          <div className="bg-surface-lowest rounded-2xl shadow-float w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-surface-lowest flex items-center justify-between px-8 py-5 border-b border-surface-high">
              <h2 className="font-display font-bold text-lg">{editId ? 'Edit Exam Session' : 'New Exam Session'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface-low flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Session Name * (e.g. "May 2025")</label>
                <input type="text" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="input-field" placeholder="May 2025" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Registration Deadline *</label>
                  <input type="date" value={form.deadline} onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-3 block">Available Levels</label>
                <div className="flex flex-wrap gap-2">
                  {LEVELS_OPTIONS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => toggleLevel(l)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${
                        form.levels?.includes(l)
                          ? 'bg-primary-container text-white border-primary-container'
                          : 'border-surface-high text-onSurfaceVariant hover:border-primary-container'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Registration Link (External URL)</label>
                <input type="url" value={form.link || ''} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} className="input-field" placeholder="https://forms.google.com/..." />
                <p className="text-[10px] text-onSurfaceVariant mt-1">If provided, the website will redirect students directly to this external form instead of standard inquiry.</p>
              </div>
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Session notes…" />
              </div>

              {/* Live status preview */}
              {form.deadline && (
                <div className="flex items-center gap-3 p-3 bg-surface-low rounded-xl">
                  <Calendar className="w-4 h-4 text-onSurfaceVariant" />
                  <span className="text-sm text-onSurfaceVariant">Auto-status will show as:</span>
                  <AutoStatusBadge deadline={form.deadline} />
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-surface-lowest px-8 py-5 border-t border-surface-high flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                {saving ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</span> : <><Save className="w-4 h-4" /> Save Session</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
