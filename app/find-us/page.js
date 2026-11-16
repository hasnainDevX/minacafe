import Navbar from "../components/Navbar";
import LocationIntro from "../components/LocationIntro";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";

export const metadata = { title: "Find Us | Mina Cafe" };

export default function FindUsPage() {
  return (
    <div className="min-h-screen bg-ivory text-cocoa">
      <Navbar />
      <main>
        <h1 className="sr-only">Find us</h1>
        <LocationIntro />
      </main>
      <FAQ/>
      <Footer/>
    </div>
  );
}
