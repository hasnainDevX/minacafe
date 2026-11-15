"use client";
import Image from "next/image";
import { useRef } from "react";
import bgGrain from "../../public/images/textures/bggrain.png";

const reviews = [
  { quote: "The chocolate milk bottle is a must try. Rich, creamy, and delivered right on time every single order.", handle: "Bilal R." },
  { quote: "Honestly the best fruit glass I've had in Karachi. Everything tastes so fresh, you can tell it's made with real care.", handle: "Ayesha K." },
  { quote: "We ordered in bulk for a small office event and everyone loved it. Great taste, great prices, super friendly service.", handle: "Sana M." },
  { quote: "The fruit was perfectly fresh and the cup was so loaded. For 200 rupees, the quality and quantity are amazing. Loved the chocolate milkshake too!", handle: "@customer_four" },
  { quote: "Chilled the fruit glass after it arrived and the taste was incredible. Great quantity, fresh fruit, and lovely toppings. Keep it up, Queen!", handle: "@customer_five" },
];

export default function Testimonials() {
  const track = useRef(null);

  function scrollByCard(direction) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : 320;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative isolate px-6 py-16 text-white md:px-12 md:py-24"
    >
      {/* background: stock photo + ivory wash + grain */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <Image
          src="/images/cafe/cafe-interior-stock.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
     
      </div>

      <div className="mx-auto max-w-[1300px]">
        <div className="flex items-end justify-between gap-6">
          <h2
            id="testimonials-heading"
            className="font-(family-name:--font-cormorant) text-4xl font-light leading-[1.15] md:text-6xl"
          >
            Kind Words From
            <br /> Our Guests.
          </h2>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous reviews"
              className="flex h-12 w-12 cursor-pointer items-center justify-center border border-[var(--mina-cocoa)] text-xl transition-colors hover:border-[var(--mina-burgundy)] hover:bg-[var(--mina-burgundy)] hover:text-[var(--mina-ivory)] motion-reduce:transition-none"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next reviews"
              className="flex h-12 w-12 cursor-pointer items-center justify-center border border-[var(--mina-burgundy)] bg-[var(--mina-burgundy)] text-xl text-[var(--mina-ivory)] transition-opacity hover:opacity-90 motion-reduce:transition-none"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <ul
          ref={track}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] md:mt-14 [&::-webkit-scrollbar]:hidden text-burgundy"
        >
          {reviews.map((review) => (
            <li
              key={review.handle}
              className="relative flex min-h-[300px] w-[82%] shrink-0 snap-start flex-col items-center justify-center border border-[#4a2e1c33] bg-white px-8 py-12 text-center sm:w-[46%] lg:w-[31.5%]"
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
              <blockquote className="mt-2 font-(family-name:--font-cormorant) text-xl font-light leading-[1.3] md:text-2xl">
                {review.quote}
              </blockquote>
              <p className="mt-5 font-[family-name:var(--font-source-sans)] text-xs uppercase tracking-[0.2em]">
                {review.handle}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}