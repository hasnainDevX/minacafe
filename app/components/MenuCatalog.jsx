"use client";
import MenuProductCard from "./MenuProductCard";
import { useStorefront, OrderingNotice } from "./StorefrontProvider";
export default function MenuCatalog() {
  const { products, categories, loading, error } = useStorefront();
  return (
    <>
      {/* <OrderingNotice /> */}
      {categories.map((category) => (
        <section
          id={"category-" + category.id}
          key={category.id}
          className="mt-12 scroll-mt-24 md:mt-16"
        >
          <h2 className="mb-6 font-(family-name:--font-cormorant) text-3xl font-light md:text-4xl">
            {category.name}
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products
              .filter((p) => p.category === category.name)
              .map((product) => (
                <MenuProductCard key={product.id} product={product} />
              ))}
          </div>
        </section>
      ))}
      {!loading && !error && !products.length && (
        <p className="py-10">Our menu will be here shortly.</p>
      )}
    </>
  );
}
