// The SEO canonical domain and the address used to sign in can differ.
// Keep this list exact: never allow all vercel.app hosts or trust forwarded hosts.
const productionOrigins = ["https://minacafe.online", "https://minacafe.vercel.app"];

export function sameOrigin(request, env = process.env) {
  try {
    const supplied = request.headers.get("origin");
    if (!supplied || supplied === "null" || request.headers.get("sec-fetch-site") === "cross-site") return false;
    const origin = new URL(supplied);
    if (!["https:", "http:"].includes(origin.protocol) || supplied !== origin.origin) return false;
    if (env.NODE_ENV === "development") return origin.origin === new URL(request.url).origin;
    const allowed = new Set(productionOrigins);
    if (env.SITE_URL) {
      const configured = new URL(env.SITE_URL);
      if (configured.protocol === "https:") allowed.add(configured.origin);
    }
    return allowed.has(origin.origin);
  } catch {
    return false;
  }
}
