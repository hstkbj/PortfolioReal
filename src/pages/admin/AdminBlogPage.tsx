import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useBlogPosts } from '../../hooks/usePortfolio';
import { blogPostSchema, BlogPostFormData } from '../../schemas';
import { BlogPost } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminBlogPage: React.FC = () => {
  const { data: posts = [], createBlogPost, updateBlogPost, deleteBlogPost } = useBlogPosts(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      content: '',
      main_image: '',
      category: 'Architecture',
      tags: 'Backend, Architecture, CleanCode',
      author: 'Alexandre Renard',
      reading_time_minutes: 5,
      status: 'published',
    },
  });

  const handleOpenCreate = () => {
    setEditingPost(null);
    reset({
      title: '',
      slug: '',
      summary: '',
      content: '## Introduction\n\nContenu rédigé de l\'article...\n\n## Bonnes pratiques\n\nExplications techniques détaillées.',
      main_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
      category: 'Architecture',
      tags: 'Backend, Architecture, CleanCode',
      author: 'Alexandre Renard',
      reading_time_minutes: 6,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    reset({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      main_image: post.main_image,
      category: post.category,
      tags: post.tags.join(', '),
      author: post.author,
      reading_time_minutes: post.reading_time_minutes,
      status: post.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Supprimer l'article « ${title} » ?`)) {
      await deleteBlogPost(id);
    }
  };

  const onSubmit = async (data: BlogPostFormData) => {
    setIsSaving(true);
    try {
      const tagsArray = data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const slugValue = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const payload = {
        title: data.title,
        slug: slugValue,
        summary: data.summary,
        content: data.content,
        main_image: data.main_image,
        category: data.category,
        tags: tagsArray,
        author: data.author,
        reading_time_minutes: data.reading_time_minutes,
        status: data.status,
        published_at: editingPost ? editingPost.published_at : new Date().toISOString(),
      };

      if (editingPost) {
        await updateBlogPost({ id: editingPost.id, updates: payload });
      } else {
        await createBlogPost(payload);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Publications
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Articles de blog ({posts.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Rédigez et publiez des articles techniques pour démontrer votre expertise.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nouvel article
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-mono uppercase text-[11px]">
            <tr>
              <th className="py-3 px-4 font-semibold">Titre</th>
              <th className="py-3 px-4 font-semibold">Catégorie</th>
              <th className="py-3 px-4 font-semibold">Lecture</th>
              <th className="py-3 px-4 font-semibold">Statut</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-zinc-50/60">
                <td className="py-3 px-4">
                  <span className="font-bold text-zinc-900 block">{post.title}</span>
                  <span className="text-xs text-zinc-400 font-mono">/blog/{post.slug}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-100 text-zinc-700">
                    {post.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-zinc-600">
                  {post.reading_time_minutes} min
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {post.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-zinc-500">
                  {new Date(post.published_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(post)}
                      className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="p-1.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-600"
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
        title={editingPost ? 'Modifier l’article' : 'Rédiger un nouvel article'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Titre de l'article *</label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Slug URL</label>
              <input
                type="text"
                placeholder="ex: architecture-api-robuste"
                {...register('slug')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Résumé court *</label>
            <textarea
              rows={2}
              {...register('summary')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.summary && <p className="text-xs text-red-600">{errors.summary.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Contenu (Markdown supporté) *</label>
            <textarea
              rows={8}
              {...register('content')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 font-mono text-xs"
            />
            {errors.content && <p className="text-xs text-red-600">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Image de couverture (URL) *</label>
              <input
                type="url"
                {...register('main_image')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Catégorie *</label>
              <input
                type="text"
                placeholder="Architecture, Base de données, Backend..."
                {...register('category')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Tags (virgules) *</label>
              <input
                type="text"
                placeholder="PostgreSQL, Laravel, Indexing"
                {...register('tags')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Auteur</label>
              <input
                type="text"
                {...register('author')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Temps de lecture (min)</label>
              <input
                type="number"
                {...register('reading_time_minutes', { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
              <select
                {...register('status')}
                className="px-2 py-1 rounded border border-zinc-200 text-xs bg-white font-mono"
              >
                <option value="published">Statut : Publié</option>
                <option value="draft">Statut : Brouillon</option>
              </select>
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              {editingPost ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
