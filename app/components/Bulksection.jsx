import Image from "next/image";
import bgGrain from "../../public/images/textures/bggrain.png";

export default function BulkSection() {
  return (
    <section
      aria-labelledby="bulk-heading"
      className="relative isolate bg-[var(--mina-ivory)] px-6 py-16 text-[var(--mina-cocoa)] md:px-12 md:py-24 lg:py-32"
    >
      {/* grain background */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src={bgGrain}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="relative bg-butter mx-auto max-w-[900px] border border-[var(--mina-burgundy)] px-8 py-12 text-center md:px-16 md:py-16">
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 h-2 w-2 rounded-full bg-[var(--mina-burgundy)]"
        />
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[var(--mina-burgundy)]"
        />

        <h2
          id="bulk-heading"
          className="font-(family-name:--font-cormorant) text-4xl font-light leading-[1.15] md:text-5xl"
        >
          Looking for Bulk Orders?
        </h2>
        <p className="mx-auto mt-6 max-w-[520px] font-[family-name:var(--font-source-sans)] text-base leading-[1.7] md:text-lg">
          We are now delivering to Schools, Offices, Universities, Corporate
          Events, and Institutions across Karachi perfect for meetings,
          celebrations, and any gathering that could use something sweet.
        </p>
        <a
          href="https://www.instagram.com/mina.cafe_/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center border border-[var(--mina-burgundy)] bg-[var(--mina-burgundy)] px-8 py-4 text-xs uppercase tracking-[0.2em] text-[var(--mina-ivory)] transition-colors hover:bg-transparent hover:text-[var(--mina-burgundy)] motion-reduce:transition-none"
        >
          Place a bulk order
        </a>
      </div>
    </section>
  );
}
