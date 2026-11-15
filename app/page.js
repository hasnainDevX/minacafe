import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LocationIntro from "./components/LocationIntro";
import Categories from "./components/Categories";
import SubMenu from "./components/SubMenu";
import Hours from "./components/Hours";
import Testimonials from "./components/Testimonials";
import Bulksection from "./components/Bulksection";

export default function Home() {
  return (
    <>
      <main className="mina-home">
        <div className="relative">
          <Hero />
          <div className="relative z-10 bg-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[calc(var(--r)*-1+1px)] h-[var(--r)] bg-white"
              style={{
                "--r": "clamp(28px, 4.5vw, 62px)",
                WebkitMask:
                  "radial-gradient(circle at 50% 100%, #000 calc(var(--r) - 0.5px), transparent var(--r)) 0 0 / calc(var(--r) * 2) 100% repeat-x",
                mask: "radial-gradient(circle at 50% 100%, #000 calc(var(--r) - 0.5px), transparent var(--r)) 0 0 / calc(var(--r) * 2) 100% repeat-x",
              }}
            />
            <Categories />
          </div>
        </div>
        <SubMenu />
        <Hours />
        <LocationIntro />
        <Testimonials/>
        <Bulksection/>
      </main>
    </>
  );
}
