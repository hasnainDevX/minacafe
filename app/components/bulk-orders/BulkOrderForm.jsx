"use client";

import { useRef, useState } from "react";
import { useStorefront } from "../StorefrontProvider";

const input = "mt-2 block min-h-12 w-full rounded-none border-0 border-b border-cocoa/25 bg-transparent px-0 py-3 text-base text-cocoa outline-none focus:border-burgundy";
const label = "block text-base leading-[1.7] text-cocoa";
const localToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export default function BulkOrderForm() {
  const { products, settings } = useStorefront();
  const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "");
  const form = useRef(null);
  const review = useRef(null);
  const [enquiry, setEnquiry] = useState("");
  const [error, setError] = useState("");

  function prepare(event) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const selected = data.getAll("products");
    if (!String(data.get("name")).trim()) {
      setError("Please enter your name.");
      form.current.elements.namedItem("name").focus();
      return;
    }
    if (!selected.length) {
      setError("Choose a product or select ‘Help me choose’.");
      form.current.querySelector('input[name="products"]').focus();
      return;
    }
    if (data.get("date") < localToday()) {
      setError("Please choose today or a future date.");
      form.current.elements.namedItem("date").focus();
      return;
    }
    setEnquiry([
      "Hello Mina! I’d like to enquire about a bulk order.", "",
      `Name: ${String(data.get("name")).trim()}`,
      `Phone: ${String(data.get("phone")).trim()}`,
      `Who it’s for: ${data.get("recipient")}`,
      `Occasion: ${data.get("occasion")}`,
      `Preferred date: ${data.get("date")}`,
      `Number of people: ${data.get("people")}`,
      `Products: ${selected.join(", ")}`,
      `Collection / delivery: ${data.get("fulfilment")}`,
      data.get("area") ? `Area / venue: ${data.get("area")}` : "",
      data.get("notes") ? `Notes: ${data.get("notes")}` : "",
      "Please confirm availability and pricing.",
    ].filter((line, index) => line || index === 1).join("\n"));
    requestAnimationFrame(() => review.current?.focus());
  }

  return (
    <div className="font-[family-name:var(--font-source-sans)]">
      <form ref={form} onSubmit={prepare} hidden={Boolean(enquiry)}>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 md:gap-y-10">
          <label className={label}>Full name *<input name="name" autoComplete="name" required maxLength={80} className={input} /></label>
          <label className={label}>Phone number *<input name="phone" type="tel" autoComplete="tel" required minLength={8} maxLength={25} className={input} /></label>
          <label className={label}>Who is it for? *<select name="recipient" required defaultValue="" className={input}><option value="" disabled>Select a group</option><option>Family & friends</option><option>Office / team</option><option>Event guests</option><option>Gifting</option><option>Other</option></select></label>
          <label className={label}>Occasion *<select name="occasion" required defaultValue="" className={input}><option value="" disabled>Select an occasion</option><option>Office gathering</option><option>Birthday / celebration</option><option>Wedding / family event</option><option>Gifts / care packages</option><option>Other gathering</option></select></label>
          <label className={label}>Preferred date *<input name="date" type="date" required onFocus={(event) => { event.currentTarget.min = localToday(); }} className={input} /></label>
          <label className={label}>Number of people *<input name="people" type="number" inputMode="numeric" min="1" max="100000" step="1" required className={input} /></label>
        </div>
        <fieldset className="mt-8 md:mt-10">
          <legend className="mb-4 text-base">Products you’re interested in *</legend>
          <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {[...products.map((product) => product.name), "Help me choose"].map((name) => (
              <label key={name} className="flex min-h-11 cursor-pointer items-center gap-3 text-base">
                <input type="checkbox" name="products" value={name} className="h-4 w-4 shrink-0 accent-burgundy" />{name}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 md:mt-10 md:gap-y-10">
          <label className={label}>Collection or delivery?<select name="fulfilment" defaultValue="Not sure yet" className={input}><option>Not sure yet</option><option>Pickup enquiry</option><option>Delivery enquiry</option></select></label>
          <label className={label}>Area / venue<input name="area" maxLength={160} className={input} /></label>
          <label className={`${label} sm:col-span-2`}>Anything else?<textarea name="notes" rows={3} maxLength={1200} placeholder="Quantities, timing or dietary requirements" className="mt-3 block w-full resize-y rounded-none border border-cocoa/25 bg-white p-3 text-base outline-none placeholder:text-cocoa/45 focus:border-burgundy" /></label>
        </div>
        {error && <p role="alert" className="mt-5 text-base text-burgundy">{error}</p>}
        <button type="submit" className="mt-8 min-h-14 w-full cursor-pointer border border-burgundy bg-burgundy px-8 py-4 text-sm uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-burgundy">Review enquiry</button>
      </form>
      {enquiry && (
        <div ref={review} tabIndex={-1} className="outline-none">
          <h2 className="font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl">Review your enquiry</h2>
          <pre className="my-6 whitespace-pre-wrap break-words border-y border-cocoa/20 py-6 font-sans text-base leading-[1.7]">{enquiry}</pre>
          <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiry)}`} target="_blank" rel="noopener noreferrer" className="flex min-h-14 w-full items-center justify-center border border-burgundy bg-burgundy px-6 py-4 text-sm uppercase tracking-[0.15em] text-white">Continue on WhatsApp</a>
          <button type="button" onClick={() => { setEnquiry(""); setError(""); requestAnimationFrame(() => form.current?.elements.namedItem("name").focus()); }} className="mt-4 min-h-11 cursor-pointer text-base underline underline-offset-4">Edit details</button>
        </div>
      )}
    </div>
  );
}
