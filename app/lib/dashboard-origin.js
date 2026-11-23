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
    // Optional exact Workers preview URL, set by the owner in runtime variables.
    for (const value of (env.DASHBOARD_ALLOWED_ORIGINS || "").split(",").map(value => value.trim()).filter(Boolean)) {
      const extra = new URL(value);
      if (extra.protocol === "https:" && value === extra.origin) allowed.add(extra.origin);
    }
    return allowed.has(origin.origin);
  } catch {
    return false;
  }
}
