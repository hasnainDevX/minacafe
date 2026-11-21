"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../components/cart/CartProvider";
import { OrderingNotice, useStorefront } from "../components/StorefrontProvider";
import { businessStatus, resolveCart, orderMessage } from "../lib/business";
const money = n => "Rs. " + n.toLocaleString("en-PK");
const input = "mt-2 min-h-12 w-full border-0 border-b border-cocoa/30 bg-transparent py-3 outline-offset-4 focus:outline-burgundy";
export default function CheckoutForm() {
 const { items, lines, removeItem } = useCart();
 const { settings, refresh, canOrder, loading } = useStorefront();
 const [message, setMessage] = useState("");
 const [busy, setBusy] = useState(false);
 const [method, setMethod] = useState("easypaisa");
 const [copied, setCopied] = useState(false);
 const number = method === "bank" ? settings.bankAccountNumber : method === "easypaisa" ? settings.easypaisaNumber : settings.jazzcashNumber;
 const holder = method === "bank" ? settings.bankAccountName : method === "easypaisa" ? settings.easypaisaAccountName : settings.jazzcashAccountName;
 const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
 const valid = lines.length > 0 && lines.every(line => line.available);
 async function submit(event) {
  event.preventDefault();
  if (busy || !event.currentTarget.reportValidity()) return;
  const customer = Object.fromEntries(new FormData(event.currentTarget));
  if (![customer.name, customer.address, customer.landmark].every(value => value?.trim())) { setMessage("Please complete your name, address and landmark."); return; }
  if (!/^\+?[\d\s()-]{10,18}$/.test(customer.phone.trim())) { setMessage("Please enter a valid WhatsApp number."); return; }
  setBusy(true); setMessage("");
  try {
   const current = await refresh(true);
   const status = businessStatus(current.settings);
   if (!current.orderingReady || current.settings.ordersPaused) throw new Error(status.isOpen ? "Ordering is not available yet." : status.message);
   const checked = resolveCart(items, current.products);
   if (!checked.length || checked.some(line => !line.available)) throw new Error("Some items are no longer available. Please remove them before continuing.");
   if (checked.some((line, i) => line.price !== lines[i]?.price || line.product.name !== lines[i]?.product?.name || line.variantInfo?.label !== lines[i]?.variantInfo?.label)) throw new Error("The menu has changed. Review the updated order and press Send Order again.");
   if (["easypaisaNumber", "easypaisaAccountName", "jazzcashNumber", "jazzcashAccountName", "bankEnabled", "bankName", "bankAccountName", "bankAccountNumber"].some(key => current.settings[key] !== settings[key])) throw new Error("Payment details have changed. Review them before continuing.");
   const account = method === "bank" ? (current.settings.bankEnabled ? current.settings.bankAccountNumber : "") : method === "easypaisa" ? current.settings.easypaisaNumber : current.settings.jazzcashNumber;
   if (!account) throw new Error("This payment method is coming soon. Please choose Easypaisa.");
   const phone = current.settings.whatsappNumber.replace(/\D/g, "");
   if (!/^92\d{10}$/.test(phone)) throw new Error("Please contact Mina while we update our ordering number.");
   const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(orderMessage({ ...customer, paymentMethod: method }, checked, current.settings));
   window.location.assign(url);
  } catch (err) { setMessage(err.message); } finally { setBusy(false); }
 }
 return <><OrderingNotice />{!items.length ? <div className="py-12"><p className="text-lg">Your cart is empty.</p><Link href="/menu" className="mt-6 inline-block bg-burgundy px-8 py-4 text-sm text-white">Explore our menu</Link></div> :
 <form onSubmit={submit} className="grid items-start gap-10 lg:grid-cols-[1fr_0.85fr]" data-motion-skip>
  <div className="bg-white p-6 md:p-9">
   <h2 className="font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl">Delivery details</h2>
   <div className="mt-8 grid gap-7">
    <label>Your name<input className={input} name="name" autoComplete="name" required maxLength={80} /></label>
    <label>WhatsApp number<input className={input} name="phone" type="tel" autoComplete="tel" required maxLength={18} /></label>
    <label>Delivery address<textarea className={input} name="address" autoComplete="street-address" rows={2} required maxLength={300} /></label>
    <label>Nearest landmark<input className={input} name="landmark" required maxLength={150} /></label>
    <label>Order notes <span className="text-cocoa/60">(optional)</span><textarea className={input} name="notes" rows={2} maxLength={400} /></label>
   </div>
  </div>
  <div className="bg-white p-6 md:p-9">
   <h2 className="font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl">Your order</h2>
   <ul className="mt-6 divide-y divide-cocoa/20">{lines.map(line => <li key={line.id + (line.variant || "")} className="py-4">
    <div className="flex justify-between gap-4"><span>{line.quantity} × {line.product?.name || "Removed product"}{line.variantInfo ? " · " + line.variantInfo.label : ""}</span><span className="shrink-0">{money(line.subtotal)}</span></div>
    {line.issue && !loading && <p className="mt-2 text-sm text-burgundy">{line.issue} <button type="button" className="underline" onClick={() => removeItem(line.variant ? line.id + "::" + line.variant : line.id)}>Remove</button></p>}
   </li>)}</ul>
   <div className="flex justify-between border-t border-cocoa/30 py-5 text-lg"><span>Food total</span><span>{money(total)}</span></div>
   <p className="text-sm leading-relaxed">Mina arranges delivery via inDrive. Pay the delivery fee separately to the rider.</p>
   <fieldset className="mt-8 border-t border-cocoa/20 pt-6"><legend className="pt-6 text-lg">Payment</legend>
    <div className="my-4 flex flex-wrap gap-5">{["easypaisa", "jazzcash", ...(settings.bankEnabled ? ["bank"] : [])].map(value => <label key={value} className="flex items-center gap-2"><input type="radio" name="paymentMethod" checked={method === value} value={value} onChange={() => { setMethod(value); setCopied(false); }} />{value === "easypaisa" ? "Easypaisa" : value === "bank" ? "Bank transfer" : "JazzCash"}</label>)}</div>
    {number ? <div className="bg-ivory p-4">{method === "bank" && <p>{settings.bankName}</p>}<p>{holder || "Account holder name pending"}</p><div className="mt-2 flex flex-wrap items-center justify-between gap-3"><span className="text-lg">{number}</span><button type="button" className="min-h-11 underline" onClick={async () => { try { await navigator.clipboard.writeText(number); setCopied(true); } catch { setMessage("Please select and copy the account number."); } }}>{copied ? "Copied" : "Copy number"}</button></div><p className="mt-2 text-sm">Food payment: {money(total)}</p></div> : <p className="bg-ivory p-4 text-sm">JazzCash account details — coming soon.</p>}
    <p className="mt-4 text-sm text-cocoa/65">{settings.bankEnabled ? "Card payments — coming soon." : "Bank transfer / card payments — coming soon."}</p>
    <p className="mt-5 text-sm leading-relaxed">Send your order on WhatsApp, transfer the food total, then send your payment screenshot in the same chat. Mina will verify payment and confirm your order.</p>
   </fieldset>
   <p role="status" className="mt-5 text-sm text-burgundy">{message}</p>
   <button disabled={busy || !canOrder || !valid || !number} className="mt-4 min-h-13 w-full cursor-pointer bg-burgundy px-5 py-4 text-sm uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Checking your order…" : "Send Order on WhatsApp"}</button>
   <p className="mt-3 text-xs leading-relaxed text-cocoa/70">Opens a draft for you to send. Your order is confirmed only when Mina replies.</p>
  </div>
 </form>}</>;
}
