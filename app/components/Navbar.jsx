"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { productCutouts } from "../assets/cutouts";
import { CartButton, AddToCartButton } from "./cart/CartControls";
import { products, categories } from "../assets/products";
const sections = [
  ["/menu", "Our menu"],
  ["/our-story", "Our story"],
  ["/find-us", "Find us"],
];

export default function Navbar() {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const navbar = useRef(null);
  const content = useRef(null);
  const opener = useRef(null);
  const closeTimer = useRef(null);
  const isOpen = useRef(false);
  const previousOverflow = useRef("");
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [category, setCategory] = useState("Milk bottles");

  useEffect(
    () => () => {
      clearTimeout(closeTimer.current);
      if (isOpen.current)
        document.body.style.overflow = previousOverflow.current;
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    function positionPanel() {
      const bottom = navbar.current.getBoundingClientRect().bottom;
      navbar.current.style.setProperty(
        "--menu-available-height",
        `${Math.max(120, window.innerHeight - bottom - 24)}px`,
      );
    }
    positionPanel();
    const observer = new ResizeObserver(positionPanel);
    observer.observe(navbar.current);
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel);
    };
  }, [open]);

  function show(event) {
    opener.current = event.currentTarget;
    setCategory("Milk bottles");
    setClosing(false);
    setOpen(true);
    if (!isOpen.current)
      previousOverflow.current = document.body.style.overflow;
    isOpen.current = true;
    clearTimeout(closeTimer.current);
    document.body.style.overflow = "hidden";

    closeButton.current.focus();
    content.current.scrollTop = 0;
  }

  function finishClose() {
    clearTimeout(closeTimer.current);
    isOpen.current = false;

    document.body.style.overflow = previousOverflow.current;
    setOpen(false);
    setClosing(false);
    opener.current?.focus();
  }

  // Used when navigating to another page: closes instantly and
  // does NOT return focus to the opener (that would steal focus from the new page).
  function closeForNavigation() {
    if (!isOpen.current) return;
    clearTimeout(closeTimer.current);
    isOpen.current = false;
    document.body.style.overflow = previousOverflow.current;
    setOpen(false);
    setClosing(false);
  }

  function requestClose() {
    if (closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    setClosing(true);
    closeTimer.current = setTimeout(finishClose, 280);
  }

  const visibleProducts = products.filter(
    (product) => product.category === category,
  );

  return (
    <>
      {open && (
        <div
          className={`fixed inset-0 z-[39] bg-[#21171270] motion-reduce:animate-none ${
            closing
              ? "animate-[mina-backdrop-in_0.26s_ease_both_reverse]"
              : "animate-[mina-backdrop-in_0.3s_ease_both]"
          }`}
          aria-hidden="true"
          onClick={requestClose}
        />
      )}
      <header
        ref={navbar}
        data-navbar
        className="sticky top-[14px] z-40 mt-[14px] mx-[14px] flex flex-wrap items-center min-h-[74px] bg-white border border-[#4a2e1c24] rounded text-[var(--mina-cocoa)] font-[family-name:var(--font-source-sans)] [font-synthesis:none] md:top-6 md:mt-6 md:mx-6 md:flex-nowrap md:min-h-[86px]"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.preventDefault();
            requestClose();
          }
        }}
        onBlur={(event) => {
          if (
            open &&
            event.relatedTarget &&
            !event.currentTarget.contains(event.relatedTarget)
          )
            requestClose();
        }}
      >
        <Link
          className="flex flex-col items-center justify-center self-stretch min-w-[125px] px-[14px] pt-[10px] pb-[12px] min-h-[73px] border-r border-[#4a2e1c24] text-[var(--mina-cocoa)] no-underline font-[family-name:var(--font-cormorant)] font-light text-3xl leading-[0.9] md:min-w-[170px] md:px-[22px] md:pb-[15px] md:text-5xl"
          href="/"
          aria-label="Mina Cafe home"
          onNavigate={closeForNavigation}
        >
          Mina
        </Link>
        <nav
          className="flex items-center gap-7 px-3 order-3 w-full justify-center border-t border-[#4a2e1c18] md:order-none md:w-auto md:justify-start md:gap-8 md:px-9 md:border-t-0"
          aria-label="Main navigation"
        >
          {sections.map(([href, name]) => (
            <Link
              key={href}
              href={href}
              onNavigate={closeForNavigation}
              className="cursor-pointer py-3 border-0 bg-transparent text-inherit uppercase text-base leading-[1.4] hover:text-[var(--mina-burgundy)] hover:underline hover:underline-offset-[7px]"
            >
              {name}
            </Link>
          ))}
        </nav>

        <CartButton beforeOpen={closeForNavigation} />
        <button
          ref={closeButton}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mina-menu"
          onClick={(event) => (open ? requestClose() : show(event))}
          className="group flex items-center justify-center gap-4 self-stretch px-3 min-h-[73px] border-0 bg-transparent text-inherit cursor-pointer md:gap-6 md:px-7"
        >
          <span className="hidden w-12 text-left text-base mx-4 md:block">
            {open ? "CLOSE" : "EXPLORE"}
          </span>
          <span className="w-[34px] grid gap-[9px]" aria-hidden="true">
            <i
              className={`h-px w-full block bg-current transition-transform duration-[250ms] motion-reduce:transition-none ${
                open && !closing
                  ? "translate-y-[5px] rotate-45"
                  : "group-hover:-translate-x-1"
              }`}
            />
            <i
              className={`h-px w-full block bg-current transition-transform duration-[250ms] motion-reduce:transition-none ${
                open && !closing
                  ? "-translate-y-[5px] -rotate-45"
                  : "group-hover:translate-x-1"
              }`}
            />
          </span>
        </button>
        <section
          id="mina-menu"
          ref={dialog}
          hidden={!open}
          aria-label="Explore Mina Cafe"
          className={`absolute inset-x-0 top-[calc(100%+8px)] w-full max-h-[var(--menu-available-height,calc(100dvh-134px))] border border-[#4a2e1c24] rounded-[5px] bg-white overflow-hidden shadow-[0_22px_40px_#24140f14] text-[var(--mina-cocoa)] font-[family-name:var(--font-source-sans)] [font-synthesis:none] ${
            open ? "flex flex-col" : "hidden"
          } ${
            closing
              ? "motion-reduce:animate-none animate-[mina-drawer-out_0.26s_ease-in_both]"
              : "motion-reduce:animate-none animate-[mina-drawer-in_0.45s_cubic-bezier(0.22,1,0.36,1)_both]"
          }`}
        >
          <div className="flex flex-col min-h-0 flex-1 md:grid md:grid-cols-[minmax(0,1fr)]">
            <div
              ref={content}
              className="pt-6 px-[18px] pb-[30px] overflow-y-auto overscroll-contain md:pt-[30px] md:px-[34px] md:pb-10"
            >
              <>
                <div className="flex flex-col gap-4 my-6">
                  <div>
                    <h2 className="font-(family-name:--font-cormorant) font-light text-4xl">
                      Find Your Little Favourite.
                    </h2>
                  </div>
                  <div
                    className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-5"
                    role="group"
                    aria-label="Filter products"
                  >
                    {categories.map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={category === value}
                        onClick={() => setCategory(value)}
                        className="cursor-pointer border-0 border-b border-transparent text-inherit bg-transparent text-base aria-pressed:border-b-[var(--mina-burgundy)] md:text-base"
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-x-6 md:gap-y-6">
                  {visibleProducts.map((product) => (
                    <div
                      className="group block text-left p-0 min-w-0 cursor-pointer text-inherit no-underline"
                      data-product-id={product.id}
                      key={product.id}
                    >
                      <Link
                        href={`/menu#${product.id}`}
                        onNavigate={closeForNavigation}
                        className="block aspect-square overflow-hidden bg-[var(--mina-ivory)] rounded-sm md:aspect-[1.3]"
                      >
                        <Image
                          src={productCutouts[product.id]}
                          alt={product.name}
                          width={220}
                          height={180}
                          sizes="(max-width: 600px) 22vw, (max-width: 900px) 12vw, 140px"
                          className="w-full h-full object-contain p-3 md:p-5 transition-transform duration-500 ease-in-out motion-reduce:transition-none group-hover:scale-[1.045]"
                        />
                      </Link>
                      <div className="flex items-center justify-between gap-2 pt-3 text-xs leading-[1.35] md:text-sm">
                        <Link
                          href={`/menu#${product.id}`}
                          onNavigate={closeForNavigation}
                          className="min-w-0"
                        >
                          {product.name}
                        </Link>
                        <AddToCartButton
                          productId={product.id}
                          productName={product.name}
                          beforeAdd={closeForNavigation}
                          className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-burgundy bg-burgundy text-xs text-white hover:bg-burgundy/95 md:mt-3 md:h-auto md:min-h-11 md:w-auto md:gap-2 md:px-3 md:py-2"
                          labelClassName="sr-only md:not-sr-only"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            </div>
          </div>
        </section>
      </header>
    </>
  );
}
