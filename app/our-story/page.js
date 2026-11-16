import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTestimonials from "../components/PageTestimonials";

export const metadata = { title: "Our Story | Mina Cafe" };

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-ivory text-cocoa">
      <Navbar />
      <main className="mx-auto w-full max-w-[1300px] px-6 py-18 md:px-12 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-(family-name:--font-cormorant) text-5xl font-light md:text-7xl">
              Our story
            </h1>
            <h2 className="mt-10 max-w-[650px] font-(family-name:--font-cormorant) text-4xl font-light md:text-5xl">
              From my hands to your heart.
            </h2>
            <p className="mt-6 max-w-[600px] text-base leading-[1.7] md:text-lg">
              From our little corner of North Nazimabad, every bottle, cup and
              bowl is prepared by hand. Come say hello and find your little
              favourite.
            </p>
          </div>
          <div className="h-[50vh] w-full overflow-hidden rounded-lg">
            <video
              className="h-full w-full object-cover"
              src="/day99.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>
      </main>
      <PageTestimonials />
      <Footer />
    </div>
  );
}
