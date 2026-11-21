"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function LoginForm({configured}) {
 const router=useRouter();
 const [error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e) {e.preventDefault();setBusy(true);setError("");try {const r=await fetch("/dashboard/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:new FormData(e.currentTarget).get("password")})});const data=await r.json();if(!r.ok)throw Error(data.error);router.refresh();}catch(err){setError(err.message);}finally{setBusy(false);}}
 return <div className="mx-auto mt-[10vh] max-w-md bg-white p-8 md:p-10"><Link href="/" className="text-sm underline">Back to Mina</Link><h1 className="mt-8 font-(family-name:--font-cormorant) text-5xl font-light">Owner dashboard</h1>{configured ? <form onSubmit={submit} className="mt-8"><label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={256} className="mt-3 block min-h-12 w-full border-b border-cocoa/30 bg-transparent" /></label><p role="status" className="mt-4 text-sm text-burgundy">{error}</p><button disabled={busy} className="mt-6 min-h-12 w-full bg-burgundy px-6 py-3 text-white disabled:opacity-50">{busy?"Signing in…":"Sign in"}</button></form> : <p className="mt-6 leading-relaxed">Private access has not been set up yet.</p>}</div>;
}