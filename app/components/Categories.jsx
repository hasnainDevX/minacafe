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
      className="bg-[var(--mina-ivory)] px-6 pb-20 pt-4 text-[var(--mina-cocoa)] md:px-12 md:pb-28"
    >
      <div className="mx-auto max-w-[1300px]">
        <div className="flex items-center justify-between">
          <h2
            id="categories-heading"
            className="font-(family-name:--font-cormorant) text-3xl font-light tracking-[0.04em] md:text-5xl"
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

        <ul className="mt-8 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
          {categories.map((category) => (
            <li key={category.name}>
              <Link href={category.href} className="group block">
                <span className="relative block aspect-[8/7] overflow-hidden rounded-md bg-[var(--mina-peach,#EFD5BE)]">
                  <Image
                    src={productImages[category.image]}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
                  />
                </span>
                <span className="mt-4 block text-sm font-medium uppercase tracking-[0.25em] md:text-base">
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}