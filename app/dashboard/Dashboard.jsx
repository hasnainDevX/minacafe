"use client";
import { useState } from "react";
import Link from "next/link";
import { calculate } from "../lib/calculator";
import SettingsEditor from "./SettingsEditor";

const blank = { online: "", offline: "", expenses: "", orders: "", target: "" };
const money = n => n === null ? "—" : "Rs. " + n.toLocaleString("en-PK", { maximumFractionDigits: 2 });
export default function Dashboard() {
  const [values, setValues] = useState(blank);
  const [notice, setNotice] = useState("");
  const result = calculate(values);
  async function logout() {
    try {
      const r = await fetch("/dashboard/logout", { method: "POST" });
      if (!r.ok && r.status !== 401) throw Error();
      window.location.replace("/dashboard");
    } catch { setNotice("Could not log out. Please try again."); }
  }
  return <div className="mx-auto max-w-[1100px]">
    <header className="flex items-center justify-between gap-6 border-b border-cocoa/20 pb-5">
      <Link href="/" className="text-sm underline">Back to Mina</Link>
      <button onClick={logout} className="min-h-11 border border-cocoa/30 px-5">Log out</button>
    </header>
    <h1 className="mt-10 font-(family-name:--font-cormorant) text-5xl font-light md:text-6xl">A little business clarity.</h1>
    <p className="mt-4 max-w-xl leading-relaxed">Enter sales and expenses for the same period. This calculator is independent of website orders.</p>
    <section aria-labelledby="calculator-heading" className="mt-10 grid gap-8 lg:grid-cols-2">
      <div className="bg-white p-6 md:p-9">
        <h2 id="calculator-heading" className="font-(family-name:--font-cormorant) text-3xl font-light">Your numbers</h2>
        <div className="mt-6 grid gap-6">{[["online", "Online sales (PKR)"], ["offline", "Offline sales (PKR)"], ["expenses", "Total expenses (PKR)"], ["orders", "Total orders (optional)"], ["target", "Sales target (PKR, optional)"]].map(([key, label]) =>
          <label key={key}>{label}<input type="number" min="0" max="1000000000" step={key === "orders" ? "1" : "0.01"} inputMode="decimal" value={values[key]} onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} className="mt-2 block min-h-12 w-full border-b border-cocoa/30 bg-transparent" /></label>)}</div>
        <p className="mt-7 text-sm text-cocoa/65">These numbers stay on this page and reset when you leave. They are not saved to a server.</p>
        <button type="button" onClick={() => { if (window.confirm("Reset all calculator inputs?")) { setValues(blank); setNotice(""); } }} className="mt-6 min-h-11 border border-cocoa/30 px-5 text-sm">Reset calculator</button>
      </div>
      <div className="self-start bg-white p-6 md:p-9">
        <h2 className="font-(family-name:--font-cormorant) text-3xl font-light">Your estimate</h2>
        <dl className="mt-6 divide-y divide-cocoa/20">{[["Total revenue", money(result.revenue)], ["Expenses", money(result.expenses)], ["Estimated profit", money(result.profit)], ["Profit margin", result.margin === null ? "—" : result.margin.toFixed(1) + "%"], ["Average order value", money(result.aov)]].map(([label, value]) =>
          <div key={label} className="flex flex-wrap justify-between gap-3 py-5"><dt>{label}</dt><dd className="text-lg">{value}</dd></div>)}</dl>
        {result.progress !== null && <div className="mt-6"><div className="flex justify-between gap-4"><span>Sales target</span><span>{result.progress.toFixed(0)}%</span></div><progress value={Math.min(100, result.progress)} max="100" aria-label="Sales target progress" className="mt-3 h-2 w-full accent-burgundy" /><p className="mt-3 text-sm">{result.remaining === 0 ? "Target reached." : money(result.remaining) + " to go."}</p></div>}
        <p className="mt-6 text-sm leading-relaxed text-cocoa/65">Profit is sales minus the expenses you enter. Include ingredients, packaging and other costs.</p>
      </div>
    </section>
    <p role="status" className="mt-4 text-sm">{notice}</p>
    <SettingsEditor />
  </div>;
}
