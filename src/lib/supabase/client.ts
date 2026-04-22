import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Usando as chaves do projeto cijhhohosmmvbednsapf
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Client-side Supabase client.
 */
export function getSupabaseClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export { supabaseUrl, supabaseAnonKey };