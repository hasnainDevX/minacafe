import Image from "next/image";
import Navbar from "../components/Navbar";
import BulkOrderForm from "../components/bulk-orders/BulkOrderForm";
import bgGrain from "../../public/images/textures/bggrain.png";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";

export const metadata = { title: "Bulk Orders | Mina Cafe", description: "Enquire about Mina bulk orders for your event, team or gathering." };

export default function BulkOrdersPage() {
  return (
    <div className="relative isolate min-h-screen bg-ivory text-cocoa">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image src={bgGrain} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ivory/60" />
      </div>
      <Navbar />
      <main className="px-4 py-12 md:px-12 md:py-20">
        <div className="mx-auto max-w-[760px] bg-white px-6 py-12 sm:px-10 md:px-16 md:py-16">
          <div className="mb-10 text-center md:mb-14">
            <h1 className="font-(family-name:--font-cormorant) text-4xl font-light uppercase leading-[1.15] md:text-6xl">Bulk orders</h1>
            <div aria-hidden="true" className="mx-auto my-6 h-px w-12 bg-burgundy" />
            <p className="font-[family-name:var(--font-source-sans)] text-base leading-[1.7] md:text-lg">Tell us your date, numbers and favourites.</p>
          </div>
          <BulkOrderForm />
        </div>
      </main>
      <FAQ/>
      <Footer/>
    </div>
  );
}
