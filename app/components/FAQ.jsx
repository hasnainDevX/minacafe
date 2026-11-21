"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrandIllustration from "./BrandIllustration";
import { useStorefront } from "./StorefrontProvider";

export default function FAQ() {
  const { settings } = useStorefront();
  const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "");
  // These answers describe existing site features; business policies can be added once confirmed.
  const questions = [
    {
      question: "How do I place an order?",
      answer:
        "Explore the menu, choose your favourites, then message Mina on WhatsApp to confirm availability and arrange your order. Adding items to your cart does not confirm an order.",
      href: `https://wa.me/${whatsappNumber}`,
      link: "Message Mina",
    },
    {
      question: "Can I order for a group or an event?",
      answer:
        "Yes. Share who it is for, your preferred date, the number of people and the products you have in mind through our bulk-order form. We’ll discuss availability, quantities and pricing with you.",
      href: "/bulk-orders",
      link: "Plan a bulk order",
    },
    {
      question: "Which toppings can I choose for my fruit glass?",
      answer:
        "Choose your topping on the menu. The selected option shows its current price before you add it to your cart.",
      href: "/menu#fresh-fruit-glass",
      link: "Choose your topping",
    },
    {
      question: "What sizes does Kashmiri Chai come in?",
      answer:
        "Select your cup size on the menu to see its current price before adding it to your cart.",
      href: "/menu#kashmiri-chai",
      link: "Find your cup",
    },
    {
      question: "What if I have an allergy or dietary requirement?",
      answer:
        "Our milk bottles contain dry fruits, and Nut & Nectar is made with honey-coated dry fruits. Tell us about any allergies or dietary requirements before ordering so we can discuss the ingredients with you.",
      href: `https://wa.me/${whatsappNumber}`,
      link: "Ask about ingredients",
    },
    {
      question: "Where can I find Mina?",
      answer: settings.address,
      href: "/find-us",
      link: "Find us",
    },
  ];

  const [active, setActive] = useState(null);
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative bg-white px-6 py-20 text-cocoa md:px-12 md:py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-[1300px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2
            id="faq-heading"
            className="max-w-[440px] font-(family-name:--font-cormorant) text-4xl font-light leading-[1.15] md:text-5xl"
          >
            Frequently Asked Questions.
          </h2>
          <p className="mt-6 max-w-[320px] font-[family-name:var(--font-source-sans)] text-base leading-[1.7] md:text-lg">
            A few things you might be wondering. For everything else, we’re just
            a message away.
          </p>
          <BrandIllustration className="mt-8 h-auto w-40 md:w-48" />
          {/* <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-11 items-center gap-5 border-b border-burgundy text-xs uppercase tracking-[0.16em] text-burgundy">Ask us anything <span aria-hidden="true">↗</span></a> */}
        </div>
        <div className="border-t border-cocoa/25">
          {questions.map((item, index) => {
            const expanded = active === index;
            return (
              <div key={item.question} className="border-b border-cocoa/25">
                <h3>
                  <button
                    type="button"
                    id={`faq-question-${index}`}
                    aria-expanded={expanded}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setActive(expanded ? null : index)}
                    className={`group flex w-full cursor-pointer items-center gap-4 py-6 text-left transition-colors duration-300 md:gap-6 md:py-7 ${expanded ? "text-burgundy" : "text-cocoa"}`}
                  >
                    <span
                      aria-hidden="true"
                      className="self-start pt-2 text-[10px] tracking-widest text-cocoa/55"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-[family-name:var(--font-source-sans)] text-base leading-[1.7] md:text-lg">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative h-5 w-5 shrink-0 transition-transform duration-500 motion-reduce:transition-none ${expanded ? "rotate-45" : ""}`}
                    >
                      <span className="absolute left-0 top-1/2 h-px w-5 bg-current" />
                      <span className="absolute left-1/2 top-0 h-5 w-px bg-current" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  aria-hidden={!expanded}
                  inert={!expanded}
                  onTransitionEnd={(event) => {
                    if (event.target === event.currentTarget)
                      ScrollTrigger.refresh();
                  }}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="pb-7 pl-9 pr-8 md:pl-12">
                      <p className="max-w-[580px] font-[family-name:var(--font-source-sans)] text-base leading-[1.7] md:text-lg">
                        {item.answer}
                      </p>
                      <Link
                        href={item.href}
                        className="mt-4 inline-block border rounded-full p-3 border-cocoa/40 text-xs uppercase tracking-[0.12em] hover:"
                      >
                        {item.link} <span aria-hidden="true">↗</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
