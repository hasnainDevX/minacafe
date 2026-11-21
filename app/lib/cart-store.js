import { products } from "../assets/products.js";

export const CART_KEY = "mina-cart-v1";
const LIFETIME = 30 * 24 * 60 * 60 * 1000;
export const cartItemKey = (item) => item.variant ? `${item.id}::${item.variant}` : item.id;
const EMPTY = [];

function normalize(items, catalog, preserveMissing = false) {
  if (!Array.isArray(items)) return [];
  const lines = new Map();
  for (const item of items) {
    const product = catalog.get(item?.id);
    if (typeof item?.id !== "string" || item.id.length > 128 || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    if (!product && !preserveMissing) continue;
    if (item.variant && (typeof item.variant !== "string" || item.variant.length > 128)) continue;
    if (preserveMissing) {
      const line = { id: item.id, quantity: item.quantity, ...(item.variant ? { variant: item.variant } : {}) };
      const key = cartItemKey(line);
      line.quantity = Math.min(99, (lines.get(key)?.quantity || 0) + item.quantity);
      lines.set(key, line);
      continue;
    }
    const variant = product.variants?.find((option) => option.id === (item.variant || product.variants[0].id));
    if ((product.variants && !variant) || (!product.variants && item.variant)) continue;
    const line = { id: item.id, quantity: item.quantity, ...(variant ? { variant: variant.id } : {}) };
    const key = cartItemKey(line);
    line.quantity = Math.min(99, (lines.get(key)?.quantity || 0) + item.quantity);
    lines.set(key, line);
  }
  return Array.from(lines.values());
}

function decode(value, catalog, preserveMissing) {
  try {
    const data = JSON.parse(value);
    if (data?.version !== 1 || !Number.isFinite(data.expires) || data.expires <= Date.now() || !Array.isArray(data.items)) return null;
    return normalize(data.items, catalog, preserveMissing);
  } catch { return null; }
}

// Only product IDs, option IDs and quantities are persisted; product details come from the catalog.
export function createCartStore(getBrowser = () => window, { preserveMissing = false } = {}) {
  let catalog = new Map(products.map(product => [product.id, product]));
  let items = EMPTY;
  let initialized = false;
  const listeners = new Set();
  const notify = () => listeners.forEach((listener) => listener());

  function read() {
    const browser = getBrowser();
    let stored = null;
    try { stored = decode(browser.localStorage.getItem(CART_KEY), catalog, preserveMissing); } catch {}
    if (stored !== null) return stored;
    try {
      const cookie = browser.document.cookie.split("; ").find((value) => value.startsWith(`${CART_KEY}=`));
      return cookie ? decode(decodeURIComponent(cookie.slice(CART_KEY.length + 1)), catalog, preserveMissing) || [] : [];
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
    items = normalize(next, catalog, preserveMissing);
    save();
    notify();
  }

  function sync(event) {
    if (event.key !== CART_KEY && event.key !== null) return;
    items = event.newValue ? decode(event.newValue, catalog, preserveMissing) || [] : [];
    notify();
  }

  return {
    setCatalog(products) { catalog = new Map(products.map(product => [product.id, product])); },
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
    add(id, variant) {
      initialize();
      const [line] = normalize([{ id, variant, quantity: 1 }], catalog);
      if (!line) return;
      commit([...items, line]);
    },
    setQuantity(id, quantity) {
      initialize();
      if (!Number.isInteger(quantity) || quantity < 0) return;
      commit(quantity === 0 ? items.filter((item) => cartItemKey(item) !== id) : items.map((item) => cartItemKey(item) === id ? { ...item, quantity: Math.min(99, quantity) } : item));
    },
    remove(id) {
      initialize();
      commit(items.filter((item) => cartItemKey(item) !== id));
    },
  };
}

export const cartStore = createCartStore(() => window, { preserveMissing: true });
