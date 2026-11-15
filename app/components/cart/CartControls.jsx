"use client";

import { useCart } from "./CartProvider";

export function CartIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3h2l2.5 12h11l2-8H6" />
      <circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export function CartButton({ beforeOpen }) {
  const { count, open, openCart } = useCart();
  return (
    <button type="button" data-cart-trigger aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`} aria-haspopup="dialog" aria-expanded={open} aria-controls="mina-cart" onClick={() => { beforeOpen?.(); openCart(); }} className="relative ml-auto flex min-h-[73px] min-w-12 cursor-pointer items-center justify-center px-3 text-cocoa hover:text-burgundy md:px-5">
      <CartIcon className="h-6 w-6" />
      {count > 0 && <span className="absolute right-0 top-3 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] text-white md:right-2" aria-hidden="true">{count}</span>}
    </button>
  );
}

export function AddToCartButton({
  productId,
  productName,
  beforeAdd,
  className = "mt-3 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-burgundy bg-burgundy px-3 py-2 text-xs text-white hover:bg-burgundy/95",
  labelClassName = "",
}) {
  const { addItem } = useCart();
  return (
    <button type="button" aria-label={`Add ${productName} to cart`} onClick={() => { beforeAdd?.(); addItem(productId); }} className={className}>
      <CartIcon className="md:h-4 md:w-4 h-3 w-3 shrink-0" />
      <span className={labelClassName}>Add to Cart</span>
    </button>
  );
}