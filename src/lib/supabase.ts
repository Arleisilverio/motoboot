/**
 * Supabase Client Configuration
 * 
 * This file prepares the Supabase client for future integration.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Creates and returns the Supabase client instance.
 */
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[Motoboot] Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
    );
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Creates a Supabase client for server-side operations.
 * Use this in Server Components and API routes.
 */
export function getSupabaseServerClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}

export { supabaseUrl, supabaseAnonKey };

