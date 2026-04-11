import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Share2, Rss, Play, ArrowRight } from 'lucide-react';

const footerLinks = {
  Pathways: [
    { label: 'DELF Preparation', to: '/courses' },
    { label: 'DELE Preparation', to: '/courses' },
    { label: 'IELTS Academy', to: '/courses' },
    { label: 'World Languages', to: '/courses' },
    { label: 'DELE Exam Dates', to: '/exams' },
  ],
  Institute: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Faculty', to: '/about' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
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
                src="/8.jpg"
                alt="Dele Jaipur"
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-2">
              Nurturing linguistic brilliance since 2009.
            </p>
            <p className="text-sm text-white/40 mb-6">
              जयपुर का प्रमुख विदेशी भाषा संस्थान
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { Icon: Share2, href: '#', label: 'Facebook' },
                { Icon: Rss, href: '#', label: 'Instagram' },
                { Icon: Play, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary-container transition-colors duration-200 flex items-center justify-center"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
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
            <Link to="/admin-portal" className="hover:text-white transition-colors opacity-50 hover:opacity-100">Admin</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
