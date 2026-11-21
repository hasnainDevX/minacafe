"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { businessStatus, defaultSettings } from "../lib/business";

const Context = createContext(null);
export const useStorefront = () => useContext(Context);
const empty = { products: [], categories: [], settings: defaultSettings, home: {}, orderingReady: false };

export default function StorefrontProvider({ children }) {
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState({ isOpen: false, message: "Checking opening hours…" });
  const pending = useRef(null);
  const sequence = useRef(0);
  const refresh = useCallback((fresh = false) => {
    // Focus and visibility events often arrive together. Checkout still gets its own fresh request.
    if (!fresh && pending.current) return pending.current;
    const request = (async () => {
    const id = ++sequence.current;
    try {
      const response = await fetch(`/api/storefront${fresh ? "?fresh=1" : ""}`, { cache: "no-store" });
      if (!response.ok) throw new Error("We couldn’t refresh the menu. Please try again.");
      const result = await response.json();
      if (id === sequence.current) { setData(previous => JSON.stringify(previous) === JSON.stringify(result) ? previous : result); setError(""); }
      return result;
    } catch (err) {
      if (id === sequence.current) setError(err.message);
      throw err;
    } finally { if (id === sequence.current) setLoading(false); }
    })();
    if (!fresh) {
      pending.current = request;
      const clear = () => { if (pending.current === request) pending.current = null; };
      request.then(clear, clear);
    }
    return request;
  }, []);
  useEffect(() => {
    const update = () => { if (!document.hidden) refresh().catch(() => {}); };
    update();
    const polling = setInterval(update, 60000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => { clearInterval(polling); window.removeEventListener("focus", update); document.removeEventListener("visibilitychange", update); };
  }, [refresh]);
  useEffect(() => {
    const tick = () => {
      if (document.hidden) return;
      const next = businessStatus(data.settings);
      // Preserve second-accurate opening boundaries without broadcasting an unchanged status.
      setStatus(previous => previous.isOpen === next.isOpen && previous.message === next.message ? previous : next);
    };
    tick();
    const clock = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => { clearInterval(clock); document.removeEventListener("visibilitychange", tick); };
  }, [data.settings]);
  const value = useMemo(() => ({ ...data, loading, error, refresh, status, canOrder: !loading && !error && data.orderingReady && !data.settings.ordersPaused }), [data, loading, error, refresh, status]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function OrderingNotice({ compact = false }) {
  const { loading, error, orderingReady, status, settings, refresh } = useStorefront();
  if (compact && !loading && !error && orderingReady && !settings.ordersPaused) {
    const opens = status.message.match(/Opens (.*?) · Karachi time/);
    return <div className="max-w-sm text-sm leading-relaxed text-cocoa md:text-right" role="status">
      <p>{status.isOpen ? status.message : `Currently closed${opens ? ` · Opens ${opens[1]}` : ""}`}</p>
      {!status.isOpen && <p className="mt-1 text-cocoa/75">Orders welcome. We’ll contact you as soon as possible.</p>}
    </div>;
  }
  return <div className={compact ? "max-w-sm text-sm leading-relaxed md:text-right" : "my-6 md:text-lg text-sm"} role="status">
    {loading ? "Loading today’s menu…" : error || (!orderingReady ? "Our menu is being updated. Please check back shortly." : status.message)}
    {error && <button className="ml-3 cursor-pointer underline" onClick={() => refresh(true).catch(() => {})}>Try again</button>}
  </div>;
}
