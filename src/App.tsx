import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { trackPageView } from './lib/analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SkillsPage } from './pages/SkillsPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceRequestPage } from './pages/ServiceRequestPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { ResumePage } from './pages/ResumePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage';
import { AdminExperiencesPage } from './pages/admin/AdminExperiencesPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminResumePage } from './pages/admin/AdminResumePage';
import { AdminServiceRequestsPage } from './pages/admin/AdminServiceRequestsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      retry: 1,
    },
  },
});

function AnalyticsPageView() {
   const location = useLocation();

   useEffect(() => {
      trackPageView(`${location.pathname}${location.search}`);
   }, [location.pathname, location.search]);

   return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AnalyticsPageView />
          <Routes>
            {/* 1. PUBLIC ROUTES */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/projets" element={<ProjectsPage />} />
              <Route path="/projets/:slug" element={<ProjectDetailPage />} />
              <Route path="/competences" element={<SkillsPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/demande-service" element={<ServiceRequestPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cv" element={<ResumePage />} />
            </Route>

            {/* 2. ADMIN AUTH ROUTE */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* 3. PROTECTED ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardOverview />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="profil" element={<AdminProfilePage />} />
              <Route path="projets" element={<AdminProjectsPage />} />
              <Route path="competences" element={<AdminSkillsPage />} />
              <Route path="experiences" element={<AdminExperiencesPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route path="cv" element={<AdminResumePage />} />
              <Route path="demandes" element={<AdminServiceRequestsPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
