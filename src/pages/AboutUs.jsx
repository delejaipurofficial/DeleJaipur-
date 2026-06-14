import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Award, Globe, BookOpen, Users, Target, Heart,
  MapPin, Star, CheckCircle, Briefcase, Zap, Shield
} from 'lucide-react';

/* ─── Static Data ─────────────────────────────────────────── */

const STATIC_TEAM = [
  { id: 1, name: 'Dr. Ritu Sharma', role: 'Director & DELE Examiner', imageURL: null },
  { id: 2, name: 'Carlos Mendoza', role: 'Native Spanish Trainer', imageURL: null },
  { id: 3, name: 'Marie Dupont', role: 'French Language Expert', imageURL: null },
  { id: 4, name: 'Priya Agarwal', role: 'IELTS Specialist', imageURL: null },
  { id: 5, name: 'Takashi Yamamoto', role: 'Japanese Language Trainer', imageURL: null },
  { id: 6, name: 'Hans Müller', role: 'German Language Expert', imageURL: null },
];

const milestones = [
  {
    year: '2009',
    title: 'DELE Jaipur Founded',
    text: "Rajasthan's first Foreign Language Study Centre by GENESIS Groups — introduced Spanish, French, German, Japanese, Russian, and Italian with international trainers.",
  },
  {
    year: '2012',
    title: 'IELTS Authorized Centre',
    text: "Became Rajasthan's first authorized IELTS centre, officially recognized by IDP Australia.",
  },
  {
    year: '2016',
    title: 'Instituto Cervantes Accreditation',
    text: 'Named the only accredited Study & Examination Centre for Spanish in Rajasthan, recognized by Instituto Cervantes, Madrid and the Embassy of Spain.',
  },
  {
    year: '2018+',
    title: 'Online & Global Expansion',
    text: 'First Training Institute for Foreign Languages to introduce flexible online programs with guest lectures by international trainers, fostering global student collaborations.',
  },
  {
    year: 'Today',
    title: 'Multi-Programme Excellence',
    text: 'Multiple programs combining traditional modern teaching methods, international collaborations, and cultural exchange opportunities — with offices in Jaipur & Wolverhampton, U.K.',
  },
];

const values = [
  { icon: Target, title: 'Trust & Pioneer Spirit', desc: 'Over a decade of pioneering excellence in language and professional education, setting the standard for Rajasthan and beyond.' },
  { icon: Globe, title: 'Global Exposure', desc: 'International trainers, cross-border collaborations, and programs that connect our students to the world.' },
  { icon: Heart, title: 'Student-Centric', desc: 'Personalized guidance, innovative teaching, and inspiring experiences tailored for every learner.' },
  { icon: BookOpen, title: 'Comprehensive Learning', desc: 'A one-stop solution — multiple foreign languages, IELTS, DELE examinations, and professional programmes.' },
  { icon: Zap, title: 'Flexible Learning', desc: 'Online and offline courses designed to fit every learner\'s schedule and lifestyle.' },
  { icon: Shield, title: 'Certified & Recognised', desc: 'Programs officially accredited by embassies, Instituto Cervantes, IDP Australia, and international education bodies.' },
];

const accreditations = [
  { icon: Award, title: 'Instituto Cervantes', sub: 'Only accredited Spanish Exam Centre in Rajasthan', badge: 'Since 2016' },
  { icon: Globe, title: 'IDP Australia', sub: 'Authorized IELTS Testing Centre', badge: 'Since 2012' },
  { icon: Briefcase, title: 'Embassy of Spain', sub: 'Recognised DELE Study & Exam Centre', badge: 'Official' },
  { icon: Star, title: 'GENESIS Groups', sub: 'International office in Wolverhampton, U.K.', badge: 'Global' },
];

const stats = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '5+', label: 'Foreign Languages Offered' },
  { value: '2', label: 'Global Offices (Jaipur & UK)' },
  { value: '10K+', label: 'Students Empowered' },
];

const whyUs = [
  { icon: CheckCircle, point: 'Trusted & Pioneering', detail: 'Over a decade of excellence in languages and professional education.' },
  { icon: CheckCircle, point: 'Comprehensive Learning', detail: 'A one-stop solution for multiple languages, IELTS, and professional programmes.' },
  { icon: CheckCircle, point: 'Flexible Learning', detail: 'Online and offline courses designed to fit every learner\'s schedule.' },
  { icon: CheckCircle, point: 'Global Exposure', detail: 'International trainers, collaborations, and programs that connect students worldwide.' },
  { icon: CheckCircle, point: 'Student-Centric Approach', detail: 'Personalized guidance, innovative teaching, and inspiring learning experiences.' },
];

/* ─── Animate-on-scroll hook ─────────────────────────────── */
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Sub-components ─────────────────────────────────────── */

function SectionLabel({ label }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="accent-line" />
      <p className="label-sm text-primary-container">{label}</p>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="text-center p-6">
      <p className="font-display font-extrabold text-4xl md:text-5xl text-white mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>{value}</p>
      <p className="text-white/75 text-sm font-medium">{label}</p>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function AboutUs() {
  const [team, setTeam] = useState([]);
  const [heroRef, heroVisible] = useFadeIn();
  const [missionRef, missionVisible] = useFadeIn();
  const [timelineRef, timelineVisible] = useFadeIn();
  const [valuesRef, valuesVisible] = useFadeIn();
  const [teamRef, teamVisible] = useFadeIn();
  const [whyRef, whyVisible] = useFadeIn();

  useEffect(() => {
    const fetchTeam = async () => {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, 'team'));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (data.length) setTeam(data);
      } catch {}
    };
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative pt-16 overflow-hidden">
        {/* Photo background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div
            ref={heroRef}
            className="max-w-3xl"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
          >
            <SectionLabel label="Our Story" />
            <h1 className="display-lg text-white mb-6">
              Shaping the Future of
              <span className="block" style={{ color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
                Language & Professional Education
              </span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              DELE Jaipur — a premier initiative by <strong className="text-white">GENESIS Groups</strong> — has been a trusted, pioneering, and globally recognized institution since <strong className="text-white">2009</strong>. Based in Jaipur, Rajasthan with an international office in <strong className="text-white">Wolverhampton, U.K.</strong>, we combine world-class learning with the convenience of on-premises examinations.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium backdrop-blur-sm">
                <MapPin className="w-4 h-4" /> Jaipur, Rajasthan
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium backdrop-blur-sm">
                <Globe className="w-4 h-4" /> Wolverhampton, U.K.
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-white text-sm font-medium backdrop-blur-sm">
                <Star className="w-4 h-4" /> Est. 2009
              </span>
            </div>
          </div>
        </div>

        {/* Stats band */}
        <div style={{ background: 'rgba(0,0,0,0.18)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
              {stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Introduction / Mission ───────────────────────── */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={missionRef}
            className="grid lg:grid-cols-2 gap-16 items-center"
            style={{ opacity: missionVisible ? 1 : 0, transform: missionVisible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
          >
            <div>
              <SectionLabel label="Introduction" />
              <h2 className="display-md mb-6">
                A Trusted Institution
                <span className="text-primary-container"> Since 2009</span>
              </h2>
              <p className="text-onSurfaceVariant leading-relaxed mb-5">
                DELE Jaipur offers <strong>5+ foreign languages</strong>, IELTS preparation and exam registrations, DELE Examinations, DELE Courses, and a wide range of professional courses designed for learners of all ages.
              </p>
              <p className="text-onSurfaceVariant leading-relaxed mb-5">
                Our mission is to <strong>empower students with language proficiency and professional skills</strong>, opening doors to global opportunities and fostering personal and professional growth.
              </p>
              <blockquote className="border-l-4 border-primary-container pl-5 py-3 rounded-r-xl bg-primary-light/20 mt-6">
                <p className="text-onSurface font-medium italic leading-relaxed">
                  "Our journey reflects a steadfast commitment to innovation, excellence, and global standards in education."
                </p>
              </blockquote>
            </div>

            {/* Accreditation Grid */}
            <div className="grid grid-cols-2 gap-4">
              {accreditations.map(({ icon: Icon, title, sub, badge }) => (
                <div key={title} className="card-static p-5 text-center group hover:-translate-y-1 hover:shadow-float transition-all duration-300">
                  <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-primary-light text-primary-dark text-xs font-semibold mb-2">{badge}</span>
                  <p className="font-display font-bold text-onSurface text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>{title}</p>
                  <p className="text-xs text-onSurfaceVariant mt-1 leading-snug">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Milestones Timeline ──────────────────────────── */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionLabel label="Our Journey" />
            <h2 className="display-md">Key Milestones</h2>
            <p className="text-onSurfaceVariant mt-4 max-w-xl mx-auto">
              From Rajasthan's first foreign language institute to an internationally accredited institution — here's how we grew.
            </p>
          </div>

          <div
            ref={timelineRef}
            className="relative max-w-3xl mx-auto"
            style={{ opacity: timelineVisible ? 1 : 0, transform: timelineVisible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
          >
            {/* Vertical line */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-container via-primary-light to-transparent" />
            <div className="space-y-8">
              {milestones.map(({ year, title, text }, i) => (
                <div
                  key={year}
                  className="relative flex gap-6 items-start pl-20"
                  style={{ opacity: timelineVisible ? 1 : 0, transform: timelineVisible ? 'translateX(0)' : 'translateX(-20px)', transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s` }}
                >
                  <div className="absolute left-0 w-14 h-14 hero-gradient rounded-2xl flex items-center justify-center shadow-red flex-shrink-0 border-4 border-surface-low">
                    <span className="text-white text-xs font-extrabold" style={{ fontFamily: 'Manrope, sans-serif' }}>{year.slice(0, 4)}</span>
                  </div>
                  <div className="card-static p-5 flex-1 hover:-translate-y-0.5 hover:shadow-float transition-all duration-300">
                    <p className="label-sm text-primary-container mb-1">{year}</p>
                    <h3 className="font-display font-bold text-onSurface mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{title}</h3>
                    <p className="text-sm text-onSurfaceVariant leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ──────────────────────────────────── */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionLabel label="Our Values" />
            <h2 className="display-md">What We Stand For</h2>
          </div>
          <div
            ref={valuesRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ opacity: valuesVisible ? 1 : 0, transform: valuesVisible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
          >
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="card p-7 group"
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <div className="w-12 h-12 hero-gradient rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-onSurface mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{title}</h3>
                <p className="text-sm text-onSurfaceVariant leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Team ─────────────────────────────────────── */}
      <section className="py-24 bg-surface-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionLabel label="The Faculty" />
            <h2 className="display-md">Meet Our Team</h2>
            <p className="text-onSurfaceVariant mt-4 max-w-2xl mx-auto">
              Our team comprises highly experienced professionals and international trainers, dedicated to delivering lessons in a comfortable, engaging, and effective way. Each trainer brings expertise, passion, and authentic cultural insight.
            </p>
          </div>
          <div
            ref={teamRef}
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-8"
            style={{ opacity: teamVisible ? 1 : 0, transform: teamVisible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
          >
            {team.map((member, i) => (
              <div
                key={member.id}
                className="card p-7 text-center group"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                {member.imageURL ? (
                  <img
                    src={member.imageURL}
                    alt={member.name}
                    className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-primary-light/50"
                  />
                ) : (
                  <div className="w-24 h-24 hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold group-hover:scale-105 transition-transform duration-300" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {member.name?.charAt(0)}
                  </div>
                )}
                <h3 className="font-display font-bold text-onSurface" style={{ fontFamily: 'Manrope, sans-serif' }}>{member.name}</h3>
                <p className="text-sm text-onSurfaceVariant mt-1">{member.role}</p>
                <div className="mt-4 h-0.5 w-10 bg-primary-container rounded mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collaborations ────────────────────────────────── */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel label="Global Network" />
              <h2 className="display-md mb-6">
                Collaborations &
                <span className="text-primary-container"> Global Partnerships</span>
              </h2>
              <p className="text-onSurfaceVariant leading-relaxed mb-5">
                DELE Jaipur partners with leading international institutions and organizations, providing students with opportunities for global internships, cultural exchange programs, and internationally recognized certifications.
              </p>
              <p className="text-onSurfaceVariant leading-relaxed">
                Our strong network enables learners to gain <strong>practical exposure, real-world experience</strong>, and a global perspective — preparing them for international careers and ensuring world-class training beyond the classroom.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Global Internships', icon: Briefcase, desc: 'Real-world professional experience abroad.' },
                { label: 'Cultural Exchange', icon: Globe, desc: 'Study and immerse in authentic language cultures.' },
                { label: 'Intl Certifications', icon: Award, desc: 'Globally recognised credentials and diplomas.' },
                { label: 'Guest Lectures', icon: Users, desc: 'Live sessions with international trainers.' },
              ].map(({ label, icon: Icon, desc }) => (
                <div key={label} className="card-static p-5 hover:-translate-y-1 hover:shadow-float transition-all duration-300 group">
                  <div className="w-10 h-10 hero-gradient rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-display font-bold text-onSurface text-sm mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>{label}</p>
                  <p className="text-xs text-onSurfaceVariant leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Us ────────────────────────────────────────── */}
      <section
        ref={whyRef}
        className="py-24 hero-gradient relative overflow-hidden"
        style={{ opacity: whyVisible ? 1 : 0, transition: 'opacity 0.7s ease' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'320px', height:'320px', borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
          <div style={{ position:'absolute', bottom:'-40px', left:'10%', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-1 w-12 rounded-full bg-white/40" />
              <p className="label-sm text-white/70">Our Edge</p>
            </div>
            <h2 className="display-md text-white">Why Choose DELE Jaipur?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map(({ icon: Icon, point, detail }, i) => (
              <div
                key={point}
                className="flex gap-4 items-start rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', opacity: whyVisible ? 1 : 0, transform: whyVisible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-white mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>{point}</p>
                  <p className="text-white/75 text-sm leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
