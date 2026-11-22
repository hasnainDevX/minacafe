import { cacheLife, cacheTag } from "next/cache";
import { getStorefront } from "../lib/storefront";
import { publicSiteUrl } from "../lib/seo";
import { DAYS } from "../lib/business";

export default async function LocalBusinessData() {
  "use cache";
  cacheLife({ stale: 30, revalidate: 30, expire: 3600 });
  cacheTag("mina-storefront");
  const origin = publicSiteUrl();
  if (!origin) return null;
  let settings;
  try {
    ({ settings } = await getStorefront({ allowPreview: false }));
  } catch {
    // A temporary CMS outage must not prevent the homepage from rendering.
    return null;
  }
  const phone = String(settings.whatsappNumber || "").replace(/\D/g, "");
  const time = /^([01]\d|2[0-3]):[0-5]\d$/;
  const data = {
    "@context": "https://schema.org",
    "@graph": [{
      "@type": "CafeOrCoffeeShop",
      "@id": origin + "/#cafe",
      name: "Mina Café",
      url: origin + "/",
      logo: origin + "/images/brand/mina-original-logo.jpg",
      image: [origin + "/images/photography/fruit-glass-stall-at-night.webp", origin + "/images/photography/chicken-salad-at-stall.webp"],
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: "Karachi",
        addressRegion: "Sindh",
        addressCountry: "PK",
      },
      ...(phone ? { telephone: "+" + (phone.startsWith("0") ? "92" + phone.slice(1) : phone) } : {}),
      ...(settings.mapsUrl ? { hasMap: settings.mapsUrl } : {}),
      ...(settings.instagramUrl ? { sameAs: [settings.instagramUrl] } : {}),
      hasMenu: origin + "/menu",
      openingHoursSpecification: (settings.hours || [])
        .filter(row => DAYS[Number(row.day)] && time.test(row.open) && time.test(row.close))
        .map(row => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "https://schema.org/" + DAYS[Number(row.day)],
          opens: row.closed ? "00:00" : row.open,
          closes: row.closed ? "00:00" : row.close,
        })),
    }, {
      "@type": "WebSite",
      "@id": origin + "/#website",
      url: origin + "/",
      name: "Mina Café",
      publisher: { "@id": origin + "/#cafe" },
      inLanguage: "en-PK",
    }],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
