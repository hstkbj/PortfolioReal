import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Mail, 
  Briefcase, 
  Layers, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  Code 
} from 'lucide-react';
import { useProfile, useResumes } from '../hooks/usePortfolio';
import { Button } from '../components/common/Button';

export const AboutPage: React.FC = () => {
  const { data: profile } = useProfile();
  const { activeResume } = useResumes();

  const workingMethodology = [
    {
      title: '1. Cadrage & Analyse des besoins métier',
      desc: 'Comprendre précisément les règles de gestion, les contraintes volumétriques et les attentes des utilisateurs finaux avant d’écrire la moindre ligne de code.',
    },
    {
      title: '2. Conception architecturale & Modélisation',
      desc: 'Schématisation des entités en base de données, définition des contrats d’API (DTO, validation stricte) et sélection du socle technique adapté.',
    },
    {
      title: '3. Développement itératif & Qualité',
      desc: 'Développement modulaire typé (TypeScript / PHP strict), tests automatisés, revue de sécurité et intégration continue (CI/CD).',
    },
    {
      title: '4. Déploiement & Accompagnement',
      desc: 'Mise en production sécurisée avec conteneurisation Docker, monitoring applicatif et documentation exhaustive pour une passation sereine.',
    },
  ];

  const projectTypes = [
    {
      title: 'Plateformes SaaS B2B',
      desc: 'Applications multi-tenants avec abonnements Stripe, tableaux de bord de gestion et droits utilisateurs complexes.',
    },
    {
      title: 'Systèmes web métier & ERP',
      desc: 'Outils internes sur-mesure pour la logistique, la gestion de stocks, la facturation ou le suivi de processus.',
    },
    {
      title: 'API REST & Microservices',
      desc: 'Architectures backend haute performance, passerelles d’authentification, intégrations de webhooks et flux bancaires/ERP.',
    },
    {
      title: 'Refonte & Modernisation technique',
      desc: 'Migration de bases de données, refactoring de monolithes vers des architectures API + React, optimisation des performances.',
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Hero */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-12 border-b border-zinc-200">
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
              Présentation
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              À propos de moi
            </h1>
            <p className="text-lg font-medium text-zinc-800">
              {profile?.title || 'Développeur Web Fullstack Senior'}
            </p>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
              {profile?.bio_short}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {profile?.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                +{profile?.years_of_experience} ans d'expérience
              </span>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm bg-zinc-100">
              <img
                src={profile?.avatar_url}
                alt={profile?.full_name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Parcours & Vision */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Mon parcours & Philosophie technique
          </h2>
          <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed text-sm sm:text-base space-y-4">
            <p className="whitespace-pre-line">
              {profile?.bio_full}
            </p>
          </div>
        </div>

        {/* Manière de travailler */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Méthodologie
            </span>
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
              Ma façon de travailler
            </h2>
            <p className="text-sm text-zinc-600 mt-1">
              Une approche rigoureuse orientée résultats et communication transparente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {workingMethodology.map((m, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-zinc-200 bg-white space-y-2">
                <h3 className="text-base font-bold text-zinc-900">{m.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Types de projets */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Interventions
            </span>
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
              Types de projets réalisés
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projectTypes.map((p, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="text-sm font-bold text-zinc-900">{p.title}</h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed pl-6">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="p-8 rounded-2xl bg-zinc-900 text-white text-center space-y-4">
          <h3 className="text-xl font-bold tracking-tight">
            Prêt à collaborer sur votre prochain projet ?
          </h3>
          <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
            Consultez mes réalisations récentes ou prenez contact directement pour échanger sur vos défis techniques.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button variant="primary" size="md" to="/projets" className="bg-white text-zinc-900 hover:bg-zinc-100">
              Voir mes projets
            </Button>
            <Button variant="outline" size="md" to="/contact" className="border-zinc-700 text-white hover:bg-zinc-800">
              Me contacter
            </Button>
            {activeResume?.file_url && (
              <Button
                variant="outline"
                size="md"
                href={activeResume.file_url}
                download={activeResume.file_name}
                leftIcon={<Download className="w-4 h-4" />}
                className="border-zinc-700 text-white hover:bg-zinc-800"
              >
                Télécharger CV
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
