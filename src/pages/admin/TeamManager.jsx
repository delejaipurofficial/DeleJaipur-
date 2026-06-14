import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query,
} from 'firebase/firestore';
import AdminLayout from './AdminLayout';
import ImageUploader from '../../components/ImageUploader';
import { Plus, Edit2, Trash2, X, Save, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '',
  role: '',
  imageURL: '',
  order: 0,
};

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    if (!db) { setLoading(false); return; }
    try {
      const snap = await getDocs(query(collection(db, 'team'), orderBy('order')));
      setMembers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load team members');
    }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, order: members.length });
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (member) => {
    setForm({ ...member });
    setEditId(member.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name?.trim()) { toast.error('Name is required.'); return; }
    if (!form.role?.trim()) { toast.error('Role / designation is required.'); return; }
    if (!db) { toast.error('Firebase is not configured.'); return; }
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        role: form.role.trim(),
        imageURL: form.imageURL || '',
        order: Number(form.order) || 0,
        updatedAt: serverTimestamp(),
      };
      if (editId) {
        await updateDoc(doc(db, 'team', editId), data);
        toast.success('Team member updated!');
      } else {
        await addDoc(collection(db, 'team'), { ...data, createdAt: serverTimestamp() });
        toast.success('Team member added!');
      }
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save: ' + (err?.message || 'Unknown error'));
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    try {
      await deleteDoc(doc(db, 'team', id));
      toast.success('Deleted');
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-onSurface">Team Manager</h1>
            <p className="text-sm text-onSurfaceVariant mt-1">
              {members.length} member{members.length !== 1 ? 's' : ''} — shown on the About page
            </p>
          </div>
          <button onClick={openAdd} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>

        {/* Table */}
        <div className="card-static overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-surface-high rounded-xl animate-pulse" />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="w-12 h-12 text-surface-dim mx-auto mb-4" />
              <p className="text-onSurfaceVariant">No team members yet. Add your first one!</p>
              <p className="text-xs text-onSurfaceVariant mt-2">
                Until you add members here, the About page will show the default static team.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px]">
                <thead>
                  <tr className="bg-surface-low border-b border-surface-high">
                    {['Member', 'Role', 'Order', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-onSurfaceVariant uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-high">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-surface-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-high flex-shrink-0">
                            {member.imageURL ? (
                              <img src={member.imageURL} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full hero-gradient flex items-center justify-center text-white font-bold text-sm">
                                {member.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <p className="font-medium text-sm text-onSurface">{member.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-onSurfaceVariant">{member.role}</td>
                      <td className="px-6 py-4 text-sm text-onSurface">{member.order ?? '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(member)}
                            className="w-8 h-8 rounded-lg hover:bg-surface-low flex items-center justify-center transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-onSurfaceVariant" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="w-8 h-8 rounded-lg hover:bg-primary-light/20 flex items-center justify-center transition-colors"
                          >
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
            {/* Header */}
            <div className="sticky top-0 bg-surface-lowest flex items-center justify-between px-8 py-5 border-b border-surface-high">
              <h2 className="font-display font-bold text-lg">
                {editId ? 'Edit Team Member' : 'New Team Member'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-low flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              {/* Photo */}
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-2 block">Photo (optional)</label>
                <ImageUploader
                  label="Upload Photo"
                  folder="team"
                  onUploadComplete={(url) => setForm((p) => ({ ...p, imageURL: url }))}
                />
                {form.imageURL && (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={form.imageURL} alt="Preview" className="w-14 h-14 rounded-xl object-cover ring-2 ring-primary-light" />
                    <p className="text-xs text-green-600 font-medium">✓ Photo uploaded</p>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="input-field"
                  placeholder="e.g. Dr. Ritu Sharma"
                />
              </div>

              {/* Role */}
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Role / Designation *</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                  className="input-field"
                  placeholder="e.g. Director & DELE Examiner"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="label-sm text-xs text-onSurfaceVariant mb-1 block">Display Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                  className="input-field"
                  placeholder="0"
                  min={0}
                />
                <p className="text-[10px] text-onSurfaceVariant mt-1">Lower number = appears first on the About page.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-surface-lowest px-8 py-5 border-t border-surface-high flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                  </span>
                ) : (
                  <><Save className="w-4 h-4" /> Save Member</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
