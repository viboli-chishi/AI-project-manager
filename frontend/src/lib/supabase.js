import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
  console.warn('[Supabase] Missing env vars — VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnon || '');
