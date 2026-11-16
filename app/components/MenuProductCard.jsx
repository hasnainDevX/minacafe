"use client";

import Image from "next/image";
import { useState } from "react";
import { productCutouts } from "../assets/cutouts";
import { AddToCartButton } from "./cart/CartControls";
import ProductReveal from "./ProductReveal";

export default function MenuProductCard({ product }) {
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id || "");
  const variant = product.variants?.find((option) => option.id === variantId);
  const price = variant?.price ?? product.price;
  return (
    <article id={product.id} className="flex scroll-mt-44 flex-col">
      <div className="relative aspect-square overflow-hidden border border-cocoa/20 bg-white">
        <ProductReveal className="absolute inset-0">
        <Image src={product.image || productCutouts[product.id]} alt={product.name} fill sizes="(max-width: 767px) 45vw, (max-width: 1023px) 30vw, 280px" className={product.image ? "object-cover" : "object-contain p-5 md:p-8"} />
        </ProductReveal>
        {product.isNew && <span className="absolute left-3 top-3 bg-burgundy px-3 py-1.5 text-[10px] uppercase tracking-widest text-ivory">New</span>}
      </div>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><h3 className="text-sm md:text-base">{product.name}</h3><p className="text-sm text-burgundy">Rs. {price.toLocaleString("en-PK")}</p></div>
      <p className="mt-2 text-xs leading-relaxed text-cocoa/75 md:text-sm">{product.description}</p>
      <div className="mt-auto pt-3">
        {product.variants && <label className="block text-[10px] uppercase tracking-widest">{product.optionLabel}<select aria-label={`${product.name} ${product.optionLabel.toLowerCase()}`} value={variantId} onChange={(event) => setVariantId(event.target.value)} className="mt-2 block min-h-11 w-full border border-cocoa/25 bg-ivory px-2 py-2 text-xs normal-case tracking-normal outline-offset-2 focus:outline-burgundy">{product.variants.map((option) => <option key={option.id} value={option.id}>{option.label} — Rs. {option.price}</option>)}</select></label>}
        <AddToCartButton productId={product.id} productName={product.name} variantId={variantId || undefined} />
      </div>
    </article>
  );
}
