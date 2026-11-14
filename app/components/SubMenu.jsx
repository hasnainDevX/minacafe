import Image from "next/image";
import Link from "next/link";
import { productImages } from "../assets";

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
      className="mina-stripes mina-paper px-5 py-16 text-[var(--mina-cocoa)] md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-[1300px]">
        <h2
          id="submenu-heading"
          className="mb-8 font-(family-name:--font-cormorant) text-4xl font-light md:mb-12 md:text-5xl"
        >
          Our little favourites
        </h2>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/menu#${item.id}`}
                className="group block rounded-sm bg-[var(--mina-ivory)] p-2.5 md:p-3"
              >
                <span
                  className="relative block aspect-[6/7] overflow-hidden rounded-md"
                  style={{ backgroundColor: item.tone }}
                >
                  <Image
                    src={productImages[item.id]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </span>
                <span className="flex items-center justify-between px-2 pb-2 pt-4">
                  <span className="font-(family-name:--font-cormorant) text-2xl">
                    {item.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-3xl font-light leading-none transition-transform duration-300 group-hover:rotate-90 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}