import Image from "next/image";
import { Suspense } from "react";
import { isOwner } from "../lib/dashboard-auth";
import { authConfigured } from "../lib/dashboard-crypto";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
export const metadata = { title:"Private dashboard | Mina Café",robots:{index:false,follow:false} };
export default function DashboardPage() { return <main className="relative isolate min-h-screen bg-ivory px-5 py-10 text-cocoa md:px-10"><div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10"><Image src="/images/textures/site-background.png" alt="" fill sizes="100vw" className="object-cover object-center" /><div className="absolute inset-0 bg-ivory/75" /></div><Suspense fallback={<p className="py-16 text-center">Opening dashboard…</p>}><PrivateDashboard /></Suspense></main>; }
async function PrivateDashboard() { return await isOwner() ? <Dashboard /> : <LoginForm configured={authConfigured()} />; }
