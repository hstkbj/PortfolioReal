import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { initAnalytics } from './lib/analytics';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  initAnalytics();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
