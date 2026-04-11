import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ArrowLeft, BookOpen, Clock, Award, ChevronDown, ChevronUp,
  CheckCircle, Phone, MessageCircle, Star, Users, Calendar, ArrowRight
} from 'lucide-react';

const COURSE_IMAGES = {
  // Legacy IDs
  'spanish-dele': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80',
  'french-delf': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
  'ielts-academy': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&auto=format&fit=crop&q=80',
  'japanese': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&auto=format&fit=crop&q=80',
  'german': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&auto=format&fit=crop&q=80',
  'italian': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1200&auto=format&fit=crop&q=80',
  // New per-level adult IDs
  'spanish-dele-a1': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&auto=format&fit=crop&q=80',
  'spanish-dele-a2': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&auto=format&fit=crop&q=80',
  'spanish-dele-b1': 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=1200&auto=format&fit=crop&q=80',
  'spanish-dele-b2': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
  'spanish-dele-c1': 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=1200&auto=format&fit=crop&q=80',
  'spanish-dele-c2': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop&q=80',
  // New per-level young learner IDs
  'spanish-dele-a1-young': 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80',
  'spanish-dele-a2b1-young': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
};

// Shared highlights / curriculum for all DELE courses
const DELE_HIGHLIGHTS = [
  'Official DELE diploma issued by Instituto Cervantes',
  'Native Spanish-speaking instructors',
  'Study materials included',
  'Practice tests & mock exams',
  'Cultural immersion activities',
  'Exam registration support',
  'Small batch sizes (max 12 students)',
  'Online & offline batch options',
];

const STATIC_COURSES = {
  // ── Legacy IDs (kept for backward compatibility) ──────────────────────────
  'spanish-dele': {
    title: 'Spanish (DELE)',
    subtitle: 'A1 – C2 · All Levels',
    level: 'All Levels',
    duration: '3–12 months',
    batchSize: 'Max 12 students',
    certificate: 'Instituto Cervantes (Ministry of Spain)',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'Official DELE diplomas (A1–C2) issued by Instituto Cervantes on behalf of the Spanish Ministry of Education. Covers all four skills: reading, writing, listening, and speaking — led by native trainers.',
    highlights: DELE_HIGHLIGHTS,
    curriculum: ['A1–A2 Foundation: Greetings, basic grammar, everyday vocabulary', 'B1 Intermediate: Complex sentences, narration, common topics', 'B2 Upper-Intermediate: Argumentation, nuanced expression', 'C1 Advanced: Abstract topics, professional communication', 'C2 Mastery: Near-native fluency, cultural nuance', 'Exam Simulation & Mock Tests', 'Oral Practice with Native Speakers'],
    instructorQuote: 'Linguistics is more than grammar — it is the architecture of human thought.',
    instructorName: 'Elena Rodriguez',
    instructorRole: 'Head of Hispanic Studies',
    status: 'active',
  },
  'french-delf': {
    title: 'French (DELF)',
    subtitle: 'A1 – B2 · All Levels',
    level: 'All Levels',
    duration: '3–12 months',
    batchSize: 'Max 12 students',
    certificate: 'French Ministry of National Education',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'Preparation for official DELF/DALF diplomas awarded by the French Ministry of National Education. Taught by expert native trainers with cultural immersion.',
    highlights: ['Official DELF/DALF certification', 'Native French instructors', 'Cultural immersion sessions', 'Mock exams included', 'Flexible timings', 'Alliance Française partnership'],
    curriculum: ['A1–A2: Basic communication and everyday French', 'B1: Independent communication on familiar topics', 'B2: Complex topics, abstract arguments', 'Written Expression Workshops', 'Oral Production & Comprehension'],
    instructorQuote: 'French is not just a language — it is a way of seeing the world with elegance and precision.',
    instructorName: 'Marie Dubois',
    instructorRole: 'Director of French Studies',
    status: 'active',
  },
  'ielts-academy': {
    title: 'IELTS Academy',
    subtitle: 'Band 5 – 9 · Intermediate',
    level: 'Intermediate',
    duration: '1–3 months',
    batchSize: 'Max 15 students',
    certificate: 'British Council / IDP Authorized',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: "Rajasthan's first authorized IELTS center. Comprehensive coaching for both Academic and General Training modules with intensive mock tests and personalized feedback.",
    highlights: ['IDP Authorized center', 'Personalized band score strategy', 'Full mock tests weekly', 'Expert assessors', 'Both Academic & General Training', 'Score improvement guarantee'],
    curriculum: ['Reading: Skimming, scanning & comprehension', 'Writing Task 1: Data interpretation & graph description', 'Writing Task 2: Essay structure and argumentation', 'Listening: Multi-accent audio comprehension', 'Speaking: Structured practice with assessors', 'Full Mock Tests (Academic & General)'],
    instructorQuote: 'Achieving a high IELTS band is not about luck — it is about strategy, practice, and understanding exactly what the examiner expects.',
    instructorName: 'Dr. Priya Mehta',
    instructorRole: 'Head of English Programs',
    status: 'active',
  },

  // ── New adult DELE courses (A1 – C2) ─────────────────────────────────────
  'spanish-dele-a1': {
    title: 'Spanish DELE – A1',
    subtitle: 'Beginner · Adult (18+)',
    level: 'A1 Beginner',
    duration: '2–3 months',
    batchSize: 'Max 12 students',
    certificate: 'DELE A1 — Instituto Cervantes',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'Build your first solid foundation in Spanish grammar, vocabulary and spoken interaction. Ideal for absolute beginners seeking the official DELE A1 diploma issued by Instituto Cervantes on behalf of the Spanish Ministry of Education.',
    highlights: DELE_HIGHLIGHTS,
    curriculum: ['Basic greetings & introductions', 'Numbers, dates and time', 'Everyday vocabulary: food, family, shopping', 'Present tense verb conjugation', 'Simple question & answer practice', 'Listening & reading comprehension at A1 level', 'Mock DELE A1 exam'],
    instructorQuote: 'Every great linguist began with a single word. Let yours be the first.',
    instructorName: 'Elena Rodriguez',
    instructorRole: 'Head of Hispanic Studies',
    status: 'active',
  },
  'spanish-dele-a2': {
    title: 'Spanish DELE – A2',
    subtitle: 'Elementary · Adult (18+)',
    level: 'A2 Elementary',
    duration: '2–3 months',
    batchSize: 'Max 12 students',
    certificate: 'DELE A2 — Instituto Cervantes',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'Expand your conversational skills and reading comprehension. Prepares you for the DELE A2 diploma, enabling you to communicate in simple, routine situations requiring a direct exchange of information.',
    highlights: DELE_HIGHLIGHTS,
    curriculum: ['Past & future tenses', 'Describing people, places and routines', 'Expressing likes, dislikes and preferences', 'Reading short texts and notices', 'Listening to short dialogues', 'Writing simple letters and messages', 'Mock DELE A2 exam'],
    instructorQuote: 'At A2, the world of Spanish begins to open up. You start to truly listen.',
    instructorName: 'Elena Rodriguez',
    instructorRole: 'Head of Hispanic Studies',
    status: 'active',
  },
  'spanish-dele-b1': {
    title: 'Spanish DELE – B1',
    subtitle: 'Intermediate · Adult (18+)',
    level: 'B1 Intermediate',
    duration: '3–4 months',
    batchSize: 'Max 12 students',
    certificate: 'DELE B1 — Instituto Cervantes',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'Achieve independent use of Spanish. Target the DELE B1 diploma for students who can handle most situations likely to arise while traveling in a Spanish-speaking country.',
    highlights: DELE_HIGHLIGHTS,
    curriculum: ['Narrating events in past, present and future', 'Expressing opinions, agreement and disagreement', 'Understanding main points of clear standard input', 'Writing simple connected texts on familiar topics', 'Participating in conversations on familiar topics', 'Subjunctive mood introduction', 'Mock DELE B1 exam'],
    instructorQuote: 'B1 is the turning point — you stop translating and start thinking in Spanish.',
    instructorName: 'Elena Rodriguez',
    instructorRole: 'Head of Hispanic Studies',
    status: 'active',
  },
  'spanish-dele-b2': {
    title: 'Spanish DELE – B2',
    subtitle: 'Upper-Intermediate · Adult (18+)',
    level: 'B2 Upper-Intermediate',
    duration: '3–5 months',
    batchSize: 'Max 12 students',
    certificate: 'DELE B2 — Instituto Cervantes',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'Communicate fluently and spontaneously with native speakers on complex topics. The DELE B2 is widely accepted by European universities and professional institutions.',
    highlights: DELE_HIGHLIGHTS,
    curriculum: ['Complex grammatical structures & subjunctive', 'Academic and formal writing', 'Argumentation and debate techniques', 'Understanding extended speech and complex texts', 'Expressing nuance and degree of certainty', 'Cultural and idiomatic language', 'Mock DELE B2 exam'],
    instructorQuote: 'B2 is where students surprise themselves — fluency feels natural for the first time.',
    instructorName: 'Elena Rodriguez',
    instructorRole: 'Head of Hispanic Studies',
    status: 'active',
  },
  'spanish-dele-c1': {
    title: 'Spanish DELE – C1',
    subtitle: 'Advanced · Adult (18+)',
    level: 'C1 Advanced',
    duration: '4–6 months',
    batchSize: 'Max 12 students',
    certificate: 'DELE C1 — Instituto Cervantes',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'Master nuanced, fluent Spanish for academic and professional contexts. The DELE C1 is recognised by top universities and employers across the Spanish-speaking world and beyond.',
    highlights: DELE_HIGHLIGHTS,
    curriculum: ['Advanced grammar: Conditional & subjunctive mastery', 'Academic writing: Reports, essays & formal correspondence', 'Complex listening: Structured discussions and debates', 'Reading literary and specialised texts', 'Spoken fluency in professional and academic settings', 'Register and style variation', 'Mock DELE C1 exam'],
    instructorQuote: 'C1 speakers wield Spanish as a precision instrument — every word chosen with intent.',
    instructorName: 'Elena Rodriguez',
    instructorRole: 'Head of Hispanic Studies',
    status: 'active',
  },
  'spanish-dele-c2': {
    title: 'Spanish DELE – C2',
    subtitle: 'Mastery · Adult (18+)',
    level: 'C2 Mastery',
    duration: '5–8 months',
    batchSize: 'Max 10 students',
    certificate: 'DELE C2 — Instituto Cervantes',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'Achieve complete Spanish mastery. The DELE C2 is the highest certification recognised worldwide by academic institutions, government bodies and international organisations.',
    highlights: DELE_HIGHLIGHTS,
    curriculum: ['Near-native fluency in all four skills', 'Literary and critical text analysis', 'Spontaneous, precise oral expression', 'Writing complex reports, summaries and critiques', 'Idiomatic and cultural nuance mastery', 'Debate and advanced argumentation', 'Mock DELE C2 exam'],
    instructorQuote: 'At C2, the language becomes a home — you inhabit it, not just speak it.',
    instructorName: 'Elena Rodriguez',
    instructorRole: 'Head of Hispanic Studies',
    status: 'active',
  },

  // ── Young Learner DELE courses ────────────────────────────────────────────
  'spanish-dele-a1-young': {
    title: 'Spanish DELE – A1 (Young Learners)',
    subtitle: 'Beginner · Ages 11–17',
    level: 'A1 Beginner',
    duration: '2–3 months',
    batchSize: 'Max 12 students',
    certificate: 'DELE A1 — Instituto Cervantes (Young Learners)',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'A fun, age-appropriate introduction to Spanish designed specifically for teenagers aged 11–17. Develops reading, writing, listening and speaking skills at DELE A1 level through interactive activities and engaging content.',
    highlights: [
      'Specially designed for ages 11–17',
      'Fun, interactive learning activities',
      'Official DELE A1 diploma',
      'Native speaker instructors',
      'Small, supportive batch environment',
      'Study materials included',
      'Mock exam preparation',
      'Cultural immersion tailored for youth',
    ],
    curriculum: ['Basic introductions and greetings', 'Numbers, colours, days and months', 'My family, home and school', 'Shopping and everyday activities', 'Simple conversations and role-play', 'Listening exercises at A1 level', 'Mock DELE A1 for Young Learners exam'],
    instructorQuote: 'Young minds absorb languages like sponges — our job is to make the experience joyful.',
    instructorName: 'Elena Rodriguez',
    instructorRole: 'Young Learners Program Lead',
    status: 'active',
  },
  'spanish-dele-a2b1-young': {
    title: 'Spanish DELE – A2/B1 (Young Learners)',
    subtitle: 'Elementary–Intermediate · Ages 11–17',
    level: 'A2 / B1',
    duration: '3–5 months',
    batchSize: 'Max 12 students',
    certificate: 'DELE A2/B1 — Instituto Cervantes (Young Learners)',
    mode: 'Online & Offline', // nextCohort: 'Ongoing batches',
    description: 'Designed for young learners who have already achieved A1 or are ready to progress. Covers communication strategies and cultural awareness at the A2/B1 level, preparing students for the combined DELE A2/B1 for Scholares diploma.',
    highlights: [
      'Designed for ages 11–17 with prior A1 exposure',
      'DELE A2/B1 "Escolares" diploma',
      'Native speaker instructors',
      'Engaging real-world language tasks',
      'Critical thinking & communication skills',
      'Study materials included',
      'Mock exam preparation',
      'Online & offline batch options',
    ],
    curriculum: ['Describing experiences and events', 'Giving and understanding directions', 'Expressing opinions on familiar topics', 'Reading and understanding short stories', 'Writing short essays and messages', 'Listening to dialogues and media clips', 'Mock DELE A2/B1 for Scholares exam'],
    instructorQuote: 'At A2/B1, young learners discover they can truly express themselves in another language — it transforms their confidence.',
    instructorName: 'Elena Rodriguez',
    instructorRole: 'Young Learners Program Lead',
    status: 'active',
  },
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModule, setOpenModule] = useState(0);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handler = () => setSticky(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!db) { setCourse(STATIC_COURSES[courseId] || null); setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, 'courses', courseId));
        if (snap.exists()) setCourse({ id: snap.id, ...snap.data() });
        else setCourse(STATIC_COURSES[courseId] || null);
      } catch {
        setCourse(STATIC_COURSES[courseId] || null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-12 h-12 hero-gradient rounded-2xl animate-pulse" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 p-8">
      <BookOpen className="w-16 h-16 text-surface-dim" />
      <h2 className="font-display font-bold text-2xl">Course Not Found</h2>
      <p className="text-onSurfaceVariant">This course may not exist or has been removed.</p>
      <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-white font-bold rounded-xl hover:bg-primary transition-colors">
        ← All Courses
      </Link>
    </div>
  );

  const heroImg = course.imageURL || COURSE_IMAGES[courseId] || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative h-48 sm:h-72 md:h-[420px] overflow-hidden">
        <img src={heroImg} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="absolute top-20 left-4 sm:left-8">
          <Link to="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <ArrowLeft className="w-4 h-4" /> All Courses
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 bg-primary-container text-white text-xs font-bold rounded-full uppercase tracking-wide">Now Enrolling</span>
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full border border-white/20">{course.level}</span>
            </div>
            <h1 className="font-display font-extrabold text-white mb-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
              {course.title}
            </h1>
            <p className="text-white/70 text-sm">{course.subtitle}</p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-10">

          {/* Main */}
          <div className="lg:col-span-2 space-y-10">

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { Icon: Clock, label: 'Duration', value: course.duration || '3 months' },
                { Icon: Users, label: 'Batch Size', value: course.batchSize || 'Max 12' },
                { Icon: Award, label: 'Certificate', value: 'Internationally Recognized' },
                { Icon: Calendar, label: 'Mode', value: course.mode || 'Online & Offline' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-card">
                  <Icon className="w-5 h-5 text-primary-container mx-auto mb-2" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-onSurfaceVariant mb-1">{label}</p>
                  <p className="text-xs font-bold text-onSurface leading-tight">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display font-bold text-2xl mb-4">About This Course</h2>
              <p className="text-onSurfaceVariant leading-relaxed text-base">{course.description}</p>
            </div>

            {/* What you'll get */}
            <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-card">
              <h2 className="font-display font-bold text-xl sm:text-2xl mb-4 sm:mb-6">What You'll Get</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {(course.highlights || [
                  'Official certification pathway', 'Native speaker instructors',
                  'Study materials included', 'Practice tests & mock exams',
                  'Cultural immersion activities', 'Small batch sizes (max 12)',
                ]).map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-container flex-shrink-0" />
                    <span className="text-sm text-onSurface">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules / Curriculum */}
            {(course.modules?.length > 0 || course.curriculum?.length > 0) && (
              <div>
                <h2 className="font-display font-bold text-2xl mb-6">Course Modules</h2>
                <div className="space-y-3">
                  {(course.modules || course.curriculum.map(c => ({ name: c }))).map((item, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setOpenModule(openModule === i ? null : i)}
                        className="w-full flex items-center justify-between p-4 bg-white rounded-xl hover:bg-surface-low transition-colors text-left shadow-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 hero-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{i + 1}</span>
                          </div>
                          <span className="font-medium text-onSurface text-sm">
                            {item.name?.split(':')[0] || item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {item.hours && (
                            <span className="text-xs text-onSurfaceVariant font-medium bg-surface-high px-2 py-1 rounded-md hidden sm:inline-block">
                              {item.hours} hrs
                            </span>
                          )}
                          {item.price && (
                            <span className="text-xs text-primary-container font-bold bg-primary-light/10 px-2 py-1 rounded-md">
                              ₹{Number(item.price).toLocaleString('en-IN')}
                            </span>
                          )}
                          {openModule === i
                            ? <ChevronUp className="w-4 h-4 text-onSurfaceVariant flex-shrink-0" />
                            : <ChevronDown className="w-4 h-4 text-onSurfaceVariant flex-shrink-0" />
                          }
                        </div>
                      </button>
                      {openModule === i && item.name?.includes(':') && (
                        <div className="px-4 py-3 bg-surface-low rounded-b-xl text-sm text-onSurfaceVariant border-t border-surface-high">
                          {item.name.split(':')[1]?.trim()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor quote */}
            {(course.instructorQuote || course.instructorName) && (
              <div className="hero-gradient rounded-2xl p-5 sm:p-8 text-white">
                <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-2">{course.instructorRole}</p>
                <blockquote className="text-lg italic font-medium leading-relaxed mb-4">
                  "{course.instructorQuote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {course.instructorName?.[0]}
                  </div>
                  <div>
                    <p className="font-display font-bold text-white text-sm">{course.instructorName}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-300 fill-yellow-300" />)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`transition-all duration-300 ${sticky ? 'lg:sticky lg:top-20' : ''}`}>
              {/* Contact for pricing card */}
              <div className="bg-white rounded-2xl p-6 shadow-card mb-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-onSurfaceVariant mb-2">Course Fee</p>
                <p className="font-display font-bold text-xl text-onSurface mb-1">Contact Us for Pricing</p>
                <p className="text-xs text-onSurfaceVariant mb-5">Fees are personalised — call us for a quote.</p>
                <div className="flex gap-2">
                  <a href="tel:+919828459107" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-low rounded-xl text-sm font-semibold text-onSurface hover:bg-surface-high transition-colors">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a href="https://wa.me/919828459107" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-low rounded-xl text-sm font-semibold text-onSurface hover:bg-surface-high transition-colors">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
              {/* Enrollment CTA card */}
              <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="accent-line" />
                  <h3 className="font-display font-bold text-lg text-onSurface">Enroll in This Course</h3>
                </div>
                {course.title && (
                  <div className="px-4 py-2.5 bg-primary-light/20 rounded-lg">
                    <p className="text-sm font-medium text-primary-container">📚 {course.title}</p>
                  </div>
                )}
                <p className="text-sm text-onSurfaceVariant">
                  Ready to start your journey? Fill in the enrollment form and our admissions team will
                  confirm your seat within 24–48 hours.
                </p>
                <Link
                  to={`/enroll?course=${courseId}`}
                  className="btn-primary w-full justify-center py-3.5"
                >
                  <ArrowRight className="w-4 h-4" /> Enroll Now
                </Link>
                <p className="text-xs text-center text-onSurfaceVariant">
                  No payment required at this stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-surface-high p-4">
        <div className="flex gap-3 items-center">
          <div className="flex-1">
            <p className="font-display font-bold text-onSurface text-sm">Contact us for pricing</p>
            <p className="text-xs text-onSurfaceVariant">Personalised fee structure</p>
          </div>
          <Link
            to={`/enroll?course=${courseId}`}
            className="px-6 py-3 bg-primary-container text-white font-bold rounded-xl text-sm uppercase tracking-wide hover:bg-primary transition-colors"
          >
            Register Interest
          </Link>
        </div>
      </div>

      <div className="lg:hidden max-w-7xl mx-auto px-4 pb-32 pt-4">
        <div className="bg-white rounded-2xl p-6 shadow-card text-center">
          <p className="text-sm text-onSurfaceVariant mb-3">Ready to begin your linguistic journey?</p>
          <Link to={`/enroll?course=${courseId}`} className="btn-primary w-full justify-center">
            <ArrowRight className="w-4 h-4" /> Enroll Now
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
