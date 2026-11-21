import "server-only";
import { cookies } from "next/headers";
import { validSession } from "./dashboard-crypto";
export const COOKIE = "__Host-mina-dashboard";
export async function isOwner() { return validSession((await cookies()).get(COOKIE)?.value); }
export const privateHeaders = { "Cache-Control":"private, no-store", "X-Robots-Tag":"noindex, nofollow" };
export function sameOrigin(request) {
 const expected = process.env.SITE_URL || new URL(request.url).origin;
 try { return new URL(request.headers.get("origin")).origin === new URL(expected).origin && request.headers.get("sec-fetch-site") !== "cross-site"; } catch { return false; }
}
// Local single-process backstop. The production Worker also enforces shared location-level limits.
let attempts = { count:0, until:0 };
export function loginAllowed(now=Date.now()) {
 if (now >= attempts.until) attempts={count:0,until:now+60000};
 attempts.count++;
 return attempts.count<=5;
}
