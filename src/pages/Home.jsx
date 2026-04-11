import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ArrowRight, Award, Globe, Users, Zap, Shield,
  ChevronLeft, ChevronRight, Star,
  CheckCircle, Quote
} from 'lucide-react';

// ─── Hero Carousel Slides ────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80',
    tag: "Rajasthan's #1 Language Institute",
    headline: ["Master the World's", 'Living Dialects.'],
    highlight: 1, // which line to highlight in red
    sub: "Official DELE, DELF & IELTS preparation by native trainers. Jaipur's first institute for 5+ foreign languages since 2009.",
  },
  {
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&auto=format&fit=crop&q=80',
    tag: 'Expert Faculty · Native Trainers',
    headline: ['Learn a Language,', 'Open Every Door.'],
    highlight: 1,
    sub: 'Taught by experienced native speakers and certified international educators with proven pedagogical methods.',
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80',
    tag: 'Global Certifications',
    headline: ['Internationally', 'Recognized Diplomas.'],
    highlight: 1,
    sub: 'Instituto Cervantes, Alliance Française & IDP-authorized certifications. Your credential, globally trusted.',
  },
  {
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1600&auto=format&fit=crop&q=80',
    tag: 'Internships in Spain & UK',
    headline: ['Your Gateway to', 'Global Exposure.'],
    highlight: 1,
    sub: 'Exclusive international internships, student exchanges, and cultural immersion programs across Europe.',
  },
];

// ─── Static data ─────────────────────────────────────────────────────────────
const STATIC_TESTIMONIALS = [
  {
    id: 1,
    quote: 'The intensity and quality of instruction at Delejaipur is remarkable. I managed to reach a confident level in English in just 4 weeks. The faculty understands the nuances of cross-cultural communication perfectly.',
    studentName: 'Jenya Evegini',
    country: 'Russia',
    track: 'IELTS Track',
    imageURL: null,
  },
  {
    id: 2,
    quote: 'Passing my IELTS with a band score of 8.0 was a goal I thought was out of reach. The structured practice tests at Delejaipur made all the difference.',
    studentName: 'Priya Sharma',
    country: 'India',
    track: 'IELTS Academy',
    imageURL: null,
  },
  {
    id: 3,
    quote: 'The French DELF preparation here is exceptional. Native-level instructors, real exam simulations, and genuine cultural immersion. Truly world-class.',
    studentName: 'Aditya Kumar',
    country: 'India',
    track: 'DELF Track',
    imageURL: null,
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Innovative Online Training',
    desc: 'Flexible sessions designed for professionals and global students, featuring guest lectures by international trainers.',
  },
  {
    icon: Globe,
    title: 'Global Partners',
    desc: 'Endorsed by Instituto Cervantes, Alliance Française, and IDP Education — your credentials are recognized worldwide.',
  },
];

const SKILLED_FACULTY_AVATARS = ['A', 'P', 'M', 'S'];

// Static placeholder for courses is removed so live database strictly rules

const PARTNER_LOGOS = [
  { name: 'Partner 1', src: '/1.png' },
  { name: 'Partner 2', src: '/2.png' },
  { name: 'Partner 3', src: '/3.jpg' },
  { name: 'Partner 4', src: '/4.gif' },
  { name: 'Partner 5', src: '/5.png' },
  { name: 'Partner 6', src: '/6.png' },
];

// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState(STATIC_TESTIMONIALS);
  const [loading, setLoading] = useState(true);

  // Hero carousel state
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroAnimating, setHeroAnimating] = useState(false);

  // Testimonial carousel state
  const [testIdx, setTestIdx] = useState(0);

  // ── Data fetch ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        setCourses([]);
        setLoading(false);
        return;
      }
      try {
        const cSnap = await getDocs(
          query(collection(db, 'courses'), where('status', '==', 'active'), limit(4))
        );
        const fetched = cSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCourses(fetched);

        const tSnap = await getDocs(
          query(collection(db, 'testimonials'), where('status', '==', 'approved'))
        );
        const fetchedT = tSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (fetchedT.length > 0) setTestimonials(fetchedT);
      } catch {
        // failed to fetch courses
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Auto-advance hero carousel ───────────────────────────────────────────
  const goToHero = useCallback((idx) => {
    if (heroAnimating) return;
    setHeroAnimating(true);
    setTimeout(() => {
      setHeroIdx(idx);
      setHeroAnimating(false);
    }, 400);
  }, [heroAnimating]);

  useEffect(() => {
    const timer = setInterval(() => {
      goToHero((heroIdx + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroIdx, goToHero]);

  const prevHero = () => goToHero((heroIdx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextHero = () => goToHero((heroIdx + 1) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[heroIdx];

  // ── Testimonial helpers ──────────────────────────────────────────────────
  const prevTest = () => setTestIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const nextTest = () => setTestIdx((i) => (i + 1) % testimonials.length);
  const currentT = testimonials[testIdx];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ══════════════ HERO CAROUSEL ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ height: 'min(90vh, 100svh)', minHeight: '360px' }}>
        {/* Background image */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${heroAnimating ? 'opacity-0' : 'opacity-100'}`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

        {/* Left / Right arrows — hidden on small mobile, visible from sm */}
        <button
          id="hero-prev-btn"
          onClick={prevHero}
          aria-label="Previous slide"
          className="hidden sm:flex absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm items-center justify-center transition-all duration-200 border border-white/30"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
        <button
          id="hero-next-btn"
          onClick={nextHero}
          aria-label="Next slide"
          className="hidden sm:flex absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm items-center justify-center transition-all duration-200 border border-white/30"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full pt-16 pb-16">
          <div className={`max-w-2xl transition-all duration-500 ${heroAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-primary-container/90 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-4 sm:mb-6">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" />
              <span className="text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{slide.tag}</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold leading-tight mb-4 sm:mb-6" style={{ fontSize: 'clamp(1.6rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}>
              {slide.headline.map((line, i) => (
                <span key={i} className={`block ${i === slide.highlight ? 'text-primary-container' : 'text-white'}`}>
                  {line}
                </span>
              ))}
            </h1>

            <p className="text-white/80 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-10 max-w-xl">{slide.sub}</p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/courses"
                id="hero-enroll-btn"
                className="inline-flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 bg-primary-container text-white font-bold rounded-xl hover:bg-primary transition-all duration-300 hover:-translate-y-0.5 shadow-lg uppercase text-xs sm:text-sm tracking-wide"
              >
                Enroll Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/25 transition-all duration-300 border border-white/30 uppercase text-xs sm:text-sm tracking-wide"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToHero(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${i === heroIdx ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-primary-container' : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </section>

      {/* ══════════════ ACCREDITATION STRIP ═══════════════════════════════════ */}
      <section className="bg-surface-lowest shadow-sm py-4 sm:py-5 border-b border-surface-high">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm">
            {[
              { icon: Shield, text: 'Official Spanish Center', sub: 'Accredited by Instituto Cervantes & Embassy of Spain' },
              { icon: Award, text: 'Authorized IELTS Center', sub: 'Recognized by IDP Education since 2012' },
              { icon: Star, text: 'Genesis Group', sub: 'Premium Education Since 2009' },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-container/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-container" />
                </div>
                <div>
                  <p className="font-semibold text-onSurface text-sm">{text}</p>
                  <p className="text-xs text-onSurfaceVariant">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ ABOUT / INTRO ══════════════════════════════════════════ */}
      <section className="py-14 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="accent-line mb-4" />
              <p className="label-sm text-primary-container mb-3">Who We Are</p>
              <h2 className="display-md mb-5">
                Jaipur's First Institute for{' '}
                <span className="text-primary-container">Global Excellence</span>
              </h2>
              <p className="text-onSurfaceVariant text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                Since 2009, Delejaipur has been at the forefront of linguistic education. As Jaipur's first institute offering 5+ foreign languages and Rajasthan's first authorized IELTS Centre, we provide an academic bridge between India and the world.
              </p>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  'Official Spanish Center – Accredited by Instituto Cervantes & Embassy of Spain',
                  'Authorized IELTS Center – Recognized by IDP Education since 2012',
                  '15+ years of world-class language scholarship',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-container flex-shrink-0 mt-0.5" />
                    <span className="text-onSurface text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link to="/courses" className="btn-primary">Explore Programs <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/about" className="btn-ghost">Learn More</Link>
              </div>
            </div>

            {/* Right – image with badge */}
            <div className="relative mt-6 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=900&auto=format&fit=crop&q=80"
                alt="Students studying at Delejaipur"
                className="w-full h-64 sm:h-80 lg:h-[480px] object-cover rounded-2xl shadow-float"
              />
              {/* Badge overlay */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-primary-container text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl shadow-lg">
                <p className="font-display font-extrabold text-xl sm:text-2xl leading-none">15+</p>
                <p className="text-white/80 text-xs mt-1 uppercase tracking-wider">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ WHY CHOOSE US ══════════════════════════════════════════ */}
      <section className="py-14 sm:py-24 bg-surface-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <div className="accent-line mx-auto mb-4" />
            <p className="label-sm text-primary-container mb-3">Why Choose Delejaipur?</p>
            <h2 className="display-md mx-auto max-w-2xl">
              Elevating the Standard of{' '}
              <span className="text-primary-container">Language Education</span>
            </h2>
          </div>

          {/* Grid: 2 feature cards + 1 large Skilled Faculty card */}
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {/* Feature cards */}
            <div className="md:col-span-2 grid grid-rows-2 gap-4 sm:gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card p-5 sm:p-8 flex gap-4 sm:gap-6 items-start">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-container/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-container" />
                  </div>
                  <div>
                    <h3 className="headline-md text-base sm:text-lg mb-1 sm:mb-2">{title}</h3>
                    <p className="text-onSurfaceVariant text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Skilled Faculty — bold red card */}
            <div className="hero-gradient rounded-2xl p-6 sm:p-8 flex flex-col justify-between text-white shadow-float">
              <div>
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white/80 mb-3 sm:mb-4" />
                <h3 className="font-display font-bold text-xl sm:text-2xl mb-2 sm:mb-3">Skilled Faculty</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Learn from native speakers and international trainers with years of professional pedagogical experience.
                </p>
              </div>
              {/* Avatar row */}
              <div className="mt-6 sm:mt-8 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {SKILLED_FACULTY_AVATARS.map((l, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/30 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <span className="text-white/70 text-xs ml-2">+20 Experts</span>
              </div>
            </div>
          </div>

          {/* Language chips */}
          <div className="mt-8 sm:mt-10 flex flex-wrap gap-2 sm:gap-3 justify-center">
            {['Speak Spanish', 'Speak French', 'Speak English', 'Speak Japanese', 'Speak German', 'Speak Italian'].map((lang) => (
              <span key={lang} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-surface-lowest border border-surface-high text-xs sm:text-sm text-onSurfaceVariant font-medium hover:border-primary-container hover:text-primary-container transition-colors cursor-pointer">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ ELITE LANGUAGE PROGRAMS ═══════════════════════════════ */}
      <section className="py-14 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
            <div>
              <div className="accent-line mb-4" />
              <p className="label-sm text-primary-container mb-3">Our Programs</p>
              <h2 className="display-md">
                Elite Language <span className="text-primary-container">Programs</span>
              </h2>
            </div>
            <Link to="/courses" className="btn-ghost flex-shrink-0">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card-static h-64 sm:h-80 animate-pulse bg-surface-high" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl shadow-card">
              <p className="text-onSurfaceVariant">Courses are being updated. Please check back shortly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {courses.map((course) => (
                <CourseCardLandmark key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ PARTNERS STRIP ════════════════════════════════════════ */}
      <section className="py-10 bg-surface-low overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slide_ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            display: flex;
            width: max-content;
            animation: slide_ticker 25s linear infinite;
          }
          .ticker-track:hover {
            animation-play-state: paused;
          }
        `}} />
        <div className="w-full">
          <p className="label-sm text-center text-onSurfaceVariant mb-8">Global Partners &amp; Endorsed By</p>
          <div className="relative overflow-hidden w-full">
            <div className="ticker-track">
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((partner, i) => (
                <div key={i} className="mx-4 px-6 py-4 bg-surface-lowest rounded-xl border border-surface-high flex items-center justify-center w-[200px] flex-shrink-0 h-24 hover:shadow-md transition-shadow">
                  <img src={partner.src} alt={partner.name} className="max-h-16 max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SCHOLAR JOURNEYS (Testimonials) ════════════════════════ */}
      <section className="py-14 sm:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12">
            <div className="accent-line mb-4" />
            <p className="label-sm text-primary-container mb-3">Student Stories</p>
            <h2 className="display-md">
              Scholar <span className="text-primary-container border-b-4 border-primary-container pb-1">Journeys</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Testimonial text */}
            <div className="relative">
              <Quote className="w-12 h-12 sm:w-16 sm:h-16 text-primary-container/20 mb-3 sm:mb-4" />
              <blockquote className="text-onSurface text-base sm:text-xl font-medium leading-relaxed mb-6 sm:mb-8 italic">
                "{currentT.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                {currentT.imageURL ? (
                  <img src={currentT.imageURL} alt={currentT.studentName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-surface-high" />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-container/20 flex items-center justify-center">
                    <span className="font-display font-bold text-primary-container text-base sm:text-lg">
                      {currentT.studentName[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-display font-bold text-onSurface">{currentT.studentName}</p>
                  <p className="text-sm text-onSurfaceVariant">{currentT.country} · {currentT.track}</p>
                </div>
              </div>
              {/* Navigation */}
              <div className="flex items-center gap-4 mt-6 sm:mt-8">
                <button onClick={prevTest} id="test-prev-btn" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-surface-high flex items-center justify-center hover:bg-primary-container hover:border-primary-container hover:text-white transition-all">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestIdx(i)}
                      className={`rounded-full transition-all duration-300 ${i === testIdx ? 'w-5 sm:w-6 h-2 sm:h-2.5 bg-primary-container' : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-surface-high'}`}
                    />
                  ))}
                </div>
                <button onClick={nextTest} id="test-next-btn" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-surface-high flex items-center justify-center hover:bg-primary-container hover:border-primary-container hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Illustration image — hidden on small screens */}
            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                alt="Students collaborating"
                className="w-full h-52 sm:h-80 object-cover rounded-2xl shadow-float"
              />
              <div className="absolute inset-0 hero-gradient opacity-10 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ QUOTE BAND ═════════════════════════════════════════════ */}
      <section className="hero-gradient py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-white/30 mx-auto mb-4" />
          <blockquote className="font-display font-bold text-white text-xl sm:text-2xl md:text-3xl leading-tight mb-4">
            "One language sets you in a corridor for life. Two languages open every door along the way."
          </blockquote>
          <p className="text-white/70 text-xs sm:text-sm uppercase tracking-widest">— Frank Smith</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─── Landmark Course Card (inline, used only in Home) ─────────────────────────
function CourseCardLandmark({ course }) {
  const img = course.imageURL || `https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&auto=format&fit=crop&q=80`;
  const badge = course.badge;

  return (
    <div className="card group overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden rounded-t-2xl">
        <img
          src={img}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary-container text-white">
              {badge}
            </span>
          </div>
        )}
        {/* Subtitle on image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-display font-bold text-sm">{course.subtitle || course.level}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-onSurface text-base mb-1 group-hover:text-primary-container transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-onSurfaceVariant line-clamp-2 mb-4 flex-1">{course.description}</p>
        <Link
          to={`/courses/${course.id}`}
          className="text-primary-container text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-200"
        >
          Enroll Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
