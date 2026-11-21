"use client";
import { useState } from "react";
import BrandIllustration from "./BrandIllustration";
import { useStorefront } from "./StorefrontProvider";


export default function Footer() {
  const { settings, refresh } = useStorefront();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const { settings: latest } = await refresh(true);
      const data = new FormData(form);
      const message = ["Hello Mina!", "Name: " + data.get("name"), "Phone: " + data.get("phone"), "", data.get("message")].join("\n");
      window.location.assign("https://wa.me/" + latest.whatsappNumber.replace(/\D/g, "") + "?text=" + encodeURIComponent(message));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full border-0 border-b border-[var(--mina-ivory)]/40 bg-transparent py-2 font-[family-name:var(--font-source-sans)] text-sm text-[var(--mina-ivory)] placeholder:text-[var(--mina-ivory)]/60 focus:border-[var(--mina-butter,#F4EDBE)] focus:outline-none";

  return (
    <footer
      data-footer-reveal
      aria-labelledby="contact-heading"
      className="relative z-0 -mt-px [--footer-h:max(100svh,640px)] md:h-[var(--footer-h)] md:overflow-hidden"
      style={{ "--r": "clamp(28px, 4.5vw, 62px)" }}
    >
      <div
        data-footer-content
        className="flex flex-col justify-between bg-[var(--mina-burgundy)] px-6 pb-8 pt-16 text-[var(--mina-ivory)] md:h-full md:px-16 md:pb-10 md:pt-[calc(var(--r)+4rem)]"
      >
        <div className="mx-auto grid w-full max-w-[1300px] gap-10 md:grid-cols-2 md:gap-24">
          <div>
            <h2
              id="contact-heading"
              className="font-(family-name:--font-cormorant) text-3xl font-light leading-[1.15] text-white md:text-4xl"
            >
              Say hello,
              <br />
              we&apos;d love to hear from you.
            </h2>
            <p className="mt-3 max-w-[340px] font-[family-name:var(--font-source-sans)] text-sm leading-[1.6] text-[var(--mina-ivory)]/80">
              Questions, orders or bulk requests. Send us a note and we&apos;ll
              reply as soon as we can.
            </p>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-xs uppercase tracking-[0.15em] underline underline-offset-[6px] hover:text-[var(--mina-butter,#F4EDBE)]"
            >
              Message @mina.cafe_ on Instagram
            </a>
            <BrandIllustration className="pointer-events-none mt-6 h-auto w-28 select-none opacity-20 md:w-36" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="contact-name">
              Your name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              autoComplete="name"
              className={field}
            />

            <label className="sr-only" htmlFor="contact-phone">
              Phone number
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              required
              placeholder="Phone number"
              autoComplete="tel"
              className={field}
            />

            <label className="sr-only" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={2}
              placeholder="How can we help?"
              className={`${field} resize-none`}
            />

            <div className="mt-1 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="cursor-pointer border border-butter bg-white px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-burgundy transition-colors hover:bg-butter disabled:opacity-60 motion-reduce:transition-none"
              >
                {status === "sending" ? "Sending..." : "Continue on WhatsApp"}
              </button>
              <p role="status" aria-live="polite" className="text-sm">
                {status === "sent" && "Send the draft in WhatsApp to contact Mina."}
                {status === "error" &&
                  "Something went wrong. Please try again."}
              </p>
            </div>
          </form>
        </div>

        <div>
          <p
            aria-hidden="true"
            className="mt-6 text-center font-(family-name:--font-cormorant) text-[22vw] font-light uppercase leading-[0.8] text-white md:mt-4 md:text-[14vw]"
          >
            MINA CAFE
          </p>
          <p className="mt-4 text-center text-base text-butter underline underline-offset-8">
            Website designed by Hasnain Webstudio
          </p>
        </div>
      </div>
    </footer>
  );
}