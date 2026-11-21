import "server-only";
import { products as localProducts, categories as localCategories } from "../assets/products";
import { productCutouts } from "../assets/cutouts";
import { productImages } from "../assets";
import { defaultSettings } from "./business";

export const projectId = process.env.SANITY_PROJECT_ID || "ea5s4yve";
export const dataset = process.env.SANITY_DATASET || "production";
const query = `{
  "products": *[_type == "product"] | order(displayOrder asc, name asc) {
    "id": _id, name, description, price, "category": category->name,
    "image": image.asset->url, imageFit, "categoryImage": categoryImage.asset->url,
    isAvailable, featured, isNew, displayOrder, optionLabel,
    "variants": variants[]{"id": _key, label, price}
  },
  "categories": *[_type == "category"] | order(displayOrder asc, name asc) {"id": _id, name, "image": image.asset->url},
  "settings": *[_type == "businessSettings" && _id == "business-settings"][0],
  "home": *[_type == "homepage" && _id == "homepage"][0]{announcement, heroHeading, heroDescription, "heroSlides": heroSlides[defined(image.asset)][]{"src": image.asset->url, name, position}}
}`;

export function localStorefront() {
  return { products: localProducts.map(p => ({ ...p, image: p.image || productCutouts[p.id], imageFit: p.image ? "cover" : "contain", categoryImage: productImages[p.id] || p.image, isAvailable: true, featured: ["strawberry-milk-bottle", "mango-milk-bottle", "fresh-fruit-glass", "chicken-salad-bowl", "nut-and-nectar-cup", "nut-and-nectar-bucket"].includes(p.id) })), categories: localCategories.map(name => ({ id: name, name })), settings: defaultSettings, home: {} };
}

export async function getStorefront({ fresh = false, allowPreview = true } = {}) {
  if (allowPreview && process.env.NODE_ENV !== "production" && process.env.SANITY_LOCAL_PREVIEW === "true") return { ...localStorefront(), source: "preview", orderingReady: true };
  const url = new URL(`https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set("query", query);
  url.searchParams.set("perspective", "published");
  const response = await fetch(url, { ...(fresh ? { cache: "no-store" } : { next: { revalidate: 30, tags: ["mina-storefront"] } }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error("Menu is temporarily unavailable. Please try again.");
  const { result } = await response.json();
  if (!result || !Array.isArray(result.products)) throw new Error("Menu could not be loaded.");
  const products = result.products.filter(p => p.name && Number.isFinite(p.price) && p.price >= 0).map(p => ({ ...p, category: p.category || "More favourites", variants: p.variants?.length ? p.variants : undefined }));
  const categories = [...(result.categories || [])];
  for (const product of products) if (!categories.some(c => c.name === product.category)) categories.push({ id: product.category, name: product.category });
  return { products, categories, settings: { ...defaultSettings, ...(result.settings || {}) }, home: result.home || {}, source: "sanity", orderingReady: Boolean(result.settings) };
}
