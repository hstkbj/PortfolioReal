import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useExperiences } from '../hooks/usePortfolio';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const ExperiencesPage: React.FC = () => {
  const { data: experiences = [], isLoading } = useExperiences();

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Carrière & Parcours
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Expériences professionnelles
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Parcours technique jalonné de responsabilités réelles sur des applications en production, de la conception architecturale à la direction d'équipe.
          </p>
        </div>

        {/* Timeline */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-400 font-mono text-sm">
            Chargement du parcours...
          </div>
        ) : (
          <div className="relative border-l-2 border-zinc-200 ml-3 sm:ml-6 space-y-12">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-6 sm:pl-8 group">
                {/* Timeline node */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-zinc-900 group-hover:scale-125 transition-transform duration-200"></div>

                <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-4">
                  
                  {/* Meta pill bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-800 font-semibold border border-zinc-200">
                        {exp.period}
                      </span>
                      {exp.is_current && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                          Poste actuel
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Title & Company */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-950">
                      {exp.role}
                    </h2>
                    <div className="text-sm sm:text-base font-medium text-zinc-600 mt-0.5">
                      {exp.company}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Responsibilities list */}
                  <div className="pt-2">
                    <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Responsabilités & Réalisations clés :
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-zinc-700">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack */}
                  <div className="pt-3 border-t border-zinc-100 flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <Badge key={tech} variant="neutral" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="p-8 rounded-2xl bg-zinc-100 border border-zinc-200 text-center space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">
            Intéressé par mon profil technique pour une mission ou un poste ?
          </h3>
          <p className="text-sm text-zinc-600 max-w-md mx-auto">
            Téléchargez mon CV complet ou contactez-moi directement pour planifier un premier échange.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" size="md" to="/contact">
              Me contacter
            </Button>
            <Button variant="outline" size="md" to="/cv">
              Consulter mon CV
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
