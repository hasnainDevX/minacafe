import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTestimonials from "../components/PageTestimonials";

export const metadata = { title: "Our Story | Mina Cafe" };

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-ivory text-cocoa">
      <Navbar />
      <main className="mx-auto w-full max-w-[1300px] px-6 py-18 md:px-12 md:py-24 lg:py-32">
        <h1 className="font-(family-name:--font-cormorant) text-5xl font-light md:text-7xl">Our story</h1>
        <h2 className="mt-10 max-w-[650px] font-(family-name:--font-cormorant) text-4xl font-light md:text-5xl">From my hands to your heart.</h2>
        <p className="mt-6 max-w-[600px] text-base leading-[1.7] md:text-lg">From our little corner of North Nazimabad, every bottle, cup and bowl is prepared by hand. Come say hello and find your little favourite.</p>
      </main>
      <PageTestimonials />
      <Footer/>
    </div>
  );
}
