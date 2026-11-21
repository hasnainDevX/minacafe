"use client";
import { useStorefront } from "./StorefrontProvider";
import Link from "next/link";

export default function Announcement() {
  const { home } = useStorefront();
  return (
    <aside aria-label="Announcement" className="relative z-10 w-full bg-butter text-black">
      <Link href="/menu" className="flex min-h-9 items-center justify-center px-4 py-2 text-center text-[11px] uppercase leading-5 tracking-[0.1em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ivory md:text-[13px]">
        {home.announcement || "365 days of Mina — from stall to café."}
      </Link>
    </aside>
  );
}
