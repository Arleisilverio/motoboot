import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://cijhhohosmmvbednsapf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpamhob2hvc21tdmJlZG5zYXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjAyMDUsImV4cCI6MjA3NDY5NjIwNX0.KQsXtPydEpJTm9UKGln1O0IUzwylL41CkUCU_pBPZrY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);