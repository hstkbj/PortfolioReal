import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  Layers, 
  FileText, 
  Send, 
  Download, 
  Menu, 
  X, 
  Terminal, 
  User, 
  ShieldCheck 
} from 'lucide-react';
import { useProfile, useResumes } from '../../hooks/usePortfolio';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data: profile } = useProfile();
  const { activeResume } = useResumes();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { label: 'Projets', href: '/projets' },
    { label: 'Services', href: '/services' },
    { label: 'Expériences', href: '/experiences' },
    { label: 'Compétences', href: '/competences' },
    { label: 'Blog', href: '/blog' },
    { label: 'À propos', href: '/a-propos' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Identity */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            id="header-brand-link"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center shrink-0">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Terminal className="w-5 h-5 text-zinc-700" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 tracking-tight text-base group-hover:text-zinc-700 transition-colors">
                  {profile?.full_name || 'Développeur Web'}
                </span>
                {profile?.is_available_for_hire && (
                  <span 
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    title="Disponible pour missions & opportunités"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="hidden sm:inline">Dispo</span>
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-500 font-mono hidden sm:block">
                {profile?.title || 'Fullstack Developer'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-zinc-950 bg-zinc-100 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {activeResume?.file_url && (
              <Button
                variant="outline"
                size="sm"
                href={activeResume.file_url}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                id="btn-header-cv"
              >
                CV
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              to="/demande-service"
              leftIcon={<Send className="w-3.5 h-3.5" />}
              id="btn-header-demande"
            >
              Demander un service
            </Button>

            {isAuthenticated ? (
              <Link
                to="/admin"
                className="p-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
                title="Espace Administrateur"
                id="header-admin-link"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
                title="Connexion Administrateur"
                id="header-admin-login"
              >
                <User className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              to="/demande-service"
              className="text-xs px-2.5 py-1"
            >
              Devis
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-700 hover:bg-zinc-100 transition-colors"
              aria-label="Menu principal"
              id="btn-mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-zinc-900 bg-zinc-100 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            {activeResume?.file_url && (
              <Button
                variant="outline"
                size="md"
                href={activeResume.file_url}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<Download className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Télécharger mon CV (PDF)
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              to="/demande-service"
              onClick={() => setMobileMenuOpen(false)}
              leftIcon={<Send className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Demander un service
            </Button>
            <div className="flex justify-between items-center pt-2 px-1 text-xs text-zinc-500">
              <span>{profile?.email}</span>
              <Link 
                to={isAuthenticated ? "/admin" : "/admin/login"} 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-zinc-900 underline"
              >
                {isAuthenticated ? "Accès Admin" : "Connexion"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
