// Supabase service boundary: place shared client helpers here as app scales.
export function isSupabaseConfigured(url) {
  return Boolean(url) && url !== 'https://YOUR_PROJECT.supabase.co';
}
