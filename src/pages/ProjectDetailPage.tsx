import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Send 
} from 'lucide-react';
import { useProject } from '../hooks/usePortfolio';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(slug || '');

  if (isLoading) {
    return (
      <div className="py-24 text-center text-zinc-500 font-mono text-sm">
        Chargement du projet...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4 space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900">Projet non trouvé</h1>
        <p className="text-zinc-600 text-sm">
          Le projet demandé n'existe pas ou a été déplacé.
        </p>
        <Button variant="outline" onClick={() => navigate('/projets')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Retourner aux projets
        </Button>
      </div>
    );
  }

  return (
    <article className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <div>
          <Link
            to="/projets"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tous les projets</span>
          </Link>
        </div>

        {/* Header Title & Meta */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono uppercase bg-zinc-900 text-white">
              {project.category}
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-zinc-100 text-zinc-700 border border-zinc-200">
              Année : {project.date}
            </span>
            {project.client && (
              <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-zinc-100 text-zinc-700 border border-zinc-200">
                Client : {project.client}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
              Statut : {project.status === 'completed' ? 'Livré en production' : 'En cours'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight">
            {project.title}
          </h1>

          <p className="text-lg text-zinc-600 leading-relaxed max-w-3xl">
            {project.description_short}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.demo_url && (
              <Button
                variant="primary"
                size="md"
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                rightIcon={<ExternalLink className="w-4 h-4" />}
              >
                Accéder à la démo live
              </Button>
            )}
            {project.github_url && (
              <Button
                variant="outline"
                size="md"
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<Github className="w-4 h-4" />}
              >
                Code source GitHub
              </Button>
            )}
            <Button
              variant="secondary"
              size="md"
              to={`/demande-service?service=${encodeURIComponent(project.title)}`}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Demander un projet similaire
            </Button>
          </div>
        </div>

        {/* Main Image */}
        <div className="rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-sm">
          <img
            src={project.main_image}
            alt={project.title}
            className="w-full h-auto max-h-[550px] object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content & Technologies Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
          
          {/* Main Description */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold text-zinc-950 border-b border-zinc-200 pb-3">
              Description & Réalisation technique
            </h2>
            <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed text-sm sm:text-base space-y-4">
              <p className="whitespace-pre-line">
                {project.description_full}
              </p>
            </div>

            {/* Gallery images if present */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <div className="pt-6 space-y-4">
                <h3 className="text-lg font-bold text-zinc-950">
                  Captures d'écran & Aperçus d'interface
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery_images.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                      <img
                        src={img}
                        alt={`${project.title} capture ${idx + 1}`}
                        className="w-full h-48 object-cover hover:scale-102 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Specs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-4">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900 pb-2 border-b border-zinc-200">
                Stack technologique
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="neutral" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-200 space-y-2 text-xs font-mono text-zinc-600">
                <div className="flex justify-between">
                  <span>Catégorie :</span>
                  <span className="font-semibold text-zinc-900 uppercase">{project.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date :</span>
                  <span className="font-semibold text-zinc-900">{project.date}</span>
                </div>
                {project.client && (
                  <div className="flex justify-between">
                    <span>Client :</span>
                    <span className="font-semibold text-zinc-900">{project.client}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Statut :</span>
                  <span className="font-semibold text-emerald-700">
                    {project.status === 'completed' ? 'Livré' : 'En cours'}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="sm"
                  to="/demande-service"
                  className="w-full justify-center"
                >
                  Initier un projet
                </Button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};
