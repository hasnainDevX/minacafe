import test from "node:test";
import assert from "node:assert/strict";
import { sameOrigin } from "./dashboard-origin.js";

const production = { NODE_ENV: "production", SITE_URL: "https://minacafe.online" };
function request(origin, site = "same-origin", extra = {}, url = "https://minacafe.vercel.app/dashboard/login") {
  return new Request(url, { method: "POST", headers: { ...(origin === undefined ? {} : { origin }), "sec-fetch-site": site, ...extra } });
}

test("both exact Mina domains can log in independently of SEO canonical", () => {
  for (const origin of ["https://minacafe.online", "https://minacafe.vercel.app"]) {
    assert.equal(sameOrigin(request(origin), production), true);
    assert.equal(sameOrigin(request(origin), { NODE_ENV: "production" }), true);
    assert.equal(sameOrigin(request(origin), { ...production, SITE_URL: "http://minacafe.vercel.app" }), true);
  }
});

test("origin checks reject unrelated domains, spoofed hosts and cross-site requests", () => {
  for (const origin of [undefined, "null", "https://other.vercel.app", "https://minacafe.vercel.app.attacker.test", "https://minacafe.online.attacker.test", "http://minacafe.vercel.app", "https://attacker.test", "https://minacafe.online/path"]) {
    assert.equal(sameOrigin(request(origin), production), false);
  }
  assert.equal(sameOrigin(request("https://minacafe.vercel.app", "cross-site"), production), false);
  assert.equal(sameOrigin(request("https://attacker.test", "same-origin", { host: "attacker.test", "x-forwarded-host": "attacker.test" }), production), false);
});

test("local development still requires the exact request origin and port", () => {
  const env = { ...production, NODE_ENV: "development" };
  const url = "http://localhost:3000/dashboard/login";
  assert.equal(sameOrigin(request("http://localhost:3000", "same-origin", {}, url), env), true);
  assert.equal(sameOrigin(request("http://localhost:3001", "same-origin", {}, url), env), false);
  assert.equal(sameOrigin(request("https://minacafe.online", "same-origin", {}, url), env), false);
});
