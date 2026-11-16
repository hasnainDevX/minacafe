"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { products } from "../../assets/products";
import { productCutouts } from "../../assets/cutouts";
import { useCart } from "./CartProvider";
import { CartIcon } from "./CartControls";
import { cartItemKey } from "../../lib/cart-store";

export default function CartDrawer() {
  const { items, count, open, closeCart, setQuantity, removeItem } = useCart();
  const dialog = useRef(null);
  const restore = useRef(null);

  useEffect(() => {
    const panel = dialog.current;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 300;
    let animation;
    if (open) {
      if (!panel.open) {
        const trigger = document.activeElement;
        const { overflow, paddingRight } = document.body.style;
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
        document.body.style.paddingRight = `${padding + scrollbar}px`;
        document.body.style.overflow = "hidden";
        restore.current = () => {
          document.body.style.overflow = overflow;
          document.body.style.paddingRight = paddingRight;
          const target = trigger?.isConnected && trigger.getClientRects().length ? trigger : document.querySelector("[data-cart-trigger]");
          target?.focus({ preventScroll: true });
        };
        panel.showModal();
      }
      animation = panel.animate([{ transform: "translateX(100%)" }, { transform: "translateX(0)" }], { duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    } else if (panel.open) {
      animation = panel.animate([{ transform: "translateX(0)" }, { transform: "translateX(100%)" }], { duration, easing: "ease-in", fill: "forwards" });
      animation.finished.then(() => {
        panel.close();
        restore.current?.();
        restore.current = null;
      }).catch(() => {});
    }
    return () => animation?.cancel();
  }, [open]);

  useEffect(() => () => { restore.current?.(); }, []);

  return (
    <dialog ref={dialog} id="mina-cart" aria-labelledby="cart-heading" onCancel={(event) => { event.preventDefault(); closeCart(); }} onClick={(event) => { if (event.target === event.currentTarget && event.clientX < event.currentTarget.getBoundingClientRect().left) closeCart(); }} className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-[460px] flex-col border-0 border-l border-cocoa/20 bg-ivory bg-[url('/images/textures/bggrain.png')] bg-cover bg-center bg-no-repeat p-0 text-cocoa shadow-xl backdrop:bg-black/40 open:flex">
      <div className="flex items-center justify-between gap-4 border-b border-cocoa/20 px-6 py-6 md:px-8 ">
        <h2 id="cart-heading" className="font-(family-name:--font-cormorant) text-4xl font-light">Your cart <span className="text-2xl">({count})</span></h2>
        <button type="button" onClick={closeCart} aria-label="Close cart" className="flex h-11 w-11 cursor-pointer items-center justify-center hover:text-burgundy">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 md:px-8">
        {items.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-5 py-16 text-center">
            <CartIcon className="h-10 w-10" />
            <p className="font-(family-name:--font-cormorant) text-3xl font-light">A little room for your favourites.</p>
            <p className="text-sm">Your cart is empty.</p>
            <Link href="/menu" onNavigate={closeCart} className="border border-burgundy bg-burgundy px-6 py-3 text-xs uppercase tracking-widest text-white">Explore our menu</Link>
          </div>
        ) : (
          <ul className="divide-y divide-cocoa/20">
            {items.map((item) => {
              const product = products.find((product) => product.id === item.id);
              if (!product) return null;
              const variant = product.variants?.find((option) => option.id === item.variant);
              const key = cartItemKey(item);
              const itemLabel = `${product.name}${variant ? ` — ${variant.label}` : ""}`;
              return (
                <li key={key} className="flex gap-4 py-6">
                  <div className="relative h-24 w-24 shrink-0 bg-white"><Image src={product.image || productCutouts[item.id]} alt={product.name} fill sizes="96px" className={product.image ? "object-cover" : "object-contain p-2"} /></div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base">{product.name}</h3>
                    <p className="mt-1 text-xs text-cocoa/70">{variant ? `${variant.label} · ` : ""}Rs. {(variant?.price ?? product.price).toLocaleString("en-PK")} each</p>
                    <div className="mt-3 inline-flex items-center border border-cocoa/30">
                      <button type="button" aria-label={`Decrease ${itemLabel} quantity`} onClick={() => setQuantity(key, item.quantity - 1)} className="h-11 w-11 cursor-pointer hover:bg-peach">−</button>
                      <span className="min-w-7 text-center text-sm" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                      <button type="button" aria-label={`Increase ${itemLabel} quantity`} disabled={item.quantity >= 99} onClick={() => setQuantity(key, item.quantity + 1)} className="h-11 w-11 cursor-pointer hover:bg-peach disabled:cursor-default disabled:opacity-40">+</button>
                    </div>
                    <button type="button" aria-label={`Remove ${itemLabel} from cart`} onClick={() => removeItem(key)} className="mt-2 block min-h-8 cursor-pointer text-xs underline underline-offset-4 hover:text-burgundy">Remove</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="border-t border-cocoa/20 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 md:px-8">
        <p role="status" className="mb-4 text-sm">{count} {count === 1 ? "item" : "items"} in your cart</p>
        <button type="button" onClick={closeCart} className="w-full cursor-pointer border border-burgundy bg-burgundy px-6 py-4 text-xs uppercase tracking-[0.15em] text-white hover:bg-burgundy/95">Place Order</button>
      </div>
    </dialog>
  );
}
