"use client";

import Link from "next/link";
import { useState } from "react";
import { rupees } from "@/lib/config";
import { PRODUCTS, findProduct } from "@/lib/products";
import { MobileCartBar } from "./CartDrawer";
import { Reveal, Spice, VegMark } from "./Decor";
import { Footer } from "./Footer";
import { STEPS } from "./Home";
import { Nav } from "./Nav";
import { Pack } from "./Pack";
import { AddButton, ProductCard } from "./ProductCard";

const TABS = [
  { id: "inside", label: "Andar kya hai", emoji: "🔍" },
  { id: "made", label: "Kaise bana", emoji: "🏭" },
  { id: "packed", label: "Kaise pack hua", emoji: "📦" },
  { id: "nutrition", label: "Nutrition", emoji: "💪" },
] as const;

export function ProductView({ slug }: { slug: string }) {
  const p = findProduct(slug)!;
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("inside");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [poked, setPoked] = useState(0);
  const others = PRODUCTS.filter((q) => q.slug !== p.slug).slice(0, 3);
  const maxN = { energy: 200, protein: 10, carbs: 25, fat: 15 };

  return (
    <>
      <Nav />
      <main>
        <section
          className="relative -mt-[76px] overflow-hidden pb-14 pt-32 text-white"
          style={{ background: `radial-gradient(90% 90% at 30% 40%, ${p.bg} 0%, ${p.color} 50%, #1a0b2e 140%)` }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setTilt({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 });
          }}
        >
          <div className="halftone absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 md:grid-cols-2">
            <div className="relative grid place-items-center" style={{ perspective: 900 }}>
              <div className="sunburst animate-spin-slow absolute h-[520px] w-[520px]" />
              <p className="display outline-only pointer-events-none absolute text-[120px] text-white/70 sm:text-[160px]" aria-hidden>
                {p.packLine[1]}
              </p>
              <button
                onClick={() => setPoked((n) => n + 1)}
                className="relative transition-transform duration-200"
                style={{ transform: `rotateY(${tilt.x * 22}deg) rotateX(${-tilt.y * 14}deg)` }}
                aria-label="Poke the pack"
              >
                <div key={poked} className={poked ? "animate-boing" : "animate-drop-in"}>
                  <Pack product={p} look={tilt} mood={poked % 3 === 1 ? "shocked" : poked % 3 === 2 ? "wink" : undefined} className="h-80 w-auto drop-shadow-[10px_14px_0_rgba(26,11,46,.25)] sm:h-[420px]" />
                </div>
              </button>
                            
            </div>

            <div className="relative">
              <Link href="/shop" className="text-sm font-extrabold underline">← All snacks</Link>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <VegMark />
                {p.tags.map((t) => (
                  <span key={t} className="brutal-sm rounded-full bg-white px-3 py-0.5 text-xs font-extrabold uppercase">{t}</span>
                ))}
              </div>
              <h1 className="display stroke-ink pop-shadow mt-3 text-5xl text-white sm:text-7xl">{p.name}</h1>
              <p className="font-hand mt-3 text-2xl font-bold">{p.tagline}</p>
              <p className="mt-3 text-lg font-semibold">{p.desc}</p>
              <p className="mt-3 flex items-center gap-2 font-bold">Teekhapan: <Spice level={p.spice} /></p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="display text-5xl">{rupees(p.price)}</span>
                <AddButton product={p} light className="px-7 py-3 text-lg" />
              </div>
              <p className="mt-4 text-sm font-bold">☕ Best with: {p.pairs}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 pt-14">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 sm:justify-center">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`brutal-sm shrink-0 rounded-full px-4 py-2 font-extrabold transition ${tab === t.id ? "-rotate-2 bg-ink text-white" : "bg-white hover:bg-haldi"}`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          <div key={tab} className="brutal animate-pop-in mt-6 rounded-[28px] bg-white p-6 sm:p-8">
            {tab === "inside" && (
              <>
                <h2 className="display text-3xl">Sirf {p.ingredients.length} cheezein. Bas.</h2>
                <p className="mt-1 text-ink/70">No MSG, no artificial colours, no palm oil. Names you can actually pronounce.</p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {p.ingredients.map((ing, i) => (
                    <div key={ing.name} className="brutal-sm animate-pop-in rounded-2xl p-4 text-center" style={{ background: [p.bg, "#fff6e5"][i % 2], animationDelay: `${i * 80}ms` }}>
                      <div className="text-5xl">{ing.emoji}</div>
                      <p className="mt-2 font-extrabold">{ing.name}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
            {tab === "made" && (
              <ol className="space-y-4">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="brutal-sm grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl" style={{ background: s.bg }}>{s.emoji}</span>
                    <div>
                      <p className="display text-xl">{i + 1}. {s.title}</p>
                      <p className="text-ink/75">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            {tab === "packed" && (
              <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="relative mx-auto">
                  <Pack product={p} mood="cool" className="h-56 w-auto" />
                  <span className="brutal-sm absolute -right-10 top-4 rotate-6 rounded-2xl bg-sky px-3 py-2 text-sm font-extrabold">N₂ inside! 🎈</span>
                </div>
                <ul className="space-y-3">
                  {[
                    ["🎈", "Nitrogen flushed", "The 'air' in the pack is nitrogen — it cushions the chips and stops them going stale. No preservatives needed."],
                    ["🛡️", "Triple-layer foil", "Food-grade, light-proof layers keep the masala fresh and the crunch intact."],
                    ["🧼", "Untouched by hand", "Weighing, filling & sealing happen on automatic machines in our FSSAI-licensed unit."],
                    ["♻️", "Recyclable shipper", "Packs ship in recyclable cartons with paper tape. No plastic bubble wrap."],
                    ["📅", "Best before 4 months", "Printed on the back. Once opened, clip it and finish within 2 days (as if it'll last that long)."],
                  ].map(([e, t, d]) => (
                    <li key={t} className="flex gap-3">
                      <span className="text-3xl">{e}</span>
                      <span>
                        <span className="display block text-lg">{t}</span>
                        <span className="text-ink/75">{d}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "nutrition" && (
              <>
                <h2 className="display text-3xl">Per 30g serving</h2>
                <div className="mt-5 space-y-4">
                  {(Object.keys(maxN) as (keyof typeof maxN)[]).map((k) => (
                    <div key={k}>
                      <div className="flex justify-between font-extrabold capitalize">
                        <span>{k}</span>
                        <span>{p.nutrition[k]}{k === "energy" ? " kcal" : "g"}</span>
                      </div>
                      <div className="mt-1 h-5 overflow-hidden rounded-full border-2 border-ink bg-cream">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(p.nutrition[k] / maxN[k]) * 100}%`, background: p.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-ink/60">100% vegetarian. Made in a facility that also handles peanuts & dairy.</p>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pt-20">
          <Reveal className="text-center">
            <h2 className="display text-4xl sm:text-6xl">Isko bhi try karo 👀</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-7 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {others.map((q, i) => (
              <ProductCard key={q.slug} product={q} i={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileCartBar />
    </>
  );
}
