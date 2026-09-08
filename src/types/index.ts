export type ProjectStatus = 'completed' | 'in-progress' | 'archived';

export interface Profile {
  id: string;
  full_name: string;
  title: string;
  tagline: string;
  bio_short: string;
  bio_full: string;
  avatar_url: string;
  location: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  github_url: string;
  linkedin_url: string;
  twitter_url?: string;
  is_available_for_hire: boolean;
  years_of_experience: number;
  completed_projects_count: number;
  created_at?: string;
  updated_at?: string;
}

export type SkillCategoryType = 'frontend' | 'backend' | 'database' | 'tools';

export interface SkillCategory {
  id: string;
  name: string;
  type: SkillCategoryType;
  order_index: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategoryType;
  level_percentage?: number;
  years_experience?: number;
  is_featured?: boolean;
  icon_name?: string;
  order_index?: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  order_index: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description_short: string;
  description_full: string;
  main_image: string;
  gallery_images: string[];
  technologies: string[];
  category: 'saas' | 'web-app' | 'api' | 'ecommerce' | 'cms';
  demo_url?: string;
  github_url?: string;
  date: string;
  status: ProjectStatus;
  is_featured: boolean;
  order_index: number;
  client?: string;
  created_at?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  indicative_price?: string;
  icon_name: string;
  features: string[];
  is_active: boolean;
  order_index: number;
  created_at?: string;
}

export type ServiceRequestStatus = 'nouveau' | 'en-cours' | 'contacte' | 'devis-envoye' | 'termine' | 'refuse';

export interface ServiceRequest {
  id: string;
  client_name: string;
  email: string;
  phone?: string;
  company?: string;
  service_title: string;
  description: string;
  budget?: string;
  timeline?: string;
  attachment_url?: string;
  preferred_contact_method: 'email' | 'phone' | 'whatsapp';
  status: ServiceRequestStatus;
  admin_notes?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  admin_notes?: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  main_image: string;
  category: string;
  tags: string[];
  author: string;
  published_at: string;
  reading_time_minutes: number;
  status: 'draft' | 'published';
  views_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Resume {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size_kb: number;
  is_active: boolean;
  created_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size_kb: number;
  folder: 'avatars' | 'projects' | 'blog' | 'resumes' | 'general';
  created_at: string;
}

export interface DashboardStats {
  projects_count: number;
  experiences_count: number;
  services_count: number;
  skills_count: number;
  articles_count: number;
  new_requests_count: number;
  unread_messages_count: number;
  recent_requests: ServiceRequest[];
  recent_messages: ContactMessage[];
}
