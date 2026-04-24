'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from 'next/navigation';

export type Profile = {
  id: string;
  email?: string | null;
  name: string | null;
  whatsapp: string | null;
  helmet_color?: string | null;
  avatar_url?: string | null;
  role: string;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;         // auth session carregando
  profileLoading: boolean;  // profile row carregando (separado)
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser]               = useState<User | null>(null);
  const [session, setSession]         = useState<Session | null>(null);
  const [profile, setProfile]         = useState<Profile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const router = useRouter();

  // ── Busca ou cria perfil do usuário ────────────────────────────────────────
  const fetchProfile = useCallback(async (u: User) => {
    setProfileLoading(true);
    try {
      // 1ª tentativa: busca o perfil existente
      let { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, whatsapp, helmet_color, avatar_url, role')
        .eq('id', u.id)
        .single();

      // Se não existir (PGRST116 = "no rows"), cria o perfil manualmente
      if (error?.code === 'PGRST116' || (!data && error)) {
        const isAdmin = ['arlei85@hotmail.com', 'arleisilverio41@gmail.com'].includes(u.email ?? '');
        const { data: inserted } = await supabase
          .from('profiles')
          .upsert({
            id:       u.id,
            email:    u.email ?? '',
            name:     u.user_metadata?.name ?? '',
            whatsapp: u.user_metadata?.whatsapp ?? '',
            role:     isAdmin ? 'admin' : 'motoboy',
          }, { onConflict: 'id' })
          .select('id, email, name, whatsapp, helmet_color, avatar_url, role')
          .single();
        data = inserted;
      }

      setProfile(data ?? null);
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // ── Inicialização ───────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data: { session: initial } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(initial);
      setUser(initial?.user ?? null);
      if (initial?.user) await fetchProfile(initial.user);
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user);
        } else {
          setProfile(null);
        }

        setLoading(false);

        if (event === 'SIGNED_IN') {
          router.push('/');
          router.refresh();
        }
        if (event === 'SIGNED_OUT') {
          router.push('/login');
          router.refresh();
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, profileLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};