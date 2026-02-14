/**
 * Get the app's base URL for auth redirects.
 * Used by OAuth redirectTo and auth callback to ensure production URLs work on Vercel.
 *
 * Client: Use getAppUrl() - respects NEXT_PUBLIC_APP_URL, VERCEL_URL, or window.location.
 * Server: Use getAppUrlFromRequest(request) - uses request headers/URL.
 */

/** Client-side: build-time env or runtime window.origin */
export function getAppUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const url =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : null) ??
    "http://localhost:3000";
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/** Server-side: from request (Vercel proxy headers or URL) */
export function getAppUrlFromRequest(request: Request): string {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    new URL(request.url).host;
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (request.url.startsWith("https") ? "https" : "http");
  const fromRequest = `${proto}://${host}`;

  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) {
    const cleaned = fromEnv.replace(/\/$/, "");
    return cleaned;
  }
  return fromRequest;
}
