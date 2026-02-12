import { NextResponse } from "next/server";

/**
 * Debug endpoint to verify Supabase env vars in production.
 * Visit: https://summit2-xi.vercel.app/api/supabase-status
 * Remove or restrict this route before going fully public.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const configured = Boolean(url && hasKey);

  return NextResponse.json({
    supabaseConfigured: configured,
    hasUrl: Boolean(url),
    hasAnonKey: hasKey,
    urlPrefix: url ? `${url.slice(0, 30)}...` : "missing",
  });
}
