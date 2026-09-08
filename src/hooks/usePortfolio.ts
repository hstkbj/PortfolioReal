import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { 
  Profile, 
  Skill, 
  Experience, 
  Project, 
  Service, 
  BlogPost, 
  ServiceRequest, 
  ContactMessage, 
  Resume, 
  MediaItem 
} from '../types';

export const QUERY_KEYS = {
  PROFILE: ['profile'],
  SKILLS: ['skills'],
  EXPERIENCES: ['experiences'],
  PROJECTS: ['projects'],
  PROJECT: (slug: string) => ['projects', slug],
  SERVICES: ['services'],
  BLOG_POSTS: (onlyPublished: boolean) => ['blog', { onlyPublished }],
  BLOG_POST: (slug: string) => ['blog', slug],
  SERVICE_REQUESTS: ['service_requests'],
  CONTACT_MESSAGES: ['contact_messages'],
  RESUMES: ['resumes'],
  ACTIVE_RESUME: ['resumes', 'active'],
  MEDIA: ['media'],
  DASHBOARD_STATS: ['dashboard_stats'],
};

// PROFILE
export function useProfile() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: () => api.getProfile(),
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<Profile>) => api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
    },
  });

  return { ...query, updateProfile: mutation.mutateAsync, isUpdating: mutation.isPending };
}

// SKILLS
export function useSkills() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.SKILLS,
    queryFn: () => api.getSkills(),
  });

  const createMutation = useMutation({
    mutationFn: (skill: Omit<Skill, 'id'>) => api.createSkill(skill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SKILLS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Skill> }) => api.updateSkill(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SKILLS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SKILLS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  return {
    ...query,
    createSkill: createMutation.mutateAsync,
    updateSkill: updateMutation.mutateAsync,
    deleteSkill: deleteMutation.mutateAsync,
  };
}

// EXPERIENCES
export function useExperiences() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.EXPERIENCES,
    queryFn: () => api.getExperiences(),
  });

  const createMutation = useMutation({
    mutationFn: (exp: Omit<Experience, 'id'>) => api.createExperience(exp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPERIENCES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Experience> }) => api.updateExperience(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPERIENCES });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXPERIENCES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  return {
    ...query,
    createExperience: createMutation.mutateAsync,
    updateExperience: updateMutation.mutateAsync,
    deleteExperience: deleteMutation.mutateAsync,
  };
}

// PROJECTS
export function useProjects() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.PROJECTS,
    queryFn: () => api.getProjects(),
  });

  const createMutation = useMutation({
    mutationFn: (project: Omit<Project, 'id'>) => api.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) => api.updateProject(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  return {
    ...query,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
  };
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT(slug),
    queryFn: () => api.getProjectBySlug(slug),
    enabled: Boolean(slug),
  });
}

// SERVICES
export function useServices() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.SERVICES,
    queryFn: () => api.getServices(),
  });

  const createMutation = useMutation({
    mutationFn: (srv: Omit<Service, 'id'>) => api.createService(srv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Service> }) => api.updateService(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  return {
    ...query,
    createService: createMutation.mutateAsync,
    updateService: updateMutation.mutateAsync,
    deleteService: deleteMutation.mutateAsync,
  };
}

// SERVICE REQUESTS
export function useServiceRequests() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.SERVICE_REQUESTS,
    queryFn: () => api.getServiceRequests(),
  });

  const submitMutation = useMutation({
    mutationFn: (req: Omit<ServiceRequest, 'id' | 'created_at' | 'status'>) => api.submitServiceRequest(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICE_REQUESTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ServiceRequest> }) =>
      api.updateServiceRequest(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICE_REQUESTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteServiceRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SERVICE_REQUESTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  return {
    ...query,
    submitServiceRequest: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    updateServiceRequest: updateMutation.mutateAsync,
    deleteServiceRequest: deleteMutation.mutateAsync,
  };
}

// CONTACT MESSAGES
export function useContactMessages() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.CONTACT_MESSAGES,
    queryFn: () => api.getContactMessages(),
  });

  const submitMutation = useMutation({
    mutationFn: (msg: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>) => api.submitContactMessage(msg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACT_MESSAGES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ContactMessage> }) =>
      api.updateContactMessage(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACT_MESSAGES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteContactMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTACT_MESSAGES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  return {
    ...query,
    submitContactMessage: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    updateContactMessage: updateMutation.mutateAsync,
    deleteContactMessage: deleteMutation.mutateAsync,
  };
}

// BLOG POSTS
export function useBlogPosts(onlyPublished = true) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.BLOG_POSTS(onlyPublished),
    queryFn: () => api.getBlogPosts(onlyPublished),
  });

  const createMutation = useMutation({
    mutationFn: (post: Omit<BlogPost, 'id' | 'created_at'>) => api.createBlogPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BlogPost> }) => api.updateBlogPost(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_STATS });
    },
  });

  return {
    ...query,
    createBlogPost: createMutation.mutateAsync,
    updateBlogPost: updateMutation.mutateAsync,
    deleteBlogPost: deleteMutation.mutateAsync,
  };
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.BLOG_POST(slug),
    queryFn: () => api.getBlogPostBySlug(slug),
    enabled: Boolean(slug),
  });
}

// RESUMES
export function useResumes() {
  const queryClient = useQueryClient();
  const listQuery = useQuery({
    queryKey: QUERY_KEYS.RESUMES,
    queryFn: () => api.getResumes(),
  });

  const activeQuery = useQuery({
    queryKey: QUERY_KEYS.ACTIVE_RESUME,
    queryFn: () => api.getActiveResume(),
  });

  const createMutation = useMutation({
    mutationFn: (res: Omit<Resume, 'id' | 'created_at'>) => api.createResume(res),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUMES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVE_RESUME });
    },
  });

  const setActiveMutation = useMutation({
    mutationFn: (id: string) => api.setActiveResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUMES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVE_RESUME });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUMES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVE_RESUME });
    },
  });

  return {
    resumes: listQuery.data || [],
    isLoadingResumes: listQuery.isLoading,
    activeResume: activeQuery.data,
    isLoadingActive: activeQuery.isLoading,
    createResume: createMutation.mutateAsync,
    setActiveResume: setActiveMutation.mutateAsync,
    deleteResume: deleteMutation.mutateAsync,
  };
}

// MEDIA
export function useMedia() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.MEDIA,
    queryFn: () => api.getMedia(),
  });

  const createMutation = useMutation({
    mutationFn: (media: Omit<MediaItem, 'id' | 'created_at'>) => api.createMedia(media),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA });
    },
  });

  return {
    ...query,
    createMedia: createMutation.mutateAsync,
    deleteMedia: deleteMutation.mutateAsync,
  };
}

// DASHBOARD STATS
export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS,
    queryFn: () => api.getDashboardStats(),
    refetchInterval: 30000, // auto refresh every 30s
  });
}
