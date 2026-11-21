"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { businessStatus, defaultSettings } from "../lib/business";

const Context = createContext(null);
export const useStorefront = () => useContext(Context);
const empty = { products: [], categories: [], settings: defaultSettings, home: {}, orderingReady: false };

export default function StorefrontProvider({ children }) {
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(null);
  const sequence = useRef(0);
  const refresh = useCallback(async (fresh = false) => {
    const id = ++sequence.current;
    try {
      const response = await fetch(`/api/storefront${fresh ? "?fresh=1" : ""}`, { cache: "no-store" });
      if (!response.ok) throw new Error("We couldn’t refresh the menu. Please try again.");
      const result = await response.json();
      if (id === sequence.current) { setData(result); setError(""); setNow(new Date()); }
      return result;
    } catch (err) {
      if (id === sequence.current) setError(err.message);
      throw err;
    } finally { if (id === sequence.current) setLoading(false); }
  }, []);
  useEffect(() => {
    const update = () => { setNow(new Date()); if (!document.hidden) refresh().catch(() => {}); };
    update();
    const polling = setInterval(update, 60000);
    const clock = setInterval(() => setNow(new Date()), 1000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => { clearInterval(polling); clearInterval(clock); window.removeEventListener("focus", update); document.removeEventListener("visibilitychange", update); };
  }, [refresh]);
  const status = now ? businessStatus(data.settings, now) : { isOpen: false, message: "Checking opening hours…" };
  return <Context.Provider value={{ ...data, loading, error, refresh, status, canOrder: !loading && !error && data.orderingReady && !data.settings.ordersPaused }}>{children}</Context.Provider>;
}

export function OrderingNotice() {
  const { loading, error, orderingReady, status, refresh } = useStorefront();
  return <div className="my-6 md:text-lg text-sm" role="status">
    {loading ? "Loading today’s menu…" : error || (!orderingReady ? "Our menu is being updated. Please check back shortly." : status.message)}
    {error && <button className="ml-3 cursor-pointer underline" onClick={() => refresh(true).catch(() => {})}>Try again</button>}
  </div>;
}
