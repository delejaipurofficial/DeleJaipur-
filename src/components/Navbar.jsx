import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/courses', label: 'Courses' },
  { to: '/exams', label: 'DELE Exam' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact Us' },
];

// ─── Searchable index ──────────────────────────────────────────────────────────
const SEARCH_INDEX = [
  { label: 'Home', to: '/', keywords: ['home', 'main', 'welcome', 'homepage'] },
  { label: 'About Us', to: '/about', keywords: ['about', 'who we are', 'team', 'faculty', 'history', 'genesis', 'institute'] },
  { label: 'Courses', to: '/courses', keywords: ['courses', 'programs', 'language', 'spanish', 'french', 'english', 'ielts', 'delf', 'dele', 'german', 'japanese', 'italian'] },
  { label: 'DELE Exam', to: '/exams', keywords: ['dele', 'exam', 'exams', 'exam dates', 'schedule', 'certification', 'test'] },
  { label: 'Gallery', to: '/gallery', keywords: ['gallery', 'photos', 'images', 'pictures', 'events'] },
  { label: 'Contact Us', to: '/contact', keywords: ['contact', 'address', 'phone', 'email', 'location', 'reach', 'enquiry', 'jaipur'] },
  { label: 'IELTS Academy', to: '/courses', keywords: ['ielts', 'english test', 'idp', 'idp australia', 'british council'] },
  { label: 'DELF Preparation', to: '/courses', keywords: ['delf', 'french exam', 'alliance', 'french certification'] },
  { label: 'Enroll / Admission', to: '/contact', keywords: ['enroll', 'enrolment', 'admission', 'register', 'fee', 'fees', 'join'] },
  { label: 'Spanish Courses', to: '/courses', keywords: ['spanish', 'espanol', 'instituto cervantes', 'spain'] },
  { label: 'Faculty', to: '/about', keywords: ['faculty', 'teachers', 'trainers', 'native speakers', 'staff'] },
  { label: 'Privacy Policy', to: '/privacy-policy', keywords: ['privacy', 'policy', 'terms', 'legal'] },
];

function getResults(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return SEARCH_INDEX.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q))
  ).slice(0, 6);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  }, [pathname]);

  useEffect(() => {
    setResults(getResults(query));
    setActiveIdx(-1);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setSearchOpen(false);
        setQuery('');
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const isHome = pathname === '/';

  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = activeIdx >= 0 ? results[activeIdx] : results[0];
      if (target) {
        navigate(target.to);
        setSearchOpen(false);
        setQuery('');
        setResults([]);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  const handleResultClick = (to) => {
    navigate(to);
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  // Text colors based on scroll/page state
  const textColor = scrolled || !isHome ? 'text-onSurface' : 'text-white/90';
  const iconColor = scrolled || !isHome ? 'text-onSurface' : 'text-white';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-surface-high'
          : isHome
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-soft border-b border-surface-high'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src="/dele-logo.png"
              alt="Dele Jaipur Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              style={{ border: '1px solid #CC0000' }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                  pathname === link.to
                    ? 'text-primary-container'
                    : scrolled || !isHome
                    ? 'text-onSurface hover:text-primary-container'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex items-center" ref={dropdownRef}>
            {searchOpen ? (
              <div className="relative">
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all duration-200 ${
                    scrolled || !isHome
                      ? 'bg-white border-surface-high shadow-sm'
                      : 'bg-white/15 border-white/30 backdrop-blur-sm'
                  }`}
                  style={{ minWidth: '220px' }}
                >
                  <Search className={`w-4 h-4 flex-shrink-0 ${scrolled || !isHome ? 'text-onSurfaceVariant' : 'text-white/70'}`} />
                  <input
                    ref={inputRef}
                    id="nav-search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search pages…"
                    className={`bg-transparent outline-none text-sm w-full ${
                      scrolled || !isHome
                        ? 'text-onSurface placeholder-onSurfaceVariant/60'
                        : 'text-white placeholder-white/50'
                    }`}
                    aria-label="Search site"
                    autoComplete="off"
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
                    className={`flex-shrink-0 ${scrolled || !isHome ? 'text-onSurfaceVariant hover:text-onSurface' : 'text-white/70 hover:text-white'}`}
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Dropdown results */}
                {results.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-float border border-surface-high overflow-hidden z-50">
                    {results.map((r, i) => (
                      <button
                        key={r.to + r.label}
                        onClick={() => handleResultClick(r.to)}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                          i === activeIdx
                            ? 'bg-primary-container/10 text-primary-container'
                            : 'text-onSurface hover:bg-surface-low'
                        }`}
                      >
                        <Search className="w-3.5 h-3.5 text-onSurfaceVariant flex-shrink-0" />
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}

                {query.trim() && results.length === 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-float border border-surface-high px-4 py-3 text-sm text-onSurfaceVariant z-50">
                    No results for "{query}"
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-search-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 text-sm font-medium ${
                  scrolled || !isHome
                    ? 'border-surface-high text-onSurface hover:border-primary-container hover:text-primary-container bg-white'
                    : 'border-white/30 text-white/90 hover:bg-white/15 backdrop-blur-sm'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              scrolled || !isHome ? 'hover:bg-surface-low text-onSurface' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-surface-high px-4 py-4 space-y-1">
          {/* Mobile search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-onSurfaceVariant" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-high text-sm text-onSurface placeholder-onSurfaceVariant/60 outline-none focus:border-primary-container bg-surface-low"
              aria-label="Search site mobile"
              autoComplete="off"
            />
            {results.length > 0 && (
              <div className="mt-1 bg-white rounded-xl border border-surface-high overflow-hidden shadow-sm">
                {results.map((r, i) => (
                  <button
                    key={r.to + r.label}
                    onClick={() => handleResultClick(r.to)}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 text-onSurface hover:bg-surface-low transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-onSurfaceVariant flex-shrink-0" />
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wide transition-colors ${
                pathname === link.to
                  ? 'text-primary-container bg-primary-light/20'
                  : 'text-onSurface hover:bg-surface-low'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
