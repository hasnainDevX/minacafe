import { pageMetadata } from "../lib/seo";
import Navbar from "../components/Navbar";
import LocationIntro from "../components/LocationIntro";
import Footer from "../components/Footer";
import PageTestimonials from "../components/PageTestimonials";
import FAQ from "../components/FAQ";

export const metadata = pageMetadata("Find Us | Mina Café North Nazimabad", "Find Mina Café near Allied Bank and SPAR in Block F, North Nazimabad, Karachi. View our location, opening hours and contact details.", "/find-us");

export default function FindUsPage() {
  return (
    <div className="min-h-screen bg-ivory text-cocoa">
      <Navbar />
      <main>
        <h1 className="sr-only">Find us</h1>
        <LocationIntro />
      </main>
      <PageTestimonials />
      <FAQ/>
      <Footer/>
    </div>
  );
}
