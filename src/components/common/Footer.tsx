import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Download, 
  Shield 
} from 'lucide-react';
import { useProfile, useResumes } from '../../hooks/usePortfolio';

export const Footer: React.FC = () => {
  const { data: profile } = useProfile();
  const { activeResume } = useResumes();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200/80 bg-white text-zinc-600 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Identity column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-zinc-950 text-lg tracking-tight">
                {profile?.full_name || 'Alexandre Renard'}
              </span>
              {profile?.is_available_for_hire && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Disponible pour missions
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-600 max-w-md leading-relaxed">
              {profile?.tagline || 'Je conçois des applications web modernes, performantes et adaptées aux besoins métier.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400" />
                {profile?.location || 'Paris, France'}
              </span>
              <a 
                href={`mailto:${profile?.email || 'contact@example.com'}`}
                className="inline-flex items-center gap-1.5 text-zinc-700 hover:text-zinc-950 transition-colors"
              >
                <Mail className="w-4 h-4 text-zinc-400" />
                {profile?.email}
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projets" className="hover:text-zinc-950 transition-colors">
                  Projets & Réalisations
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-zinc-950 transition-colors">
                  Services & Prestations
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-zinc-950 transition-colors">
                  Parcours & Expériences
                </Link>
              </li>
              <li>
                <Link to="/competences" className="hover:text-zinc-950 transition-colors">
                  Stack technique & Outils
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-zinc-950 transition-colors">
                  Articles de blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-zinc-950 transition-colors">
                  Formulaire de contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Actions & Reseau */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900">
              Réseaux & Documents
            </h4>
            <ul className="space-y-2 text-sm">
              {profile?.github_url && (
                <li>
                  <a 
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-zinc-950 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                  </a>
                </li>
              )}
              {profile?.linkedin_url && (
                <li>
                  <a 
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-zinc-950 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                  </a>
                </li>
              )}
              {activeResume?.file_url && (
                <li>
                  <a 
                    href={activeResume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-zinc-900 hover:text-zinc-700 transition-colors"
                  >
                    <Download className="w-4 h-4 text-zinc-700" />
                    <span>Télécharger CV (PDF)</span>
                  </a>
                </li>
              )}
              <li>
                <Link 
                  to="/demande-service"
                  className="inline-flex items-center gap-1.5 text-zinc-900 font-medium hover:underline"
                >
                  <span>Demander un devis</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>
            © {currentYear} {profile?.full_name}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span>Stack : React • TypeScript • Tailwind • Supabase</span>
            <span className="text-zinc-300">•</span>
            <Link 
              to="/admin" 
              className="inline-flex items-center gap-1 hover:text-zinc-800 transition-colors text-zinc-400"
              title="Administration du site"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
