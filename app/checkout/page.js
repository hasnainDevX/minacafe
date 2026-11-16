import Link from "next/link";
import Navbar from "../components/Navbar";
export const metadata = { title: "Checkout | Mina Cafe", robots: { index: false, follow: true } };
export default function CheckoutPage() {
  return <div className="min-h-screen bg-ivory text-cocoa"><Navbar /><main className="mx-auto max-w-[900px] px-6 py-24 text-center md:py-32"><h1 className="font-(family-name:--font-cormorant) text-5xl font-light md:text-7xl">Checkout</h1><p className="mt-8 text-lg">Under development</p><Link href="/menu" className="mt-10 inline-flex min-h-12 items-center border border-burgundy bg-burgundy px-8 py-4 text-xs uppercase tracking-[0.2em] text-white">Back to menu</Link></main></div>;
}
