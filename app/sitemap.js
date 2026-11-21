import { publicSiteUrl } from './lib/seo';
export default function sitemap() {
  const origin = publicSiteUrl();
  if (!origin) return [];
  return ['/', '/menu', '/our-story', '/find-us', '/bulk-orders'].map(path => ({ url: new URL(path, origin).href }));
}
