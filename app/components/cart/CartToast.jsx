"use client";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
export default function CartToast({ toast, onDismiss, onOpen }) {
  const panel = useRef(null);
  useEffect(() => {
    if (!toast) return;
    const animation = matchMedia('(prefers-reduced-motion: reduce)').matches ? null : panel.current.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'ease-out' });
    const timer = setTimeout(onDismiss, 3500);
    return () => { clearTimeout(timer); animation?.cancel(); };
  }, [toast, onDismiss]);
  if (!toast) return null;
  return createPortal(<div ref={panel} data-cart-toast className="fixed inset-x-4 bottom-5 z-[200] flex items-center gap-4 border border-cocoa/20 bg-white px-5 py-4 text-cocoa shadow-sm sm:left-auto sm:right-6 sm:max-w-[420px]">
    <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-burgundy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 12 4 4L19 6" /></svg>
    <p role="status" aria-live="polite" className="flex-1 text-sm leading-5">{toast.name} added to cart.</p>
    <button type="button" onClick={onOpen} className="min-h-10 shrink-0 cursor-pointer border-b border-cocoa text-sm">View cart</button>
    <button type="button" onClick={onDismiss} aria-label="Dismiss cart notification" className="min-h-10 min-w-6 cursor-pointer text-xl">×</button>
  </div>, document.body);
}
