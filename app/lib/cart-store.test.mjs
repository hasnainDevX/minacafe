import test from "node:test";
import assert from "node:assert/strict";
import { createCartStore, CART_KEY } from "./cart-store.js";

function browser() {
  const data = new Map();
  let cookie = "";
  const events = new Map();
  return {
    localStorage: { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) },
    document: { get cookie() { return cookie; }, set cookie(value) { cookie = value.split(";")[0]; } },
    location: { protocol: "https:" },
    addEventListener: (name, callback) => events.set(name, callback),
    removeEventListener: (name) => events.delete(name),
    emit: (event) => events.get("storage")?.(event),
  };
}

const id = "strawberry-milk-bottle";

test("adding, incrementing, removing and reload preserve the cart", () => {
  const env = browser();
  const store = createCartStore(() => env);
  store.add(id);
  store.add(id);
  store.add("mango-milk-bottle");
  assert.equal(store.getSnapshot().length, 2);
  const reloaded = createCartStore(() => env);
  reloaded.initialize();
  assert.equal(reloaded.getSnapshot()[0].quantity, 2);
  reloaded.setQuantity(id, 99);
  reloaded.add(id);
  assert.equal(reloaded.getSnapshot()[0].quantity, 99);
  reloaded.setQuantity(id, 0);
  reloaded.remove("mango-milk-bottle");
  const empty = createCartStore(() => env);
  empty.initialize();
  assert.deepEqual(empty.getSnapshot(), []);
});

test("cookie restores cart when local storage is blocked", () => {
  const env = browser();
  env.localStorage = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } };
  createCartStore(() => env).add(id);
  assert.ok(env.document.cookie.startsWith(`${CART_KEY}=`));
  const restored = createCartStore(() => env);
  restored.initialize();
  assert.deepEqual(restored.getSnapshot(), [{ id, quantity: 1 }]);
});

test("malformed, expired, and unknown saved products are handled safely", () => {
  const env = browser();
  env.localStorage.setItem(CART_KEY, "broken json");
  const store = createCartStore(() => env);
  store.initialize();
  assert.deepEqual(store.getSnapshot(), []);
  env.localStorage.setItem(CART_KEY, JSON.stringify({ version: 1, expires: Date.now() - 1000, items: [{ id, quantity: 4 }] }));
  const expired = createCartStore(() => env);
  expired.initialize();
  assert.deepEqual(expired.getSnapshot(), []);
  env.localStorage.setItem(CART_KEY, JSON.stringify({ version: 1, expires: Date.now() + 10000, items: [{ id: "unknown", quantity: 3 }, { id, quantity: -3 }, { id, quantity: 2 }, { id, quantity: 3 }] }));
  const sanitized = createCartStore(() => env);
  sanitized.initialize();
  assert.deepEqual(sanitized.getSnapshot(), [{ id, quantity: 5 }]);
});

test("cart remains usable when both storage mechanisms are blocked", () => {
  const env = browser();
  env.localStorage = { getItem() { throw Error(); }, setItem() { throw Error(); } };
  Object.defineProperty(env.document, "cookie", { get() { throw Error(); }, set() { throw Error(); } });
  const store = createCartStore(() => env);
  store.add(id);
  store.add("unknown");
  assert.deepEqual(store.getSnapshot(), [{ id, quantity: 1 }]);
});

test("changes in another tab update subscribers", () => {
  const env = browser();
  const store = createCartStore(() => env);
  store.initialize();
  let updates = 0;
  const unsubscribe = store.subscribe(() => updates++);
  env.emit({ key: CART_KEY, newValue: JSON.stringify({ version: 1, expires: Date.now() + 10000, items: [{ id, quantity: 3 }] }) });
  assert.equal(store.getSnapshot()[0].quantity, 3);
  env.emit({ key: CART_KEY, newValue: JSON.stringify({ version: 1, expires: Date.now() + 10000, items: [] }) });
  assert.deepEqual(store.getSnapshot(), []);
  assert.equal(updates, 2);
  unsubscribe();
});
