import Image from "next/image";
import bgGrain from "../../public/images/textures/bggrain.png";

export default function LocationIntro() {
  return (
    <section
      aria-labelledby="location-heading"
      className="relative isolate z-10 bg-[var(--mina-ivory)] px-6 py-16 text-[var(--mina-cocoa)] md:px-12 md:py-24 lg:py-32"
    >
      {/* grain background */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <Image
          src={bgGrain}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Distort only the alpha outline; keep the photo pixels untouched. */}
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
              in="SourceAlpha"
              in2="noise"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
              result="roughAlpha"
            />
            <feComposite in="SourceGraphic" in2="roughAlpha" operator="in" />
          </filter>
        </defs>
      </svg>

      <div className="mx-auto grid max-w-[1300px] items-center gap-10 lg:grid-cols-2 lg:gap-0">
        {/* images */}
        <div className="grid w-full max-w-[520px] grid-cols-2 items-start gap-5 lg:pr-12">
          <div className="relative h-52 [filter:url(#mina-rough)] sm:h-72 lg:h-80">
            <Image
              src="/images/cafe/cafe-counter-stock.jpg"
              alt="Stock photo of a cafe counter with pendant lights"
              fill
              sizes="(max-width: 575px) 45vw, 250px"
              className="object-cover"
            />
          </div>
          <div className="relative mt-8 h-52 [filter:url(#mina-rough)] sm:h-72 lg:h-80">
            <Image
              src="/images/cafe/cafe-interior-stock.jpg"
              alt="Stock photo of a sunlit cafe interior with plants"
              fill
              sizes="(max-width: 575px) 45vw, 250px"
              className="object-cover"
            />
          </div>
        </div>

        {/* text */}
        <div className="w-full lg:border-l lg:border-cocoa/20 lg:py-4 lg:pl-16">
          <h2
            id="location-heading"
            className="font-(family-name:--font-cormorant) text-4xl font-light leading-[1.15] md:text-5xl"
          >
            Find us
          </h2>
          <p className="mt-8 max-w-[520px] font-[family-name:var(--font-source-sans)] text-base leading-[1.7] md:text-lg">
            From our little corner of North Nazimabad, every bottle, cup and
            bowl is prepared by hand, fresh, hygienic and made with love. Come
            say hello, or get in touch to ask about today&apos;s menu.
          </p>
          <a
            href="https://www.instagram.com/mina.cafe_/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center border border-[var(--mina-cocoa)] px-8 py-4 text-xs uppercase tracking-[0.2em] transition-colors hover:border-[var(--mina-burgundy)] hover:bg-[var(--mina-burgundy)] hover:text-[var(--mina-ivory)] motion-reduce:transition-none"
          >
            Visit us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}