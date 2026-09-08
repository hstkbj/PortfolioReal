import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, 
  BookOpen, 
  Inbox, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Database,
  ExternalLink,
  Plus,
  Camera,
  UserCheck
} from 'lucide-react';
import { 
  useProjects, 
  useBlogPosts, 
  useServiceRequests, 
  useContactMessages, 
  useProfile 
} from '../../hooks/usePortfolio';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const AdminDashboardOverview: React.FC = () => {
  const { isSupabaseConfigured } = useAuth();
  const { data: profile } = useProfile();
  const { data: projects = [] } = useProjects();
  const { data: posts = [] } = useBlogPosts(false);
  const { data: serviceRequests = [] } = useServiceRequests();
  const { data: messages = [] } = useContactMessages();

  const newRequests = serviceRequests.filter((r) => r.status === 'nouveau');
  const unreadMessages = messages.filter((m) => !m.is_read);

  const stats = [
    {
      title: 'Projets réalisés',
      value: projects.length,
      detail: `${projects.filter(p => p.is_featured).length} en vedette`,
      icon: <FolderGit2 className="w-5 h-5 text-blue-600" />,
      link: '/admin/projets',
    },
    {
      title: 'Articles de blog',
      value: posts.length,
      detail: `${posts.filter(p => p.status === 'published').length} publiés`,
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      link: '/admin/blog',
    },
    {
      title: 'Demandes de service',
      value: serviceRequests.length,
      detail: `${newRequests.length} nouvelle(s)`,
      icon: <Inbox className="w-5 h-5 text-amber-600" />,
      link: '/admin/demandes',
      highlight: newRequests.length > 0,
    },
    {
      title: 'Messages reçus',
      value: messages.length,
      detail: `${unreadMessages.length} non lu(s)`,
      icon: <MessageSquare className="w-5 h-5 text-purple-600" />,
      link: '/admin/messages',
      highlight: unreadMessages.length > 0,
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Tableau de bord
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
            Bonjour, {profile?.full_name || 'Alexandre'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Gérez vos contenus, répondez aux prospects et pilotez vos publications en un seul endroit.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" to="/admin/projets" leftIcon={<Plus className="w-4 h-4" />}>
            Nouveau projet
          </Button>
          <Button variant="secondary" size="sm" to="/admin/blog" leftIcon={<Plus className="w-4 h-4" />}>
            Nouvel article
          </Button>
        </div>
      </div>

      {/* Profil & Photo Quick Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="relative group">
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'}
              alt={profile?.full_name || 'Photo de profil'}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-zinc-100 shadow-xs"
            />
            <Link
              to="/admin/profil"
              className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs"
              title="Changer ma photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-zinc-950">
                {profile?.full_name || 'Développeur Fullstack'}
              </h2>
              {profile?.is_available_for_hire && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Disponible
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {profile?.title || 'Développeur Web & Architecte'} • {profile?.location || 'Paris, France'}
            </p>
            <p className="text-[11px] font-mono text-zinc-400 mt-1">
              Email connecté : {profile?.email || 'soheholmes7@gmail.com'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            to="/admin/profil"
            variant="outline"
            size="md"
            leftIcon={<Camera className="w-4 h-4 text-blue-600" />}
          >
            Changer ma photo & mon profil
          </Button>
          <Button
            to="/admin/profil"
            variant="secondary"
            size="md"
            leftIcon={<Database className="w-4 h-4 text-zinc-500" />}
          >
            Assistant Supabase
          </Button>
        </div>
      </div>

      {/* Supabase status info */}
      {!isSupabaseConfigured && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Database className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Mode Local / Démo actif :</span>
              <p className="text-amber-800 mt-0.5">
                Les modifications sont persistées dans votre navigateur (localStorage). Pour connecter Supabase en production, renseignez vos variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.
              </p>
            </div>
          </div>
          <Link
            to="/admin/profil"
            className="text-amber-950 font-bold underline shrink-0 hover:text-amber-800"
          >
            Tester l'édition
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className={`p-5 rounded-xl border bg-white shadow-2xs hover:border-zinc-300 transition-all block ${
              item.highlight ? 'border-amber-300 ring-1 ring-amber-200' : 'border-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">{item.title}</span>
              <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                {item.icon}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold font-mono text-zinc-950">
                {item.value}
              </div>
              <div className="text-xs text-zinc-500 mt-1 flex items-center justify-between">
                <span>{item.detail}</span>
                <span className="text-zinc-400 group-hover:text-zinc-900">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two columns: Recent Service Requests & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Service Requests */}
        <div className="lg:col-span-7 p-6 rounded-xl border border-zinc-200 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-zinc-700" />
              <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono">
                Demandes de service récentes
              </h2>
            </div>
            <Link
              to="/admin/demandes"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-900 underline"
            >
              Voir tout ({serviceRequests.length})
            </Link>
          </div>

          {serviceRequests.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-400 font-mono">
              Aucune demande de service reçue pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {serviceRequests.slice(0, 5).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900 truncate">
                        {req.client_name}
                      </span>
                      {req.company && (
                        <span className="text-[11px] text-zinc-400 font-mono truncate">
                          ({req.company})
                        </span>
                      )}
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-medium ${
                        req.status === 'nouveau' ? 'bg-amber-100 text-amber-800' :
                        req.status === 'en-cours' ? 'bg-purple-100 text-purple-800' :
                        req.status === 'contacte' ? 'bg-blue-100 text-blue-800' :
                        req.status === 'devis-envoye' ? 'bg-cyan-100 text-cyan-800' :
                        req.status === 'termine' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-zinc-100 text-zinc-700'
                      }`}>
                        {req.status === 'nouveau' ? 'Nouveau' :
                         req.status === 'en-cours' ? 'En cours' :
                         req.status === 'contacte' ? 'Contacté' :
                         req.status === 'devis-envoye' ? 'Devis envoyé' :
                         req.status === 'termine' ? 'Terminé' : 'Refusé'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 truncate mt-0.5">
                      {req.service_title} • {req.budget || 'Budget non spécifié'}
                    </p>
                  </div>

                  <Link
                    to="/admin/demandes"
                    className="shrink-0 p-1.5 rounded text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-5 p-6 rounded-xl border border-zinc-200 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-zinc-700" />
              <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono">
                Derniers messages reçus
              </h2>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-mono text-zinc-500 hover:text-zinc-900 underline"
            >
              Voir tout ({messages.length})
            </Link>
          </div>

          {messages.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-400 font-mono">
              Aucun message reçu pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 5).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-lg border transition-colors ${
                    !msg.is_read ? 'bg-zinc-50/80 border-zinc-300 font-medium' : 'bg-white border-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 truncate">{msg.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 truncate mt-1">
                    {msg.subject}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
