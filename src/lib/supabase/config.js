export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** False until `.env.local` is filled (see README). The login page explains it. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Single Storage bucket for avatars, ticket images and resource thumbnails. */
export const IMAGE_BUCKET = "images";
