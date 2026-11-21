"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function InstagramFeed() {
  const feed = useRef(null);

  useEffect(() => {
    let timer;
    let height = -1;
    const observer = new ResizeObserver(([entry]) => {
      const nextHeight = Math.round(entry.contentRect.height);
      if (nextHeight === height) return;
      height = nextHeight;
      clearTimeout(timer);
      // The embed loads its own content; update scroll measurements after it settles.
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    observer.observe(feed.current);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  return (
    <section aria-labelledby="instagram-heading" className="bg-white px-6 py-20 text-cocoa md:px-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 md:mb-10">
          {/* <h2 id="instagram-heading" className="font-(family-name:--font-cormorant) text-4xl font-light leading-[1.15] md:text-5xl">365 days of Mina.</h2> */}
          {/* <a href="https://www.instagram.com/mina.cafe_/" target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">@mina.cafe_ ↗</a> */}
        </div>
        <div ref={feed} data-motion-skip>
          <div className="elfsight-app-b150fcf2-463e-4385-b96e-5e132347b9a5" data-elfsight-app-lazy />
        </div>
      </div>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
    </section>
  );
}
