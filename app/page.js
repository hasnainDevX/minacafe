import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LocationIntro from "./components/LocationIntro";
import Categories from "./components/Categories";
import SubMenu from "./components/SubMenu";
import Hours from "./components/Hours";

export default function Home() {
  return (
    <>
      <main className="mina-home">
        <div className="relative">
          <Hero />
          <LocationIntro />
        </div>
        <Categories />
        <SubMenu />
        <Hours/>
      </main>
    </>
  );
}
