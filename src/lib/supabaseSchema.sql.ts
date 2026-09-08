export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- SCHEMA POSTGRESQL & SUPABASE PRODUCTION-READY POUR PORTFOLIO DÉVELOPPEUR
-- ==============================================================================

-- 1. Activer l'extension UUID si non présente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Table: profiles (informations personnelles & professionnelles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  bio_short TEXT NOT NULL,
  bio_full TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  github_url TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  twitter_url TEXT,
  is_available_for_hire BOOLEAN DEFAULT true,
  years_of_experience INTEGER DEFAULT 5,
  completed_projects_count INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: skill_categories & skills
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'database', 'tools')),
  level_percentage INTEGER CHECK (level_percentage >= 0 AND level_percentage <= 100),
  years_experience INTEGER DEFAULT 1,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: experiences
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table: projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_short TEXT NOT NULL,
  description_full TEXT NOT NULL,
  main_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('saas', 'web-app', 'api', 'ecommerce', 'cms')),
  demo_url TEXT,
  github_url TEXT,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  client TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table: services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  indicative_price TEXT,
  icon_name TEXT DEFAULT 'Code',
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table: service_requests (demandes clients)
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
  attachment_url TEXT,
  preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp')),
  status TEXT DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en-cours', 'contacte', 'devis-envoye', 'termine', 'refuse')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Table: contact_messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Table: blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  main_image TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time_minutes INTEGER DEFAULT 5,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Table: resumes (gestion du CV)
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_kb INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Table: media
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_kb INTEGER DEFAULT 0,
  folder TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Lectures publiques pour le contenu du portfolio
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public skills read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public experiences read" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public projects read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public services read" ON public.services FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public blog read" ON public.blog_posts FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');
CREATE POLICY "Public resumes read" ON public.resumes FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');

-- Insertions publiques sécurisées pour les demandes et messages de contact
CREATE POLICY "Public service requests insert" ON public.service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public contact messages insert" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Accès complet réservé à l'administrateur authentifié
CREATE POLICY "Admin profiles full" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin skills full" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin experiences full" ON public.experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin projects full" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin services full" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin blog full" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin resumes full" ON public.resumes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin service requests read_write" ON public.service_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin contact messages read_write" ON public.contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin media full" ON public.media FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================================================
-- BUCKETS SUPABASE STORAGE (Créer via Dashboard ou SQL)
-- ==============================================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true) ON CONFLICT DO NOTHING;
`;
