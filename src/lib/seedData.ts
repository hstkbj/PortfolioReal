import { Profile, Skill, Experience, Project, Service, BlogPost, Resume, ServiceRequest, ContactMessage } from '../types';

export const initialProfile: Profile = {
  id: 'profile-1',
  full_name: 'Alexandre Renard',
  title: 'Développeur Web Fullstack Senior',
  tagline: 'Je conçois des applications web modernes, performantes et adaptées aux besoins métier.',
  bio_short: 'Fort de plus de 7 années d’expérience, j’accompagne entreprises et startups dans la conception, le développement et le passage à l’échelle d’applications SaaS, d’architectures Laravel / Node.js et d’interfaces réactives React & Vue.js.',
  bio_full: 'Passionné par l’ingénierie logicielle et les architectures maintenables, je conçois des systèmes d’information robustes centrés sur la valeur métier. Mon expertise couvre l’écosystème Laravel/PHP et Node.js côté backend, ainsi que React.js et TypeScript côté frontend.\n\nRigoureux dans mes choix techniques, j’accorde une attention particulière aux performances des bases de données (PostgreSQL, MySQL), à la sécurité des API REST et à la clarté du code pour assurer une pérennité maximale aux projets.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  location: 'Paris, France (Disponible en remote & hybride)',
  email: 'contact@alexandrerenard.dev',
  phone: '+33 6 12 34 56 78',
  whatsapp: '+33 6 12 34 56 78',
  github_url: 'https://github.com/alexandrerenard-dev',
  linkedin_url: 'https://linkedin.com/in/alexandre-renard-dev',
  twitter_url: 'https://twitter.com/alexrenard_dev',
  is_available_for_hire: true,
  years_of_experience: 7,
  completed_projects_count: 42,
};

export const initialSkills: Skill[] = [
  // Frontend
  { id: 'sk-1', name: 'React.js', category: 'frontend', level_percentage: 95, years_experience: 6, is_featured: true },
  { id: 'sk-2', name: 'TypeScript', category: 'frontend', level_percentage: 90, years_experience: 5, is_featured: true },
  { id: 'sk-3', name: 'Vue.js', category: 'frontend', level_percentage: 85, years_experience: 4, is_featured: true },
  { id: 'sk-4', name: 'JavaScript (ES6+)', category: 'frontend', level_percentage: 95, years_experience: 7, is_featured: true },
  { id: 'sk-5', name: 'Tailwind CSS', category: 'frontend', level_percentage: 92, years_experience: 5, is_featured: false },
  { id: 'sk-6', name: 'HTML5 / CSS3 sémantique', category: 'frontend', level_percentage: 98, years_experience: 7, is_featured: false },
  
  // Backend
  { id: 'sk-7', name: 'Laravel', category: 'backend', level_percentage: 95, years_experience: 6, is_featured: true },
  { id: 'sk-8', name: 'PHP 8+', category: 'backend', level_percentage: 92, years_experience: 7, is_featured: true },
  { id: 'sk-9', name: 'Node.js / Express', category: 'backend', level_percentage: 88, years_experience: 5, is_featured: true },
  { id: 'sk-10', name: 'API REST & Webhooks', category: 'backend', level_percentage: 95, years_experience: 7, is_featured: true },
  { id: 'sk-11', name: 'Architecture microservices & modulaire', category: 'backend', level_percentage: 86, years_experience: 4, is_featured: false },

  // Database
  { id: 'sk-12', name: 'PostgreSQL', category: 'database', level_percentage: 90, years_experience: 6, is_featured: true },
  { id: 'sk-13', name: 'MySQL / MariaDB', category: 'database', level_percentage: 92, years_experience: 7, is_featured: true },
  { id: 'sk-14', name: 'Supabase', category: 'database', level_percentage: 88, years_experience: 3, is_featured: true },
  { id: 'sk-15', name: 'Redis (Cache & Queues)', category: 'database', level_percentage: 84, years_experience: 4, is_featured: false },

  // Outils
  { id: 'sk-16', name: 'Git & GitHub Workflows', category: 'tools', level_percentage: 94, years_experience: 7, is_featured: true },
  { id: 'sk-17', name: 'Docker & Docker Compose', category: 'tools', level_percentage: 86, years_experience: 5, is_featured: true },
  { id: 'sk-18', name: 'Vite & Build Tools', category: 'tools', level_percentage: 90, years_experience: 4, is_featured: false },
  { id: 'sk-19', name: 'CI/CD Pipelines (GitHub Actions)', category: 'tools', level_percentage: 85, years_experience: 4, is_featured: false },
  { id: 'sk-20', name: 'Tests automatisés (PHPUnit, Pest, Vitest)', category: 'tools', level_percentage: 88, years_experience: 5, is_featured: false },
];

export const initialExperiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Nexus Cloud Solutions',
    role: 'Lead Développeur Fullstack (Laravel & React)',
    period: '2023 - Présent',
    is_current: true,
    location: 'Paris (Hybride)',
    description: 'Conception et pilotage technique de la plateforme SaaS de gestion financière B2B servant plus de 15 000 utilisateurs actifs mensuels.',
    responsibilities: [
      'Architecture du backend Laravel 11 et des API REST sécurisées avec authentification JWT et RBAC granulaire',
      'Refonte complète du frontend en React 19, TypeScript et TanStack Query pour des temps de réponse sous les 120ms',
      'Optimisation des requêtes PostgreSQL et mise en place de workers asynchrones avec Redis',
      'Mentorat d’une équipe de 4 développeurs et mise en place des standards de revue de code et CI/CD'
    ],
    technologies: ['Laravel', 'PHP 8.3', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
    order_index: 1,
  },
  {
    id: 'exp-2',
    company: 'Optima Data Systems',
    role: 'Développeur Web Senior',
    period: '2021 - 2023',
    is_current: false,
    location: 'Lyon (Remote)',
    description: 'Développement d’applications web métier et d’outils d’automatisation logistique pour des acteurs du e-commerce et de la distribution.',
    responsibilities: [
      'Développement de modules sur-mesure sous Laravel et interfaces réactives sous Vue.js 3',
      'Conception d’API REST haute disponibilité consommant des flux ERP (SAP, Cegid)',
      'Migration d’une base de données MySQL volumineuse (+20M lignes) vers PostgreSQL avec zéro interruption de service',
      'Création d’un système d’export et de reporting analytique automatisé'
    ],
    technologies: ['PHP', 'Laravel', 'Vue.js', 'MySQL', 'PostgreSQL', 'Tailwind CSS', 'API REST'],
    order_index: 2,
  },
  {
    id: 'exp-3',
    company: 'Agence Digitale Stratège',
    role: 'Développeur Web Fullstack',
    period: '2019 - 2021',
    is_current: false,
    location: 'Paris',
    description: 'Réalisation de plateformes sur-mesure, portails clients et architectures web pour divers comptes d’entreprises.',
    responsibilities: [
      'Développement de sites et portails applicatifs avec Laravel, Node.js et React',
      'Intégration de passerelles de paiement sécurisées (Stripe, PayPal) et d’outils CRM tiers',
      'Optimisation SEO technique et performance web (Core Web Vitals scores > 95/100)'
    ],
    technologies: ['Laravel', 'Node.js', 'React', 'JavaScript', 'MySQL', 'Git'],
    order_index: 3,
  },
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'FlowMetric — Plateforme SaaS d’analyse de trésorerie',
    slug: 'flowmetric-saas-tresorerie',
    description_short: 'Application SaaS B2B permettant aux PME d’agréger leurs flux bancaires, simuler leur prévisionnel et éditer des reportings automatisés.',
    description_full: 'FlowMetric est une plateforme SaaS complète conçue pour simplifier le pilotage financier des PME. Le backend développé sous Laravel 11 expose une API REST haute performance communicant avec les connecteurs bancaires. Le frontend sous React et TypeScript offre des tableaux de bord interactifs en temps réel avec filtrage dynamique et export PDF haute résolution. Architecture scalable déployée avec conteneurs Docker et base PostgreSQL gérée.',
    main_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    ],
    technologies: ['Laravel', 'React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'API REST'],
    category: 'saas',
    demo_url: 'https://flowmetric.example.com',
    github_url: 'https://github.com/alexandrerenard-dev/flowmetric-core',
    date: '2024',
    status: 'completed',
    is_featured: true,
    order_index: 1,
    client: 'FlowMetric Tech SAS',
  },
  {
    id: 'proj-2',
    title: 'LogiStock ERP — Gestion de stocks & chaîne d’approvisionnement',
    slug: 'logistock-erp-supply-chain',
    description_short: 'Système web métier complet de gestion d’entrepôts, suivi des commandes fournisseurs et inventaires en temps réel.',
    description_full: 'Développement d’un progiciel métier sur-mesure pour un réseau de distribution régional. Le système gère plus de 45 000 références produits, synchronise les expéditions via API avec les transporteurs (Colissimo, DPD) et offre une interface tactile optimisée pour les préparateurs de commandes.',
    main_image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
    ],
    technologies: ['PHP', 'Laravel', 'Vue.js', 'MySQL', 'Redis', 'Docker'],
    category: 'web-app',
    demo_url: 'https://logistock.example.com',
    github_url: 'https://github.com/alexandrerenard-dev/logistock-erp',
    date: '2023',
    status: 'completed',
    is_featured: true,
    order_index: 2,
    client: 'Groupe Ouest Logistique',
  },
  {
    id: 'proj-3',
    title: 'PulseAuth & Gateway — Microservice d’authentification & API Gateway',
    slug: 'pulseauth-api-gateway',
    description_short: 'Passerelle API haute performance gérant l’authentification OAuth2, le rate-limiting et le routage sécurisé pour 8 microservices.',
    description_full: 'Conception d’un service centralisé d’authentification sécurisé basé sur Node.js et Supabase / PostgreSQL. Implémente la rotation automatique de clés JWT, la détection des requêtes frauduleuses avec Redis et la journalisation centralisée des événements de sécurité.',
    main_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    ],
    technologies: ['Node.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Redis', 'API REST'],
    category: 'api',
    demo_url: 'https://api-docs.pulseauth.example.com',
    github_url: 'https://github.com/alexandrerenard-dev/pulseauth-gateway',
    date: '2024',
    status: 'completed',
    is_featured: true,
    order_index: 3,
  },
  {
    id: 'proj-4',
    title: 'MedikaConnect — Portail de prise de rendez-vous pour praticiens',
    slug: 'medikaconnect-portail-sante',
    description_short: 'Application web de gestion d’agenda médical avec rappels SMS automatiques et synchronisation Google Agenda.',
    description_full: 'Application respectant les exigences de confidentialité médicale (RGPD), conçue pour des cabinets médicaux indépendants. Comprend un calendrier interactif réactif, un module de téléconsultation et un panneau d’administration personnalisé.',
    main_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    ],
    technologies: ['Laravel', 'React', 'MySQL', 'Tailwind CSS'],
    category: 'web-app',
    demo_url: 'https://medikaconnect.example.com',
    date: '2023',
    status: 'completed',
    is_featured: false,
    order_index: 4,
  },
];

export const initialServices: Service[] = [
  {
    id: 'srv-1',
    title: 'Développement d’applications web & SaaS',
    slug: 'developpement-applications-web-saas',
    description: 'Conception de plateformes web sur-mesure, robustes et évolutives, pensées dès le départ pour supporter votre croissance métier.',
    indicative_price: 'À partir de 3 500 €',
    icon_name: 'Laptop',
    features: [
      'Architecture modulaire et maintenable',
      'Tableaux de bord d’administration complets',
      'Gestion des rôles et autorisations complexes',
      'Intégration de systèmes de paiement et abonnements (Stripe)',
      'Déploiement automatisé et monitoring'
    ],
    is_active: true,
    order_index: 1,
  },
  {
    id: 'srv-2',
    title: 'Applications backend Laravel & API REST',
    slug: 'applications-laravel-api-rest',
    description: 'Développement d’architectures backend solides en PHP 8 / Laravel pour motoriser vos applications, applications mobiles ou logiciels tiers.',
    indicative_price: 'À partir de 2 200 €',
    icon_name: 'Server',
    features: [
      'API RESTful documentées (OpenAPI / Swagger)',
      'Modélisation et optimisation de bases PostgreSQL & MySQL',
      'Sécurisation des accès (JWT, Sanctum, OAuth2)',
      'Traitement de tâches lourdes en arrière-plan (Queues, Redis)',
      'Tests unitaires et d’intégration complets'
    ],
    is_active: true,
    order_index: 2,
  },
  {
    id: 'srv-3',
    title: 'Développement frontend React.js & Vue.js',
    slug: 'developpement-frontend-react-vue',
    description: 'Création d’interfaces utilisateur modernes, ergonomiques, réactives et typées sous TypeScript, avec une attention rigoureuse à l’expérience utilisateur.',
    indicative_price: 'À partir de 1 800 €',
    icon_name: 'Layout',
    features: [
      'Single Page Applications (SPA) dynamiques',
      'Gestion d’état optimisée avec TanStack Query & Context',
      'Design System soigné avec Tailwind CSS',
      'Temps de chargement et Core Web Vitals optimisés',
      'Compatibilité mobile et accessibilité (WCAG)'
    ],
    is_active: true,
    order_index: 3,
  },
  {
    id: 'srv-4',
    title: 'Intégration d’API & Services tiers',
    slug: 'integration-api-services-tiers',
    description: 'Interconnexion transparente de vos logiciels existants avec vos outils externes (CRM, ERP, passerelles de paiement, webhooks, outils marketing).',
    indicative_price: 'À partir de 1 200 €',
    icon_name: 'Layers',
    features: [
      'Connecteurs ERP, CRM (Hubspot, Salesforce)',
      'Passerelles de paiement sécurisées (Stripe, PayPal)',
      'Gestion et fiabilisation des Webhooks avec retry automatique',
      'Synchronisation bidirectionnelle de données'
    ],
    is_active: true,
    order_index: 4,
  },
  {
    id: 'srv-5',
    title: 'Maintenance, Audit & Optimisation de code existant',
    slug: 'maintenance-audit-optimisation',
    description: 'Audit technique de code, résolution de goulets d’étranglement de performance, mise à niveau de versions (PHP/Laravel/React) et reprise en main.',
    indicative_price: 'TJM : 550 € / jour',
    icon_name: 'Wrench',
    features: [
      'Audit de sécurité et revue de code approfondie',
      'Optimisation des requêtes SQL lentes et indexation',
      'Migration de versions majeures (ex: Laravel 8 vers 11)',
      'Correction de bugs critiques et refactoring ciblé'
    ],
    is_active: true,
    order_index: 5,
  },
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Architecture modulaire avec Laravel 11 et React : construire pour durer',
    slug: 'architecture-modulaire-laravel-11-react',
    summary: 'Comment structurer une application SaaS d’envergure en séparant nettement les responsabilités entre une API Laravel typée et un frontend React autonome.',
    content: `## Pourquoi séparer le backend et le frontend en environnement métier ?

Dans les projets SaaS à forte croissance, la maintenabilité du code est le premier facteur d’accélération technique. Une architecture découplée reposant sur **Laravel pour le domaine métier et la persistance**, et **React + TypeScript pour l'interface utilisateur**, apporte une clarté immédiate.

### 1. Le rôle central du backend Laravel

Laravel apporte une maturité exceptionnelle pour traiter la logique métier complexe :
- **Form Requests & DTOs** : pour garantir que chaque donnée franchissant la frontière de l'API est strictement validée.
- **Actions ou Services dédiés** : pour éviter les contrôleurs obèses et garder chaque règle métier testable unitairement.
- **Queues asynchrones** : pour déléguer les envois d’emails, générations de factures et webhooks à des workers Redis.

### 2. Le frontend React & TanStack Query

Côté frontend, la combinaison de **TypeScript** et de **TanStack Query** transforme l'expérience de développement :
- Les réponses de l'API sont typées de bout en bout.
- La mise en cache automatique élimine les requêtes redondantes.
- Les mutations gèrent les états de chargement et d'erreur de façon standardisée sans code répétitif.

\`\`\`typescript
// Exemple de hook propre avec TanStack Query
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index');
      if (error) throw error;
      return data;
    },
  });
}
\`\`\`

### Conclusion

Investir dès les premières itérations dans une architecture propre et modulaire permet d’ajouter de nouvelles fonctionnalités sans introduire de dette technique exponentielle.`,
    main_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    category: 'Architecture',
    tags: ['Laravel', 'React', 'Architecture', 'TypeScript'],
    author: 'Alexandre Renard',
    published_at: '2024-08-15',
    reading_time_minutes: 6,
    status: 'published',
    views_count: 1420,
  },
  {
    id: 'blog-2',
    title: 'Optimisation des performances PostgreSQL : indexation et requêtes complexes',
    slug: 'optimisation-performances-postgresql-indexation',
    summary: 'Guide pratique pour identifier les requêtes lentes, choisir les bons types d’index (B-Tree, GIN, Partial) et éviter les écueils de volumétrie.',
    content: `## Comprendre le coût d’exécution de vos requêtes SQL

Dans les applications métier, 80 % des ralentissements constatés en production proviennent de requêtes de base de données non indexées ou mal formulées.

### 1. L’outil incontournable : EXPLAIN ANALYZE

Avant toute optimisation à l’aveugle, il est indispensable de mesurer le plan d’exécution réel :

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT p.id, p.title, COUNT(i.id) AS image_count
FROM projects p
LEFT JOIN project_images i ON i.project_id = p.id
WHERE p.status = 'completed'
GROUP BY p.id;
\`\`\`

Repérez les **Sequential Scans (Seq Scan)** sur les tables contenant plus de quelques milliers de lignes.

### 2. Les index partiels (Partial Indexes)

Saviez-vous qu'il est souvent inutile d'indexer l'intégralité d'une table ? Si votre application filtre presque toujours sur les projets actifs ou les utilisateurs vérifiés :

\`\`\`sql
CREATE INDEX idx_projects_active ON projects(created_at DESC) 
WHERE status = 'completed';
\`\`\`

Cet index consomme une fraction de l'espace disque et reste en mémoire vive (RAM), accélérant considérablement les requêtes.`,
    main_image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
    category: 'Database',
    tags: ['PostgreSQL', 'Performance', 'SQL', 'Bases de données'],
    author: 'Alexandre Renard',
    published_at: '2024-07-22',
    reading_time_minutes: 8,
    status: 'published',
    views_count: 980,
  },
  {
    id: 'blog-3',
    title: 'Sécuriser une API REST professionnelle : les piliers indispensables',
    slug: 'securiser-api-rest-professionnelle',
    summary: 'Rate limiting, validation stricte d’entrées avec Zod/FormRequests, jetons sécurisés et headers HTTP indispensables pour protéger vos endpoints.',
    content: `## La sécurité comme prérequis, non comme option

Exposer une API REST en production requiert une rigueur méthodique contre les attaques les plus communes (injection, abus de requêtes, usurpation de droits).

### 1. La validation stricte aux frontières

Ne faites jamais confiance aux données reçues du client. Que ce soit avec **Zod** côté TypeScript ou les **FormRequests** dans Laravel, chaque champ doit avoir des contraintes de taille, de type et de format.

### 2. Le Rate Limiting granulaire

Protéger vos routes sensibles (authentification, formulaires de contact, endpoints lourds) contre le déni de service ou le brute-force :
- 5 tentatives par minute sur les endpoints de connexion
- 60 requêtes par minute sur les endpoints de consultation

### 3. Les headers de sécurité

N'oubliez jamais de configurer :
- \`Content-Security-Policy\`
- \`X-Content-Type-Options: nosniff\`
- \`X-Frame-Options: DENY\``,
    main_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    category: 'Sécurité',
    tags: ['Sécurité', 'API REST', 'Node.js', 'Laravel'],
    author: 'Alexandre Renard',
    published_at: '2024-06-10',
    reading_time_minutes: 5,
    status: 'published',
    views_count: 1250,
  },
];

export const initialResume: Resume = {
  id: 'resume-1',
  title: 'CV Développeur Fullstack Senior — Alexandre Renard (2025)',
  file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Clean valid standard sample PDF
  file_name: 'CV_Alexandre_Renard_Developpeur_Web_Senior.pdf',
  file_size_kb: 142,
  is_active: true,
  created_at: '2025-01-15T10:00:00Z',
};

export const initialServiceRequests: ServiceRequest[] = [
  {
    id: 'req-1',
    client_name: 'Cabinet Valois & Associés',
    email: 'contact@valois-associes.fr',
    phone: '+33 1 42 68 00 00',
    company: 'Valois & Associés',
    service_title: 'Développement d’applications web & SaaS',
    description: 'Nous souhaitons développer un portail sécurisé pour le partage de documents et la validation de dossiers clients.',
    budget: '5 000 € - 10 000 €',
    timeline: 'Sous 2 à 3 mois',
    preferred_contact_method: 'email',
    status: 'nouveau',
    created_at: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
  },
  {
    id: 'req-2',
    client_name: 'Sophie Marceau',
    email: 'sophie.m@greenshop.io',
    phone: '+33 6 88 77 66 55',
    company: 'GreenShop SAS',
    service_title: 'Applications backend Laravel & API REST',
    description: 'Optimisation de notre API de gestion de stocks e-commerce existante et synchronisation avec notre nouvel ERP.',
    budget: '3 000 € - 5 000 €',
    timeline: 'Dès que possible',
    preferred_contact_method: 'phone',
    status: 'en-cours',
    admin_notes: 'Premier échange téléphonique prévu mardi matin.',
    created_at: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
  }
];

export const initialContactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Julien Dupont',
    email: 'julien.dupont@techcorp.com',
    subject: 'Opportunité mission freelance Lead Tech Laravel',
    message: 'Bonjour Alexandre, nous avons vu votre profil et serions intéressés pour échanger sur une mission de 6 mois pour renforcer notre équipe backend. Êtes-vous disponible prochainement ?',
    is_read: false,
    created_at: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Camille Leroy',
    email: 'c.leroy@startup-incubator.eu',
    subject: 'Question relative à votre article sur PostgreSQL',
    message: 'Merci pour votre article très instructif sur les index partiels ! Nous l’avons appliqué avec succès sur notre base de données de production.',
    is_read: true,
    created_at: new Date(Date.now() - 3600 * 1000 * 50).toISOString(),
  }
];
