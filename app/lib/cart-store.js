import { products } from "../assets/products.js";

export const CART_KEY = "mina-cart-v1";
const LIFETIME = 30 * 24 * 60 * 60 * 1000;
const validIds = new Set(products.map((product) => product.id));
const EMPTY = [];

function normalize(items) {
  if (!Array.isArray(items)) return [];
  const quantities = new Map();
  for (const item of items) {
    if (!validIds.has(item?.id) || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    quantities.set(item.id, Math.min(99, (quantities.get(item.id) || 0) + item.quantity));
  }
  return Array.from(quantities, ([id, quantity]) => ({ id, quantity }));
}

function decode(value) {
  try {
    const data = JSON.parse(value);
    if (data?.version !== 1 || !Number.isFinite(data.expires) || data.expires <= Date.now() || !Array.isArray(data.items)) return null;
    return normalize(data.items);
  } catch { return null; }
}

// Only IDs and quantities are persisted; product details come from the catalog.
export function createCartStore(getBrowser = () => window) {
  let items = EMPTY;
  let initialized = false;
  const listeners = new Set();
  const notify = () => listeners.forEach((listener) => listener());

  function read() {
    const browser = getBrowser();
    let stored = null;
    try { stored = decode(browser.localStorage.getItem(CART_KEY)); } catch {}
    if (stored !== null) return stored;
    try {
      const cookie = browser.document.cookie.split("; ").find((value) => value.startsWith(`${CART_KEY}=`));
      return cookie ? decode(decodeURIComponent(cookie.slice(CART_KEY.length + 1))) || [] : [];
    } catch { return []; }
  }

  function save() {
    const browser = getBrowser();
    const value = JSON.stringify({ version: 1, expires: Date.now() + LIFETIME, items });
    try { browser.localStorage.setItem(CART_KEY, value); } catch {}
    try {
      browser.document.cookie = `${CART_KEY}=${encodeURIComponent(value)}; Path=/; Max-Age=${LIFETIME / 1000}; SameSite=Lax${browser.location.protocol === "https:" ? "; Secure" : ""}`;
    } catch {}
  }

  function initialize() {
    if (initialized) return;
    initialized = true;
    items = read();
    notify();
  }

  function commit(next) {
    items = normalize(next);
    save();
    notify();
  }

  function sync(event) {
    if (event.key !== CART_KEY && event.key !== null) return;
    items = event.newValue ? decode(event.newValue) || [] : [];
    notify();
  }

  return {
    initialize,
    getSnapshot: () => items,
    getServerSnapshot: () => EMPTY,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) getBrowser().addEventListener("storage", sync);
      return () => {
        listeners.delete(listener);
        if (!listeners.size) getBrowser().removeEventListener("storage", sync);
      };
    },
    add(id) {
      initialize();
      if (!validIds.has(id)) return;
      const existing = items.find((item) => item.id === id);
      commit(existing ? items.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { id, quantity: 1 }]);
    },
    setQuantity(id, quantity) {
      initialize();
      if (!Number.isInteger(quantity) || quantity < 0) return;
      commit(quantity === 0 ? items.filter((item) => item.id !== id) : items.map((item) => item.id === id ? { ...item, quantity: Math.min(99, quantity) } : item));
    },
    remove(id) {
      initialize();
      commit(items.filter((item) => item.id !== id));
    },
  };
}

export const cartStore = createCartStore();
