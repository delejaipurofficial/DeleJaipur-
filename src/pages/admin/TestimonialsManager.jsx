import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from './AdminLayout';
import { MessageSquareQuote, CheckCircle, Clock, Trash2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestimonialsManager() {
  const { user, demoMode, loading: authLoading } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

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
      fetchTestimonials();
    } catch {
      toast.error('Failed to delete');
    }
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
            <p className="text-sm text-onSurfaceVariant mt-1">Review student feedback and publish to the homepage</p>
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
              <p className="text-onSurfaceVariant text-sm mb-4">Share you feedback form link with students to gather reviews.</p>
              <button onClick={copyFormLink} className="btn-primary text-sm mx-auto">Copy Link</button>
            </div>
          ) : (
            testimonials.map(t => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm border border-surface-high flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {t.imageURL ? (
                      <img src={t.imageURL} alt={t.studentName} className="w-12 h-12 rounded-full object-cover border-2 border-surface-high" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center font-bold text-primary-container text-lg">
                        {t.studentName[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{t.studentName}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs font-semibold text-onSurfaceVariant px-2 py-0.5 rounded-md bg-surface-low">{t.track}</span>
                        {t.country && <span className="text-xs font-semibold text-onSurfaceVariant px-2 py-0.5 rounded-md bg-surface-low">{t.country}</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-onSurface leading-relaxed italic border-l-4 border-surface-high pl-4 py-1">"{t.quote}"</p>
                  <p className="text-xs text-onSurfaceVariant mt-3">Submitted on: {t.createdAt?.toDate ? t.createdAt.toDate().toLocaleDateString() : 'Just now'}</p>
                </div>
                
                <div className="flex flex-row md:flex-col items-stretch gap-2 w-full md:w-48 mt-4 md:mt-0 border-t border-surface-high md:border-t-0 pt-4 md:pt-0">
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
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-lowest border border-surface-high text-onSurfaceVariant font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
