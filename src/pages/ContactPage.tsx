import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Github, 
  Linkedin, 
  MessageSquare 
} from 'lucide-react';
import { contactSchema, ContactFormData } from '../schemas';
import { useContactMessages, useProfile } from '../hooks/usePortfolio';
import { Button } from '../components/common/Button';

export const ContactPage: React.FC = () => {
  const { data: profile } = useProfile();
  const { submitContactMessage, isSubmitting } = useContactMessages();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      honeypot: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Anti-spam honeypot
    if (data.honeypot) {
      return;
    }

    setErrorMessage(null);
    try {
      await submitContactMessage({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de l’envoi de votre message.');
    }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Contact
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Échangeons sur votre projet
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Vous avez une question technique, une opportunité de mission ou un projet à lancer ? Laissez-moi un message, je réponds sous 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
              <h2 className="text-lg font-bold text-zinc-900">
                Coordonnées professionnelles
              </h2>

              <div className="space-y-4 text-sm text-zinc-600">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-zinc-400 uppercase block">Email</span>
                    <a 
                      href={`mailto:${profile?.email}`}
                      className="font-medium text-zinc-900 hover:underline"
                    >
                      {profile?.email}
                    </a>
                  </div>
                </div>

                {profile?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-mono text-zinc-400 uppercase block">Téléphone / WhatsApp</span>
                      <a 
                        href={`tel:${profile.phone}`}
                        className="font-medium text-zinc-900 hover:underline"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-mono text-zinc-400 uppercase block">Localisation</span>
                    <span className="font-medium text-zinc-900">{profile?.location}</span>
                  </div>
                </div>
              </div>

              {/* Status pill */}
              <div className="pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{profile?.is_available_for_hire ? 'Disponible immédiatement pour nouvelles missions' : 'Actuellement indisponible'}</span>
              </div>
            </div>

            {/* Social links */}
            <div className="p-6 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-3">
              <h3 className="text-xs font-mono font-semibold uppercase text-zinc-500 tracking-wider">
                Profils & Réseaux
              </h3>
              <div className="flex flex-col gap-2 text-sm">
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-zinc-700 hover:text-zinc-950 font-medium"
                  >
                    <Github className="w-4 h-4" />
                    <span>Profil GitHub ({profile.github_url.split('/').pop()})</span>
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-zinc-700 hover:text-zinc-950 font-medium"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>Profil LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="p-8 sm:p-12 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-emerald-950">
                  Message envoyé avec succès !
                </h2>
                <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Merci de m’avoir contacté. Votre message a été reçu et enregistré. Je vous répondrai dans les plus brefs délais.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setIsSuccess(false)}
                    className="bg-white"
                  >
                    Envoyer un autre message
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-5"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                      Votre nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Marc Lefèvre"
                      {...register('name')}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                      Votre adresse email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="marc@entreprise.com"
                      {...register('email')}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                    Sujet de votre message <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Proposition de mission freelance / Refonte d'application"
                    {...register('subject')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-zinc-800 uppercase tracking-wide">
                    Votre message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Précisez votre demande, le contexte de votre entreprise ou votre calendrier..."
                    {...register('message')}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all leading-relaxed"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-mono">
                    Réponse garantie sous 24h
                  </span>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-4 h-4" />}
                    id="btn-submit-contact"
                  >
                    Envoyer le message
                  </Button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
