import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const AdminLoginPage: React.FC = () => {
  const { login, isSupabaseConfigured, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('soheholmes7@gmail.com');
  const [password, setPassword] = useState('AdminPassword2025!');
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setWarning(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.warning) {
          setWarning(res.warning);
        }
        const from = (location.state as any)?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Identifiants invalides.');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 text-white font-mono font-bold text-base shadow-sm">
          DEV
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Espace Administration
        </h1>
        <p className="text-xs text-zinc-500 font-mono">
          Gestion du profil, photo, contenus, demandes et base Supabase
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {warning && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{warning}</span>
            </div>
          )}

          {/* Carte Identifiant Administrateur créé */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between text-blue-900 font-semibold">
              <span className="flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Votre compte Administrateur créé
              </span>
              <span className="text-[10px] text-blue-700 font-mono bg-blue-100 px-2 py-0.5 rounded">Actif</span>
            </div>
            
            <div className="space-y-1 font-mono text-[11px] text-blue-950 bg-white/80 p-2.5 rounded-lg border border-blue-100">
              <div className="flex justify-between">
                <span className="text-zinc-500">Email :</span>
                <strong className="text-zinc-900">soheholmes7@gmail.com</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Mot de passe provisoire :</span>
                <strong className="text-zinc-900">AdminPassword2025!</strong>
              </div>
            </div>

            <p className="text-[11px] text-blue-800 leading-relaxed">
              Vous pourrez modifier votre mot de passe et votre email à tout moment dans l'onglet <strong>Profil & Ma Photo</strong>.
            </p>

            <button
              type="button"
              onClick={() => handleLogin()}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Se connecter à mon espace Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink mx-4 text-[11px] font-mono text-zinc-400">ou saisie manuelle</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Email
              </label>
              <div className="mt-1 relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
                  placeholder="soheholmes7@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-zinc-700 uppercase">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Connexion
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-zinc-100">
            <Link
              to="/"
              className="text-xs text-zinc-500 hover:text-zinc-900 font-mono transition-colors"
            >
              ← Retour au site public
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
