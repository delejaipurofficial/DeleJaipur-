import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, User, Phone, Mail, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendLeadEmail } from '../email';

export default function LeadCaptureForm({ courseName = '' }) {
  const [form, setForm] = useState({
    studentName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName || !form.email || !form.phone) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    if (!db) {
      // Demo mode — show success without saving
      setSubmitted(true);
      toast.success('Your inquiry has been received! (Demo mode — Firebase not configured)');
      setSubmitting(false);
      return;
    }
    try {
      await addDoc(collection(db, 'leads'), {
        ...form,
        courseName,
        timestamp: serverTimestamp(),
        status: 'new',
      });

      // Trigger email notification entirely client-side using EmailJS
      await sendLeadEmail(form, courseName);

      setSubmitted(true);
      toast.success('Your inquiry has been submitted!');
    } catch (err) {
      console.error(err);
      toast.error('Could not save your inquiry. Please contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="card-static p-8 text-center">
        <div className="w-16 h-16 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-white" />
        </div>
        <h3 className="headline-md mb-2">Thank You!</h3>
        <p className="text-onSurfaceVariant text-sm">
          We've received your inquiry for <strong className="text-primary-container">{courseName}</strong> and will get back to you within 24 hours.
        </p>
        <p className="text-xs text-onSurfaceVariant mt-4">📞 +91 98284 59107 &nbsp;|&nbsp; ✉️ delejaipur@gmail.com</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ studentName: '', email: '', phone: '', message: '' }); }}
          className="btn-ghost mt-4 text-sm"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="card-static p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="accent-line" />
        <h3 className="headline-md text-lg">Inquire About This Course</h3>
      </div>
      {courseName && (
        <div className="mb-5 px-4 py-2.5 bg-primary-light/20 rounded-lg">
          <p className="text-sm font-medium text-primary-container">
            📚 {courseName}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
          <input
            type="text"
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="Full Name *"
            className="input-field pl-10"
            required
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address *"
            className="input-field pl-10"
            required
          />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number *"
            className="input-field pl-10"
            required
          />
        </div>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-onSurfaceVariant" />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Any specific questions or requirements?"
            rows={4}
            className="input-field pl-10 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Sending…
            </span>
          ) : (
            <>Send Inquiry <Send className="w-4 h-4" /></>
          )}
        </button>
        <p className="text-xs text-center text-onSurfaceVariant">
          We respond within 24 hours. No spam, ever.
        </p>
      </form>
    </div>
  );
}
