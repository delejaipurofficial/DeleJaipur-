import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { User, Phone, Mail, BookOpen, CheckCircle, ArrowRight, Hash } from 'lucide-react';
import { sendLeadEmail } from '../email';



export default function EnrollmentForm() {
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    course: params.get('course') || '',
    age: '',
  });

  const [dynamicCourses, setDynamicCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!db) { setLoadingCourses(false); return; }
      try {
        const q = query(collection(db, 'courses'), where('status', '==', 'active'));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => {
          const c = doc.data();
          const formatStr = c.format ? ` [${c.format}]` : '';
          return {
            id: doc.id,
            group: c.group || 'adult',
            format: c.format || 'Regular',
            label: `${c.title}${formatStr}`
          };
        });
        setDynamicCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.name.trim()) { toast.error('Please enter your full name.'); return; }
    if (!form.email.trim() || !form.email.includes('@')) { toast.error('Please enter a valid email address.'); return; }
    if (!form.mobile.trim() || form.mobile.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.'); return;
    }
    if (!form.course) { toast.error('Please select the course you are interested in.'); return; }
    if (!form.age || Number(form.age) < 1) { toast.error('Please enter your age.'); return; }

    setSubmitting(true);

    const payload = {
      studentName: form.name.trim(),
      email:       form.email.trim(),
      phone:      form.mobile.trim(),
      courseName:  courseLabel,
      age:         Number(form.age),
      type:        'enrollment_interest',
      status:      'new',
    };

    if (!db) {
      await new Promise((r) => setTimeout(r, 1000));
      setSubmitted(true);
      toast.success('Interest registered! (Demo mode)');
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'leads'), {
        ...payload,
        timestamp: serverTimestamp(),
      });
      
      // Trigger EmailJS emails
      await sendLeadEmail(form, courseLabel);

      setSubmitted(true);
      toast.success('Your interest has been registered!');
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const courseLabel =
    dynamicCourses.find((c) => c.id === form.course)?.label || form.course || 'your selected course';

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-28 text-center">
          <div className="w-24 h-24 hero-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-red animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-onSurface mb-3" style={{ letterSpacing: '-0.02em' }}>
            You're on the List!
          </h1>
          <p className="text-onSurfaceVariant text-lg mb-2">
            Thank you, <strong className="text-onSurface">{form.name}</strong>.
          </p>
          <p className="text-onSurfaceVariant mb-8 text-sm leading-relaxed">
            We've received your interest for{' '}
            <strong className="text-primary-container">{courseLabel}</strong>.<br />
            Our team will call you on <strong className="text-onSurface">{form.mobile}</strong> within <strong>24–48 hours</strong> to discuss course details and fees.
          </p>

          {/* Contact info */}
          <div className="bg-white rounded-2xl p-5 shadow-card text-sm text-onSurfaceVariant mb-8">
            <p>For urgent queries, reach us directly:</p>
            <p className="mt-2 font-semibold text-onSurface">📞 +91 98284 59107</p>
            <p className="font-semibold text-onSurface">✉️ delejaipurofficial@gmail.com</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/courses" className="btn-primary">
              <BookOpen className="w-4 h-4" /> Browse More Courses
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Form screen ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero */}
      <div className="hero-gradient pt-20 pb-12 sm:pb-16 px-4 text-center">
        <div className="mx-auto mb-4 flex items-center justify-center">
          <img src="/8.jpg" alt="Dele Jaipur Logo" className="h-16 w-auto object-contain brightness-0 invert" />
        </div>
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">
          Delejaipur Language Institute
        </p>
        <h1 className="font-display font-extrabold text-white mb-3 sm:mb-4" style={{ fontSize: 'clamp(1.6rem, 5vw, 3rem)', letterSpacing: '-0.02em' }}>
          Register Your Interest
        </h1>
        <p className="text-white/75 text-sm sm:text-base max-w-lg mx-auto">
          Fill in your details below and our team will get in touch with course details and personalised fee structure.
        </p>
      </div>

      {/* Form card */}
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-14">
        <div className="bg-white rounded-2xl shadow-float p-5 sm:p-8 md:p-10">
          {/* Header accent */}
          <div className="flex items-center gap-3 mb-7">
            <div className="accent-line" />
            <h2 className="font-display font-bold text-xl text-onSurface">Your Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-onSurfaceVariant uppercase tracking-wide mb-1.5">
                Full Name <span className="text-primary-container">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Arjun Sharma"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-onSurfaceVariant uppercase tracking-wide mb-1.5">
                Email Address <span className="text-primary-container">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. arjun@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-onSurfaceVariant uppercase tracking-wide mb-1.5">
                Mobile Number <span className="text-primary-container">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="input-field pl-10"
                  maxLength={15}
                  required
                />
              </div>
            </div>

            {/* Course Interested */}
            <div>
              <label className="block text-xs font-semibold text-onSurfaceVariant uppercase tracking-wide mb-1.5">
                Course Interested In <span className="text-primary-container">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant pointer-events-none" />
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  className="input-field pl-10 appearance-none"
                  required
                >
                  <option value="">
                    {loadingCourses ? 'Loading available courses...' : 'Select a course…'}
                  </option>
                  {!loadingCourses && (
                    <>
                      <optgroup label="── Adult Learners (18+) ──">
                        {dynamicCourses.filter(c => c.group === 'adult').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="── Young Learners (11–17) ──">
                        {dynamicCourses.filter(c => c.group === 'young').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </optgroup>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-onSurfaceVariant uppercase tracking-wide mb-1.5">
                Age <span className="text-primary-container">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g. 22"
                  min={1}
                  max={100}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Note */}
            <p className="text-xs text-onSurfaceVariant bg-surface-low rounded-lg px-4 py-3 leading-relaxed">
              📋 Course pricing is discussed personally — our team will contact you to explain the fee structure and batch schedule.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Register Interest
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact sidebar info */}
        <div className="mt-6 bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-6 text-white text-center">
          <h3 className="font-display font-bold mb-1">Have questions?</h3>
          <p className="text-white/70 text-sm mb-4">Talk to us directly and we'll guide you to the right course.</p>
          <a href="tel:+919828459107" className="block font-semibold text-white hover:text-white/80 transition-colors mb-1">
            📞 +91 98284 59107
          </a>
          <a href="mailto:delejaipurofficial@gmail.com" className="block font-semibold text-white hover:text-white/80 transition-colors">
            ✉️ delejaipurofficial@gmail.com
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
