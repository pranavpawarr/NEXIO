import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !publicKey) {
  throw new Error(
    "Missing Supabase public environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)"
  );
}

// Public client for browser usage (safe to expose the anon key)
export const supabase: SupabaseClient = createClient(supabaseUrl, publicKey);

// Factory for creating a server-side/admin client when needed.
// Use this only in server-side code (API routes, server components). Do NOT expose the service role key to the browser.
export function createServiceSupabase(): SupabaseClient {
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_KEY for server-side Supabase client");
  }
  return createClient(supabaseUrl!, serviceRoleKey);
}
