"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ContentReveals() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    function setup() {
      cleanup();
      if (preference.matches) return;
      const states = new Map();
      const excluded = '[aria-roledescription="carousel"], [aria-labelledby="testimonials-heading"], [data-motion-skip], [data-product-reveal], nav, header, dialog, form, [id^="faq-answer-"]';
      function reveal(el) {
        const state = states.get(el);
        if (!state || state.done || !state.visible || document.querySelector('[data-mina-intro][data-state="loading"], dialog[open]')) return;
        state.done = true;
        observer.unobserve(el);
        state.animation = el.animate([{ opacity: 0, filter: 'blur(5px)', transform: 'translateY(16px)' }, { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' }], { duration: 800, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'both' });
        state.animation.finished.then(() => { state.conceal.cancel(); state.animation.cancel(); }).catch(() => {});
      }
      const observer = new IntersectionObserver(entries => entries.forEach(entry => { const state = states.get(entry.target); if (state) state.visible = entry.isIntersecting; reveal(entry.target); }), { rootMargin: '0px 0px -40px 0px' });
      const selector = 'main h1, main h2, main h3, main p, section[aria-labelledby] h2, section[aria-labelledby] p, [data-footer-content] h2, [data-footer-content] p';
      function scan(root = document) {
        const elements = [...root.querySelectorAll(selector)];
        if (root instanceof Element && root.matches(selector)) elements.unshift(root);
        elements.forEach(el => {
          if (states.has(el) || el.closest(excluded)) return;
          const conceal = el.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: 'both' });
          conceal.pause();
          states.set(el, { conceal }); observer.observe(el);
        });
      }
      function resume() { states.forEach((_, el) => reveal(el)); }
      scan();
      const changes = new MutationObserver(records => {
        // Only inspect newly inserted subtrees; text updates need no animation setup.
        const added = new Set();
        records.forEach(record => record.addedNodes.forEach(node => {
          if (node instanceof Element && node.isConnected) added.add(node);
        }));
        added.forEach(node => {
          if (![...added].some(parent => parent !== node && parent.contains(node))) scan(node);
        });
        states.forEach((state, el) => {
          if (!el.isConnected) {
            observer.unobserve(el);
            state.animation?.cancel();
            state.conceal.cancel();
            states.delete(el);
          }
        });
      });
      changes.observe(document.getElementById('smooth-content') || document.body, { childList: true, subtree: true });
      document.addEventListener('mina:content-visible', resume); document.addEventListener('close', resume, true);
      cleanup = () => { observer.disconnect(); changes.disconnect(); document.removeEventListener('mina:content-visible', resume); document.removeEventListener('close', resume, true); states.forEach((state, el) => { state.animation?.cancel(); state.conceal.cancel(); }); };
    }
    setup(); preference.addEventListener('change', setup);
    return () => { cleanup(); preference.removeEventListener('change', setup); };
  }, [pathname]);
  return null;
}
