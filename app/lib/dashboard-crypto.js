import { SignJWT, jwtVerify } from "jose";
const encoder = new TextEncoder();
export const SESSION_SECONDS = 8 * 60 * 60;
export function authConfigured() { return Boolean(process.env.DASHBOARD_PASSWORD?.length >= 8 && process.env.DASHBOARD_SESSION_SECRET?.length >= 32); }
function key() { if (!authConfigured()) throw new Error("Dashboard access has not been configured."); return encoder.encode(process.env.DASHBOARD_SESSION_SECRET); }
export async function passwordMatches(password) {
 if (!authConfigured() || typeof password !== "string" || password.length > 256) return false;
 const digest = value => crypto.subtle.digest("SHA-256", encoder.encode(value));
 const [a,b] = await Promise.all([digest(password), digest(process.env.DASHBOARD_PASSWORD)]);
 const aa=new Uint8Array(a),bb=new Uint8Array(b);let result=0;
 for(let i=0;i<aa.length;i++) result |= aa[i]^bb[i];
 return result===0;
}
export async function createSession() {
 return new SignJWT({role:"owner"}).setProtectedHeader({alg:"HS256"}).setIssuer("mina-cafe").setAudience("mina-dashboard").setIssuedAt().setExpirationTime(Math.floor(Date.now()/1000)+SESSION_SECONDS).setJti(crypto.randomUUID()).sign(key());
}
export async function validSession(token) {
 if (!token || !authConfigured()) return false;
 try { const {payload}=await jwtVerify(token,key(),{algorithms:["HS256"],issuer:"mina-cafe",audience:"mina-dashboard",maxTokenAge:SESSION_SECONDS});return payload.role==="owner"; } catch {return false;}
}
