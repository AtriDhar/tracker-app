import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase keys are missing!\n' +
    'If running locally: create .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n' +
    'If deployed on Render/Vercel: add both as Environment Variables in the dashboard, then redeploy.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);
