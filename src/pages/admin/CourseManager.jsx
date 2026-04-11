import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import AdminLayout from './AdminLayout';
import ImageUploader from '../../components/ImageUploader';
import { Plus, Edit2, Trash2, X, Save, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  title: '', description: '', level: 'A1', group: 'adult', format: 'Regular',
  imageURL: '', status: 'draft', modules: [{ name: '', price: '', hours: '' }],
};

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'All Levels'];
const FORMATS = ['Regular', 'Super Intensive', 'Exam Preparation', 'Other'];
const STATUSES = ['active', 'draft', 'closed'];

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    if (!db) { setLoading(false); return; }
    try {
      const snap = await getDocs(collection(db, 'courses'));
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load courses');
    }
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit = (course) => {
    // Port legacy data to new format if needed
    let parsedModules = course.modules || [];
    if (parsedModules.length === 0) {
      if (course.curriculum) {
        parsedModules = course.curriculum.map(c => ({ name: c, price: course.price || '', hours: '' }));
      } else {
        parsedModules = [{ name: '', price: course.price || '', hours: '' }];
      }
    }
    setForm({ 
      ...course, 
      format: course.format || 'Regular',
      modules: parsedModules
    });
    setEditId(course.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) { toast.error('Title and description are required.'); return; }
    setSaving(true);
    try {
      // Clean up modules
      const cleanedModules = form.modules
        .filter(m => m.name.trim() !== '')
        .map(m => ({
           name: m.name.trim(),
           price: Number(m.price) || 0,
           hours: Number(m.hours) || 0,
        }));

      const data = {
        title: form.title,
        description: form.description,
        level: form.level,
        group: form.group,
        format: form.format,
        imageURL: form.imageURL,
        status: form.status,
        modules: cleanedModules,
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, 'courses', editId), data);
        toast.success('Course updated!');
      } else {
        await addDoc(collection(db, 'courses'), { ...data, createdAt: serverTimestamp() });
        toast.success('Course created!');
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save course. Check console.');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteDoc(doc(db, 'courses', id));
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete.');
    }
  };

  const updateModule = (i, field, val) => {
    const arr = [...form.modules];
    arr[i] = { ...arr[i], [field]: val };
    setForm((p) => ({ ...p, modules: arr }));
  };
  const addModule = () => setForm((p) => ({ ...p, modules: [...p.modules, { name: '', price: '', hours: '' }] }));
  const removeModule = (i) => setForm((p) => ({ ...p, modules: p.modules.filter((_, idx) => idx !== i) }));

  const statusBadge = (s) => ({ active: 'badge-active', draft: 'badge-draft', closed: 'badge-closed' }[s] || 'badge-draft');

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-onSurface">Course Manager</h1>
            <p className="text-sm text-onSurfaceVariant mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} total</p>
          </div>
          <button onClick={openAdd} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>

        {/* Table */}
        <div className="card-static overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-surface-high rounded-xl animate-pulse" />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="p-16 text-center">
              <BookOpen className="w-12 h-12 text-surface-dim mx-auto mb-4" />
              <p className="text-onSurfaceVariant">No courses yet. Add your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-surface-low border-b border-surface-high">
                    {['Course', 'Format', 'Level', 'Modules', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-onSurfaceVariant uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-high">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-surface-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-high flex-shrink-0">
                            {course.imageURL ? (
                              <img src={course.imageURL} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full hero-gradient flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white/60" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-onSurface">{course.title}</p>
                            <p className="text-[10px] text-onSurfaceVariant uppercase tracking-widest">{course.group === 'young' ? 'Young Learners' : 'Adults'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-onSurface">{course.format || 'Regular'}</td>
                      <td className="px-6 py-4 text-sm text-onSurface">{course.level}</td>
                      <td className="px-6 py-4 text-sm text-onSurface">
                        <span className="inline-flex items-center gap-1"><Layers className="w-3 h-3" /> {course.modules?.length || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={statusBadge(course.status)}>{course.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(course)} className="w-8 h-8 rounded-lg hover:bg-surface-low flex items-center justify-center transition-colors">
                            <Edit2 className="w-4 h-4 text-onSurfaceVariant" />
                          </button>
                          <button onClick={() => handleDelete(course.id)} className="w-8 h-8 rounded-lg hover:bg-primary-light/20 flex items-center justify-center transition-colors">
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
          <div className="bg-surface-lowest rounded-2xl shadow-float w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="sticky top-0 bg-surface-lowest flex items-center justify-between px-8 py-5 border-b border-surface-high z-10">
              <h2 className="font-display font-bold text-lg">{editId ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-surface-low flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              {/* Image */}
              <ImageUploader
                label="Course Thumbnail"
                folder="courses"
                onUploadComplete={(url) => setForm((p) => ({ ...p, imageURL: url }))}
              />
              {form.imageURL && (
                <p className="text-xs text-green-600">✓ Image uploaded successfully</p>
              )}

              {/* Title */}
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Course Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="input-field" placeholder="e.g. A1 Breakthrough" />
              </div>

              {/* Description */}
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Course overview…" />
              </div>

              {/* Format, Level, Group */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Age Group</label>
                  <select value={form.group || 'adult'} onChange={(e) => setForm((p) => ({ ...p, group: e.target.value }))} className="input-field">
                    <option value="adult">General Courses (Adults)</option>
                    <option value="young">Young Learners (11-17)</option>
                  </select>
                </div>
                <div>
                  <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Format</label>
                  <select value={form.format || 'Regular'} onChange={(e) => setForm((p) => ({ ...p, format: e.target.value }))} className="input-field">
                    {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Primary Level</label>
                  <select value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))} className="input-field">
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-3 block">Publication Status</label>
                <div className="flex gap-3">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, status: s }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${
                        form.status === s
                          ? 'border-primary-container bg-primary-light/20 text-primary-container'
                          : 'border-surface-high text-onSurfaceVariant hover:border-primary-container'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modules (Curriculum + Price/Hours) */}
              <div>
                <div className="flex items-center justify-between mb-3 border-t border-surface-high pt-6">
                  <div>
                    <label className="label-sm text-xs text-onSurfaceVariant block">Course Modules</label>
                    <p className="text-[10px] text-onSurfaceVariant mt-0.5">Define sub-courses and their prices (e.g. A1.1, A1.2)</p>
                  </div>
                  <button type="button" onClick={addModule} className="btn-secondary text-xs py-1.5 px-3">
                    <Plus className="w-3 h-3" /> Add Module
                  </button>
                </div>
                <div className="space-y-3">
                  {form.modules.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start bg-surface-low p-3 rounded-xl border border-surface-high">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <input type="text" value={item.name} onChange={(e) => updateModule(i, 'name', e.target.value)} className="input-field py-2 text-sm" placeholder="Module Name (e.g. A1.1)" />
                        </div>
                        <div>
                          <input type="number" value={item.price} onChange={(e) => updateModule(i, 'price', e.target.value)} className="input-field py-2 text-sm" placeholder="Price (₹)" />
                        </div>
                        <div>
                          <input type="number" value={item.hours} onChange={(e) => updateModule(i, 'hours', e.target.value)} className="input-field py-2 text-sm" placeholder="Hours (e.g. 35)" />
                        </div>
                      </div>
                      <button onClick={() => removeModule(i)} className="w-10 h-10 flex items-center justify-center text-onSurfaceVariant hover:text-primary-container rounded-lg hover:bg-white flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-surface-lowest px-8 py-5 border-t border-surface-high flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                {saving ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</span> : <><Save className="w-4 h-4" /> Save Course</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
