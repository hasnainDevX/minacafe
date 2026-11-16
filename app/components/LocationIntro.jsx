import Image from "next/image";
import bgGrain from "../../public/images/textures/bggrain.png";

export default function LocationIntro() {
  return (
    <section
      aria-labelledby="location-heading"
      className="relative isolate bg-ivory  px-6 py-20 text-[var(--mina-cocoa)] md:px-12 md:py-24 lg:py-32"
    >
      
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <Image
          src={bgGrain}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-butter/20"></div>
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

      <div className="mx-auto grid max-w-[1300px] items-center gap-12 md:gap-10 lg:grid-cols-2 lg:gap-0">
        {/* images */}
        <div className="grid w-full max-w-[520px] grid-cols-2 items-start gap-5 lg:pr-12">
          <div className="relative h-52 [filter:url(#mina-rough)] sm:h-72 lg:h-80">
            <Image
              src="/images/photography/fruit-glass-north-nazimabad.webp"
              alt="Mina fruit glass at the North Nazimabad stall"
              fill
              sizes="(max-width: 575px) 45vw, 250px"
              className="object-cover"
            />
          </div>
          <div className="relative mt-8 h-52 [filter:url(#mina-rough)] sm:h-72 lg:h-80">
            <Image
              src="/images/photography/creamy-milk-north-nazimabad.webp"
              alt="Mina creamy milk bottle in North Nazimabad"
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
            className="mt-8 inline-flex items-center justify-center border bg-white border-[var(--mina-cocoa)] px-8 py-4 text-xs uppercase tracking-[0.2em] transition-colors hover:border-[var(--mina-burgundy)] hover:bg-[var(--mina-burgundy)] hover:text-[var(--mina-ivory)] motion-reduce:transition-none"
          >
            Visit us on Instagram
          </a>
          <div className="mt-6 max-w-[520px]">
            <iframe
              title="Mina Cafe (Portable Stall), North Nazimabad, Karachi"
              src="https://www.google.com/maps?q=Mina+Cafe+Portable+Stall&ll=24.9285468,67.0415666&z=17&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-[180px] w-full border border-cocoa/20 sm:h-[200px]"
            />
            <a href="https://maps.app.goo.gl/wjPkvrJnkTH7UC7KA" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-10 items-center text-sm underline underline-offset-4">Get directions ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}