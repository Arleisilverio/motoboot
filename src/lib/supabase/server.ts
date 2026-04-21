import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

const supabaseUrl = "https://cijhhohosmmvbednsapf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpamhob2hvc21tdmJlZG5zYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjAyMDUsImV4cCI6MjA3NDY5NjIwNX0.KQsXtPydEpJTm9UKGln1O0IUzwylL41CkUCU_pBPZrY";

/**
 * Server-side Supabase client.
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignorado em Server Components
          }
        },
      },
    }
  );
}
export { supabaseUrl, supabaseAnonKey };