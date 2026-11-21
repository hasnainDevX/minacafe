import Image from "next/image";
import Navbar from "../components/Navbar";
import CheckoutForm from "./CheckoutForm";
import StripedBackground from "../components/StripedBackground";

export const metadata = {
  title: "Checkout | Mina Cafe",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <div className="relative isolate min-h-screen text-cocoa">
       <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10`}
      style={{
        // backgroundColor: "#f4edbe, #f4edbe",
        backgroundImage:
          "linear-gradient(90deg, var(--stripe-color, #EFD5BE) 50%, transparent 50%)",
        backgroundSize: "var(--stripe-width, clamp(188px, 30vw, 300px)) 100%",
        backgroundRepeat: "repeat-x",
      }}
    />

      <Navbar />
      <main className="mx-auto max-w-[1100px] px-3 py-18 md:px-12 md:py-24">
       
        <div className="mt-10 rounded-sm bg-white/95 p-6 md:p-10">
          <CheckoutForm />
        </div>
      </main>
    </div>
  );
}