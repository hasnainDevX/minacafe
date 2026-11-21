import { pageMetadata } from "../lib/seo";
import Image from "next/image";
import bgGrain from "../../public/images/textures/bggrain.png";
import MenuCatalog from "../components/MenuCatalog";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import PageTestimonials from "../components/PageTestimonials";
import { OrderingNotice } from "../components/StorefrontProvider";

export const metadata = pageMetadata("Our Menu | Mina Café Karachi", "Explore Mina Café’s menu: milk bottles, fresh fruit glasses, chicken salad bowls, Nut & Nectar and Kashmiri chai. Choose your favourites and order on WhatsApp.", "/menu");

export default function MenuPage() {
  return (
    <div className="relative isolate min-h-screen bg-ivory text-cocoa">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <Image
          src={bgGrain}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ivory/50" />
      </div>
      <Navbar />
      <main className="mx-auto max-w-[1300px] px-6 py-18 md:px-12 md:py-24 lg:py-32">
        <div className="flex w-full flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <h1 className="shrink-0 whitespace-nowrap font-(family-name:--font-cormorant) text-5xl font-light md:text-7xl">
            Our Menu
          </h1>
        <OrderingNotice compact />
        </div>
        <MenuCatalog />
      </main>
      <PageTestimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
