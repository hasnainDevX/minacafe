import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { SignJWT } from "jose";
import { authConfigured, passwordMatches, createSession, validSession } from "./dashboard-crypto.js";
process.env.DASHBOARD_PASSWORD=randomBytes(20).toString("hex");
process.env.DASHBOARD_SESSION_SECRET=randomBytes(48).toString("hex");
test("password validation fails closed and accepts only the configured password",async()=>{
 assert.equal(authConfigured(),true);
 assert.equal(await passwordMatches("incorrect"),false);
 assert.equal(await passwordMatches(null),false);
 assert.equal(await passwordMatches(process.env.DASHBOARD_PASSWORD),true);
});
test("signed owner sessions reject tampering, expiration and the wrong audience",async()=>{
 const token=await createSession();assert.equal(await validSession(token),true);
 const parts=token.split(".");parts[1]=Buffer.from(JSON.stringify({role:"owner",exp:9999999999})).toString("base64url");
 assert.equal(await validSession(parts.join(".")),false);
 assert.equal(await validSession("broken"),false);
 const key=new TextEncoder().encode(process.env.DASHBOARD_SESSION_SECRET);
 for(const props of [{aud:"wrong",exp:Math.floor(Date.now()/1000)+100},{aud:"mina-dashboard",exp:1}]) {
  const bad=await new SignJWT({role:"owner"}).setProtectedHeader({alg:"HS256"}).setIssuer("mina-cafe").setAudience(props.aud).setIssuedAt().setExpirationTime(props.exp).sign(key);
  assert.equal(await validSession(bad),false);
 }
});
