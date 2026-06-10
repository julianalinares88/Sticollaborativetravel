import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function isValidHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const supabaseUrl = isValidHttpUrl(rawSupabaseUrl) ? rawSupabaseUrl : "https://placeholder.supabase.co";

if (!isValidHttpUrl(rawSupabaseUrl) || !supabaseKey) {
  console.error("[TripMatch] Revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseKey || "placeholder-anon-key", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});