import Hero from "./components/Hero";
import LocationIntro from "./components/LocationIntro";
import Categories from "./components/Categories";
import SubMenu from "./components/SubMenu";
import Hours from "./components/Hours";
import Testimonials from "./components/Testimonials";
import Bulksection from "./components/Bulksection";
import Footer from "./components/Footer";
import Marquee from "./components/Marquee";

export default function Home() {
  return (
    <main className="mina-home">
      <div
        data-section-stack
        className="relative"
        style={{ "--r": "clamp(28px, 4.5vw, 62px)" }}
      >
        <div data-section-underlay>
          <Hero />
        </div>
        <div
          data-section-cover
          className="relative z-10 min-h-[calc(100svh_+_var(--r))] bg-white"
        >
          <div
            aria-hidden="true"
            className="hidden md:block pointer-events-none absolute inset-x-0 top-[calc(var(--r)*-1+1px)] h-[var(--r)] bg-white"
            style={{
              WebkitMask:
                "radial-gradient(circle at 50% 100%, #000 calc(var(--r) - 0.5px), transparent var(--r)) 0 0 / calc(var(--r) * 2) 100% repeat-x",
              mask: "radial-gradient(circle at 50% 100%, #000 calc(var(--r) - 0.5px), transparent var(--r)) 0 0 / calc(var(--r) * 2) 100% repeat-x",
            }}
          />
          <Categories />

          <Marquee
            speed={18}
            className="bg-burgundy text-white p-3"
            itemClassName="gap-10"
          >
            <span>★ Fresh daily</span>
            <span>★ Karachi's favorite</span>
            <span>★ 200+ happy customers</span>
          </Marquee>
          <SubMenu />
        </div>
      </div>

      <Hours />
      <Marquee
        speed={18}
        className="bg-white p-3"
        itemClassName="gap-10 text-5xl md:text-7xl text-burgundy "
      >
        <span>★ Fresh daily</span>
        <span>★ Karachi's favorite</span>
        <span>★ 200+ happy customers</span>
      </Marquee>
      <LocationIntro />
      <Testimonials />
      <Bulksection />
      <Footer />
    </main>
  );
}