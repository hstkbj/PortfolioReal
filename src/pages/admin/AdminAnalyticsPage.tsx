import React, { useState } from 'react';
import { BarChart3, CheckCircle2, ExternalLink, Send, XCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { isAnalyticsConfigured, measurementId, trackEvent } from '../../lib/analytics';

export const AdminAnalyticsPage: React.FC = () => {
  const [testSent, setTestSent] = useState(false);
  const analyticsUrl = 'https://analytics.google.com/';

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

      <div className="p-6 rounded-xl border border-zinc-200 bg-white space-y-5">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
          <BarChart3 className="w-4 h-4 text-zinc-700" />
          <h2 className="text-sm font-bold text-zinc-900 uppercase font-mono">
            Rapports et vérification
          </h2>
        </div>

        <p className="text-sm text-zinc-600 leading-relaxed">
          Les statistiques complètes de visiteurs, sources, pages et conversions restent dans Google Analytics. Cette page confirme que le suivi est configuré et permet d'envoyer un événement de test.
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
