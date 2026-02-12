"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const hasPlaceholderConfig =
  isSupabaseConfigured &&
  (supabaseUrl.includes("your-project") || supabaseAnonKey.includes("your-anon-key"));
