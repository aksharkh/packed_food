import Link from "next/link";
import { SITE } from "@/lib/config";

export function Footer() {
  return (
    <footer className="relative mt-28 overflow-hidden bg-ink pb-28 pt-16 text-white sm:pb-12">
      <p className="display outline-only pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[24vw] leading-none text-white/10" aria-hidden>
        {SITE.name}
      </p>
      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="display text-5xl">{SITE.name}<span className="text-haldi">!</span></p>
          <p className="mt-3 max-w-xs text-sm text-white/60">{SITE.tagline} Desi snacks with full-on masala — made in India with real ingredients and zero palm oil.</p>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-extrabold text-ink">
            💬 WhatsApp us
          </a>
        </div>
        {[
          ["Shop", [["All flavours", "/shop"], ["Combos", "/shop#combos"], ["Build a box", "/box"], ["Subscribe", "/subscribe"]]],
          ["Help", [["Track order", "/order"], ["Bulk & gifting", "/bulk"], [SITE.email, `mailto:${SITE.email}`], [SITE.phone, `tel:${SITE.phone.replace(/\s/g, "")}`]]],
        ].map(([title, links]) => (
          <div key={title as string} className="space-y-2.5 text-sm">
            <p className="text-xs font-extrabold uppercase tracking-[.25em] text-white/40">{title as string}</p>
            {(links as string[][]).map(([label, href]) => (
              <p key={label}><Link href={href} className="text-white/75 transition hover:text-haldi">{label}</Link></p>
            ))}
          </div>
        ))}
        <div className="space-y-2.5 text-sm">
          <p className="text-xs font-extrabold uppercase tracking-[.25em] text-white/40">Factory</p>
          <p className="text-white/75">{SITE.address}</p>
          <p className="text-white/40">{SITE.fssai}</p>
          <p><Link href="/admin" className="text-white/40 hover:text-haldi">Admin</Link></p>
        </div>
      </div>
      <p className="relative mt-12 text-center text-xs text-white/40">© {SITE.full} · Made with 🌶️ in India</p>
    </footer>
  );
}
