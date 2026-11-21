"use client";
import BrandLogo from "./BrandLogo";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { CartButton } from "./cart/CartControls";

const sections = [
  ["/menu", "Our menu"],
  ["/our-story", "Our story"],
  ["/find-us", "Find us"],
];
const extraLinks = [
  ["/bulk-orders", "Bulk orders"],
  ["/#contact-heading", "Contact"],
];

function MenuToggle({ open, closing, compact = false, onClick }) {
  return (
    <button type="button" data-menu-trigger aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mina-menu" onClick={onClick} className={`group flex cursor-pointer items-center justify-center bg-white text-cocoa ${compact ? "h-12 w-14" : "min-h-[73px] self-stretch gap-4 px-3 md:gap-6 md:px-7"}`}>
      {!compact && <span className="mx-4 hidden w-12 text-left text-base md:block">{open ? "CLOSE" : "EXPLORE"}</span>}
      <span className={`${compact ? "w-6" : "w-[34px]"} grid gap-[9px]`} aria-hidden="true">
        <i className={`block h-px w-full bg-current transition-transform duration-250 motion-reduce:transition-none ${open && !closing ? "translate-y-[5px] rotate-45" : ""}`} />
        <i className={`block h-px w-full bg-current transition-transform duration-250 motion-reduce:transition-none ${open && !closing ? "-translate-y-[5px] -rotate-45" : ""}`} />
      </span>
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const navbar = useRef(null);
  const floating = useRef(null);
  const opener = useRef(null);
  const closeTimer = useRef(null);
  const unlock = useRef(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [panelTop, setPanelTop] = useState(0);

  useEffect(() => {
    const element = navbar.current;
    let animation;
    let entered = false;
    function enter() {
      if (entered || document.querySelector('[data-mina-intro][data-state="loading"]')) return;
      entered = true;
      element.style.opacity = "";
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animation = element.animate([{ opacity: 0, transform: "translateY(-24px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 700, easing: "cubic-bezier(0.22,1,0.36,1)" });
      }
    }
    document.addEventListener("mina:content-visible", enter);
    enter();
    return () => { document.removeEventListener("mina:content-visible", enter); animation?.cancel(); element.style.opacity = ""; };
  }, [pathname]);

  useEffect(() => {
    function update() {
      if (open) return;
      const secondSection = pathname === "/" ? document.querySelector("[data-section-cover]") : null;
      const boundary = secondSection || navbar.current;
      const rect = boundary.getBoundingClientRect();
      setScrolled(secondSection ? rect.top <= 24 : rect.bottom <= 0);
    }
    // Read the rendered position so the floating controls follow ScrollSmoother too.
    let frame;
    function tick() { update(); frame = requestAnimationFrame(tick); }
    frame = requestAnimationFrame(tick);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [open, pathname]);

  useEffect(() => () => {
    clearTimeout(closeTimer.current);
    unlock.current?.();
  }, []);

  function finishClose(restoreFocus = true) {
    clearTimeout(closeTimer.current);
    unlock.current?.();
    unlock.current = null;
    setOpen(false);
    setClosing(false);
    if (restoreFocus) opener.current?.focus({ preventScroll: true });
  }

  function requestClose() {
    if (closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    setClosing(true);
    closeTimer.current = setTimeout(() => finishClose(), 260);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        clearTimeout(closeTimer.current);
        unlock.current?.();
        unlock.current = null;
        setOpen(false);
        setClosing(false);
        opener.current?.focus({ preventScroll: true });
      }
    }
    function positionPanel() {
      setPanelTop((scrolled ? floating.current : navbar.current).getBoundingClientRect().bottom);
    }
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", positionPanel);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", positionPanel);
    };
  }, [open, scrolled]);

  function toggle(event) {
    if (open) { requestClose(); return; }
    opener.current = event.currentTarget;
    setPanelTop((scrolled ? floating.current : navbar.current).getBoundingClientRect().bottom);
    clearTimeout(closeTimer.current);
    setClosing(false);
    const overflow = document.body.style.overflow;
    const smoother = window.smoother;
    const wasPaused = smoother?.paused();
    smoother?.paused(true);
    document.body.style.overflow = "hidden";
    unlock.current = () => {
      document.body.style.overflow = overflow;
      if (smoother && !wasPaused) smoother.paused(false);
    };
    setOpen(true);
  }

  const closeForNavigation = () => finishClose(false);

  return (
    <>
      <header ref={navbar} data-navbar className="relative z-40 m-0 flex min-h-[74px] w-full flex-wrap items-center border-b border-[#4a2e1c24] bg-white text-cocoa [font-synthesis:none] md:min-h-[86px] md:flex-nowrap">
        <Link href="/" aria-label="Mina Cafe home" onNavigate={closeForNavigation} className="flex min-h-[73px] min-w-[125px] flex-col items-center justify-center self-stretch border-r border-[#4a2e1c24] px-[14px] pb-[12px] pt-[10px] font-(family-name:--font-cormorant) text-3xl font-light leading-[0.9] md:min-w-[170px] md:px-[22px] md:pb-[15px] md:text-5xl"><BrandLogo className="h-12 w-25 md:h-14 md:w-30" /></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 px-9 md:flex">
          {sections.map(([href, label]) => <Link key={href} href={href} onNavigate={closeForNavigation} className="py-3 text-base uppercase hover:text-burgundy hover:underline hover:underline-offset-8">{label}</Link>)}
        </nav>
        <CartButton beforeOpen={closeForNavigation} />
        <MenuToggle open={open} closing={closing} onClick={toggle} />
      </header>
      {(scrolled || open) && createPortal(
        <>
          {open && <div aria-hidden="true" onClick={requestClose} style={{ top: scrolled ? 0 : Math.max(0, panelTop) }} className={`fixed inset-x-0 bottom-0 z-[90] bg-[#21171270] motion-reduce:animate-none ${closing ? "animate-[mina-backdrop-in_0.26s_ease_both_reverse]" : "animate-[mina-backdrop-in_0.3s_ease_both]"}`} />}
          {scrolled && (
            <div ref={floating} data-floating-nav className="fixed right-4 top-4 z-[100] flex items-center border border-cocoa/20 bg-white text-cocoa shadow-sm md:right-6 md:top-6">
              <CartButton beforeOpen={closeForNavigation} className="relative flex h-12 w-14 cursor-pointer items-center justify-center border-r border-cocoa/20 text-cocoa hover:text-burgundy" />
              <MenuToggle compact open={open} closing={closing} onClick={toggle} />
            </div>
          )}
          {open && (
            <nav id="mina-menu" aria-label="Explore Mina Cafe" style={{ top: panelTop, maxHeight: `calc(100dvh - ${Math.max(0, panelTop)}px - 16px)` }} className={`fixed z-[100] w-[min(100vw,480px)] overflow-y-auto overscroll-contain rounded-b-md border border-cocoa/20 bg-white px-6 py-5 text-right text-cocoa shadow-lg md:px-10 md:py-8 ${scrolled ? "right-4 max-w-[calc(100vw-32px)] md:right-6" : "right-0"} ${closing ? "motion-reduce:animate-none animate-[mina-drawer-out_0.26s_ease-in_both]" : "motion-reduce:animate-none animate-[mina-drawer-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both]"}`}>
              {sections.map(([href, label]) => <Link key={href} href={href} onNavigate={closeForNavigation} className={`${scrolled ? "block" : "block md:hidden"} border-b border-cocoa/20 py-4 text-xl uppercase hover:text-burgundy md:text-2xl`}>{label}</Link>)}
              {extraLinks.map(([href, label]) => <Link key={href} href={href} onNavigate={closeForNavigation} className="block border-b border-cocoa/20 py-4 text-xl uppercase last:border-b-0 hover:text-burgundy md:text-2xl">{label}</Link>)}
            </nav>
          )}
        </>, document.body,
      )}
    </>
  );
}
