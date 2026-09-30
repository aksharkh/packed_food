"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/config";
import { useCart } from "./CartContext";
import { Marquee } from "./Decor";

const LINKS = [
  { href: "/shop", label: "Shop", emoji: "🛍️" },
  { href: "/box", label: "Build a Box", emoji: "📦" },
  { href: "/subscribe", label: "Subscribe", emoji: "🔁" },
  { href: "/bulk", label: "Bulk & Gifting", emoji: "🎁" },
  { href: "/#made", label: "How it's made", emoji: "🏭" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-1 ${className}`} aria-label={SITE.full}>
      <span className="display stroke-ink text-3xl text-pink transition-transform group-hover:-rotate-6 group-hover:scale-110 sm:text-4xl" style={{ WebkitTextStrokeWidth: "1.5px" }}>
        {SITE.name}!
      </span>
      <span className="text-2xl transition-transform group-hover:rotate-12 group-hover:scale-125">💥</span>
    </Link>
  );
}

export function Ticker() {
  return (
    <Marquee
      className="bg-ink py-2 text-sm font-extrabold uppercase tracking-wide text-lime"
      items={[
        `🚚 Free delivery above ₹${SITE.freeShippingAbove}`,
        "🪔 Diwali gift boxes are LIVE",
        "🌶️ New: Peri Peri Pataka",
        "📦 Build your own box — up to 15% off",
        "🥔 No palm oil. Ever.",
      ]}
      separator="✦"
      speed={35}
    />
  );
}

export function Nav() {
  const { count, setOpen, bump } = useCart();
  const [menu, setMenu] = useState(false);
  const path = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile menu on navigation
  useEffect(() => setMenu(false), [path]);

  return (
    <>
      <Ticker />
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
        <nav className="brutal mx-auto flex max-w-6xl items-center justify-between rounded-full bg-white py-2 pl-5 pr-2">
          <Logo />
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-full px-3 py-2 text-[15px] font-extrabold transition hover:-rotate-2 hover:bg-haldi ${path === l.href ? "bg-haldi" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <button
              key={bump}
              onClick={() => setOpen(true)}
              className={`btn-pop flex items-center gap-2 rounded-full bg-pink px-4 py-2 font-extrabold text-white ${bump ? "animate-shake" : ""}`}
            >
              <span className="text-lg">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-white px-1 text-sm text-ink">{count}</span>
            </button>
            <button
              onClick={() => setMenu((m) => !m)}
              className="btn-pop grid h-11 w-11 place-items-center rounded-full bg-haldi text-xl lg:hidden"
              aria-label="Menu"
              aria-expanded={menu}
            >
              {menu ? "✕" : "☰"}
            </button>
          </div>
        </nav>
        {menu && (
          <div className="brutal animate-pop-in mx-auto mt-2 max-w-6xl rounded-3xl bg-white p-3 lg:hidden">
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-lg font-extrabold hover:bg-haldi"
                style={{ transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}
              >
                <span className="text-2xl">{l.emoji}</span> {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
