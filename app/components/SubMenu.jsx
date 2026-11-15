import Image from "next/image";
import Link from "next/link";
import { productCutouts } from "../assets/cutouts";
import { AddToCartButton } from "./cart/CartControls";
import StripedBackground from "./StripedBackground";

const items = [
  { id: "strawberry-milk-bottle", name: "Strawberry Milk", tone: "#EFD5BE" },
  { id: "mango-milk-bottle", name: "Mango Milk", tone: "#F4EDBE" },
  { id: "fresh-fruit-glass", name: "Fresh Fruit Glass", tone: "#F3ECE8" },
  { id: "chicken-salad-bowl", name: "Chicken Salad Bowl", tone: "#F4EDBE" },
  { id: "nut-and-nectar-cup", name: "Nut & Nectar Cup", tone: "#EFD5BE" },
  { id: "nut-and-nectar-bucket", name: "Nut & Nectar Bucket", tone: "#F3ECE8" },
];

export default function SubMenu() {
  return (
    <section
      aria-labelledby="submenu-heading"
      className="relative isolate px-5 py-18 text-[var(--mina-cocoa)] md:px-12 md:py-24 lg:py-32 [--stripe-bg:#ffff] md:[--stripe-color:#f8e59a]/80 [--stripe-color:#f8e59a]/60 border-y"
    >
      <StripedBackground />
      <div className="mx-auto max-w-[1080px]">
        <h2
          id="submenu-heading"
          className="mb-12 font-(family-name:--font-cormorant) text-burgundy text-4xl font-light leading-[1.15] md:mb-20 md:text-5xl lg:text-7xl text-center md:text-left"
        >
          Our Little Favourites
        </h2>

        <ul className="flex flex-col gap-12 md:gap-16 ">
          {items.map((item) => (
            <li
              key={item.id}
              className="w-full max-w-[480px] odd:ml-auto even:mr-auto md:w-[44.444%]"
            >
              <Link href={`/menu#${item.id}`} className="group block">
                <span
                  className="relative block aspect-[4/3] overflow-hidden rounded-[4px] bg-white border"
                >
                  <Image
                    src={productCutouts[item.id]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1175px) 40vw, 480px"
                    className="object-contain p-6 md:p-8 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </span>
              </Link>
                <div className="flex justify-between gap-2 py-3 font-serif">
                  <span className="text-xs p-3 uppercase tracking-[0.16em] md:text-sm border bg-ivory">
                    {item.name}
                  </span>
                  <AddToCartButton productId={item.id} productName={item.name} className="inline-flex cursor-pointer items-center justify-center gap-2 text-xs p-3 uppercase tracking-[0.16em] md:text-sm border bg-burgundy text-white hover:bg-burgundy/95" />
                </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
