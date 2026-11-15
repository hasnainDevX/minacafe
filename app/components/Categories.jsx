import Image from "next/image";
import Link from "next/link";
import { productImages } from "../assets";

const categories = [
  { name: "Milk bottles", image: "strawberry-milk-bottle", href: "/menu" },
  { name: "Fruit & bowls", image: "fresh-fruit-glass", href: "/menu" },
  { name: "Nut & Nectar", image: "nut-and-nectar-cup", href: "/menu" },
];

export default function Categories() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="bg-white px-6 py-16 text-[var(--mina-cocoa)] md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="flex items-center justify-between">
          <h2
            id="categories-heading"
            className="font-(family-name:--font-cormorant) text-4xl font-light leading-[1.15] md:text-5xl"
          >
            Explore more
          </h2>
          <Link
            href="/menu"
            aria-label="View the full menu"
            className="group text-4xl leading-none transition-transform duration-300 hover:translate-x-1 motion-reduce:transition-none md:text-5xl"
          >
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-x-8 md:mt-10 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.name}>
              <Link href={category.href} className="group flex items-center gap-5 border-t border-cocoa/20 py-5">
                <span className="relative block h-24 w-24 shrink-0 overflow-hidden bg-peach md:h-28 md:w-28">
                  <Image
                    src={productImages[category.image]}
                    alt={category.name}
                    fill
                    sizes="(max-width: 767px) 96px, 112px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
                  />
                </span>
                <span className="block text-base font-normal md:text-lg">
                  {category.name}
                </span>
                <span aria-hidden="true" className="ml-auto text-xl font-light">↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}