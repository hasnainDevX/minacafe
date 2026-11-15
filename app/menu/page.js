import Image from "next/image";
import bgGrain from "../../public/images/textures/bggrain.png";
import { AddToCartButton } from "../components/cart/CartControls";
import Navbar from "../components/Navbar";
import { products, categories } from "../assets/products";
import { productCutouts } from "../assets/cutouts";

export const metadata = { title: "Our Menu | Mina Cafe" };

export default function MenuPage() {
  return (
    <div className="relative isolate min-h-screen bg-ivory text-cocoa">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image src={bgGrain} alt="" fill sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-ivory/50" />
      </div>
      <Navbar />
      <main className="mx-auto max-w-[1300px] px-6 py-18 md:px-12 md:py-24 lg:py-32">
        <h1 className="font-(family-name:--font-cormorant) text-5xl font-light md:text-7xl">Our menu</h1>
        {categories.map((category) => (
          <section key={category} className="mt-12 md:mt-16">
            <h2 className="mb-6 font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl">{category}</h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {products.filter((product) => product.category === category).map((product) => (
                <article key={product.id} id={product.id} className="scroll-mt-44">
                  <div className="relative aspect-square border border-cocoa/20 bg-white">
                    <Image src={productCutouts[product.id]} alt={product.name} fill sizes="(max-width: 767px) 45vw, (max-width: 1023px) 30vw, 280px" className="object-contain p-5 md:p-8" />
                  </div>
                  <h3 className="mt-3 text-sm md:text-base">{product.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-cocoa/75 md:text-sm">{product.description}</p>
                  <AddToCartButton productId={product.id} productName={product.name} />
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
