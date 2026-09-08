-- ==============================================================================
-- SCHEMA COMPLET SUPABASE - PORTFOLIO PROFESSIONNEL DÉVELOPPEUR WEB
-- Projet : qynznggnsmrnogkuzzju
-- À exécuter dans : https://supabase.com/dashboard/project/qynznggnsmrnogkuzzju/sql/new
-- ==============================================================================

-- 1. Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE PROFILES (Profil professionnel du développeur)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL DEFAULT 'Développeur Fullstack',
    title TEXT NOT NULL DEFAULT 'Développeur Web Fullstack & Architecte Cloud',
    tagline TEXT NOT NULL DEFAULT 'Conception d''applications web modernes, performantes et scalables',
    bio_short TEXT NOT NULL DEFAULT 'Développeur passionné avec une expertise approfondie en architectures web modernes et bases de données.',
    bio_full TEXT NOT NULL DEFAULT 'Spécialisé dans le développement d''applications web robustes, d''APIs sécurisées et d''interfaces soignées.',
    avatar_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    location TEXT NOT NULL DEFAULT 'Paris, France / Remote',
    email TEXT NOT NULL DEFAULT 'soheholmes7@gmail.com',
    phone TEXT,
    whatsapp TEXT,
    github_url TEXT NOT NULL DEFAULT 'https://github.com',
    linkedin_url TEXT NOT NULL DEFAULT 'https://linkedin.com',
    twitter_url TEXT,
    is_available_for_hire BOOLEAN DEFAULT TRUE,
    years_of_experience INTEGER DEFAULT 5,
    completed_projects_count INTEGER DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLE PROJECTS (Projets réalisés)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description_short TEXT NOT NULL,
    description_full TEXT NOT NULL,
    main_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    technologies TEXT[] NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('saas', 'web-app', 'api', 'ecommerce', 'cms')),
    client TEXT,
    date TEXT NOT NULL,
    github_url TEXT,
    demo_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'archived')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABLE EXPERIENCES (Expériences professionnelles)
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    period TEXT NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    technologies TEXT[] NOT NULL DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABLE SKILLS (Compétences techniques)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'tools')),
    level_percentage INTEGER DEFAULT 80 CHECK (level_percentage >= 0 AND level_percentage <= 100),
    years_experience INTEGER DEFAULT 3,
    is_featured BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABLE SERVICES (Services et prestations)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    indicative_price TEXT,
    icon_name TEXT DEFAULT 'laptop',
    features TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TABLE BLOG_POSTS (Articles techniques)
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    main_image TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    author TEXT NOT NULL DEFAULT 'Alexandre',
    reading_time_minutes INTEGER DEFAULT 5,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TABLE RESUMES (CV en PDF)
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size_kb INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. TABLE SERVICE_REQUESTS (Demandes de devis & services reçues)
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service_title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget TEXT,
    timeline TEXT,
    preferred_contact_method TEXT NOT NULL,
    attachment_url TEXT,
    status TEXT DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en-cours', 'contacte', 'devis-envoye', 'termine', 'refuse')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. TABLE CONTACT_MESSAGES (Messages du formulaire de contact)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- CONFIGURATION ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. LECTURE PUBLIQUE (Tout visiteur peut voir le contenu du portfolio)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read resumes" ON public.resumes FOR SELECT USING (true);

-- 2. SOUMISSIONS PUBLIQUES (Visiteurs peuvent envoyer un message ou une demande)
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert service_requests" ON public.service_requests FOR INSERT WITH CHECK (true);

-- 3. ACCÈS TOTAL POUR L'ADMINISTRATEUR CONNECTÉ
CREATE POLICY "Admin all profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all resumes" ON public.resumes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all service_requests" ON public.service_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin all contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- DONNÉES INITIALES (PROFIL DU PROPRIÉTAIRE)
-- ==============================================================================
INSERT INTO public.profiles (
    full_name,
    title,
    tagline,
    bio_short,
    bio_full,
    avatar_url,
    location,
    email,
    github_url,
    linkedin_url,
    is_available_for_hire,
    years_of_experience,
    completed_projects_count
) VALUES (
    'Développeur Fullstack',
    'Développeur Fullstack & Ingénieur Web',
    'Conception d''architectures robustes, d''APIs performantes et d''interfaces modernes',
    'Développeur web expérimenté spécialisé dans la réalisation d''applications sur-mesure pour startups et entreprises.',
    'Passionné par l''ingénierie logicielle, les architectures cloud et les performances web. J''accompagne mes clients depuis le cadrage technique jusqu''au déploiement continu.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    'Paris / Remote',
    'soheholmes7@gmail.com',
    'https://github.com',
    'https://linkedin.com',
    true,
    5,
    18
) ON CONFLICT DO NOTHING;
