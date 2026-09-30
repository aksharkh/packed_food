"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/config";
import { useCart } from "./CartContext";

const LINKS = [
  { href: "/shop", label: "Flavours" },
  { href: "/box", label: "Build a Box" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/bulk", label: "Bulk & Gifting" },
  { href: "/#made", label: "Our Story" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`display text-3xl tracking-wide text-white ${className}`} aria-label={SITE.full}>
      {SITE.name}
      <span className="text-haldi">!</span>
    </Link>
  );
}

/** Floating dark glass nav — sits on top of the full-bleed flavour sections. */
export function Nav() {
  const { count, setOpen, bump } = useCart();
  const [menu, setMenu] = useState(false);
  const path = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile menu on navigation
  useEffect(() => setMenu(false), [path]);

  return (
    <header className="sticky top-0 z-40 h-[76px] px-3 pt-3 sm:px-5">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full bg-ink/85 pl-6 pr-2 text-white shadow-[0_16px_40px_-18px_rgba(0,0,0,.7)] backdrop-blur-md">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider transition hover:bg-white/10 ${path === l.href ? "text-haldi" : "text-white/80"}`}
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
            className={`flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-ink transition hover:bg-haldi ${bump ? "animate-shake" : ""}`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 7h12l1 13H5L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-pink px-1 text-xs text-white">{count}</span>
          </button>
          <button onClick={() => setMenu((m) => !m)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-lg lg:hidden" aria-label="Menu" aria-expanded={menu}>
            {menu ? "✕" : "☰"}
          </button>
        </div>
      </nav>
      {menu && (
        <div className="animate-pop-in mx-auto mt-2 max-w-6xl rounded-3xl bg-ink/95 p-3 text-white backdrop-blur-md lg:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="display block rounded-2xl px-4 py-3 text-2xl hover:bg-white/10">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
