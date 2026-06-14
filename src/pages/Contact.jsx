import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendLeadEmail } from '../email';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  MapPin, Phone, Mail, Clock, Send,
  User, MessageSquare, Globe, ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const CONTACT_INFO = [
  {
    Icon: MapPin,
    title: 'Main Campus',
    lines: ['84/260, Roondla Plaza, Madhyam Marg,', 'Mansarover Plaza, Near K.V.-5,', 'Jaipur (Raj.) – 302020'],
    note: 'Open Mon–Sat, 9 AM – 7 PM',
  },
  {
    Icon: Phone,
    title: 'Call Us',
    lines: ['+91 98284 59107'],
    href: 'tel:+919828459107',
  },
  {
    Icon: Mail,
    title: 'Email Us',
    lines: ['delejaipurofficial@gmail.com', 'info@genesisgroups.in'],
    href: 'mailto:delejaipurofficial@gmail.com',
  },
  {
    Icon: Globe,
    title: 'LinkedIn',
    lines: ['DELE Jaipur Centre'],
    href: 'https://www.linkedin.com/company/dele-jaipur-centre/posts/?feedView=all',
  },
  {
    Icon: Globe,
    title: 'Instagram',
    lines: ['@delejaipur'],
    href: 'https://www.instagram.com/delejaipur?igsh=MTkxejVnazdjcXdteg==',
  },
  {
    Icon: Globe,
    title: 'YouTube',
    lines: ['@delejaipurcentre'],
    href: 'https://youtube.com/@delejaipurcentre?si=gWWVGzC9vk5LBjpG',
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (!db) {
      setTimeout(() => {
        setSubmitted(true);
        setSubmitting(false);
        toast.success('Message received! (Demo mode)');
      }, 800);
      return;
    }
    try {
      await addDoc(collection(db, 'leads'), { 
        ...form, 
        studentName: form.name,
        type: 'contact_form',
        status: 'new',
        timestamp: serverTimestamp() 
      });
      
      await sendLeadEmail(form, form.subject || 'General Contact Inquiry');

      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      toast.error('Failed to send. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative pt-16 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1423592707957-3b212afa6733?w=1600&auto=format&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-24">
          <div className="accent-line mb-4" style={{ background: 'rgba(255,255,255,0.5)' }} />
          <p className="label-sm text-white/70 mb-3">Get In Touch</p>
          <h1 className="font-display font-extrabold text-white mb-3 sm:mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}>
            Contact <span className="text-primary-container">Us</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-lg max-w-xl leading-relaxed">
            Our academic advisors are here to guide your linguistic journey. Reach out for course details, corporate training, or research collaborations.
          </p>
        </div>
      </div>

      {/* ── Contact Cards strip ── */}
      <div className="bg-white border-b border-surface-high shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
            {CONTACT_INFO.map(({ Icon, title, lines, href, note }) => (
              <div key={title} className="flex flex-col gap-1">
                <div className="w-10 h-10 bg-primary-container/10 rounded-lg flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5 text-primary-container" />
                </div>
                <p className="font-display font-bold text-onSurface text-sm">{title}</p>
                {lines.map((l) =>
                  href ? (
                    <a key={l} href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-onSurfaceVariant hover:text-primary-container transition-colors flex items-center gap-1">
                      {l} <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <p key={l} className="text-xs text-onSurfaceVariant">{l}</p>
                  )
                )}
                {note && <p className="text-[10px] text-onSurfaceVariant/70 mt-0.5">{note}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid lg:grid-cols-5 gap-8 sm:gap-12">

          {/* Left: map + info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl overflow-hidden shadow-card h-64">
              <iframe
                title="Delejaipur Location"
                src="https://maps.google.com/maps?q=Roondla+Plaza+Madhyam+Marg+Mansarovar+Jaipur&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <div className="bg-surface-lowest rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary-container" />
                <h3 className="font-display font-bold text-onSurface">Office Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ['Monday – Friday', '9:00 AM – 7:00 PM'],
                  ['Saturday', '9:00 AM – 5:00 PM'],
                  ['Sunday', 'By Appointment'],
                ].map(([day, time]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-onSurfaceVariant">{day}</span>
                    <span className="font-semibold text-onSurface">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-surface-lowest rounded-2xl p-12 text-center shadow-card">
                <div className="w-20 h-20 hero-gradient rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-3">Message Received!</h3>
                <p className="text-onSurfaceVariant mb-6">Our team will respond within 24 hours. For urgent queries, email us at delejaipurofficial@gmail.com.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-white font-bold rounded-xl hover:bg-primary transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-surface-lowest rounded-2xl p-8 shadow-card">
                <h2 className="font-display font-bold text-2xl mb-2">Send a Message</h2>
                <p className="text-onSurfaceVariant text-sm mb-8">Fill out the form and our team will respond within 24 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" className="w-full pl-10 pr-4 py-3 bg-surface-low rounded-xl text-onSurface placeholder-onSurfaceVariant border border-surface-high focus:outline-none focus:border-primary-container text-sm transition-colors" required />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full pl-10 pr-4 py-3 bg-surface-low rounded-xl text-onSurface placeholder-onSurfaceVariant border border-surface-high focus:outline-none focus:border-primary-container text-sm transition-colors" />
                    </div>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address *" className="w-full pl-10 pr-4 py-3 bg-surface-low rounded-xl text-onSurface placeholder-onSurfaceVariant border border-surface-high focus:outline-none focus:border-primary-container text-sm transition-colors" required />
                  </div>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="w-full px-4 py-3 bg-surface-low rounded-xl text-onSurface placeholder-onSurfaceVariant border border-surface-high focus:outline-none focus:border-primary-container text-sm transition-colors" />
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-onSurfaceVariant" />
                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message…" rows={5} className="w-full pl-10 pr-4 py-3 bg-surface-low rounded-xl text-onSurface placeholder-onSurfaceVariant border border-surface-high focus:outline-none focus:border-primary-container text-sm transition-colors resize-none" required />
                  </div>
                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary-container text-white font-bold rounded-xl hover:bg-primary transition-all duration-200 text-sm uppercase tracking-wide disabled:opacity-60"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</span>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
