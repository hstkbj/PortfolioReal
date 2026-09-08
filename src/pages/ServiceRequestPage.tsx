import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  FileText, 
  Calendar, 
  DollarSign, 
  Mail, 
  Phone, 
  MessageSquare 
} from 'lucide-react';
import { serviceRequestSchema, ServiceRequestFormData } from '../schemas';
import { useServiceRequests, useServices } from '../hooks/usePortfolio';
import { Button } from '../components/common/Button';

export const ServiceRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get('service') || '';
  const { submitServiceRequest, isSubmitting } = useServiceRequests();
  const { data: services = [] } = useServices();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      client_name: '',
      email: '',
      phone: '',
      company: '',
      service_title: prefilledService || '',
      description: '',
      budget: '',
      timeline: '',
      preferred_contact_method: 'email',
      attachment_url: '',
      honeypot: '',
    },
  });

  useEffect(() => {
    if (prefilledService) {
      setValue('service_title', prefilledService);
    }
  }, [prefilledService, setValue]);

  const onSubmit = async (data: ServiceRequestFormData) => {
    // Basic anti-spam check
    if (data.honeypot) {
      return;
    }

    setErrorMessage(null);
    try {
      await submitServiceRequest({
        client_name: data.client_name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        service_title: data.service_title,
        description: data.description,
        budget: data.budget,
        timeline: data.timeline,
        attachment_url: data.attachment_url,
        preferred_contact_method: data.preferred_contact_method,
      });
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de l’envoi de votre demande.');
    }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour aux services</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Devis & Commande
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Demander un service ou un devis
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Remplissez ce formulaire détaillé pour présenter votre besoin. Je prendrai connaissance de votre projet et reviendrai vers vous avec une estimation ou des questions de cadrage sous 24h ouvrées.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-emerald-950">
              Votre demande a bien été enregistrée !
            </h2>
            <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
              Merci pour votre confiance. Vos informations ont été enregistrées avec succès. Vous recevrez une réponse personnalisée très prochainement.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsSuccess(false)}
                className="bg-white"
              >
                Envoyer une autre demande
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-6"
            noValidate
          >
            {/* Honeypot anti-spam */}
            <input
              type="text"
              {...register('honeypot')}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {errorMessage && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Service souhaité */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                Service souhaité <span className="text-red-500">*</span>
              </label>
              <select
                {...register('service_title')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              >
                <option value="">Sélectionner un type de service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="Autre besoin sur-mesure">Autre besoin spécifique sur-mesure</option>
              </select>
              {errors.service_title && (
                <p className="text-xs text-red-600 mt-1">{errors.service_title.message}</p>
              )}
            </div>

            {/* Two columns: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                  Votre nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Jean Dupont"
                  {...register('client_name')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                />
                {errors.client_name && (
                  <p className="text-xs text-red-600 mt-1">{errors.client_name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                  Adresse email professionnelle <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="jean.dupont@entreprise.fr"
                  {...register('email')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Two columns: Phone & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  {...register('phone')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                  Entreprise ou organisation (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Acme SAS"
                  {...register('company')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                Description de votre besoin & fonctionnalités attendues <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Décrivez votre projet, vos utilisateurs cibles, vos fonctionnalités prioritaires et toute contrainte technique..."
                {...register('description')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all leading-relaxed"
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Budget & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                  Budget indicatif
                </label>
                <select
                  {...register('budget')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                >
                  <option value="">Sélectionner une fourchette...</option>
                  <option value="Moins de 2 000 €">&lt; 2 000 €</option>
                  <option value="2 000 € - 5 000 €">2 000 € - 5 000 €</option>
                  <option value="5 000 € - 10 000 €">5 000 € - 10 000 €</option>
                  <option value="Plus de 10 000 €">&gt; 10 000 €</option>
                  <option value="TJM / Régie (au temps passé)">TJM / Régie (au temps passé)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                  Délai souhaité de démarrage
                </label>
                <select
                  {...register('timeline')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                >
                  <option value="">Sélectionner un horizon...</option>
                  <option value="Immédiat (sous 1 à 2 semaines)">Immédiat (sous 1 à 2 semaines)</option>
                  <option value="Dans le mois">Dans le mois</option>
                  <option value="Sous 2 à 3 mois">Sous 2 à 3 mois</option>
                  <option value="Projet exploratoire / Devis préalable">Projet exploratoire / Devis préalable</option>
                </select>
              </div>
            </div>

            {/* Preferred contact method */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                Moyen de contact préféré <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                  <input
                    type="radio"
                    value="email"
                    {...register('preferred_contact_method')}
                    className="text-zinc-900 focus:ring-zinc-900"
                  />
                  <span className="text-xs sm:text-sm font-medium text-zinc-800">Email</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                  <input
                    type="radio"
                    value="phone"
                    {...register('preferred_contact_method')}
                    className="text-zinc-900 focus:ring-zinc-900"
                  />
                  <span className="text-xs sm:text-sm font-medium text-zinc-800">Téléphone</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                  <input
                    type="radio"
                    value="whatsapp"
                    {...register('preferred_contact_method')}
                    className="text-zinc-900 focus:ring-zinc-900"
                  />
                  <span className="text-xs sm:text-sm font-medium text-zinc-800">WhatsApp</span>
                </label>
              </div>
            </div>

            {/* Lien ou pièce jointe optionnelle (URL cahier des charges, Figma, etc.) */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                Lien vers cahier des charges / Figma / Doc (optionnel)
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/... ou https://figma.com/..."
                {...register('attachment_url')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-xs text-zinc-500 font-mono">
                Vos données restent strictement confidentielles.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
                id="btn-submit-service-request"
              >
                Envoyer la demande
              </Button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
