import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendLeadEmail } from '../email';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FaMapPin, FaPhone, FaEnvelope, FaLinkedin,
  FaInstagram, FaYoutube, FaFacebook, FaXTwitter,
  FaRegClock, FaPaperPlane, FaUser, FaRegComment
} from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';

import toast from 'react-hot-toast';

const CORE_CONTACTS = [
  {
    Icon: FaMapPin,
    title: 'Main Campus',
    lines: ['84/260, Roondla Plaza, Madhyam Marg,', 'Mansarover Plaza, Near K.V.-5,', 'Jaipur (Raj.) – 302020'],
    note: 'Open Mon–Fri: 10 AM – 5 PM, Sat: 10 AM – 2 PM',
  },
  {
    Icon: FaPhone,
    title: 'Call Us',
    lines: ['+91 98284 59107'],
    href: 'tel:+919828459107',
  },
  {
    Icon: FaEnvelope,
    title: 'Email Us',
    lines: ['delejaipur@gmail.com', 'info@genesisgroups.in'],
    href: 'mailto:delejaipurofficial@gmail.com',
  },
];

const SOCIAL_CONTACTS = [
  {
    Icon: FaLinkedin,
    title: 'LinkedIn',
    lines: ['DELE Jaipur Centre'],
    href: 'https://www.linkedin.com/company/dele-jaipur-centre/posts/?feedView=all',
  },
  {
    Icon: FaInstagram,
    title: 'Instagram',
    lines: ['@delejaipur'],
    href: 'https://www.instagram.com/delejaipur?igsh=MTkxejVnazdjcXdteg==',
  },
  {
    Icon: FaYoutube,
    title: 'YouTube',
    lines: ['@delejaipurcentre'],
    href: 'https://youtube.com/@delejaipurcentre?si=gWWVGzC9vk5LBjpG',
  },
  {
    Icon: FaFacebook,
    title: 'Facebook',
    lines: ['DELE Jaipur'],
    href: 'https://www.facebook.com/share/1CGGVGzGi1/',
  },
  {
    Icon: FaXTwitter,
    title: 'X',
    lines: ['@DeleJaipur'],
    href: 'https://x.com/DeleJaipur',
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Core Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {CORE_CONTACTS.map(({ Icon, title, lines, href, note }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl border border-surface-high/80 bg-surface-lowest hover:border-primary-container/30 hover:shadow-lg transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-primary-container/10 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 hover:scale-110">
                  <Icon className="w-7 h-7 text-primary-container" />
                </div>
                <h3 className="font-display font-bold text-onSurface text-lg mb-3">{title}</h3>
                <div className="flex-1 flex flex-col justify-center gap-1 w-full">
                  {lines.map((l) =>
                    href ? (
                      <a key={l} href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-onSurfaceVariant hover:text-primary-container transition-colors flex items-center justify-center gap-1 font-medium py-0.5">
                        {l} <FiArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <p key={l} className="text-sm text-onSurfaceVariant leading-relaxed font-medium">{l}</p>
                    )
                  )}
                </div>
                {note && (
                  <div className="border-t border-surface-high/60 pt-3 w-full mt-4">
                    <p className="text-xs text-onSurfaceVariant/70 leading-relaxed font-medium">{note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Social Contacts */}
          <div className="border-t border-surface-high/60 pt-8">
            <h3 className="text-center font-display font-bold text-lg text-onSurface mb-6">Connect with us on Social Media</h3>
            <div className="flex flex-wrap gap-6 justify-center max-w-5xl mx-auto">
              {SOCIAL_CONTACTS.map(({ Icon, title, lines, href }) => (
                <div key={title} className="flex items-center gap-4 p-4 rounded-xl border border-surface-high bg-surface-lowest shadow-sm hover:shadow-md transition-all duration-200 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] min-w-[240px]">
                  <div className="w-11 h-11 bg-primary-container/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5.5 h-5.5 text-primary-container" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-onSurface text-sm mb-1">{title}</h4>
                    {lines.map((l) => (
                      <a key={l} href={href} target="_blank" rel="noopener noreferrer" className="text-xs text-onSurfaceVariant hover:text-primary-container transition-colors flex items-center gap-1">
                        {l} <FiArrowUpRight className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
                <FaRegClock className="w-5 h-5 text-primary-container" />
                <h3 className="font-display font-bold text-onSurface">Office Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ['Monday – Friday', '10:00 AM – 5:00 PM'],
                  ['Saturday', '10:00 AM – 2:00 PM'],
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
                  <FaPaperPlane className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-3">Message Received!</h3>
                <p className="text-onSurfaceVariant mb-6">Our team will respond within 24 hours. For urgent queries, email us at delejaipur@gmail.com.</p>
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
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name *" className="w-full pl-10 pr-4 py-3 bg-surface-low rounded-xl text-onSurface placeholder-onSurfaceVariant border border-surface-high focus:outline-none focus:border-primary-container text-sm transition-colors" required />
                    </div>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full pl-10 pr-4 py-3 bg-surface-low rounded-xl text-onSurface placeholder-onSurfaceVariant border border-surface-high focus:outline-none focus:border-primary-container text-sm transition-colors" />
                    </div>
                  </div>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Address *" className="w-full pl-10 pr-4 py-3 bg-surface-low rounded-xl text-onSurface placeholder-onSurfaceVariant border border-surface-high focus:outline-none focus:border-primary-container text-sm transition-colors" required />
                  </div>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="w-full px-4 py-3 bg-surface-low rounded-xl text-onSurface placeholder-onSurfaceVariant border border-surface-high focus:outline-none focus:border-primary-container text-sm transition-colors" />
                  <div className="relative">
                    <FaRegComment className="absolute left-3 top-4 w-4 h-4 text-onSurfaceVariant" />
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
                      <><FaPaperPlane className="w-4 h-4" /> Send Message</>
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
