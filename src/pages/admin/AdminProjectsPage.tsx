import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Star, 
  AlertCircle 
} from 'lucide-react';
import { useProjects } from '../../hooks/usePortfolio';
import { projectSchema, ProjectFormData } from '../../schemas';
import { Project } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminProjectsPage: React.FC = () => {
  const { data: projects = [], createProject, updateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      description_short: '',
      description_full: '',
      main_image: '',
      technologies: '',
      category: 'saas',
      client: '',
      date: new Date().getFullYear().toString(),
      github_url: '',
      demo_url: '',
      is_featured: false,
      status: 'completed',
    },
  });

  const handleOpenCreate = () => {
    setEditingProject(null);
    reset({
      title: '',
      slug: '',
      description_short: '',
      description_full: '',
      main_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      technologies: 'React, TypeScript, Node.js, PostgreSQL',
      category: 'saas',
      client: '',
      date: new Date().getFullYear().toString(),
      github_url: '',
      demo_url: '',
      is_featured: false,
      status: 'completed',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    reset({
      title: project.title,
      slug: project.slug,
      description_short: project.description_short,
      description_full: project.description_full,
      main_image: project.main_image,
      technologies: project.technologies.join(', '),
      category: project.category,
      client: project.client || '',
      date: project.date,
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      is_featured: project.is_featured,
      status: project.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Êtes-vous certain de vouloir supprimer définitivement le projet « ${title} » ?`)) {
      try {
        await deleteProject(id);
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSaving(true);
    setErrorNotice(null);
    try {
      const techArray = data.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const slugValue = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const payload = {
        title: data.title,
        slug: slugValue,
        description_short: data.description_short,
        description_full: data.description_full,
        main_image: data.main_image,
        technologies: techArray,
        category: data.category,
        client: data.client || undefined,
        date: data.date,
        github_url: data.github_url || undefined,
        demo_url: data.demo_url || undefined,
        is_featured: data.is_featured,
        status: data.status,
      };

      if (editingProject) {
        await updateProject({
          id: editingProject.id,
          updates: payload,
        });
      } else {
        await createProject({
          ...payload,
          gallery_images: [],
          order_index: projects.length + 1,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorNotice(err.message || 'Erreur lors de l’enregistrement du projet.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Gestion du portfolio
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Projets & Réalisations ({projects.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Ajoutez, éditez ou mettez en vedette les projets visibles sur le site public.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Ajouter un projet
        </Button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Filtrer par titre, techno..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Projet</th>
                <th className="py-3.5 px-4 font-semibold">Catégorie</th>
                <th className="py-3.5 px-4 font-semibold">Stack</th>
                <th className="py-3.5 px-4 font-semibold">Statut</th>
                <th className="py-3.5 px-4 font-semibold text-center">Vedette</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400 font-mono text-xs">
                    Aucun projet ne correspond à vos critères.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.main_image}
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-zinc-900 block">{project.title}</span>
                          <span className="text-zinc-400 font-mono text-[11px]">/{project.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-mono uppercase bg-zinc-100 text-zinc-700">
                        {project.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 text-[11px] font-mono">
                            {t}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-[10px] text-zinc-400 font-mono self-center">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                        project.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {project.status === 'completed' ? 'Livré' : project.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {project.is_featured ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-mono text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>Oui</span>
                        </span>
                      ) : (
                        <span className="text-zinc-300 font-mono text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Project */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Modifier le projet' : 'Ajouter un nouveau projet'}
        description="Renseignez les détails techniques, visuels et le contexte de réalisation."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorNotice && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Titre du projet *</label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Slug URL</label>
              <input
                type="text"
                placeholder="ex: plateforme-saas-gestion"
                {...register('slug')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Description courte *</label>
            <textarea
              rows={2}
              {...register('description_short')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.description_short && <p className="text-xs text-red-600">{errors.description_short.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Description détaillée & architecture *</label>
            <textarea
              rows={5}
              {...register('description_full')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.description_full && <p className="text-xs text-red-600">{errors.description_full.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Image principale (URL) *</label>
              <input
                type="url"
                {...register('main_image')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Technologies (séparées par des virgules) *</label>
              <input
                type="text"
                placeholder="Laravel, React, PostgreSQL, Docker"
                {...register('technologies')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.technologies && <p className="text-xs text-red-600">{errors.technologies.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Catégorie</label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="saas">SaaS</option>
                <option value="web-app">Application Web</option>
                <option value="api">API & Microservices</option>
                <option value="ecommerce">E-commerce</option>
                <option value="cms">CMS</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Année</label>
              <input
                type="text"
                {...register('date')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Client</label>
              <input
                type="text"
                placeholder="ex: FinCorp SAS"
                {...register('client')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">URL Démo en ligne</label>
              <input
                type="url"
                placeholder="https://..."
                {...register('demo_url')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">URL Code GitHub</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                {...register('github_url')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
              <input
                type="checkbox"
                {...register('is_featured')}
                className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900"
              />
              <span>Mettre en vedette (Page d'accueil)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
              <select
                {...register('status')}
                className="px-2 py-1 rounded border border-zinc-200 text-xs bg-white"
              >
                <option value="completed">Statut : Livré en production</option>
                <option value="in-progress">Statut : En cours</option>
                <option value="archived">Statut : Archivé</option>
              </select>
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              {editingProject ? 'Enregistrer les modifications' : 'Créer le projet'}
            </Button>
          </div>

        </form>
      </Modal>

    </div>
  );
};
