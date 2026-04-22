/**
 * Auth Service
 * 
 * Handles authentication flows via Supabase Auth.
 */

import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

/**
 * Signs in a user with email and password.
 */
export async function signIn(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error || !data.user) {
    console.error(`[Motoboot] Sign in error: ${error?.message}`);
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata?.name || '',
  };
}

/**
 * Signs up a new user.
 */
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<User | null> {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password, 
    options: { 
      data: { name } 
    } 
  });

  if (error || !data.user) {
    console.error(`[Motoboot] Sign up error: ${error?.message}`);
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata?.name || '',
  };
}

/**
 * Signs out the current user.
 */
export async function signOut(): Promise<boolean> {
  const { error } = await supabase.auth.signOut();
  return !error;
}

/**
 * Gets the current authenticated user.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name || '',
  };
}
