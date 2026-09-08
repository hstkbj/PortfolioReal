import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { useServices } from '../../hooks/usePortfolio';
import { serviceSchema, ServiceFormData } from '../../schemas';
import { Service } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';

export const AdminServicesPage: React.FC = () => {
  const { data: services = [], createService, updateService, deleteService, isLoading } = useServices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      features: '',
      indicative_price: '',
      icon_name: 'laptop',
      is_active: true,
    },
  });

  const handleOpenCreate = () => {
    setEditingService(null);
    reset({
      title: '',
      slug: '',
      description: '',
      features: 'Conception d’architecture\nDéveloppement typé\nTests et mise en production',
      indicative_price: 'Sur devis / TJM',
      icon_name: 'laptop',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    reset({
      title: service.title,
      slug: service.slug,
      description: service.description,
      features: service.features.join('\n'),
      indicative_price: service.indicative_price || '',
      icon_name: service.icon_name,
      is_active: service.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Supprimer le service « ${title} » ?`)) {
      await deleteService(id);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    setIsSaving(true);
    try {
      const featuresArray = data.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const slugValue = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (editingService) {
        await updateService({
          id: editingService.id,
          updates: {
            title: data.title,
            slug: slugValue,
            description: data.description,
            features: featuresArray,
            indicative_price: data.indicative_price || undefined,
            icon_name: data.icon_name,
            is_active: data.is_active,
          },
        });
      } else {
        await createService({
          title: data.title,
          slug: slugValue,
          description: data.description,
          features: featuresArray,
          indicative_price: data.indicative_price || undefined,
          icon_name: data.icon_name,
          is_active: data.is_active,
          order_index: services.length + 1,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’enregistrement.');
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
            Offres & Prestations
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Services & Tarifs ({services.length})
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Définissez les offres techniques affichées aux prospects et sélectionnables lors des demandes de devis.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Ajouter un service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-6 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-zinc-900">{service.title}</h3>
                  <span className="text-[11px] font-mono text-zinc-400">/{service.slug}</span>
                </div>
                {service.indicative_price && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-100 text-zinc-700">
                    {service.indicative_price}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {service.description}
              </p>

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-mono text-zinc-400 uppercase">Fonctionnalités incluses :</span>
                <ul className="space-y-1 text-xs text-zinc-700">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                service.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
              }`}>
                {service.is_active ? 'Actif sur le site' : 'Désactivé'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="p-1.5 rounded hover:bg-zinc-100 text-zinc-600"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id, service.title)}
                  className="p-1.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-600"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Modifier le service' : 'Ajouter un service'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Titre du service *</label>
              <input
                type="text"
                placeholder="ex: Développement d'API REST"
                {...register('title')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Slug URL *</label>
              <input
                type="text"
                placeholder="ex: developpement-api-rest"
                {...register('slug')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.slug && <p className="text-xs text-red-600">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Description *</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Éléments inclus (1 par ligne) *</label>
            <textarea
              rows={4}
              placeholder="Architecture et documentation OpenAPI / Swagger&#10;Sécurisation JWT & OAuth2"
              {...register('features')}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.features && <p className="text-xs text-red-600">{errors.features.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Tarif indicatif</label>
              <input
                type="text"
                placeholder="À partir de 2 500 € ou 500 €/jour"
                {...register('indicative_price')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-medium text-zinc-700 uppercase">Icône</label>
              <select
                {...register('icon_name')}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="laptop">Laptop / Web</option>
                <option value="server">Server / Backend</option>
                <option value="layout">Layout / UI</option>
                <option value="layers">Layers / Architecture</option>
                <option value="wrench">Wrench / Maintenance</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800">
              <input
                type="checkbox"
                {...register('is_active')}
                className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900"
              />
              <span>Service actif (visible et sélectionnable)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isSaving}>
              {editingService ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
