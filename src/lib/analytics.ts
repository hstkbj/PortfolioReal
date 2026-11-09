declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const env = (import.meta as any).env || {};
const defaultMeasurementId = 'G-7P4R85DG4C';

export const measurementId = (env.VITE_GA_MEASUREMENT_ID || defaultMeasurementId) as string;
export const isAnalyticsConfigured = Boolean(measurementId && measurementId !== 'G-XXXXXXXXXX');

export const initAnalytics = () => {
  if (typeof window === 'undefined' || !measurementId || document.querySelector('[data-google-analytics]')) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.googleAnalytics = 'true';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer.push(args);
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });
};

export const trackPageView = (path: string) => {
  if (typeof window === 'undefined' || !measurementId || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    send_to: measurementId,
  });
};

export const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined' || !measurementId || !window.gtag) return false;
  window.gtag('event', eventName, {
    ...parameters,
    send_to: measurementId,
  });
  return true;
};