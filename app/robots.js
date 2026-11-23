// Cache Components prerenders this metadata route; force-static is not supported.
import { publicSiteUrl } from './lib/seo';
export default function robots() {
  const origin = publicSiteUrl();
  return { rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/checkout', '/api/'] }, ...(origin ? { sitemap: new URL('/sitemap.xml', origin).href } : {}) };
}
