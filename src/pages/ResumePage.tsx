import React from 'react';
import { Download, ExternalLink, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useResumes, useProfile } from '../hooks/usePortfolio';
import { Button } from '../components/common/Button';

export const ResumePage: React.FC = () => {
  const { activeResume, isLoadingActive } = useResumes();
  const { data: profile } = useProfile();

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Curriculum Vitae
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Curriculum Vitae professionnel
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Consultez ou téléchargez la dernière version active de mon CV au format PDF détaillant mes réalisations, compétences et expériences.
          </p>
        </div>

        {/* Card CV active */}
        {isLoadingActive ? (
          <div className="py-20 text-center text-zinc-400 font-mono text-sm">
            Vérification du CV actif...
          </div>
        ) : activeResume ? (
          <div className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-zinc-950">
                      {activeResume.title}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Version active
                    </span>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    Fichier : {activeResume.file_name} • {(activeResume.file_size_kb || 140)} Ko
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="primary"
                  size="md"
                  href={activeResume.file_url}
                  download={activeResume.file_name}
                  leftIcon={<Download className="w-4 h-4" />}
                  id="btn-download-resume"
                >
                  Télécharger le PDF
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  href={activeResume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  rightIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Ouvrir dans un onglet
                </Button>
              </div>
            </div>

            {/* Quick summary of profile strengths */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70">
                <span className="text-xs font-mono text-zinc-400 block mb-1">PROFIL</span>
                <p className="text-sm font-bold text-zinc-900">{profile?.title}</p>
                <p className="text-xs text-zinc-500 mt-1">+{profile?.years_of_experience} années d'expérience</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70">
                <span className="text-xs font-mono text-zinc-400 block mb-1">SPÉCIALITÉ</span>
                <p className="text-sm font-bold text-zinc-900">Laravel, React, Node.js</p>
                <p className="text-xs text-zinc-500 mt-1">PostgreSQL & architectures SaaS</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70">
                <span className="text-xs font-mono text-zinc-400 block mb-1">LOCALISATION</span>
                <p className="text-sm font-bold text-zinc-900">Paris & Remote</p>
                <p className="text-xs text-zinc-500 mt-1">Disponible pour missions</p>
              </div>
            </div>

            {/* Embedded PDF iframe preview */}
            <div className="pt-4">
              <span className="text-xs font-mono text-zinc-400 block mb-2">
                Aperçu du document :
              </span>
              <div className="w-full h-[600px] rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100">
                <iframe
                  src={`${activeResume.file_url}#toolbar=0`}
                  title="Aperçu CV"
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-zinc-200 space-y-3">
            <p className="text-sm text-zinc-500">Aucun CV n'est actuellement configuré comme actif.</p>
            <p className="text-xs text-zinc-400 font-mono">
              Vous pouvez uploader votre document dans l'espace administration (/admin/cv).
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
