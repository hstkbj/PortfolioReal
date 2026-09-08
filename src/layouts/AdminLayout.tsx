import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Code2, 
  Briefcase, 
  Layers, 
  BookOpen, 
  FileText, 
  Inbox, 
  MessageSquare, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Camera,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useServiceRequests, useContactMessages, useProfile } from '../hooks/usePortfolio';

export const AdminLayout: React.FC = () => {
  const { user, logout, isDemoMode } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: serviceRequests = [] } = useServiceRequests();
  const { data: messages = [] } = useContactMessages();

  const newRequestsCount = serviceRequests.filter((r) => r.status === 'nouveau').length;
  const unreadMessagesCount = messages.filter((m) => !m.is_read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin', label: 'Vue d’ensemble', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { to: '/admin/profil', label: 'Profil & Ma Photo', icon: <Camera className="w-4 h-4 text-blue-500" /> },
    { to: '/admin/projets', label: 'Projets réalisés', icon: <FolderGit2 className="w-4 h-4" /> },
    { to: '/admin/competences', label: 'Compétences', icon: <Code2 className="w-4 h-4" /> },
    { to: '/admin/experiences', label: 'Expériences', icon: <Briefcase className="w-4 h-4" /> },
    { to: '/admin/services', label: 'Services & Tarifs', icon: <Layers className="w-4 h-4" /> },
    { to: '/admin/blog', label: 'Articles de blog', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/admin/cv', label: 'Gestion du CV', icon: <FileText className="w-4 h-4" /> },
    { 
      to: '/admin/demandes', 
      label: 'Demandes de devis', 
      icon: <Inbox className="w-4 h-4" />,
      badge: newRequestsCount > 0 ? newRequestsCount : undefined,
      badgeColor: 'bg-emerald-600 text-white'
    },
    { 
      to: '/admin/messages', 
      label: 'Messages reçus', 
      icon: <MessageSquare className="w-4 h-4" />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: 'bg-zinc-900 text-white'
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-zinc-200"
          />
          <span className="font-bold text-sm text-zinc-900 tracking-tight">Admin Console</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/profil"
            className="px-2 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium flex items-center gap-1"
          >
            <Camera className="w-3 h-3 text-blue-600" />
            <span>Photo</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-zinc-200 flex flex-col justify-between transition-transform duration-200 ease-in-out
        md:static md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'}
      `}>
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Logo & Header */}
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <div>
                <h1 className="font-bold text-sm text-zinc-900 leading-tight truncate max-w-[140px]">
                  {profile?.full_name || 'Admin'}
                </h1>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Supabase Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Profile & Photo Link Card */}
          <div className="p-3">
            <Link
              to="/admin/profil"
              className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-50 border border-blue-200/60 transition-colors group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-semibold text-blue-950 block truncate">
                    Changer ma photo
                  </span>
                  <span className="text-[10px] text-blue-700 block">
                    Modifier profil & visuels
                  </span>
                </div>
              </div>
              <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform text-xs font-mono">
                →
              </span>
            </Link>
          </div>

          {/* Quick link to public website */}
          <div className="px-3 pb-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:bg-zinc-50 border border-zinc-200/80 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                <span>Voir le site public</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">↗</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-0.5 flex-1">
            <span className="px-3 py-1.5 text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Contenus & Services
            </span>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white font-semibold shadow-2xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${link.badgeColor || 'bg-zinc-200 text-zinc-800'}`}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="text-xs font-medium text-zinc-900 block truncate">
                {user?.email || 'soheholmes7@gmail.com'}
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold block">
                Session active
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-zinc-500" />
            <span>Se déconnecter</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
