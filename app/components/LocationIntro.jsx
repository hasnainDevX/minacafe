import Image from "next/image";
import { productImages } from "../assets";

export default function LocationIntro() {
  return (
    <section
      aria-labelledby="location-heading"
      className="relative z-10 bg-[var(--mina-ivory)] px-6 py-20 text-[var(--mina-cocoa)] md:px-12 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[calc(var(--r)*-1+1px)] h-[var(--r)] bg-[var(--mina-ivory)]"
        style={{
          "--r": "clamp(28px, 4.5vw, 62px)",
          WebkitMask:
            "radial-gradient(circle at 50% 100%, #000 calc(var(--r) - 0.5px), transparent var(--r)) 0 0 / calc(var(--r) * 2) 100% repeat-x",
          mask: "radial-gradient(circle at 50% 100%, #000 calc(var(--r) - 0.5px), transparent var(--r)) 0 0 / calc(var(--r) * 2) 100% repeat-x",
        }}
      />
      {/* rough, torn-paper edge filter, defined once */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="mina-rough" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto flex max-w-[1300px] flex-col items-center gap-14 md:flex-row md:items-start md:gap-12 lg:gap-16">
        {/* images */}
        <div className="flex w-full flex-1 gap-5 md:gap-8">
          <div className="relative aspect-[3/4] w-1/2 [filter:url(#mina-rough)]">
            <Image
              src={productImages["strawberry-milk-bottle"]}
              alt="Strawberry milk bottle from Mina"
              fill
              sizes="(max-width: 768px) 45vw, 22vw"
              className="object-cover"
            />
          </div>
          <div className="relative mt-16 aspect-[3/4] w-1/2 [filter:url(#mina-rough)] md:mt-24">
            <Image
              src={productImages["nut-and-nectar-cup"]}
              alt="Nut and Nectar cup from Mina"
              fill
              sizes="(max-width: 768px) 45vw, 22vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* text */}
        <div className="w-full max-w-[420px] md:mt-24 md:shrink-0">
          <h2
            id="location-heading"
            className="font-(family-name:--font-cormorant) text-4xl font-light uppercase tracking-[0.12em] md:text-5xl"
          >
            Find us
          </h2>
          <p className="mt-8 font-[family-name:var(--font-source-sans)] text-base leading-[1.75]">
            From our little corner of North Nazimabad, every bottle, cup and
            bowl is prepared by hand, fresh, hygienic and made with love. Come
            say hello, or get in touch to ask about today&apos;s menu.
          </p>
          <a
            href="https://www.instagram.com/mina.cafe_/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center border border-[var(--mina-cocoa)] px-8 py-4 text-xs uppercase tracking-[0.2em] transition-colors hover:bg-[var(--mina-cocoa)] hover:text-[var(--mina-ivory)] motion-reduce:transition-none"
          >
            Visit us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
