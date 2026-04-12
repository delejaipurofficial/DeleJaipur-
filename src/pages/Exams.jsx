import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Calendar, Clock, Award, AlertCircle, CheckCircle, ArrowRight,
  BookOpen, Globe, Star
} from 'lucide-react';


const EXAM_FEES = [
  { level: 'A1–A2', desc: 'No prior certificate required', fee: '₹4,500' },
  { level: 'B1–B2', desc: 'No prior certificate required', fee: '₹6,000' },
  { level: 'C1', desc: 'B-level certificate recommended', fee: '₹8,000' },
  { level: 'C2', desc: 'C1 certificate required', fee: '₹10,000' },
];

function ExamCard({ exam }) {
  const today = new Date();
  const deadline = new Date(exam.deadline);
  const isOpen = today < deadline;
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-float hover:-translate-y-1 transition-all duration-300 p-5 sm:p-8 flex flex-col">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-primary-container" />
            <h3 className="font-display font-bold text-xl text-onSurface">{exam.date}</h3>
          </div>
          <p className="text-sm text-onSurfaceVariant">{exam.description}</p>
        </div>
        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isOpen ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-surface-high text-secondary'
          }`}>
          {isOpen ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-3 p-3 bg-surface-low rounded-xl mb-5">
        <Clock className="w-4 h-4 text-onSurfaceVariant flex-shrink-0" />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-onSurfaceVariant">Registration Deadline</p>
          <p className="font-semibold text-onSurface text-sm">
            {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            {isOpen && daysLeft > 0 && <span className="ml-2 text-primary-container text-xs font-bold">({daysLeft} days left)</span>}
          </p>
        </div>
      </div>

      {/* Levels */}
      <div className="mb-6 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-onSurfaceVariant mb-3">Available Levels</p>
        <div className="flex flex-wrap gap-2">
          {exam.levels?.map((level) => (
            <span key={level} className="px-3 py-1 bg-primary-light/30 text-primary-dark text-xs font-bold rounded-full">
              {level}
            </span>
          ))}
        </div>
      </div>

      {isOpen ? (
        exam.link ? (
          <a href={exam.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-primary-container text-white font-bold rounded-xl hover:bg-primary transition-colors text-sm uppercase tracking-wide">
            Register <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-3 bg-primary-container text-white font-bold rounded-xl hover:bg-primary transition-colors text-sm uppercase tracking-wide">
            Register Interest <ArrowRight className="w-4 h-4" />
          </Link>
        )
      ) : (
        <button disabled className="w-full py-3 bg-surface-high text-secondary font-bold rounded-xl text-sm uppercase tracking-wide cursor-not-allowed opacity-60">
          Registration Closed
        </button>
      )}
    </div>
  );
}

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarImg, setCalendarImg] = useState(null);

  useEffect(() => {
    const fetchExamsAndSettings = async () => {
      if (!db) { setLoading(false); return; }
      try {
        // Fetch exams
        const snap = await getDocs(query(collection(db, 'exams'), orderBy('deadline')));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setExams(data);

        // Fetch settings
        const settingsSnap = await getDoc(doc(db, 'settings', 'exams'));
        if (settingsSnap.exists()) {
          setCalendarImg(settingsSnap.data().calendarImageURL || null);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally { setLoading(false); }
    };
    fetchExamsAndSettings();
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative pt-16 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&auto=format&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-24">
          <div className="inline-flex items-center gap-2 bg-primary-container/90 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-4 sm:mb-6">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" />
            <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">Examinations</span>
          </div>
          <h1 className="font-display font-extrabold text-white mb-3 sm:mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}>
            DELE Exam <span className="text-primary-container">Calendar</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-lg max-w-2xl leading-relaxed">
            Official DELE examination sessions administered by Instituto Cervantes on behalf of the Spanish Ministry of Education.
          </p>
        </div>
      </div>

      {/* ── Info Strip ── */}
      <div className="bg-white border-b border-surface-high shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap gap-3 sm:gap-8">
            {[
              { Icon: Award, text: 'Globally recognized by 100+ countries' },
              { Icon: CheckCircle, text: 'Authorized Instituto Cervantes exam center' },
              { Icon: Calendar, text: 'Two main sessions per year (May & November)' },
              { Icon: Globe, text: "Jaipur's only authorized DELE exam venue" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary-container flex-shrink-0" />
                <span className="text-xs sm:text-sm text-onSurface">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Exam Cards & Calendar Image ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Admin uploaded global calendar image */}
        {calendarImg && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-float border border-surface-high bg-white">
            {/* Card header */}
            <div className="hero-gradient px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-display font-bold text-sm sm:text-base leading-tight">DELE Exam Calendar</p>
                  <p className="text-white/70 text-[10px] sm:text-xs">Official session schedule — Instituto Cervantes</p>
                </div>
              </div>
              <span className="hidden sm:flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Published
              </span>
            </div>

            {/* Image */}
            <div className="relative bg-surface-low">
              <img
                src={calendarImg}
                alt="DELE Exam Calendar"
                className="w-full h-auto object-contain max-h-[680px]"
              />
              {/* Subtle bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
            </div>

            {/* Footer note */}
            <div className="px-6 py-3 bg-surface-low border-t border-surface-high flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-primary-container flex-shrink-0" />
              <p className="text-xs text-onSurfaceVariant">
                Dates are subject to change. Contact us to confirm your session before registering.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <div className="accent-line" />
          <h2 className="font-display font-bold text-xl sm:text-2xl">Upcoming Sessions</h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <div key={i} className="rounded-2xl h-72 animate-pulse bg-surface-high" />)}
          </div>
        ) : exams.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-card">
            <Calendar className="w-16 h-16 text-surface-high mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl mb-2">No upcoming exams</h3>
            <p className="text-onSurfaceVariant text-sm">Exam sessions will appear here once published.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {exams.map((exam) => <ExamCard key={exam.id} exam={exam} />)}
          </div>
        )}

        {/* About + Fees */}
        <div className="mt-10 sm:mt-16 grid sm:grid-cols-2 gap-5 sm:gap-8">
          {/* About */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary-container" />
              <h3 className="font-display font-bold text-lg sm:text-xl">About DELE Examinations</h3>
            </div>
            <p className="text-onSurfaceVariant text-sm leading-relaxed mb-4">
              DELE (Diplomas de Español como Lengua Extranjera) are official certificates of Spanish language proficiency, awarded by Instituto Cervantes on behalf of the Spanish Ministry of Education. They are internationally recognized and valid for life.
            </p>
            <p className="text-onSurfaceVariant text-sm leading-relaxed">
              Delejaipur is Jaipur's only authorized DELE examination center, meaning students can take the official exam right here — no need to travel to another city.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 mt-6 text-primary-container font-bold text-sm hover:gap-3 transition-all duration-200">
              Speak with an Advisor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Fees */}
          <div className="bg-white rounded-2xl p-8 shadow-card">
            <div className="flex items-center gap-3 mb-5">
              <Award className="w-6 h-6 text-primary-container" />
              <h3 className="font-display font-bold text-xl">Eligibility & Fees</h3>
            </div>
            <div className="space-y-3">
              {EXAM_FEES.map(({ level, desc, fee }) => (
                <div key={level} className="flex items-center justify-between p-3 bg-surface-low rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-primary-light/30 text-primary-dark text-xs font-bold rounded-md">{level}</span>
                    <span className="text-xs text-onSurfaceVariant">{desc}</span>
                  </div>
                  <span className="font-display font-bold text-sm text-onSurface">{fee}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-onSurfaceVariant mt-4">* Fees are subject to change. Contact us for the latest rates.</p>
          </div>
        </div>
      </div>

      {/* ── CTA Red Band ── */}
      <section className="hero-gradient py-10 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-3 sm:mb-4">
            Ready to Take the DELE Exam?
          </h2>
          <p className="text-white/80 text-sm sm:text-base mb-6 sm:mb-8">
            Speak with our academic advisors to plan your DELE journey and secure your spot in the next examination session.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-container font-bold rounded-xl hover:bg-primary-light transition-all duration-200 text-sm sm:text-base">
            Register Your Interest <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
