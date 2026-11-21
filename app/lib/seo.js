// Set SITE_URL to the final public origin when deploying.
export function publicSiteUrl() {
  try {
    const url = new URL(process.env.SITE_URL);
    if (!['https:', 'http:'].includes(url.protocol) || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(url.hostname)) return null;
    return url.origin;
  } catch { return null; }
}

export function pageMetadata(title, description, path = '/') {
  const origin = publicSiteUrl();
  const images = origin ? [{ url: new URL('/images/brand/mina-original-logo.jpg', origin).href, width: 1254, height: 1254, alt: 'Mina Café — from my hands to your heart' }] : [];
  return {
    title, description,
    ...(origin ? { metadataBase: new URL(origin), alternates: { canonical: path } } : {}),
    openGraph: { title, description, siteName: 'Mina Café', type: 'website', locale: 'en_PK', ...(origin ? { url: new URL(path, origin).href } : {}), images },
    twitter: { card: 'summary', title, description, images: images.map(image => image.url) },
  };
}
