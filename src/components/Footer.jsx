import { Link } from 'react-router-dom';
import { MapPin, Mail, ArrowRight } from 'lucide-react';

const footerLinks = {
  Pathways: [
    { label: 'DELE Preparation', to: '/courses' },
    { label: 'IELTS Academy', to: '/courses' },
    { label: 'DELF Preparation', to: '/courses' },
    { label: 'Other Languages', to: '/courses' },
    { label: 'DELE Exam Dates', to: '/exams' },
  ],
  Institute: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Faculty', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms-of-service' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-onSurface text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center mb-5">
              <img
                src="/dele-logo.png"
                alt="Dele Jaipur"
                className="h-16 w-auto object-contain"
                style={{ border: '1px solid #CC0000' }}
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Nurturing linguistic brilliance since 2009.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/dele-jaipur-centre/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary-container transition-colors duration-200 flex items-center justify-center">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/delejaipur?igsh=MTkxejVnazdjcXdteg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary-container transition-colors duration-200 flex items-center justify-center">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@delejaipurcentre?si=gWWVGzC9vk5LBjpG" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary-container transition-colors duration-200 flex items-center justify-center">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="https://x.com/DeleJaipur" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary-container transition-colors duration-200 flex items-center justify-center">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-bold text-white mb-5 uppercase text-sm tracking-wider">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 uppercase text-sm tracking-wider">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-container flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/60 leading-relaxed">
                  84/260, Roondla Plaza, Madhyam Marg,<br />Mansarover Plaza, Near K.V.-5,<br />Jaipur (Raj.) – 302020
                </span>
              </div>
              <a href="mailto:delejaipurofficial@gmail.com" className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 text-primary-container flex-shrink-0" />
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">delejaipurofficial@gmail.com</span>
              </a>
              <a href="mailto:info@genesisgroups.in" className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 text-primary-container flex-shrink-0" />
                <span className="text-sm text-white/60 group-hover:text-white transition-colors">info@genesisgroups.in</span>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-10 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-bold text-white mb-1">Subscribe Us</h4>
              <p className="text-sm text-white/50">Get exam dates, new courses & scholarship alerts.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-white/10 rounded-lg text-white placeholder-white/40 border border-white/10 focus:border-primary-container focus:outline-none text-sm transition-colors"
              />
              <button className="px-5 py-3 bg-primary-container hover:bg-primary text-white font-bold rounded-lg text-sm uppercase tracking-wide transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>© 2025 Genesis Groups – DELE Jaipur. All rights reserved.</span>
          <span className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
