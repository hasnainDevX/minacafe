import localFont from "next/font/local";
import "./globals.css";
import StorefrontProvider from "./components/StorefrontProvider";
import SiteExperience from "./components/SiteExperience";

const sourceSans = localFont({
  src: [
    {
      path: "./fonts/source-sans-pro/SourceSansPro-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/source-sans-pro/SourceSansPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/source-sans-pro/SourceSansPro-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata = {
  title: "Mina Cafe",
  description: "From my hands to your heart.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sourceSans.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <StorefrontProvider><SiteExperience>{children}</SiteExperience></StorefrontProvider>
      </body>
    </html>
  );
}
