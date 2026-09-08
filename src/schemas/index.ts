import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  honeypot: z.string().optional(), // Protection anti-spam
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const serviceRequestSchema = z.object({
  client_name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Adresse email valide requise'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service_title: z.string().min(2, 'Veuillez sélectionner ou préciser un service'),
  description: z.string().min(15, 'Veuillez détailler votre besoin (au moins 15 caractères)'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  preferred_contact_method: z.enum(['email', 'phone', 'whatsapp']),
  attachment_url: z.string().optional(),
  honeypot: z.string().optional(), // Anti-spam
});

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

export const projectSchema = z.object({
  title: z.string().min(2, 'Titre requis'),
  slug: z.string().min(2, 'Slug requis'),
  description_short: z.string().min(10, 'Courte description requise'),
  description_full: z.string().min(20, 'Description complète requise'),
  main_image: z.string().min(1, 'Image principale requise'),
  technologies: z.string().min(1, 'Au moins une technologie (séparées par virgules)'),
  category: z.enum(['saas', 'web-app', 'api', 'ecommerce', 'cms']),
  demo_url: z.string().url('URL valide requise').optional().or(z.literal('')),
  github_url: z.string().url('URL valide requise').optional().or(z.literal('')),
  date: z.string().min(4, 'Année ou date requise'),
  status: z.enum(['completed', 'in-progress', 'archived']),
  is_featured: z.boolean(),
  client: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const experienceSchema = z.object({
  company: z.string().min(2, 'Entreprise requise'),
  role: z.string().min(2, 'Intitulé du poste requis'),
  period: z.string().min(2, 'Période requise (ex: 2022 - Présent)'),
  location: z.string().min(2, 'Lieu requis (ex: Paris / Remote)'),
  description: z.string().min(10, 'Description requise'),
  responsibilities: z.string().min(5, 'Responsabilités (une par ligne ou séparées par virgules)'),
  technologies: z.string().min(2, 'Technologies (séparées par virgules)'),
  is_current: z.boolean(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

export const skillSchema = z.object({
  name: z.string().min(1, 'Nom de la compétence requis'),
  category: z.enum(['frontend', 'backend', 'database', 'tools']),
  level_percentage: z.number().min(1).max(100).optional(),
  years_experience: z.number().min(0).optional(),
  is_featured: z.boolean(),
});

export type SkillFormData = z.infer<typeof skillSchema>;

export const serviceSchema = z.object({
  title: z.string().min(3, 'Titre du service requis'),
  slug: z.string().min(2, 'Slug requis'),
  description: z.string().min(15, 'Description requise'),
  indicative_price: z.string().optional(),
  icon_name: z.string(),
  features: z.string().min(5, 'Caractéristiques (séparées par des retours à la ligne)'),
  is_active: z.boolean(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(5, 'Titre requis'),
  slug: z.string().min(3, 'Slug requis'),
  summary: z.string().min(15, 'Résumé requis'),
  content: z.string().min(30, 'Contenu requis (Markdown supporté)'),
  main_image: z.string().min(1, 'Image requise'),
  category: z.string().min(2, 'Catégorie requise'),
  tags: z.string().min(2, 'Tags (séparés par des virgules)'),
  author: z.string().min(2, 'Auteur requis'),
  reading_time_minutes: z.number().min(1),
  status: z.enum(['draft', 'published']),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Nom complet requis'),
  title: z.string().min(2, 'Métier / Titre requis'),
  tagline: z.string().min(10, 'Accroche requise'),
  bio_short: z.string().min(20, 'Présentation courte requise'),
  bio_full: z.string().min(50, 'Présentation complète requise'),
  avatar_url: z.string().min(1, 'URL de la photo requise'),
  location: z.string().min(2, 'Localisation requise'),
  email: z.string().email('Email valide requis'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  github_url: z.string().url('URL GitHub valide requise'),
  linkedin_url: z.string().url('URL LinkedIn valide requise'),
  twitter_url: z.string().optional(),
  is_available_for_hire: z.boolean(),
  years_of_experience: z.number().min(0),
  completed_projects_count: z.number().min(0),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
