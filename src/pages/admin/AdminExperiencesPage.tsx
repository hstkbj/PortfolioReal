import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useExperiences } from '../../hooks/usePortfolio';
import { experienceSchema, ExperienceFormData } from '../../schemas';
import { Experience } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminExperiencesPage: React.FC = () => {
  const { data: experiences = [], createExperience, updateExperience, deleteExperience } = useExperiences();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      role: '',
      company: '',
      location: '',
      period: '',
      is_current: false,
      description: '',
      responsibilities: '',
      technologies: '',
    },
  });

  const handleOpenCreate = () => {
    setEditingExp(null);
    reset({
      role: '',
      company: '',
      location: 'Paris & Remote',
      period: '2024 - Présent',
      is_current: true,
      description: '',
      responsibilities: 'Direction technique\nConception d’API REST\nRevue de code',
      technologies: 'PHP, Laravel, PostgreSQL, Docker',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp(exp);
    reset({
      role: exp.role,
      company: exp.company,
      location: exp.location,
      period: exp.period,
      is_current: exp.is_current,
      description: exp.description,
      responsibilities: exp.responsibilities.join('\n'),
      technologies: exp.technologies.join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, role: string) => {
    if (window.confirm(`Supprimer l'expérience « ${role} » ?`)) {
      await deleteExperience(id);
    }
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSaving(true);
    try {
      const respArray = data.responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const techArray = data.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        role: data.role,
        company: data.company,
        location: data.location,
        period: data.period,
        is_current: data.is_current,
        description: data.description,
        responsibilities: respArray,
        technologies: techArray,
      };

      if (editingExp) {
        await updateExperience({ id: editingExp.id, updates: payload });
      } else {
        await createExperience({
          ...payload,
          order_index: experiences.length + 1,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Carrière
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Expériences professionnelles ({experiences.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Gérez les étapes clés de votre carrière affichées sur la timeline.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Ajouter une expérience
        </Button>
      </div>

      {/* Experience list */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-zinc-900">{exp.role}</h3>
                <span className="text-zinc-500 font-medium">chez {exp.company}</span>
                {exp.is_current && (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-mono">
                    Actuel
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                <span>{exp.period}</span>
                <span>•</span>
                <span>{exp.location}</span>
              </div>
              <p className="text-xs text-zinc-600 line-clamp-2 max-w-2xl pt-1">
                {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEdit(exp)}
                className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600"
                title="Modifier"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id, exp.role)}
                className="p-2 rounded-lg border border-zinc-200 hover:bg-red-50 text-zinc-400 hover:text-red-600"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Modifier l’expérience' : 'Ajouter une expérience'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Intitulé du poste *</label>
              <input
                type="text"
                {...register('role')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Entreprise *</label>
              <input
                type="text"
                {...register('company')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.company && <p className="text-xs text-red-600">{errors.company.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Période (ex: 2022 - 2024) *</label>
              <input
                type="text"
                {...register('period')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Localisation *</label>
              <input
                type="text"
                {...register('location')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Description générale du rôle *</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Responsabilités (1 par ligne) *</label>
            <textarea
              rows={4}
              placeholder="Architecture d'une API haute disponibilité&#10;Management technique d'une équipe de 4 développeurs"
              {...register('responsibilities')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Technologies (séparées par virgules) *</label>
            <input
              type="text"
              placeholder="Laravel, PostgreSQL, Docker, Redis"
              {...register('technologies')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
              <input
                type="checkbox"
                {...register('is_current')}
                className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900"
              />
              <span>Poste actuellement occupé</span>
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              {editingExp ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
