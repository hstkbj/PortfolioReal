import React, { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, ExternalLink, LoaderCircle, Send, XCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { isAnalyticsConfigured, measurementId, trackEvent } from '../../lib/analytics';
import { supabase } from '../../lib/supabase';

interface AnalyticsData {
  period: string;
  activeUsers: number;
  sessions: number;
  pageViews: number;
  daily: Array<{ date: string; users: number; pageViews: number }>;
}

export const AdminAnalyticsPage: React.FC = () => {
  const [testSent, setTestSent] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const analyticsUrl = 'https://analytics.google.com/';

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      const { data: sessionData } = await supabase?.auth.getSession() || { data: { session: null } };

      if (!sessionData.session) {
        setError('Session administrateur introuvable. Reconnectez-vous.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Impossible de charger les statistiques.');
        setData(result as AnalyticsData);
      } catch (requestError: any) {
        setError(requestError.message || 'Impossible de charger les statistiques.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadAnalytics();
  }, []);

  const sendTestEvent = () => {
    setTestSent(trackEvent('admin_analytics_test', { source: 'admin_dashboard' }));
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
      <div className="pb-6 border-b border-zinc-200">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
          Mesure & acquisition
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
          Google Analytics
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Vérifiez le suivi du site et accédez aux rapports Google Analytics 4.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500">Configuration</span>
            {isAnalyticsConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className="mt-4 text-lg font-bold text-zinc-950">
            {isAnalyticsConfigured ? 'Activée' : 'Non configurée'}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {isAnalyticsConfigured
              ? 'Le script Google Analytics est chargé sur le site.'
              : 'Ajoutez VITE_GA_MEASUREMENT_ID dans les variables Vercel.'}
          </p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <span className="text-xs font-mono text-zinc-500">Identifiant de mesure</span>
          <p className="mt-4 text-lg font-bold font-mono text-zinc-950 break-all">
            {measurementId || 'G-XXXXXXXXXX'}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Les rapports détaillés sont consultables dans Google Analytics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Utilisateurs actifs', value: data?.activeUsers },
          { label: 'Sessions', value: data?.sessions },
          { label: 'Pages vues', value: data?.pageViews },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl border border-zinc-200 bg-white shadow-2xs">
            <span className="text-xs font-mono text-zinc-500">{stat.label}</span>
            <p className="mt-4 text-3xl font-extrabold font-mono text-zinc-950">
              {isLoading ? <LoaderCircle className="w-6 h-6 animate-spin text-zinc-400" /> : (stat.value ?? '—').toLocaleString('fr-FR')}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{data?.period || '30 derniers jours'}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          {error} Ajoutez les variables serveur Google Analytics dans Vercel si nécessaire.
        </div>
      )}

      {data && data.daily.length > 0 && (
        <div className="p-6 rounded-xl border border-zinc-200 bg-white space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono">Activité quotidienne</h2>
            <span className="text-xs text-zinc-500">30 derniers jours</span>
          </div>
          <div className="h-48 flex items-end gap-1.5 overflow-hidden">
            {data.daily.map((day) => {
              const maxUsers = Math.max(...data.daily.map((item) => item.users), 1);
              return (
                <div key={day.date} className="flex-1 min-w-1.5 h-full flex items-end" title={`${day.date}: ${day.users} utilisateur(s)`}>
                  <div className="w-full bg-orange-400 hover:bg-orange-500 rounded-t-sm" style={{ height: `${Math.max((day.users / maxUsers) * 100, 3)}%` }} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-zinc-400">
            <span>{data.daily[0]?.date}</span>
            <span>{data.daily[data.daily.length - 1]?.date}</span>
          </div>
        </div>
      )}

      <div className="p-6 rounded-xl border border-zinc-200 bg-white space-y-5">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
          <BarChart3 className="w-4 h-4 text-zinc-700" />
          <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono">
            Rapports et vérification
          </h2>
        </div>

        <p className="text-sm text-zinc-600 leading-relaxed">
          Les statistiques des 30 derniers jours sont chargées ici depuis l'API Google Analytics Data. Les clés Google restent côté serveur et ne sont jamais envoyées au navigateur.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            href={analyticsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="md"
            leftIcon={<ExternalLink className="w-4 h-4" />}
          >
            Ouvrir Google Analytics
          </Button>
          <Button
            onClick={sendTestEvent}
            variant="outline"
            size="md"
            disabled={!isAnalyticsConfigured}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Envoyer un événement test
          </Button>
        </div>

        {testSent && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            Événement envoyé. Vérifiez-le dans le rapport Temps réel de Google Analytics.
          </div>
        )}
      </div>
    </div>
  );
};
