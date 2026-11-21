"use client";
import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import Announcement from "./Announcement";
import CartProvider from "./cart/CartProvider";
import WelcomeExperience from "./WelcomeExperience";
import ContentReveals from "./ContentReveals";
export default function SiteExperience({ children }) {
  const path = usePathname();
  if (path.startsWith("/dashboard")) return children;
  return <CartProvider><SmoothScroll><Announcement />{children}</SmoothScroll><WelcomeExperience /><ContentReveals /></CartProvider>;
}
