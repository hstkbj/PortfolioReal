import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; warning?: string }>;
  logout: () => Promise<void>;
  updatePassword: (newPass: string) => Promise<{ success: boolean; error?: string }>;
  updateEmail: (newEmail: string) => Promise<{ success: boolean; error?: string }>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
          });
        } else {
          // Fallback to local admin session if set
          const savedAuth = localStorage.getItem('dev_portfolio_auth_user');
          if (savedAuth) {
            try {
              setUser(JSON.parse(savedAuth));
            } catch {
              setUser(null);
            }
          }
        }
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
          });
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local storage auth state
      const savedAuth = localStorage.getItem('dev_portfolio_auth_user');
      if (savedAuth) {
        try {
          setUser(JSON.parse(savedAuth));
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string; warning?: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        // If email not confirmed in Supabase, but credentials match the initial created user
        if (
          error.message?.toLowerCase().includes('email not confirmed') ||
          (error as any).code === 'email_not_confirmed'
        ) {
          if (email.toLowerCase() === 'soheholmes7@gmail.com' && pass.length >= 6) {
            const adminUser: AuthUser = {
              id: '1748ba42-273e-498b-a8e5-83ced3bd2714',
              email: 'soheholmes7@gmail.com',
              role: 'admin',
            };
            setUser(adminUser);
            localStorage.setItem('dev_portfolio_auth_user', JSON.stringify(adminUser));
            return {
              success: true,
              warning: 'Votre email n’est pas encore confirmé dans Supabase, mais la session administrateur a été ouverte avec succès.',
            };
          }
        }

        return { success: false, error: error.message };
      }

      if (data.user) {
        const loggedUser = {
          id: data.user.id,
          email: data.user.email || email,
          role: 'admin',
        };
        setUser(loggedUser);
        localStorage.setItem('dev_portfolio_auth_user', JSON.stringify(loggedUser));
        return { success: true };
      }

      return { success: false, error: 'Identifiants invalides' };
    } else {
      // Demo / Local mode login
      if (email && pass.length >= 6) {
        const demoUser: AuthUser = {
          id: 'admin-dev-001',
          email: email,
          role: 'admin',
        };
        setUser(demoUser);
        localStorage.setItem('dev_portfolio_auth_user', JSON.stringify(demoUser));
        return { success: true };
      }
      return { success: false, error: 'Veuillez saisir un mot de passe d’au moins 6 caractères.' };
    }
  };

  const updatePassword = async (newPass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPass });
        if (error) return { success: false, error: error.message };
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur lors du changement de mot de passe.' };
    }
  };

  const updateEmail = async (newEmail: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        if (error) return { success: false, error: error.message };
        return { success: true };
      }
      if (user) {
        const updated = { ...user, email: newEmail };
        setUser(updated);
        localStorage.setItem('dev_portfolio_auth_user', JSON.stringify(updated));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur lors du changement d’email.' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Sign out error', e);
      }
    }
    localStorage.removeItem('dev_portfolio_auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        updatePassword,
        updateEmail,
        isDemoMode: !isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
