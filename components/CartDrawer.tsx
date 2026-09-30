"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SITE, rupees } from "@/lib/config";
import { findProduct } from "@/lib/products";
import { useCart } from "./CartContext";
import { Pack } from "./Pack";

export function LineThumb({ packs, emoji, color }: { packs: { slug: string }[]; emoji?: string; color: string }) {
  if (packs.length === 1 || (packs.length > 0 && !emoji)) {
    return <PackThumb slug={packs[0].slug} />;
  }
  return (
    <div className="brutal-sm relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl" style={{ background: color }}>
      {emoji}
      {packs.length > 0 && (
        <span className="absolute -bottom-2 -right-2 rounded-full border-2 border-ink bg-white px-1.5 text-xs font-extrabold">×{packs.length}</span>
      )}
    </div>
  );
}

function PackThumb({ slug }: { slug: string }) {
  const p = findProduct(slug);
  return p ? <Pack product={p} className="h-16 w-14 shrink-0" /> : null;
}

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, shipping, total, count, setQty, hasSub } = useCart();
  const path = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (path.startsWith("/admin")) return null;
  const toFree = SITE.freeShippingAbove - subtotal;

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-[3px] border-ink bg-cream transition-transform duration-500 ease-[cubic-bezier(.3,1.3,.5,1)] ${
          open ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        <div className="halftone flex items-center justify-between border-b-[3px] border-ink bg-haldi p-5">
          <div>
            <p className="font-hand text-lg">tera jhola 🛍️</p>
            <h2 className="display text-4xl">Your Cart</h2>
          </div>
          <button onClick={() => setOpen(false)} className="btn-pop grid h-11 w-11 place-items-center rounded-full bg-white text-xl" aria-label="Close cart">
            ✕
          </button>
        </div>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="animate-jiggle text-7xl">😢</div>
            <p className="display text-3xl">Itna khaali?</p>
            <p className="text-ink/70">Your cart is sad and empty. Let&apos;s fill it with crunch!</p>
            <Link href="/shop" onClick={() => setOpen(false)} className="btn-pop mt-2 rounded-full bg-pink px-6 py-3 font-extrabold text-white">
              Go snack shopping →
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto p-5">
              {lines.map((l) => (
                <li key={l.key} className="brutal-sm flex items-center gap-3 rounded-2xl bg-white p-3">
                  <LineThumb packs={l.info.packs} emoji={l.info.emoji} color={l.info.color} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold leading-tight">{l.info.title}</p>
                    <p className="truncate text-xs text-ink/60">{l.info.subtitle}</p>
                    <p className="text-sm font-bold">
                      {rupees(l.info.unit * l.qty)}
                      {l.info.recurring && <span className="text-xs font-semibold text-ink/60"> / {l.info.recurring}</span>}
                    </p>
                  </div>
                  {l.type === "sub" ? (
                    <button onClick={() => setQty(l.key, 0)} className="text-sm font-bold text-ink/50 underline">Remove</button>
                  ) : (
                    <div className="flex items-center overflow-hidden rounded-full border-2 border-ink font-extrabold">
                      <button onClick={() => setQty(l.key, l.qty - 1)} className="px-2.5 py-1 hover:bg-haldi" aria-label="Less">−</button>
                      <span key={l.qty} className="animate-pop-in w-6 text-center">{l.qty}</span>
                      <button onClick={() => setQty(l.key, l.qty + 1)} className="px-2.5 py-1 hover:bg-haldi" aria-label="More">+</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t-[3px] border-ink bg-white p-5">
              {!hasSub &&
                (toFree > 0 ? (
                  <div className="rounded-xl bg-lime/40 px-3 py-2 text-sm font-bold">
                    Bas {rupees(toFree)} aur — FREE delivery unlock! 🚚
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full border-2 border-ink bg-white">
                      <div className="h-full bg-pink transition-all" style={{ width: `${(subtotal / SITE.freeShippingAbove) * 100}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-lime px-3 py-2 text-sm font-extrabold">🎉 Free delivery unlocked!</div>
                ))}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{rupees(subtotal)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{shipping ? rupees(shipping) : "FREE"}</span></div>
                <div className="display flex justify-between pt-1 text-2xl"><span>Total</span><span>{rupees(total)}</span></div>
              </div>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="btn-pop display flex w-full items-center justify-between rounded-full bg-pink px-6 py-4 text-xl text-white"
              >
                <span>Checkout</span>
                <span>→</span>
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function MobileCartBar() {
  const { count, total, setOpen, bump } = useCart();
  if (!count) return null;
  return (
    <button
      key={bump}
      onClick={() => setOpen(true)}
      className="brutal animate-pop-in fixed bottom-3 left-28 right-3 z-30 flex items-center justify-between rounded-full bg-ink py-2.5 pl-5 pr-2 text-white sm:hidden"
    >
      <span className="text-left leading-tight">
        <span className="block text-xs text-lime">{count} in cart</span>
        <span className="font-extrabold">{rupees(total)}</span>
      </span>
      <span className="rounded-full bg-pink px-4 py-2 font-extrabold">View →</span>
    </button>
  );
}
