import Image from "next/image";
import Navbar from "../components/Navbar";
import CheckoutForm from "./CheckoutForm";

export const metadata = {
  title: "Checkout | Mina Cafe",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <div className="relative isolate min-h-screen text-cocoa">
      <Image
        src="/images/textures/site-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-burgundy/10" />

      <Navbar />
      <main className="mx-auto max-w-[1100px] px-6 py-18 md:px-12 md:py-24">
        <h1 className="font-(family-name:--font-cormorant) text-5xl font-light md:text-7xl">
          Checkout
        </h1>
        <div className="mt-10 rounded-sm bg-white/95 p-6 md:p-10">
          <CheckoutForm />
        </div>
      </main>
    </div>
  );
}