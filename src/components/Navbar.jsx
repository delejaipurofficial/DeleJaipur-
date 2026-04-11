import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/exams', label: 'DELE Exams' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // On the home page hero is dark, elsewhere pages have their own hero
  const isHome = pathname === '/';

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
              src="/8.jpg"
              alt="Dele Jaipur Logo"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
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

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/contact"
              id="nav-enroll-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-container text-white font-bold rounded-lg hover:bg-primary transition-all duration-200 text-sm uppercase tracking-wide"
            >
              Enroll Now
            </Link>
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
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-surface-high px-4 py-4 space-y-1">
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
          <div className="pt-2">
            <Link
              to="/contact"
              className="block w-full text-center bg-primary-container text-white font-bold rounded-lg py-3 text-sm uppercase tracking-wide hover:bg-primary transition-colors"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
