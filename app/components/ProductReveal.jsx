"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ProductReveal({ as: Tag = "div", children, ...props }) {
  const card = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const element = card.current;
      let entered = false;
      let revealed = false;
      let animation;
      gsap.set(element, { opacity: 0, scale: 0.72 });

      function reveal() {
        if (revealed || !entered) return;
        if (document.querySelector('[data-mina-intro][data-state="loading"], dialog[open]')) return;
        revealed = true;
        observer.disconnect();
        animation = gsap.to(element, {
          opacity: 1,
          scale: 1,
          duration: 1.15,
          ease: "power2.out",
          clearProps: "opacity,transform",
        });
      }

      const observer = new IntersectionObserver(([entry]) => {
        entered = entry.isIntersecting;
        reveal();
      }, { rootMargin: "0px 0px -48px 0px", threshold: 0 });
      observer.observe(element);
      document.addEventListener("mina:content-visible", reveal);
      document.addEventListener("close", reveal, true);
      // Keyboard users should never focus an invisible product control.
      element.addEventListener("focusin", reveal);
      return () => {
        observer.disconnect();
        animation?.revert();
        gsap.set(element, { clearProps: "opacity,transform" });
        document.removeEventListener("mina:content-visible", reveal);
        document.removeEventListener("close", reveal, true);
        element.removeEventListener("focusin", reveal);
      };
    });
    return () => media.revert();
  }, { scope: card });

  return <Tag ref={card} data-product-reveal {...props}>{children}</Tag>;
}
