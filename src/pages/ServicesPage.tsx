import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Laptop, 
  Server, 
  Layout, 
  Layers, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock 
} from 'lucide-react';
import { useServices } from '../hooks/usePortfolio';
import { Button } from '../components/common/Button';

export const ServicesPage: React.FC = () => {
  const { data: services = [], isLoading } = useServices();
  const activeServices = services.filter((s) => s.is_active);

  const getServiceIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'server':
        return <Server className="w-5 h-5" />;
      case 'layout':
        return <Layout className="w-5 h-5" />;
      case 'layers':
        return <Layers className="w-5 h-5" />;
      case 'wrench':
        return <Wrench className="w-5 h-5" />;
      case 'laptop':
      default:
        return <Laptop className="w-5 h-5" />;
    }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
            Prestations & Expertise
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Services de développement web sur-mesure
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            De l'architecture d'un SaaS complet à la modernisation d'une API existante, je mets mon savoir-faire au service de vos ambitions.
          </p>
        </div>

        {/* Value props guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-xl bg-white border border-zinc-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Code propre & typé</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Normes PSR, TypeScript strict, architecture testable et documentée.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Respect des délais</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Estimation transparente, jalons précis et communication proactive continue.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Garantie & suivi</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Période de garantie post-livraison et maintenance évolutive sur demande.</p>
            </div>
          </div>
        </div>

        {/* Services List */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-400 font-mono text-sm">
            Chargement des services...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeServices.map((service) => (
              <div
                key={service.id}
                className="flex flex-col justify-between p-8 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md transition-all space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 shrink-0">
                      {getServiceIcon(service.icon_name)}
                    </div>
                    {service.indicative_price && (
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                        {service.indicative_price}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-zinc-900">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="pt-2">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Inclus dans cette prestation :
                    </h4>
                    <ul className="space-y-2 text-sm text-zinc-700">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <Button
                    variant="primary"
                    size="md"
                    to={`/demande-service?service=${encodeURIComponent(service.title)}`}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Demander cette prestation
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
