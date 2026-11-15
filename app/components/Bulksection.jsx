import Image from "next/image";
import bgGrain from "../../public/images/textures/bggrain.png";
import sectionbg from "../../public/images/textures/site-background.png";

export default function BulkSection() {
  return (
    <section
      aria-labelledby="bulk-heading"
      className="relative isolate z-10 bg-ivory px-6 py-18 text-burgundy md:px-12 md:py-24 lg:py-32"
    >
      {/* background photo + burgundy overlay */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/textures/site-background.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ivory/40" />
      </div>
      <div className="relative mx-auto max-w-[900px] border border-burgundy px-8 py-12 text-center md:px-16 md:py-16">
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
          Planning an office event, a party or a gift for many? We prepare
          bottles, fruit glasses and bowls by hand in larger quantities. Message
          us with your date and numbers and we&apos;ll sort out the rest.
        </p>
        <a
          href="https://www.instagram.com/mina.cafe_/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center border border-burgundy bg-[var(--mina-burgundy)] px-8 py-4 text-xs uppercase tracking-[0.2em] text-[var(--mina-ivory)] transition-colors hover:bg-transparent hover:text-[var(--mina-burgundy)] motion-reduce:transition-none"
        >
          Place a bulk order
        </a>
      </div>
      {/* cloud edge: same background as the section, hanging into the footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full z-10 h-[var(--r)] bg-[var(--mina-ivory)]"
        style={{
          "--r": "clamp(28px, 4.5vw, 62px)",
          WebkitMask:
            "radial-gradient(circle at 50% 0, #000 calc(var(--r) - 0.5px), transparent var(--r)) 0 0 / calc(var(--r) * 2) 100% repeat-x",
          mask: "radial-gradient(circle at 50% 0, #000 calc(var(--r) - 0.5px), transparent var(--r)) 0 0 / calc(var(--r) * 2) 100% repeat-x",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{
            backgroundImage: "url('/images/textures/site-background.png')",
          }}
        />
        <div className="absolute inset-0 bg-ivory/40" />
      </div>
    </section>
  );
}
