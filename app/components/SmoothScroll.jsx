"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

ScrollTrigger.config({ ignoreMobileResize: true });

const MOUSE =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)";

export default function SmoothScroll({ children }) {
  const wrapper = useRef(null);
  const content = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      // Mouse devices: smooth scroll + JS section stack + footer reveal
      media.add(MOUSE, () => {
        const smoother = ScrollSmoother.create({
          wrapper: wrapper.current,
          content: content.current,
          smooth: 1.6,
          smoothTouch: false,
          effects: true,
        });
        window.smoother = smoother;

        content.current
          .querySelectorAll("[data-section-stack]")
          .forEach((stack) => {
            const underlay = stack.querySelector("[data-section-underlay]");
            const cover = stack.querySelector("[data-section-cover]");
            if (!underlay || !cover) return;

            gsap.to(underlay, {
              y: () => cover.offsetHeight,
              ease: "none",
              scrollTrigger: {
                trigger: underlay,
                start: "top top",
                end: () => `+=${cover.offsetHeight}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          });

        const footer = content.current.querySelector("[data-footer-reveal]");
        const footerContent = content.current.querySelector(
          "[data-footer-content]",
        );
        if (footer && footerContent) {
          gsap.fromTo(
            footerContent,
            { yPercent: -100 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: footer,
                start: "top bottom",
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        return () => {
          delete window.smoother;
          smoother.kill();
        };
      });

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        window.removeEventListener("load", onLoad);
        media.revert();
      };
    },
    { scope: wrapper },
  );

  return (
    <div ref={wrapper} id="smooth-wrapper">
      <div ref={content} id="smooth-content">
        {children}
      </div>
    </div>
  );
}