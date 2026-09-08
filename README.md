# Portfolio developpeur web

Portfolio React + Vite deploye sur Vercel. Ce document explique comment ajouter
Google Analytics 4 et configurer le referencement Google (SEO).

## Demarrage local

Prerequis : Node.js 18 ou une version plus recente.

```bash
npm install
npm run dev
```

Autres commandes utiles :

```bash
npm run lint
npm run build
npm run preview
```

## 1. Creer Google Analytics 4

1. Ouvrir [Google Analytics](https://analytics.google.com/).
2. Creer un compte ou selectionner un compte existant.
3. Creer une propriete pour le portfolio.
4. Choisir la plateforme **Web**.
5. Saisir l'URL de production : `https://holmesdev.vercel.app`.
6. Copier l'identifiant de mesure au format `G-XXXXXXXXXX`.

L'identifiant de mesure est public. Il ne faut pas le confondre avec une cle
secrete et il ne doit pas etre place dans un fichier prive.

## 2. Ajouter Google Analytics dans Vite/React

Creer le fichier `src/lib/analytics.ts` :

```ts
declare global {
   interface Window {
      dataLayer: unknown[];
      gtag: (...args: unknown[]) => void;
   }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

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
```

Dans `src/main.tsx`, initialiser Analytics avant le rendu :

```ts
import { initAnalytics } from './lib/analytics';

initAnalytics();
```

Dans `src/App.tsx`, suivre les changements de route avec un composant place
a l'interieur du `BrowserRouter` :

```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './lib/analytics';

function AnalyticsPageView() {
   const location = useLocation();

   useEffect(() => {
      trackPageView(`${location.pathname}${location.search}`);
   }, [location.pathname, location.search]);

   return null;
}
```

> Si le projet utilise deja une solution Analytics ou un bandeau de consentement,
> conserver une seule initialisation pour eviter les visites comptees deux fois.

## 3. Configurer la variable d'environnement

Dans `.env` en local :

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Sur Vercel :

1. Ouvrir le projet dans le tableau de bord Vercel.
2. Aller dans **Settings > Environment Variables**.
3. Ajouter `VITE_GA_MEASUREMENT_ID` avec l'identifiant `G-XXXXXXXXXX`.
4. Cocher **Production** et **Preview** si necessaire.
5. Relancer un redeploiement.

Ne jamais commiter `.env` si le fichier contient des valeurs privees.

### Variables necessaires pour les statistiques dans l'admin

La page `/admin/analytics` utilise une fonction Vercel cote serveur pour
interroger Google Analytics Data API. Elle necessite un compte de service Google
avec le role **Lecteur** sur la propriete GA4.

1. Dans Google Cloud, activer **Google Analytics Data API**.
2. Creer un compte de service et une cle JSON.
3. Dans Google Analytics, ajouter l'adresse email du compte de service dans
   **Administration > Gestion des accès à la propriété**, avec le role **Lecteur**.
4. Recuperer l'identifiant numerique de la propriete GA4, pas l'identifiant
   de mesure `G-...`.
5. Ajouter ces variables dans Vercel, uniquement pour l'environnement **Production** :

```env
GA4_PROPERTY_ID=123456789
GOOGLE_CLIENT_EMAIL=analytics-reader@mon-projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

`GOOGLE_PRIVATE_KEY` doit conserver les retours à la ligne sous la forme `\n`.
Ne mettez jamais ces trois valeurs dans `VITE_...`, dans Git ou dans le code
frontend. Apres l'ajout des variables, redeployez Vercel puis ouvrez
`/admin/analytics`.

Methode recommandee si Vercel renvoie une erreur `DECODER routines::unsupported` :
encoder le fichier JSON du compte de service en base64 localement, sans afficher
son contenu :

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('.\compte-service.json'))
```

Ajouter ensuite uniquement cette variable dans Vercel :

```env
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=BASE64_DU_FICHIER_JSON
```

Le endpoint `/api/analytics` lit cette variable en priorite et extrait
automatiquement `client_email` et `private_key`.

## 4. Creer Google Search Console

1. Ouvrir [Google Search Console](https://search.google.com/search-console).
2. Ajouter `https://holmesdev.vercel.app` comme **Prefixe d'URL**.
3. Choisir la verification par balise HTML.
4. Copier la valeur `content` fournie par Google.
5. Ajouter dans le `<head>` de `index.html` :

```html
<meta name="google-site-verification" content="VALEUR_FOURNIE_PAR_GOOGLE" />
```

6. Deployer l'application.
7. Retourner dans Search Console et cliquer sur **Verifier**.

## 5. Ajouter un sitemap et robots.txt

Creer `public/robots.txt` :

```txt
User-agent: *
Allow: /

Sitemap: https://holmesdev.vercel.app/sitemap.xml
```

Creer `public/sitemap.xml` et adapter la liste aux routes publiques reelles :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url><loc>https://holmesdev.vercel.app/</loc></url>
   <url><loc>https://holmesdev.vercel.app/projets</loc></url>
   <url><loc>https://holmesdev.vercel.app/services</loc></url>
   <url><loc>https://holmesdev.vercel.app/contact</loc></url>
</urlset>
```

Apres le deploiement, tester les deux URLs puis declarer le sitemap dans
Search Console, menu **Sitemaps**.

## 6. Completer les balises SEO

Dans `index.html`, conserver au minimum :

```html
<title>Alexandre Renard - Developpeur Web Fullstack</title>
<meta
   name="description"
   content="Portfolio d'Alexandre Renard, developpeur web fullstack specialise en React, Laravel, Node.js et applications SaaS."
/>
<link rel="canonical" href="https://holmesdev.vercel.app/" />
<meta property="og:url" content="https://holmesdev.vercel.app/" />
<meta property="og:image" content="https://holmesdev.vercel.app/assets/og-image.jpg" />
```

Bonnes pratiques :

- utiliser un titre et une description uniques pour chaque page importante ;
- ajouter une image `public/assets/og-image.jpg` pour les partages sociaux ;
- utiliser un seul `h1` par page ;
- donner un texte `alt` descriptif a chaque image utile ;
- ne pas mettre les routes `/admin` dans le sitemap ;
- verifier la version mobile et les temps de chargement.

Pour un SEO avance des pages dynamiques React, utiliser un rendu SSR/SSG comme
Next.js ou prerendre les pages publiques.

## 7. Verifier Analytics et SEO

### Analytics

1. Ouvrir le site en production dans une fenetre privee.
2. Dans Google Analytics, ouvrir **Rapports > Temps reel**.
3. Verifier qu'un utilisateur actif et un evenement `page_view` apparaissent.
4. Naviguer vers plusieurs routes et verifier les pages dans les donnees temps reel.

### SEO

1. Dans Search Console, utiliser **Inspection de l'URL**.
2. Tester `https://holmesdev.vercel.app/`.
3. Cliquer sur **Tester l'URL en direct**, puis **Demander une indexation**.
4. Verifier que le sitemap est accepte.
5. Utiliser [PageSpeed Insights](https://pagespeed.web.dev/) pour les performances.

Les resultats SEO ne sont pas immediats : l'indexation peut prendre plusieurs
jours et aucune configuration ne garantit une position precise dans Google.

## Deploiement

```bash
npm run lint
npm run build
```

Apres un push Git, verifier le build de production puis refaire les tests
Analytics et Search Console.
