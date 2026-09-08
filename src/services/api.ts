import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Profile, 
  Skill, 
  Experience, 
  Project, 
  Service, 
  ServiceRequest, 
  ContactMessage, 
  BlogPost, 
  Resume, 
  MediaItem, 
  DashboardStats 
} from '../types';
import {
  initialProfile,
  initialSkills,
  initialExperiences,
  initialProjects,
  initialServices,
  initialBlogPosts,
  initialResume,
  initialServiceRequests,
  initialContactMessages,
} from '../lib/seedData';

// Helper for local storage persistence when Supabase credentials are not set
const STORAGE_KEYS = {
  PROFILE: 'dev_portfolio_profile_v1',
  SKILLS: 'dev_portfolio_skills_v1',
  EXPERIENCES: 'dev_portfolio_experiences_v1',
  PROJECTS: 'dev_portfolio_projects_v1',
  SERVICES: 'dev_portfolio_services_v1',
  REQUESTS: 'dev_portfolio_requests_v1',
  MESSAGES: 'dev_portfolio_messages_v1',
  BLOG: 'dev_portfolio_blog_v1',
  RESUMES: 'dev_portfolio_resumes_v1',
  MEDIA: 'dev_portfolio_media_v1',
};

function getLocalData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

export const api = {
  // PROFILE
  async getProfile(): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn('Supabase session check failed:', sessionError.message);
      }
      if (session) {
        const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
        if (!error && data) return data as Profile;
      }
    }
    return getLocalData<Profile>(STORAGE_KEYS.PROFILE, initialProfile);
  },

  async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          throw new Error('No active Supabase session. Please sign in again to save to the database.');
        }

        const existing = await supabase.from('profiles').select('id').limit(1).maybeSingle();
        if (existing.data?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .update({ ...profileData, updated_at: new Date().toISOString() })
            .eq('id', existing.data.id)
            .select()
            .single();
          if (!error && data) {
            setLocalData(STORAGE_KEYS.PROFILE, data);
            return data as Profile;
          }
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('profiles')
            .insert([{ ...profileData }])
            .select()
            .single();
          if (!error && data) {
            setLocalData(STORAGE_KEYS.PROFILE, data);
            return data as Profile;
          }
          if (error) throw error;
        }
      } catch (err: any) {
        console.warn('Supabase updateProfile error, remote save failed:', err);
        throw new Error(err?.message || 'Impossible de sauvegarder dans la base de données.');
      }
    }

    const current = getLocalData<Profile>(STORAGE_KEYS.PROFILE, initialProfile);
    const updated = { ...current, ...profileData, updated_at: new Date().toISOString() };
    setLocalData(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  async checkSupabaseTables(): Promise<Record<string, boolean>> {
    if (!isSupabaseConfigured || !supabase) {
      return {};
    }
    const tables = [
      'profiles',
      'projects',
      'experiences',
      'skills',
      'services',
      'blog_posts',
      'resumes',
      'service_requests',
      'contact_messages',
    ];
    const results: Record<string, boolean> = {};
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('id', { count: 'exact', head: true });
        results[table] = !error;
      } catch {
        results[table] = false;
      }
    }
    return results;
  },

  purgeLocalDemoData(): void {
    setLocalData(STORAGE_KEYS.PROJECTS, []);
    setLocalData(STORAGE_KEYS.SKILLS, []);
    setLocalData(STORAGE_KEYS.EXPERIENCES, []);
    setLocalData(STORAGE_KEYS.SERVICES, []);
    setLocalData(STORAGE_KEYS.BLOG, []);
    setLocalData(STORAGE_KEYS.REQUESTS, []);
    setLocalData(STORAGE_KEYS.MESSAGES, []);
    setLocalData(STORAGE_KEYS.RESUMES, []);
  },

  // SKILLS
  async getSkills(): Promise<Skill[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('skills').select('*').order('order_index');
      if (!error && data) return data as Skill[];
    }
    return getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills);
  },

  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const newSkill: Skill = {
      ...skill,
      id: 'sk_' + Date.now(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('skills').insert([skill]).select().single();
      if (!error && data) return data as Skill;
    }
    const list = getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills);
    const updated = [...list, newSkill];
    setLocalData(STORAGE_KEYS.SKILLS, updated);
    return newSkill;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Skill;
    }
    const list = getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setLocalData(STORAGE_KEYS.SKILLS, updated);
    return updated.find((i) => i.id === id)!;
  },

  async deleteSkill(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('skills').delete().eq('id', id);
      return;
    }
    const list = getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, initialSkills);
    setLocalData(STORAGE_KEYS.SKILLS, list.filter((i) => i.id !== id));
  },

  // EXPERIENCES
  async getExperiences(): Promise<Experience[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('experiences').select('*').order('order_index');
      if (!error && data) return data as Experience[];
    }
    return getLocalData<Experience[]>(STORAGE_KEYS.EXPERIENCES, initialExperiences);
  },

  async createExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
    const newExp: Experience = {
      ...exp,
      id: 'exp_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('experiences').insert([exp]).select().single();
      if (!error && data) return data as Experience;
    }
    const list = getLocalData<Experience[]>(STORAGE_KEYS.EXPERIENCES, initialExperiences);
    const updated = [newExp, ...list];
    setLocalData(STORAGE_KEYS.EXPERIENCES, updated);
    return newExp;
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('experiences').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Experience;
    }
    const list = getLocalData<Experience[]>(STORAGE_KEYS.EXPERIENCES, initialExperiences);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setLocalData(STORAGE_KEYS.EXPERIENCES, updated);
    return updated.find((i) => i.id === id)!;
  },

  async deleteExperience(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('experiences').delete().eq('id', id);
      return;
    }
    const list = getLocalData<Experience[]>(STORAGE_KEYS.EXPERIENCES, initialExperiences);
    setLocalData(STORAGE_KEYS.EXPERIENCES, list.filter((i) => i.id !== id));
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').select('*').order('order_index');
      if (!error && data) return data as Project[];
    }
    return getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (!error && data) return data as Project;
    }
    const list = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    return list.find((p) => p.slug === slug) || null;
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: 'proj_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').insert([project]).select().single();
      if (!error && data) return data as Project;
    }
    const list = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    const updated = [newProject, ...list];
    setLocalData(STORAGE_KEYS.PROJECTS, updated);
    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Project;
    }
    const list = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setLocalData(STORAGE_KEYS.PROJECTS, updated);
    return updated.find((i) => i.id === id)!;
  },

  async deleteProject(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('projects').delete().eq('id', id);
      return;
    }
    const list = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    setLocalData(STORAGE_KEYS.PROJECTS, list.filter((i) => i.id !== id));
  },

  // SERVICES
  async getServices(): Promise<Service[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').select('*').order('order_index');
      if (!error && data) return data as Service[];
    }
    return getLocalData<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
  },

  async createService(srv: Omit<Service, 'id'>): Promise<Service> {
    const newService: Service = {
      ...srv,
      id: 'srv_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').insert([srv]).select().single();
      if (!error && data) return data as Service;
    }
    const list = getLocalData<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
    const updated = [...list, newService];
    setLocalData(STORAGE_KEYS.SERVICES, updated);
    return newService;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('services').update(updates).eq('id', id).select().single();
      if (!error && data) return data as Service;
    }
    const list = getLocalData<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setLocalData(STORAGE_KEYS.SERVICES, updated);
    return updated.find((i) => i.id === id)!;
  },

  async deleteService(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('services').delete().eq('id', id);
      return;
    }
    const list = getLocalData<Service[]>(STORAGE_KEYS.SERVICES, initialServices);
    setLocalData(STORAGE_KEYS.SERVICES, list.filter((i) => i.id !== id));
  },

  // SERVICE REQUESTS (Demandes de devis / services)
  async submitServiceRequest(reqData: Omit<ServiceRequest, 'id' | 'created_at' | 'status'>): Promise<ServiceRequest> {
    const newReq: ServiceRequest = {
      ...reqData,
      id: 'req_' + Date.now(),
      status: 'nouveau',
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('service_requests').insert([newReq]).select().single();
      if (!error && data) return data as ServiceRequest;
    }
    const list = getLocalData<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, initialServiceRequests);
    const updated = [newReq, ...list];
    setLocalData(STORAGE_KEYS.REQUESTS, updated);
    return newReq;
  },

  async getServiceRequests(): Promise<ServiceRequest[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('service_requests').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as ServiceRequest[];
    }
    return getLocalData<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, initialServiceRequests);
  },

  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('service_requests').update(updates).eq('id', id).select().single();
      if (!error && data) return data as ServiceRequest;
    }
    const list = getLocalData<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, initialServiceRequests);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setLocalData(STORAGE_KEYS.REQUESTS, updated);
    return updated.find((i) => i.id === id)!;
  },

  async deleteServiceRequest(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('service_requests').delete().eq('id', id);
      return;
    }
    const list = getLocalData<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, initialServiceRequests);
    setLocalData(STORAGE_KEYS.REQUESTS, list.filter((i) => i.id !== id));
  },

  // CONTACT MESSAGES
  async submitContactMessage(msgData: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg_' + Date.now(),
      is_read: false,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('contact_messages').insert([newMsg]).select().single();
      if (!error && data) return data as ContactMessage;
    }
    const list = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialContactMessages);
    const updated = [newMsg, ...list];
    setLocalData(STORAGE_KEYS.MESSAGES, updated);
    return newMsg;
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as ContactMessage[];
    }
    return getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialContactMessages);
  },

  async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('contact_messages').update(updates).eq('id', id).select().single();
      if (!error && data) return data as ContactMessage;
    }
    const list = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialContactMessages);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setLocalData(STORAGE_KEYS.MESSAGES, updated);
    return updated.find((i) => i.id === id)!;
  },

  async deleteContactMessage(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('contact_messages').delete().eq('id', id);
      return;
    }
    const list = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialContactMessages);
    setLocalData(STORAGE_KEYS.MESSAGES, list.filter((i) => i.id !== id));
  },

  // BLOG
  async getBlogPosts(onlyPublished = true): Promise<BlogPost[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
      if (onlyPublished) query = query.eq('status', 'published');
      const { data, error } = await query;
      if (!error && data) return data as BlogPost[];
    }
    const list = getLocalData<BlogPost[]>(STORAGE_KEYS.BLOG, initialBlogPosts);
    return onlyPublished ? list.filter((p) => p.status === 'published') : list;
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
      if (!error && data) return data as BlogPost;
    }
    const list = getLocalData<BlogPost[]>(STORAGE_KEYS.BLOG, initialBlogPosts);
    return list.find((p) => p.slug === slug) || null;
  },

  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: 'post_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('blog_posts').insert([post]).select().single();
      if (!error && data) return data as BlogPost;
    }
    const list = getLocalData<BlogPost[]>(STORAGE_KEYS.BLOG, initialBlogPosts);
    const updated = [newPost, ...list];
    setLocalData(STORAGE_KEYS.BLOG, updated);
    return newPost;
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('blog_posts').update(updates).eq('id', id).select().single();
      if (!error && data) return data as BlogPost;
    }
    const list = getLocalData<BlogPost[]>(STORAGE_KEYS.BLOG, initialBlogPosts);
    const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setLocalData(STORAGE_KEYS.BLOG, updated);
    return updated.find((i) => i.id === id)!;
  },

  async deleteBlogPost(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('blog_posts').delete().eq('id', id);
      return;
    }
    const list = getLocalData<BlogPost[]>(STORAGE_KEYS.BLOG, initialBlogPosts);
    setLocalData(STORAGE_KEYS.BLOG, list.filter((i) => i.id !== id));
  },

  // RESUMES
  async getActiveResume(): Promise<Resume | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('resumes').select('*').eq('is_active', true).single();
      if (!error && data) return data as Resume;
    }
    const list = getLocalData<Resume[]>(STORAGE_KEYS.RESUMES, [initialResume]);
    return list.find((r) => r.is_active) || list[0] || null;
  },

  async getResumes(): Promise<Resume[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('resumes').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Resume[];
    }
    return getLocalData<Resume[]>(STORAGE_KEYS.RESUMES, [initialResume]);
  },

  async createResume(resumeData: Omit<Resume, 'id' | 'created_at'>): Promise<Resume> {
    const newResume: Resume = {
      ...resumeData,
      id: 'res_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      if (resumeData.is_active) {
        await supabase.from('resumes').update({ is_active: false }).neq('id', 'placeholder');
      }
      const { data, error } = await supabase.from('resumes').insert([resumeData]).select().single();
      if (!error && data) return data as Resume;
    }
    const list = getLocalData<Resume[]>(STORAGE_KEYS.RESUMES, [initialResume]);
    const updated = resumeData.is_active 
      ? list.map(r => ({ ...r, is_active: false })) 
      : list;
    setLocalData(STORAGE_KEYS.RESUMES, [newResume, ...updated]);
    return newResume;
  },

  async setActiveResume(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('resumes').update({ is_active: false }).neq('id', id);
      await supabase.from('resumes').update({ is_active: true }).eq('id', id);
      return;
    }
    const list = getLocalData<Resume[]>(STORAGE_KEYS.RESUMES, [initialResume]);
    const updated = list.map(r => ({ ...r, is_active: r.id === id }));
    setLocalData(STORAGE_KEYS.RESUMES, updated);
  },

  async deleteResume(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('resumes').delete().eq('id', id);
      return;
    }
    const list = getLocalData<Resume[]>(STORAGE_KEYS.RESUMES, [initialResume]);
    setLocalData(STORAGE_KEYS.RESUMES, list.filter(r => r.id !== id));
  },

  // MEDIA
  async getMedia(): Promise<MediaItem[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as MediaItem[];
    }
    return getLocalData<MediaItem[]>(STORAGE_KEYS.MEDIA, [
      {
        id: 'med-1',
        name: 'photo_profil_alexandre.jpg',
        file_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        file_type: 'image/jpeg',
        file_size_kb: 245,
        folder: 'avatars',
        created_at: new Date().toISOString(),
      },
      {
        id: 'med-2',
        name: 'flowmetric_dashboard_mockup.png',
        file_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        file_type: 'image/png',
        file_size_kb: 512,
        folder: 'projects',
        created_at: new Date().toISOString(),
      }
    ]);
  },

  async createMedia(mediaData: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem> {
    const newMedia: MediaItem = {
      ...mediaData,
      id: 'med_' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('media').insert([mediaData]).select().single();
      if (!error && data) return data as MediaItem;
    }
    const list = await this.getMedia();
    const updated = [newMedia, ...list];
    setLocalData(STORAGE_KEYS.MEDIA, updated);
    return newMedia;
  },

  async deleteMedia(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('media').delete().eq('id', id);
      return;
    }
    const list = await this.getMedia();
    setLocalData(STORAGE_KEYS.MEDIA, list.filter(m => m.id !== id));
  },

  // STATS DASHBOARD
  async getDashboardStats(): Promise<DashboardStats> {
    const [projects, experiences, services, skills, blog, requests, messages] = await Promise.all([
      this.getProjects(),
      this.getExperiences(),
      this.getServices(),
      this.getSkills(),
      this.getBlogPosts(false),
      this.getServiceRequests(),
      this.getContactMessages(),
    ]);

    return {
      projects_count: projects.length,
      experiences_count: experiences.length,
      services_count: services.length,
      skills_count: skills.length,
      articles_count: blog.length,
      new_requests_count: requests.filter((r) => r.status === 'nouveau').length,
      unread_messages_count: messages.filter((m) => !m.is_read).length,
      recent_requests: requests.slice(0, 5),
      recent_messages: messages.slice(0, 5),
    };
  },

  // Reset demo data to factory defaults
  resetToFactoryData(): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile));
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(initialSkills));
    localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(initialExperiences));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(initialServices));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(initialServiceRequests));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialContactMessages));
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(initialBlogPosts));
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify([initialResume]));
  }
};
