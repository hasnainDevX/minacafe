"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useStorefront } from "./StorefrontProvider";

const defaultSlides = [
  {
    src: "/images/photography/strawberry-milk-yellow-baskets.webp",
    name: "Strawberry Milk",
    position: "center 58%",
  },
  {
    src: "/images/photography/fruit-glass-stall-at-night.webp",
    name: "Fresh Fruit Glass",
    position: "center 65%",
  },
  {
    src: "/images/photography/mango-milk-yellow-baskets.webp",
    name: "Mango Milk",
    position: "center 58%",
  },
];
const SLIDE_DURATION = 6500;
const WIPE = 1300; 

export default function Hero() {
  const { home } = useStorefront();
  const slides = home.heroSlides?.length ? home.heroSlides : defaultSlides;
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [loaded, setLoaded] = useState([]);
  const remaining = useRef(SLIDE_DURATION);
  const stopped = paused || reducedMotion || !pageVisible;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    remaining.current = SLIDE_DURATION;
  }, [active]);

  useEffect(() => {
    if (stopped || !loaded.includes(active)) return;
    const next = Array.from(
      { length: slides.length - 1 },
      (_, offset) => (active + offset + 1) % slides.length,
    ).find((index) => loaded.includes(index));
    if (next === undefined) return;
    const started = performance.now();
    const timer = setTimeout(() => {
      setPrevious(active);
      setActive(next);
    }, remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (performance.now() - started),
      );
    };
  }, [active, stopped, loaded, slides.length]);

  function selectSlide(index) {
    if (index === active) return;
    setPrevious(active);
    setActive(index);
  }

  const reveal = "block mina-reveal motion-reduce:animate-none";

  return (
    <section
      className="relative z-0 isolate h-[calc(100svh_+_var(--r))] overflow-hidden bg-cocoa text-ivory"
      aria-label="A taste of Mina"
      aria-roledescription="carousel"
      data-paused={stopped}
      style={{ "--r": "clamp(28px, 4.5vw, 62px)" }}
    >
      <style>{`
        @keyframes mina-wipe { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes mina-settle { from { transform: scale(1.2) translateY(6%); } to { transform: scale(1) translateY(0); } }
        @keyframes mina-exit { from { transform: scale(1) translateY(0); } to { transform: scale(1.05) translateY(-12%); } }
       @keyframes mina-zoom { from { transform: scale(1.25); } to { transform: scale(1); } }
        @keyframes mina-text-reveal { from { transform: translateY(110%); } to { transform: translateY(0); } }
        @keyframes mina-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        .mina-slide-active { animation: mina-wipe ${WIPE}ms cubic-bezier(0.77, 0, 0.175, 1) both; }
        .mina-slide-active .mina-motion { animation: mina-settle 2s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .mina-slide-leaving .mina-motion { animation: mina-exit ${WIPE}ms cubic-bezier(0.77, 0, 0.175, 1) both; }
        .mina-slide-active img,
        .mina-slide-leaving img { animation: mina-zoom ${SLIDE_DURATION + WIPE}ms linear both; }

        .mina-slide-initial,
        .mina-slide-initial .mina-motion { animation: none; }

        .mina-reveal { animation: mina-text-reveal 1.1s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .mina-fade-up { animation: mina-fade-up 1s ease 0.7s both; }

        [data-paused="true"] .mina-slide-active,
        [data-paused="true"] .mina-motion,
        [data-paused="true"] img { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          .mina-slide-active, .mina-slide-active .mina-motion, .mina-slide-leaving .mina-motion,
          .mina-slide-active img, .mina-slide-leaving img,
          .mina-reveal, .mina-fade-up { animation: none; }
        }
      `}</style>

      <Navbar />

      <div className="absolute inset-0 z-[-3]" aria-hidden="true">
        {slides.map((slide, index) => {
          const state =
            index === active
              ? "active"
              : index === previous
                ? "leaving"
                : "idle";
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 overflow-hidden ${
                state === "active"
                  ? `mina-slide-active z-20 ${previous === null ? "mina-slide-initial" : ""}`
                  : state === "leaving"
                    ? "mina-slide-leaving z-10"
                    : "invisible z-0"
              }`}
            >
              <div className="mina-motion absolute inset-0">
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  sizes="100vw"
                  preload={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  className="object-cover"
                  style={{ objectPosition: slide.position }}
                  onLoad={() =>
                    setLoaded((current) =>
                      current.includes(index) ? current : [...current, index],
                    )
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="absolute inset-0 z-[-1] pointer-events-none bg-[#180f0c]/60"
        aria-hidden="true"
      />

      <div className="absolute inset-x-5 top-[130px] bottom-[calc(80px_+_var(--r))] flex flex-col items-center justify-center gap-6 text-center text-white md:inset-x-12 md:top-[130px] md:bottom-[calc(110px_+_var(--r))] md:items-stretch md:justify-between md:gap-0 md:text-left">
        <h1 className="mt-0 font-(family-name:--font-cormorant) text-[2.5rem] uppercase leading-[0.98] md:mt-28 md:text-7xl md:leading-[0.95]">
          <span className="block overflow-hidden pb-[0.1em]">
            <span className={`${reveal} [animation-delay:180ms]`}>
              {home.heroHeading || "From my hands"}
            </span>
          </span>
          <span className="-mt-[0.06em] block overflow-hidden pb-[0.1em]">
            <span className={`${reveal} [animation-delay:360ms]`}>
              {home.heroHeading ? "" : "to your heart."}
            </span>
          </span>
        </h1>

        <div className="mina-fade-up flex max-w-[320px] flex-col items-center md:max-w-[360px] md:items-start md:self-end">
          <p className="font-[family-name:var(--font-source-sans)] text-sm leading-[1.5] md:text-base">
            {home.heroDescription || "Fresh, hygienic and delicious treats made by hand in Karachi, every cup and bottle, just for you."}
          </p>
          <div className="mt-5 flex w-full max-w-[260px] flex-col items-stretch gap-3 md:mt-5 md:w-auto md:max-w-none md:flex-row md:items-center md:gap-4">
            <a
              href="/menu"
              className="border border-white bg-white px-5 py-3 text-center text-xs uppercase tracking-[0.15em] text-cocoa transition-colors hover:bg-transparent hover:text-white motion-reduce:transition-none md:py-2.5 md:text-sm"
            >
              View Menu
            </a>
            <a
              href="/menu"
              className="border border-white px-5 py-3 text-center text-xs uppercase tracking-[0.15em] transition-colors hover:bg-white hover:text-cocoa motion-reduce:transition-none md:py-2.5 md:text-sm"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
      <div className="absolute left-6 right-6 bottom-[calc(1.5rem_+_var(--r))] grid grid-cols-[1fr_40px] gap-x-3 gap-y-[18px] items-end md:left-[38px] md:right-[38px] md:bottom-[calc(34px_+_var(--r))] md:grid-cols-[1fr_minmax(200px,1.1fr)_44px] md:gap-9">
        <div className="flex items-center gap-3 pb-px col-start-1 row-start-2 md:gap-[18px] md:col-auto md:row-auto">
          <div
            className="flex flex-1 gap-[6px]"
            role="group"
            aria-label="Choose a hero image"
          >
            {slides.map((slide, index) => {
              const isCurrent = index === active;
              return (
                <button
                  type="button"
                  key={slide.src}
                  aria-label={`Show ${slide.name}`}
                  aria-pressed={isCurrent}
                  onClick={() => selectSlide(index)}
                  className="flex-1 min-w-[32px] h-11 flex items-center p-0 bg-transparent border-0 cursor-pointer"
                ></button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
