import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { BookOpen, ArrowRight, Star, Users, GraduationCap, Loader2 } from 'lucide-react';

// ── Age-group tabs ──────────────────────────────────────────────────────────
const GROUPS = [
  { key: 'all',   label: 'All Courses',   icon: BookOpen },
  { key: 'adult', label: 'Adult Learners (+18)', icon: GraduationCap },
  { key: 'young', label: 'Young Learners (11–17)', icon: Users },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Courses() {
  const [activeGroup, setActiveGroup] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      if (!db) {
        setError('Database not connected. Please check your Firebase configuration.');
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'courses'),
          where('status', '==', 'active')
        );
        const snap = await getDocs(q);
        const fetchedCourses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        
        // Sort in memory to avoid composite index requirement
        fetchedCourses.sort((a, b) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return tB - tA; // Descending map
        });
        
        setCourses(fetchedCourses);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again.');
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const filtered = activeGroup === 'all'
    ? courses
    : courses.filter((c) => (c.group || 'adult') === activeGroup);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative pt-16 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-24">
          <div className="inline-flex items-center gap-2 bg-primary-container/90 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-4 sm:mb-6">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" />
            <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">Our Programs</span>
          </div>
          <h1 className="font-display font-extrabold text-white mb-3 sm:mb-4" style={{ fontSize: 'clamp(1.7rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}>
            Official DELE <span className="text-primary-container">Diploma Programs</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-lg max-w-2xl leading-relaxed">
            Internationally recognised Spanish language certifications for all ages — taught by expert native trainers in Jaipur.
          </p>

          {/* Quick fact pills */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-5 sm:mt-8">
            <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              ✦ Adults: A1 – C2
            </span>
            <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              ✦ Young Learners: A1 &amp; A2/B1
            </span>
            <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
              ✦ Instituto Cervantes Certified
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Layout (Sidebar + Content) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* ── Left Sidebar Filter ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft border border-surface-high p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg text-onSurface mb-4">Filter Courses</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-onSurfaceVariant uppercase tracking-widest mb-3">Age Group</p>
                  <div className="space-y-2">
                    {GROUPS.map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setActiveGroup(key)}
                        className="flex items-center gap-3 cursor-pointer group w-full text-left bg-transparent border-0 p-0"
                      >
                        <div className={`w-4 h-4 rounded-full border flex flex-shrink-0 items-center justify-center transition-colors ${activeGroup === key ? 'border-primary-container bg-primary-container' : 'border-surface-dim group-hover:border-primary-container'}`}>
                          {activeGroup === key && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`text-sm ${activeGroup === key ? 'font-semibold text-onSurface' : 'text-onSurfaceVariant group-hover:text-onSurface'}`}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-high">
                  <p className="text-xs text-onSurfaceVariant leading-relaxed">
                    Select an age group to see relevant course formats and levels tailored for your learning pace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Content Area ── */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 text-primary-container animate-spin" />
                <p className="text-onSurfaceVariant text-sm">Loading courses…</p>
              </div>
            ) : error ? (
              <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-surface-high">
                <BookOpen className="w-16 h-16 text-surface-high mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl mb-2 text-onSurface">Oops!</h3>
                <p className="text-onSurfaceVariant text-sm">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-surface-high">
                <BookOpen className="w-16 h-16 text-surface-high mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl mb-2">No courses yet</h3>
                <p className="text-onSurfaceVariant text-sm">
                  {activeGroup !== 'all'
                    ? 'No courses in this category. Try "All Courses".'
                    : 'Courses will appear here once they are published from the admin panel.'}
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Dynamically group filtered courses by Format */}
                {['Regular', 'Super Intensive', 'Exam Preparation', 'Other'].map((formatLabel) => {
                  // Fallback for empty formats or undefined is basically "Regular" usually, but let's strictly categorize:
                  const formatCoures = filtered.filter(c => (c.format === formatLabel) || (!c.format && formatLabel === 'Regular'));
                  
                  if (formatCoures.length === 0) return null;

                  return (
                    <div key={formatLabel}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="accent-line" />
                        <h2 className="font-display font-extrabold text-2xl text-onSurface">{formatLabel} Courses</h2>
                        <span className="ml-auto text-xs font-semibold text-onSurfaceVariant bg-surface-low px-3 py-1 rounded-full">
                          {formatCoures.length} Program{formatCoures.length !== 1 && 's'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                        {formatCoures.map((course) => (
                          <CourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="hero-gradient py-10 sm:py-14 px-4 text-center">
        <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-2">Ready to begin?</p>
        <h2 className="font-display font-extrabold text-white text-2xl sm:text-3xl mb-3 sm:mb-4" style={{ letterSpacing: '-0.02em' }}>
          Enroll Today — Contact Us for Pricing
        </h2>
        <p className="text-white/75 text-sm sm:text-base max-w-xl mx-auto mb-5 sm:mb-7">
          Course fees are customised based on your level and schedule. Click any course above to learn more, or reach out to us directly.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-white text-primary-container font-bold px-8 py-3.5 rounded-full hover:bg-white/90 transition-all shadow-lg"
        >
          Contact Us <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <Footer />
    </div>
  );
}

// ── Card component ────────────────────────────────────────────────────────────
function CourseCard({ course }) {
  const isYoung = course.group === 'young';
  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-float hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative h-36 sm:h-48 overflow-hidden bg-surface-high">
        {course.imageURL ? (
          <img
            src={course.imageURL}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full hero-gradient flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badge */}
        {course.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full ${
            isYoung ? 'bg-blue-500' : course.badge === 'HOT' ? 'bg-primary-container' : 'bg-primary-container/80'
          }`}>
            {course.badge}
          </span>
        )}

        {/* Level pill */}
        {course.level && (
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="bg-white/90 text-onSurface text-[10px] font-bold px-2 py-0.5 rounded-full">
              {course.level}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          {isYoung
            ? <Users className="w-3.5 h-3.5 text-blue-500" />
            : <GraduationCap className="w-3.5 h-3.5 text-primary-container" />
          }
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isYoung ? 'text-blue-500' : 'text-primary-container'}`}>
            {isYoung ? 'Ages 11–17' : 'Adults 18+'}
          </span>
        </div>

        <h3 className="font-display font-bold text-onSurface text-base mb-2 group-hover:text-primary-container transition-colors leading-tight">
          {course.title}
        </h3>
        <p className="text-xs text-onSurfaceVariant line-clamp-3 mb-5 flex-1">{course.description}</p>


        <div className="pt-4 border-t border-surface-high">
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center gap-1.5 text-primary-container text-sm font-bold hover:gap-3 transition-all duration-200"
          >
            View Course <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
