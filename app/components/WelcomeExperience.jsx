"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FruitGlassIllustration from "./FruitGlassIllustration";
import StripedBackground from "./StripedBackground";
import { products } from "../assets/products";

const INTRO_KEY = "mina-intro-seen-v1";
const chai = products.find((product) => product.id === "kashmiri-chai");
const readSession = (key) => { try { return sessionStorage.getItem(key) === "1"; } catch { return false; } };
const markSeen = (key) => { try { sessionStorage.setItem(key, "1"); } catch {} };

export default function WelcomeExperience() {
  const pathname = usePathname();
  const initialPath = useRef(pathname);
  const navigated = useRef(false);
  const overlay = useRef(null);
  const wordmark = useRef(null);
  const illustration = useRef(null);
  const popup = useRef(null);
  const popupShown = useRef(false);
  const releaseLock = useRef(null);

  function closePopup() {
    popup.current?.close();
    releaseLock.current?.();
    releaseLock.current = null;
    ScrollTrigger.refresh();
    document.dispatchEvent(new Event("mina:content-visible"));
  }

  useEffect(() => {
    if (pathname !== initialPath.current) navigated.current = true;
    const loader = overlay.current;
    const modal = popup.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showIntro = (!navigated.current && initialPath.current === "/" && pathname === "/") || !readSession(INTRO_KEY);
    const eligiblePopup = pathname === "/" || pathname === "/menu";
    const timers = new Set();
    let disposed = false;
    let timeline;
    let popupAnimation;

    function later(callback, delay) {
      const timer = setTimeout(() => { timers.delete(timer); if (!disposed) callback(); }, delay);
      timers.add(timer);
    }

    function lockPage() {
      const { overflow, paddingRight } = document.body.style;
      const content = document.getElementById("smooth-wrapper");
      const wasInert = content?.inert;
      const smoother = window.smoother;
      const wasPaused = smoother?.paused();
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      smoother?.paused(true, true);
      if (content) content.inert = true;
      document.body.style.paddingRight = `${padding + scrollbar}px`;
      document.body.style.overflow = "hidden";
      releaseLock.current = () => {
        document.body.style.overflow = overflow;
        document.body.style.paddingRight = paddingRight;
        if (content) content.inert = Boolean(wasInert);
        if (smoother && !wasPaused) smoother.paused(false);
      };
    }

    function maybeOpenPopup() {
      if (!eligiblePopup || popupShown.current) return;
      // Wait if the visitor is already using the cart or navigation.
      if (document.querySelector("dialog[open]") || document.body.style.overflow === "hidden") {
        later(maybeOpenPopup, 300);
        return;
      }
      lockPage();
      modal.showModal();
      popupShown.current = true;
      if (!reducedMotion) popupAnimation = modal.animate([{ opacity: 0, transform: "translateY(16px) scale(0.97)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], { duration: 450, easing: "cubic-bezier(0.22,1,0.36,1)" });
    }

    function finishIntro() {
      gsap.set(loader, { display: "none" });
      loader.setAttribute("aria-hidden", "true");
      loader.dataset.state = "complete";
      markSeen(INTRO_KEY);
      releaseLock.current?.();
      releaseLock.current = null;
      ScrollTrigger.refresh();
      document.dispatchEvent(new Event("mina:content-visible"));
      later(maybeOpenPopup, 10000);
    }

    if (showIntro) {
      lockPage();
      loader.removeAttribute("aria-hidden");
      loader.dataset.state = "loading";
      gsap.set(loader, { display: "flex", opacity: 1, yPercent: 0 });
      timeline = gsap.timeline({ onComplete: finishIntro });
      if (reducedMotion) {
        gsap.set(wordmark.current, { scale: 1, opacity: 1 });
        gsap.set(illustration.current, { y: 0, opacity: 1 });
        timeline.to(loader, { opacity: 0, duration: 0.12 });
      } else {
        timeline.fromTo(illustration.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 0);
        timeline.fromTo(wordmark.current, { scale: 0.42, opacity: 0.25 }, { scale: 1, opacity: 1, duration: 1.35, ease: "power2.out" }, 0)
          .to(loader, { yPercent: -100, duration: 0.65, ease: "power3.inOut" }, "+=0.15");
      }
    } else {
      gsap.set(loader, { display: "none" });
      loader.setAttribute("aria-hidden", "true");
      loader.dataset.state = "skipped";
      document.dispatchEvent(new Event("mina:content-visible"));
      later(maybeOpenPopup, 10000);
    }

    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      timeline?.kill();
      popupAnimation?.cancel();
      modal.close();
      releaseLock.current?.();
      releaseLock.current = null;
    };
  }, [pathname]);

  return (
    <>
      <div ref={overlay} data-mina-intro data-state="loading" role="status" aria-label="Loading Mina" className="fixed inset-0 z-[1000] flex isolate flex-col items-center justify-center gap-3 overflow-hidden bg-ivory text-cocoa">
        <StripedBackground />
        <div ref={illustration} className="text-burgundy"><FruitGlassIllustration className="h-28 w-auto md:h-36" /></div>
        <span ref={wordmark} aria-hidden="true" className="block origin-center font-(family-name:--font-cormorant) text-[clamp(7rem,23vw,20rem)] font-light leading-none tracking-[-0.055em] will-change-transform" style={{ transform: "scale(0.42)" }}>MINA</span>
      </div>
      <noscript><style>{"[data-mina-intro]{display:none!important}"}</style></noscript>
      <dialog ref={popup} id="mina-launch" aria-labelledby="launch-heading" onCancel={(event) => { event.preventDefault(); closePopup(); }} onClick={(event) => { if (event.target !== event.currentTarget) return; const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closePopup(); }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[700px] overflow-y-auto border-0 bg-transparent p-0 pt-12 text-cocoa outline-none backdrop:bg-black/50">
        <button type="button" onClick={closePopup} aria-label="Close launch announcement" className="absolute right-0 top-0 flex h-11 w-11 cursor-pointer items-center justify-center rounded-sm bg-ivory text-xl">×</button>
        <div className="overflow-hidden rounded-sm bg-ivory">
          <div className="relative h-[clamp(100px,24dvh,170px)] w-full"><Image src={chai.image} alt="Freshly prepared cups of Mina Kashmiri Chai" fill sizes="(max-width: 732px) calc(100vw - 32px), 700px" className="object-cover object-[center_55%]" /></div>
          <div className="px-6 py-6 md:px-8 md:py-7">
            <h2 id="launch-heading" className="font-(family-name:--font-cormorant) text-4xl font-light leading-[1.15] md:text-5xl">Kashmiri Chai is here.</h2>
            <p className="mt-4 font-[family-name:var(--font-source-sans)] text-base leading-[1.7] md:text-lg">{chai.description} Now on our menu.</p>
            <p className="mt-3 text-sm leading-[1.7] md:text-base">{chai.variants.map((variant) => `${variant.label} Rs.${variant.price}`).join(" · ")}</p>
            <Link href="/menu#kashmiri-chai" onNavigate={closePopup} className="mt-5 inline-flex min-h-12 items-center border border-burgundy bg-burgundy px-8 py-4 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-transparent hover:text-burgundy">View on menu</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
