declare global {
   interface Window {
      dataLayer: unknown[];
      gtag: (...args: unknown[]) => void;
   }
}

const env = (import.meta as any).env || {};

export const measurementId = env.VITE_GA_MEASUREMENT_ID as string | undefined;

export const isAnalyticsConfigured = Boolean(measurementId);

export const initAnalytics = () => {
   if (!measurementId || document.querySelector('[data-google-analytics]')) return;

   const script = document.createElement('script');
   script.async = true;
   script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
   script.dataset.googleAnalytics = 'true';
   document.head.appendChild(script);

   window.dataLayer = window.dataLayer || [];
   window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
   window.gtag('js', new Date());
   window.gtag('config', measurementId, { send_page_view: false });
};

export const trackPageView = (path: string) => {
   if (!measurementId || !window.gtag) return;
   window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
   });
};

export const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
   if (!measurementId || !window.gtag) return false;
   window.gtag('event', eventName, parameters);
   return true;
};