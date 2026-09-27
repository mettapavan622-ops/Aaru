import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE CLIENT INITIALIZATION & CONFIGURATION
//
// Credentials should NEVER be exposed or requested in the frontend UI.
// Credentials and user accounts are securely stored in Supabase.
// Configure your project connection via environment variables or replace
// the placeholders below in your private environment:
// ============================================================================

export const SUPABASE_URL: string =
  (import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  'https://YOUR_SUPABASE_PROJECT_URL.supabase.co'; // <--- [PLACEHOLDER: PASTE YOUR SUPABASE URL HERE]

export const SUPABASE_ANON_KEY: string =
  (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  'YOUR_SUPABASE_ANON_KEY'; // <--- [PLACEHOLDER: PASTE YOUR SUPABASE ANON KEY HERE]

/**
 * Validates if the project has real Supabase credentials or still default placeholders.
 */
export const isSupabaseConfigured = (): boolean => {
  const url = (SUPABASE_URL || '').trim();
  const key = (SUPABASE_ANON_KEY || '').trim();

  const isPlaceholderUrl =
    !url ||
    url.includes('YOUR_SUPABASE_PROJECT_URL') ||
    url.includes('YOUR_PROJECT_ID') ||
    !url.startsWith('http');

  const isPlaceholderKey =
    !key ||
    key.includes('YOUR_SUPABASE_ANON_KEY') ||
    key.includes('YOUR_SUPABASE_ANON_PUBLIC_KEY');

  return !isPlaceholderUrl && !isPlaceholderKey;
};

/**
 * Client initialization using createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
