import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Quote, Send, CheckCircle, Heart, UploadCloud } from 'lucide-react';

export default function FeedbackForm() {
  const [form, setForm] = useState({ studentName: '', country: '', track: '', quote: '' });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName || !form.quote) return;

    setSubmitting(true);
    try {
      if (!db) throw new Error('Database not connected');

      let imageURL = null;
      if (imageFile) {
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
        
        if (!cloudName || !uploadPreset) {
          alert('Missing Cloudinary configuration in .env');
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await res.json();
        if (data.secure_url) {
          imageURL = data.secure_url;
        } else {
          throw new Error('Cloudinary upload failed');
        }
      }

      await addDoc(collection(db, 'testimonials'), {
        ...form,
        imageURL,
        status: 'pending', // Requires admin approval to show on homepage
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit feedback. Please try again or contact support.');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 sm:p-12 text-center shadow-float">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-green-500 fill-green-500" />
          </div>
          <h2 className="font-display font-bold text-2xl text-onSurface mb-3">Thank You!</h2>
          <p className="text-onSurfaceVariant text-sm leading-relaxed">
            Your feedback has been submitted successfully. We deeply appreciate you sharing your experience with the Delejaipur community!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-16 h-16 bg-primary-container/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Quote className="w-8 h-8 text-primary-container" />
        </div>
        <h2 className="text-center font-display font-extrabold text-3xl text-onSurface">
          Share Your Experience
        </h2>
        <p className="mt-3 text-center text-sm text-onSurfaceVariant">
          Help future students by sharing your learning journey at Delejaipur.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-onSurface mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className="input-field"
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-onSurface mb-1">Course Taken</label>
                <input
                  type="text"
                  value={form.track}
                  onChange={(e) => setForm({ ...form, track: e.target.value })}
                  className="input-field"
                  placeholder="e.g. DELE B2, IELTS"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-onSurface mb-1">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="input-field"
                  placeholder="e.g. India"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-onSurface mb-1">Your Photo (Optional)</label>
              <div className="flex items-center gap-4 bg-surface-lowest p-3 rounded-xl border border-surface-high">
                <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UploadCloud className="w-5 h-5 text-primary-container" />
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    id="photo"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label htmlFor="photo" className="text-sm font-semibold text-primary-container cursor-pointer block">
                    {imageFile ? imageFile.name : 'Upload a profile photo'}
                  </label>
                  <p className="text-xs text-onSurfaceVariant mt-0.5">JPG, PNG (Max 5MB)</p>
                </div>
                {imageFile && (
                  <button type="button" onClick={() => setImageFile(null)} className="text-xs font-bold text-red-500 hover:text-red-700 px-3">
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-onSurface mb-1">Your Feedback *</label>
              <textarea
                required
                rows={5}
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                className="input-field resize-none"
                placeholder="How was your experience learning with us?"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}
