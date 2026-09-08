import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github, Search, Filter } from 'lucide-react';
import { useProjects } from '../hooks/usePortfolio';
import { Badge } from '../components/common/Badge';

export const ProjectsPage: React.FC = () => {
  const { data: projects = [], isLoading } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { label: 'Tous', value: 'all' },
    { label: 'SaaS', value: 'saas' },
    { label: 'Applications Web', value: 'web-app' },
    { label: 'API & Microservices', value: 'api' },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description_short.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Portfolio
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Projets & Réalisations
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Découvrez une sélection de plateformes logicielles, d'applications SaaS et d'architectures backend développées avec rigueur technique.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher par techno, mot clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>

        </div>

        {/* Project Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-400 font-mono text-sm">
            Chargement des projets...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-zinc-200 p-8">
            <p className="text-sm text-zinc-500">Aucun projet ne correspond à vos critères de recherche.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-xs font-mono text-zinc-900 underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all duration-200"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-zinc-100">
                  <img
                    src={project.main_image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-zinc-900/80 backdrop-blur-sm text-white text-[11px] font-mono uppercase tracking-wider">
                      {project.category}
                    </span>
                    {project.is_featured && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/90 text-white text-[11px] font-mono">
                        ★ Vedette
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                      <span>{project.date}</span>
                      <span className="capitalize">{project.status === 'completed' ? 'Livré' : 'En cours'}</span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      <Link to={`/projets/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-zinc-600 mt-2 line-clamp-3 leading-relaxed">
                      {project.description_short}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-zinc-100">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((t) => (
                        <Badge key={t} variant="neutral" size="sm">
                          {t}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <Link
                        to={`/projets/${project.slug}`}
                        className="font-medium text-zinc-900 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Fiche détaillée</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <div className="flex items-center gap-2">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-900"
                            title="Code source GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-900"
                            title="Démo du projet"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
