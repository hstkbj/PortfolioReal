import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Check, 
  Save, 
  Camera, 
  Upload, 
  Trash2, 
  User, 
  Lock, 
  Database, 
  ExternalLink, 
  Copy, 
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useProfile } from '../../hooks/usePortfolio';
import { useAuth } from '../../context/AuthContext';
import { profileSchema, ProfileFormData } from '../../schemas';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

export const AdminProfilePage: React.FC = () => {
  const { data: profile, updateProfile, isUpdating } = useProfile();
  const { user, updatePassword } = useAuth();

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password update state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passNotice, setPassNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Supabase migration & tables check state
  const [tablesStatus, setTablesStatus] = useState<Record<string, boolean> | null>(null);
  const [isCheckingTables, setIsCheckingTables] = useState(false);
  const [hasCopiedSql, setHasCopiedSql] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      title: '',
      tagline: '',
      bio_short: '',
      bio_full: '',
      avatar_url: '',
      years_of_experience: 5,
      completed_projects_count: 20,
      email: '',
      phone: '',
      whatsapp: '',
      location: '',
      github_url: '',
      linkedin_url: '',
      twitter_url: '',
      is_available_for_hire: true,
    },
  });

  const watchedAvatarUrl = watch('avatar_url');

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name,
        title: profile.title,
        tagline: profile.tagline,
        bio_short: profile.bio_short,
        bio_full: profile.bio_full,
        avatar_url: profile.avatar_url,
        years_of_experience: profile.years_of_experience,
        completed_projects_count: profile.completed_projects_count,
        email: profile.email,
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || '',
        location: profile.location,
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
        is_available_for_hire: profile.is_available_for_hire,
      });
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile, reset]);

  // Handle local photo file upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setValue('avatar_url', result, { shouldDirty: true, shouldValidate: true });
        setSuccessNotice('Photo chargée ! Cliquez sur "Enregistrer les modifications" pour l\'appliquer.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    const defaultPlaceholder = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop';
    setAvatarPreview(defaultPlaceholder);
    setValue('avatar_url', defaultPlaceholder, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (data: ProfileFormData) => {
    setErrorMessage(null);
    setSuccessNotice(null);
    try {
      await updateProfile(data);
      setSuccessNotice('Profil et photo enregistrés avec succès ! Les modifications sont visibles sur le site.');
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la mise à jour du profil.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassNotice(null);

    if (newPassword.length < 6) {
      setPassNotice({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caractères.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassNotice({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setIsChangingPass(true);
    const res = await updatePassword(newPassword);
    setIsChangingPass(false);

    if (res.success) {
      setPassNotice({ type: 'success', message: 'Votre mot de passe a été mis à jour avec succès !' });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPassNotice({ type: 'error', message: res.error || 'Erreur lors du changement de mot de passe.' });
    }
  };

  const checkTables = async () => {
    setIsCheckingTables(true);
    const res = await api.checkSupabaseTables();
    setTablesStatus(res);
    setIsCheckingTables(false);
  };

  const copySqlMigration = async () => {
    try {
      const response = await fetch('/supabase_migration.sql');
      const sqlText = await response.text();
      await navigator.clipboard.writeText(sqlText);
      setHasCopiedSql(true);
      setTimeout(() => setHasCopiedSql(false), 4000);
    } catch {
      setHasCopiedSql(true);
      setTimeout(() => setHasCopiedSql(false), 4000);
    }
  };

  const handlePurgeDemo = () => {
    if (window.confirm('Voulez-vous réinitialiser le portfolio en vidant les données démo ? Vous pourrez ensuite saisir vos vrais projets.')) {
      api.purgeLocalDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Paramètres d'identité & Visuels
          </span>
          <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">
            Mon Profil & Ma Photo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Mettez à jour votre photo de profil, vos compétences de présentation, coordonnées et accès sécurisé.
          </p>
        </div>

        {successNotice && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* FORMULAIRE PRINCIPAL DU PROFIL */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* SECTION 1: PHOTO DE PROFIL & AVATAR (Mise en avant) */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono flex items-center gap-2">
                <Camera className="w-4 h-4 text-zinc-700" />
                <span>Photo de profil du développeur</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Cette photo s'affiche sur la page d'accueil, la page À propos et l'en-tête de votre portfolio.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Synchronisation instantanée
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Visual Avatar preview */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-zinc-200 bg-zinc-100 shadow-xs relative">
                <img
                  src={avatarPreview || watchedAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'}
                  alt="Aperçu photo de profil"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 shadow-md transition-transform active:scale-95"
                title="Changer la photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Actions & File Picker */}
            <div className="space-y-4 flex-1 w-full">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload className="w-4 h-4" />}
                  >
                    Choisir une photo depuis mon appareil
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleRemovePhoto}
                    leftIcon={<Trash2 className="w-4 h-4 text-zinc-400" />}
                  >
                    Réinitialiser
                  </Button>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono mt-2">
                  Formats acceptés : PNG, JPG, WebP. L'image est automatiquement optimisée pour le web.
                </p>
              </div>

              {/* Direct image URL */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                <label className="block text-xs font-mono font-medium text-zinc-600 uppercase">
                  Ou saisir directement une URL d'image web :
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  {...register('avatar_url')}
                  onChange={(e) => {
                    register('avatar_url').onChange(e);
                    setAvatarPreview(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: IDENTITÉ & COORDONNÉES */}
        <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
          <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono border-b border-zinc-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-zinc-700" />
            <span>Identité & Présentation professionnelle</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Nom complet *
              </label>
              <input
                type="text"
                placeholder="Votre Prénom & Nom"
                {...register('full_name')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.full_name && <p className="text-xs text-red-600">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Titre professionnel *
              </label>
              <input
                type="text"
                placeholder="ex: Développeur Web Fullstack & Architecte Cloud"
                {...register('title')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
              Accroche principale (Tagline) *
            </label>
            <input
              type="text"
              placeholder="ex: Conception d'applications web modernes, performantes et scalables"
              {...register('tagline')}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.tagline && <p className="text-xs text-red-600">{errors.tagline.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
              Courte bio (Affichée sur la page d'accueil) *
            </label>
            <textarea
              rows={3}
              placeholder="Présentez brièvement vos compétences clés..."
              {...register('bio_short')}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.bio_short && <p className="text-xs text-red-600">{errors.bio_short.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
              Biographie complète (Page À propos) *
            </label>
            <textarea
              rows={6}
              placeholder="Détaillez votre parcours, vos convictions techniques et votre approche métier..."
              {...register('bio_full')}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            {errors.bio_full && <p className="text-xs text-red-600">{errors.bio_full.message}</p>}
          </div>

          {/* Coordonnées */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Email public *
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Téléphone
              </label>
              <input
                type="text"
                placeholder="+33 6 ..."
                {...register('phone')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Localisation *
              </label>
              <input
                type="text"
                placeholder="ex: Paris, France / Remote"
                {...register('location')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Liens réseaux sociaux */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Lien GitHub *
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                {...register('github_url')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Lien LinkedIn *
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                {...register('linkedin_url')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Lien Twitter / X
              </label>
              <input
                type="url"
                placeholder="https://twitter.com/..."
                {...register('twitter_url')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Disponibilité & Métriques */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Années d'expérience
              </label>
              <input
                type="number"
                min={0}
                {...register('years_of_experience', { valueAsNumber: true })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Projets réalisés
              </label>
              <input
                type="number"
                min={0}
                {...register('completed_projects_count', { valueAsNumber: true })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_available_for_hire')}
                  className="w-4 h-4 rounded text-zinc-900 focus:ring-zinc-900"
                />
                <span className="text-xs font-medium text-zinc-800">
                  Disponible pour nouveaux projets (badge vert)
                </span>
              </label>
            </div>
          </div>

          {/* Bouton Enregistrer Profil */}
          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isUpdating}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Enregistrer les modifications du profil
            </Button>
          </div>
        </div>

      </form>

      {/* SECTION 3: SÉCURITÉ & ACCÈS ADMINISTRATEUR (Changement mot de passe) */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
        <div className="border-b border-zinc-100 pb-4">
          <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono flex items-center gap-2">
            <Lock className="w-4 h-4 text-zinc-700" />
            <span>Sécurité du compte & Mot de passe administrateur</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Votre identifiant administrateur est configuré sur <strong className="text-zinc-900 font-mono">soheholmes7@gmail.com</strong>.
          </p>
        </div>

        {passNotice && (
          <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            passNotice.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {passNotice.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{passNotice.message}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
              Identifiant de connexion
            </label>
            <input
              type="text"
              readOnly
              value={user?.email || 'soheholmes7@gmail.com'}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 text-sm font-mono cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 caractères"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Confirmer le mot de passe
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="secondary"
              size="md"
              isLoading={isChangingPass}
              disabled={!newPassword || !confirmPassword}
            >
              Mettre à jour mon mot de passe
            </Button>
          </div>
        </form>
      </div>

      {/* SECTION 4: ASSISTANT MIGRATION SUPABASE & GESTION DES DONNÉES */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 bg-white shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Base de données Supabase & Migration</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Projet connecté : <span className="font-mono text-zinc-800">qynznggnsmrnogkuzzju</span>
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={checkTables}
            isLoading={isCheckingTables}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Vérifier l'état des tables Supabase
          </Button>
        </div>

        {/* Tables diagnostic grid if checked */}
        {tablesStatus && (
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
            <span className="text-xs font-mono font-bold text-zinc-700 uppercase block">
              État de synchronisation des 9 tables PostgreSQL :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              {Object.entries(tablesStatus).map(([table, exists]) => (
                <div key={table} className="flex items-center justify-between p-2 rounded-lg bg-white border border-zinc-200">
                  <span className="text-zinc-700 truncate">{table}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    exists ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {exists ? 'Prête' : 'À créer'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-5 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3">
          <h3 className="text-xs font-bold text-blue-900 uppercase font-mono">
            Exécuter la migration Supabase en 2 clics :
          </h3>
          <p className="text-xs text-blue-800 leading-relaxed">
            Pour initialiser les tables et activer les règles de sécurité Row-Level Security (RLS) sur votre projet Supabase :
          </p>

          <ol className="list-decimal list-inside text-xs text-blue-800 space-y-1.5 font-mono">
            <li>Copiez le script SQL complet prêt à l'emploi ci-dessous.</li>
            <li>Ouvrez l'éditeur SQL de votre projet Supabase.</li>
            <li>Collez et cliquez sur <strong>Run</strong>.</li>
          </ol>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={copySqlMigration}
              leftIcon={hasCopiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {hasCopiedSql ? 'Script SQL copié !' : 'Copier le script SQL de migration'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              href="https://supabase.com/dashboard/project/qynznggnsmrnogkuzzju/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Ouvrir l'éditeur SQL Supabase
            </Button>
          </div>
        </div>

        {/* Purge demo data button */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-zinc-900 block font-mono">
              Nettoyer les données de démonstration
            </span>
            <p className="text-xs text-zinc-500">
              Supprime tous les exemples pré-remplis pour avoir un portfolio vierge prêt pour vos vrais projets.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePurgeDemo}
            className="text-red-600 hover:bg-red-50 border-red-200"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Purger les données démo
          </Button>
        </div>

      </div>

    </div>
  );
};
