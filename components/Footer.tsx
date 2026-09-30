import Link from "next/link";
import { SITE } from "@/lib/config";
import { Bunting } from "./Decor";

export function Footer() {
  return (
    <footer className="relative mt-28 border-t-[3px] border-ink bg-ink pb-28 text-cream sm:pb-12">
      <div className="absolute inset-x-0 -top-1">
        <Bunting count={22} />
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-20 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="display stroke-ink text-5xl text-pink">{SITE.name}!</p>
          <p className="font-hand mt-2 text-xl text-haldi">{SITE.tagline}</p>
          <p className="mt-3 max-w-xs text-sm text-cream/70">Desi snacks with full-on masala. Made in India, with real ingredients and zero palm oil.</p>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border-[3px] border-cream bg-[#25d366] px-5 py-2.5 font-extrabold text-ink"
          >
            💬 WhatsApp us
          </a>
        </div>
        <div className="space-y-2 text-sm">
          <p className="display text-lg text-lime">Shop</p>
          <p><Link href="/shop" className="hover:text-haldi">All snacks</Link></p>
          <p><Link href="/shop#combos" className="hover:text-haldi">Combos</Link></p>
          <p><Link href="/box" className="hover:text-haldi">Build a box</Link></p>
          <p><Link href="/subscribe" className="hover:text-haldi">Subscribe</Link></p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="display text-lg text-lime">Help</p>
          <p><Link href="/order" className="hover:text-haldi">Track order</Link></p>
          <p><Link href="/bulk" className="hover:text-haldi">Bulk & gifting</Link></p>
          <p><a href={`mailto:${SITE.email}`} className="hover:text-haldi">{SITE.email}</a></p>
          <p><a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-haldi">{SITE.phone}</a></p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="display text-lg text-lime">Factory</p>
          <p className="text-cream/70">{SITE.address}</p>
          <p className="text-cream/50">{SITE.fssai}</p>
          <p><Link href="/admin" className="text-cream/40 hover:text-haldi">Admin</Link></p>
        </div>
      </div>
      <p className="display outline-only mt-12 select-none text-center text-[22vw] leading-none text-pink/60 md:text-[16vw]" aria-hidden>
        {SITE.name}!
      </p>
      <p className="mt-2 text-center text-xs text-cream/50">Made with 🌶️ & ❤️ in India</p>
    </footer>
  );
}
