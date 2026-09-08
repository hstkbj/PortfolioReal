import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Download, 
  Send, 
  Terminal, 
  CheckCircle2, 
  ExternalLink, 
  Github, 
  Code2, 
  Layers, 
  Server, 
  Database, 
  Wrench, 
  Calendar, 
  Clock, 
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { 
  useProfile, 
  useProjects, 
  useServices, 
  useExperiences, 
  useSkills, 
  useBlogPosts, 
  useResumes 
} from '../hooks/usePortfolio';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const HomePage: React.FC = () => {
  const { data: profile } = useProfile();
  const { data: projects = [] } = useProjects();
  const { data: services = [] } = useServices();
  const { data: experiences = [] } = useExperiences();
  const { data: skills = [] } = useSkills();
  const { data: blogPosts = [] } = useBlogPosts(true);
  const { activeResume } = useResumes();

  const featuredProjects = projects.filter(p => p.is_featured).slice(0, 3);
  const activeServices = services.filter(s => s.is_active).slice(0, 4);
  const recentPosts = blogPosts.slice(0, 3);

  // Group skills by category
  const skillsByCategory = {
    frontend: skills.filter(s => s.category === 'frontend'),
    backend: skills.filter(s => s.category === 'backend'),
    database: skills.filter(s => s.category === 'database'),
    tools: skills.filter(s => s.category === 'tools'),
  };

  const keyTechs = ['Laravel', 'React.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Vue.js', 'Supabase'];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Positioning & Presentation */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{profile?.is_available_for_hire ? 'Disponible pour nouveaux projets & missions' : 'Actuellement en mission'}</span>
              </div>

              {/* Title & Headline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.15]">
                  {profile?.full_name || 'Alexandre Renard'}
                  <span className="block text-zinc-500 font-medium text-2xl sm:text-3xl mt-1">
                    {profile?.title || 'Développeur Web Fullstack Senior'}
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-zinc-700 font-normal leading-relaxed max-w-2xl">
                  {profile?.tagline || 'Je conçois des applications web modernes, performantes et adaptées aux besoins métier.'}
                </p>
              </div>

              {/* Short Bio */}
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl">
                {profile?.bio_short}
              </p>

              {/* Key Technologies Badges */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                  Technologies clés de prédilection
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {keyTechs.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-white border border-zinc-200 text-zinc-800 shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap gap-3 pt-3">
                <Button
                  variant="primary"
                  size="lg"
                  to="/projets"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  id="hero-cta-projects"
                >
                  Découvrir mes projets
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  to="/contact"
                  id="hero-cta-contact"
                >
                  Me contacter
                </Button>
                {activeResume?.file_url && (
                  <Button
                    variant="secondary"
                    size="lg"
                    href={activeResume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftIcon={<Download className="w-4 h-4" />}
                    id="hero-cta-cv"
                  >
                    Télécharger CV
                  </Button>
                )}
              </div>

              {/* Stats highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200/80 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950">
                    +{profile?.years_of_experience || 7} ans
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">d’expérience réelle</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950">
                    +{profile?.completed_projects_count || 40}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">projets livrés</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-950">
                    100%
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">code sur-mesure</div>
                </div>
              </div>

            </div>

            {/* Right Column: Developer Photo & Visual Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                
                {/* Photo container */}
                <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-white p-2 shadow-sm">
                  <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-zinc-100">
                    <img 
                      src={profile?.avatar_url} 
                      alt={profile?.full_name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent"></div>
                    
                    {/* Badge on photo */}
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-white/95 backdrop-blur-sm border border-zinc-200/80 text-xs">
                      <div className="flex items-center justify-between text-zinc-900 font-medium">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          {profile?.location || 'Paris & Remote'}
                        </span>
                        <span className="font-mono text-zinc-500">PHP • TS • SQL</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Developer Philosophy Card below photo */}
                <div className="mt-4 p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
                    <Code2 className="w-3.5 h-3.5 text-zinc-700" />
                    <span>PHILOSOPHIE TECHNIQUE</span>
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed">
                    Architecture claire, typage strict, séparation domaine/UI et zéro dette technique prématurée.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROJETS EN VEDETTE */}
      <section className="py-16 sm:py-24 border-b border-zinc-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Portfolio & Réalisations
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                Projets récents & applications métier
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl">
                Une sélection de plateformes SaaS, logiciels de gestion et API conçus pour répondre à des enjeux concrets de production.
              </p>
            </div>
            <Link 
              to="/projets"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors shrink-0"
            >
              <span>Tous les projets</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <article 
                key={project.id}
                className="group flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all duration-200"
              >
                {/* Project Image */}
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
                  </div>
                </div>

                {/* Project Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      <Link to={`/projets/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-zinc-600 mt-2 line-clamp-3 leading-relaxed">
                      {project.description_short}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-4 pt-2 border-t border-zinc-100">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="neutral" size="sm">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[11px] font-mono text-zinc-400 self-center">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <Link 
                        to={`/projets/${project.slug}`}
                        className="font-medium text-zinc-900 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Détails de l'architecture</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {project.demo_url && (
                        <a 
                          href={project.demo_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1"
                          title="Voir la démo en ligne"
                        >
                          <span>Démo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* 3. SERVICES PROPOSÉS */}
      <section className="py-16 sm:py-24 border-b border-zinc-200/80 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Prestations & Accompagnement
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                Services proposés aux entreprises & startups
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl">
                Un accompagnement technique rigoureux, de la phase de conception logicielle jusqu’au déploiement sécurisé.
              </p>
            </div>
            <Link 
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors shrink-0"
            >
              <span>Tous les services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeServices.map((service) => (
              <div 
                key={service.id}
                className="p-6 sm:p-8 rounded-xl border border-zinc-200 bg-white shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    {service.indicative_price && (
                      <span className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {service.indicative_price}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 pt-2 text-xs sm:text-sm text-zinc-700">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between">
                  <Link
                    to={`/demande-service?service=${encodeURIComponent(service.title)}`}
                    className="text-xs sm:text-sm font-medium text-zinc-950 hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>Commander cette prestation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. EXPÉRIENCES & TIMELINE */}
      <section className="py-16 sm:py-24 border-b border-zinc-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Parcours Professionnel
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                Expériences professionnelles
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl">
                Des postes à responsabilité technique, axés sur la robustesse logicielle et l’excellence opérationnelle.
              </p>
            </div>
            <Link 
              to="/experiences"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors shrink-0"
            >
              <span>Voir la timeline complète</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Timeline List */}
          <div className="relative border-l-2 border-zinc-200 ml-3 md:ml-6 space-y-12">
            {experiences.slice(0, 3).map((exp) => (
              <div key={exp.id} className="relative pl-6 sm:pl-8">
                {/* Node */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-zinc-900"></div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-semibold">
                      {exp.period}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-500">{exp.location}</span>
                    {exp.is_current && (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                        Poste actuel
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-zinc-950">
                    {exp.role} <span className="text-zinc-500 font-normal">chez {exp.company}</span>
                  </h3>

                  <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">
                    {exp.description}
                  </p>

                  {/* Responsabilités */}
                  <ul className="space-y-1.5 pt-2 text-xs sm:text-sm text-zinc-700 max-w-3xl">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-zinc-400 font-mono select-none">—</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Technologies used */}
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {exp.technologies.map((t) => (
                      <Badge key={t} variant="neutral" size="sm">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. COMPÉTENCES TECHNIQUES ORGANISÉES */}
      <section className="py-16 sm:py-24 border-b border-zinc-200/80 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Stack & Savoir-faire
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
              Compétences techniques & technologies
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-2">
              Un socle technique pragmatique, maîtrisé sur des cas d'usage réels en production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Frontend */}
            <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
                <Code2 className="w-5 h-5 text-zinc-800" />
                <h3 className="font-bold text-zinc-900 text-base">Frontend</h3>
              </div>
              <ul className="space-y-2.5">
                {skillsByCategory.frontend.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-800">{s.name}</span>
                    {s.years_experience && (
                      <span className="text-xs font-mono text-zinc-400">{s.years_experience} ans</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend */}
            <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
                <Server className="w-5 h-5 text-zinc-800" />
                <h3 className="font-bold text-zinc-900 text-base">Backend</h3>
              </div>
              <ul className="space-y-2.5">
                {skillsByCategory.backend.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-800">{s.name}</span>
                    {s.years_experience && (
                      <span className="text-xs font-mono text-zinc-400">{s.years_experience} ans</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Database */}
            <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
                <Database className="w-5 h-5 text-zinc-800" />
                <h3 className="font-bold text-zinc-900 text-base">Database</h3>
              </div>
              <ul className="space-y-2.5">
                {skillsByCategory.database.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-800">{s.name}</span>
                    {s.years_experience && (
                      <span className="text-xs font-mono text-zinc-400">{s.years_experience} ans</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outils */}
            <div className="p-6 rounded-xl bg-white border border-zinc-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100">
                <Wrench className="w-5 h-5 text-zinc-800" />
                <h3 className="font-bold text-zinc-900 text-base">Outils & DevOps</h3>
              </div>
              <ul className="space-y-2.5">
                {skillsByCategory.tools.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-800">{s.name}</span>
                    {s.years_experience && (
                      <span className="text-xs font-mono text-zinc-400">{s.years_experience} ans</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="text-center mt-8">
            <Link 
              to="/competences"
              className="text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 underline"
            >
              Consulter l'ensemble détaillé des compétences & niveaux
            </Link>
          </div>

        </div>
      </section>

      {/* 6. BLOG / ARTICLES */}
      {recentPosts.length > 0 && (
        <section className="py-16 sm:py-24 border-b border-zinc-200/80 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  Publications & Retours d'expérience
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                  Articles de blog & veille technique
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 mt-2 max-w-2xl">
                  Partage de bonnes pratiques sur les architectures backend, l'optimisation des bases de données et la qualité de code.
                </p>
              </div>
              <Link 
                to="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors shrink-0"
              >
                <span>Tous les articles</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article 
                  key={post.id}
                  className="group flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 hover:shadow-md transition-all"
                >
                  <div className="aspect-16/9 overflow-hidden bg-zinc-100">
                    <img 
                      src={post.main_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.reading_time_minutes} min de lecture</span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-2">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-mono">
                        {new Date(post.published_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="font-medium text-zinc-900 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Lire l'article</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 7. SECTION CONTACT / CTA FINAL */}
      <section className="py-16 sm:py-24 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Disponible pour nouvelles missions
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Un projet d'application web, SaaS ou refonte d'API ?
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Discutons de vos besoins techniques et de vos objectifs métier. Je vous réponds sous 24h avec une estimation ou des recommandations concrètes.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              variant="primary"
              size="lg"
              to="/demande-service"
              className="bg-white text-zinc-950 hover:bg-zinc-100 font-semibold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Demander un service / devis
            </Button>
            <Button
              variant="outline"
              size="lg"
              to="/contact"
              className="border-zinc-700 text-white hover:bg-zinc-800"
            >
              Envoyer un message direct
            </Button>
          </div>

          <div className="pt-6 text-xs text-zinc-400 font-mono">
            <span>Email direct : {profile?.email || 'contact@alexandrerenard.dev'}</span>
          </div>
        </div>
      </section>

    </div>
  );
};
