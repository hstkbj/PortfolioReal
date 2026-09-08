import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useSkills } from '../../hooks/usePortfolio';
import { skillSchema, SkillFormData } from '../../schemas';
import { Skill, SkillCategoryType } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminSkillsPage: React.FC = () => {
  const { data: skills = [], createSkill, updateSkill, deleteSkill, isLoading } = useSkills();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      category: 'frontend',
      level_percentage: 85,
      years_experience: 3,
      is_featured: false,
    },
  });

  const handleOpenCreate = () => {
    setEditingSkill(null);
    reset({
      name: '',
      category: 'frontend',
      level_percentage: 85,
      years_experience: 3,
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    reset({
      name: skill.name,
      category: skill.category,
      level_percentage: skill.level_percentage || 80,
      years_experience: skill.years_experience || 3,
      is_featured: Boolean(skill.is_featured),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Supprimer la compétence « ${name} » ?`)) {
      await deleteSkill(id);
    }
  };

  const onSubmit = async (data: SkillFormData) => {
    setIsSaving(true);
    try {
      if (editingSkill) {
        await updateSkill({ id: editingSkill.id, updates: data });
      } else {
        await createSkill({
          ...data,
          order_index: skills.length + 1,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSkills = skills.filter(
    (s) => filterCategory === 'all' || s.category === filterCategory
  );

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Gestion technique
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Compétences & Technologies ({skills.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Ajoutez, ajustez le niveau de maîtrise ou supprimez des compétences.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Ajouter une compétence
        </Button>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {['all', 'frontend', 'backend', 'database', 'tools'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filterCategory === cat
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            {cat === 'all' ? 'Toutes' : cat}
          </button>
        ))}
      </div>

      {/* Skills list table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-mono uppercase text-[11px]">
            <tr>
              <th className="py-3 px-4 font-semibold">Compétence</th>
              <th className="py-3 px-4 font-semibold">Catégorie</th>
              <th className="py-3 px-4 font-semibold">Niveau</th>
              <th className="py-3 px-4 font-semibold">Expérience</th>
              <th className="py-3 px-4 font-semibold text-center">Top</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredSkills.map((skill) => (
              <tr key={skill.id} className="hover:bg-zinc-50/60">
                <td className="py-3 px-4 font-bold text-zinc-900">
                  {skill.name}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-xs font-mono uppercase bg-zinc-100 text-zinc-700">
                    {skill.category}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full"
                        style={{ width: `${skill.level_percentage || 50}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-zinc-500">
                      {skill.level_percentage}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-zinc-600">
                  {skill.years_experience ? `${skill.years_experience} ans` : '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  {skill.is_featured ? (
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
                      onClick={() => handleOpenEdit(skill)}
                      className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id, skill.name)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-zinc-400 hover:text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Modifier la compétence' : 'Ajouter une compétence'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Nom de la compétence *</label>
            <input
              type="text"
              placeholder="ex: React.js, Laravel, Docker..."
              {...register('name')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Catégorie *</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Base de données</option>
              <option value="tools">Outils & DevOps</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Maîtrise (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                {...register('level_percentage', { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Années d'expérience</label>
              <input
                type="number"
                min={0}
                max={30}
                {...register('years_experience', { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
              <input
                type="checkbox"
                {...register('is_featured')}
                className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900"
              />
              <span>Mettre en avant sur la page d'accueil</span>
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              {editingSkill ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
