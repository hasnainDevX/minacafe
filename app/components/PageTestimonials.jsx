"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";



const reviews = [
  {
    quote:
      "The chocolate milk bottle is a must try. Rich, creamy, and delivered right on time every single order.",
    handle: "Bilal R.",
  },
  {
    quote:
      "Honestly the best fruit glass I've had in Karachi. Everything tastes so fresh, you can tell it's made with real care.",
    handle: "Ayesha K.",
  },
  {
    quote:
      "We ordered in bulk for a small office event and everyone loved it. Great taste, great prices, super friendly service.",
    handle: "Sana M.",
  },
  {
    quote:
      "The fruit was perfectly fresh and the cup was so loaded. For 200 rupees, the quality and quantity are amazing. Loved the chocolate milkshake too!",
    handle: "@customer_four",
  },
  {
    quote:
      "Chilled the fruit glass after it arrived and the taste was incredible. Great quantity, fresh fruit, and lovely toppings. Keep it up, Queen!",
    handle: "@customer_five",
  },
];

const N = reviews.length;
const GAP = 24;
const AUTOPLAY_MS = 3000;
const slides = [...reviews, ...reviews];
const BG_IMAGE = "/images/photography/fruit-glass-stall-at-night.webp";

export default function PageTestimonials() {
  const list = useRef(null);
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const measure = () => {
      const card = el.querySelector("li");
      if (card) setStep(card.offsetWidth + GAP);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const next = useCallback(() => {
    setAnimate(true);
    setPos((p) => p + 1);
  }, []);

  function prev() {
    if (pos === 0) {
      setAnimate(false);
      setPos(N);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimate(true);
          setPos(N - 1);
        }),
      );
    } else {
      setAnimate(true);
      setPos(pos - 1);
    }
  }

  function handleTransitionEnd(event) {
    if (event.target !== list.current) return;
    if (pos >= N) {
      setAnimate(false);
      setPos(pos % N);
    }
  }

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [pos, paused, reducedMotion, next]);

  return (
    <>
      <section
        data-motion-skip
        aria-labelledby="page-testimonials-heading"
        className="relative isolate px-6 py-20 text-white overflow-hidden md:px-12 md:py-24 lg:py-32"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10"><Image src={BG_IMAGE} alt="" fill sizes="100vw" className="object-cover object-center" /><div className="absolute inset-0 bg-black/60" /></div>
        <div className="mx-auto max-w-[1300px]">
          <div className="flex items-end justify-between gap-6">
            <h2
              id="page-testimonials-heading"
              className="font-(family-name:--font-cormorant) text-4xl font-light leading-[1.15] md:text-6xl"
            >
              Kind Words From
              <br /> Our Guests.
            </h2>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous reviews"
                className="flex h-12 w-12 cursor-pointer items-center justify-center border text-xl transition-colors hover:border-burgundy hover:bg-burgundy hover:text-ivory motion-reduce:transition-none border-white"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next reviews"
                className="flex h-12 w-12 cursor-pointer items-center justify-center border border-white bg-burgundy text-xl text-ivory transition-opacity hover:opacity-90 motion-reduce:transition-none"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div
            className="mt-10 overflow-hidden md:mt-14"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <ul
              ref={list}
              onTransitionEnd={handleTransitionEnd}
              className="flex gap-6 pb-4 text-burgundy"
              style={{
                transform: `translateX(${-pos * step}px)`,
                transition: animate
                  ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)"
                  : "none",
              }}
            >
              {slides.map((review, i) => (
                <li
                  key={`${review.handle}-${i}`}
                  aria-hidden={i >= N ? "true" : undefined}
                  className="relative flex min-h-[320px] md:min-h-[300px] w-[82%] shrink-0 flex-col items-center justify-center border border-[#4a2e1c33] bg-white px-8 py-14 text-center md:py-12 sm:w-[46%] lg:w-[31.5%]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-4 h-2 w-2 rounded-full bg-[var(--mina-burgundy)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[var(--mina-burgundy)]"
                  />
                  <span
                    aria-hidden="true"
                    className="font-(family-name:--font-cormorant) text-7xl leading-none text-[var(--mina-burgundy)]"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 font-[family-name:var(--font-source-sans)] text-base leading-[1.7] md:text-lg">
                    {review.quote}
                  </blockquote>
                  <p className="mt-5 font-[family-name:var(--font-source-sans)] text-xs uppercase tracking-[0.2em]">
                    {review.handle}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}