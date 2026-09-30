"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { rupees } from "@/lib/config";
import { CATEGORY_FILTERS, COMBOS, PRODUCTS, findProduct, type Combo } from "@/lib/products";
import { useAddFrom } from "./CartContext";
import { Burst, Marquee, Reveal, Spice, Squiggle } from "./Decor";
import { Pack } from "./Pack";
import { AddButton, ProductCard } from "./ProductCard";

/* ─────────────────────────────── HERO ─────────────────────────────── */

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [auto, setAuto] = useState(true);
  const p = PRODUCTS[idx];

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % PRODUCTS.length), 4500);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <section
      className="relative -mt-[76px] overflow-hidden pb-10 pt-28 transition-colors duration-700"
      style={{ background: p.bg }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="halftone pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-4 px-5 lg:grid-cols-[1fr_1.1fr]">
        {/* copy */}
        <div className="relative z-10 text-center lg:text-left">
          <p className="brutal-sm inline-block -rotate-3 rounded-full bg-white px-4 py-1 text-sm font-extrabold uppercase">🪔 100% desi · 0% palm oil</p>
          <h1 className="display mt-4 text-[13vw] sm:text-8xl lg:text-[112px]">
            <span className="stroke-ink pop-shadow block text-white">
              Bhook <br className="hidden sm:block" />
              lagi?
            </span>
            <span className="stroke-ink pop-shadow inline-block -rotate-3 text-haldi sm:block">Crunch</span>{" "}
            <span className="stroke-ink pop-shadow inline-block rotate-2 text-pink sm:block">karo!</span>
          </h1>
          <p className="mx-auto mt-5 hidden max-w-md text-lg font-semibold sm:block lg:mx-0">
            Chips, namkeen & healthy munchies with <b>full-on desi masala</b>. Kettle-cooked, nitrogen-packed, and delivered across India.
          </p>
          <div className="mt-6 hidden flex-wrap items-center justify-center gap-3 sm:flex lg:justify-start">
            <Link href="/shop" className="btn-pop display rounded-full bg-ink px-7 py-4 text-xl text-white">
              Shop snacks →
            </Link>
            <Link href="/box" className="btn-pop display rounded-full bg-white px-6 py-4 text-xl">
              Build a box 📦
            </Link>
          </div>
        </div>

        {/* pack stage */}
        <div className="relative mx-auto grid aspect-square w-full max-w-[520px] place-items-center" style={{ perspective: 900 }}>
          <div className="sunburst animate-spin-slow absolute inset-[-20%]" />
          <p
            key={`w-${p.slug}`}
            className="display outline-only animate-pop-in pointer-events-none absolute text-[26vw] text-white/70 sm:text-[170px]"
            aria-hidden
          >
            {p.packLine[0].split(" ")[0]}
          </p>

          {p.ingredients.map((ing, i) => (
            <span
              key={`${p.slug}-${ing.name}`}
              className="animate-orbit pointer-events-none absolute left-1/2 top-1/2 -ml-6 -mt-6 grid h-12 w-12 place-items-center text-4xl sm:h-14 sm:w-14 sm:text-5xl"
              style={
                {
                  "--orbit": "min(40vw, 215px)",
                  "--dur": "16s",
                  animationDelay: `${(-16 / p.ingredients.length) * i}s`,
                } as React.CSSProperties
              }
            >
              <span className="drop-shadow-[2px_3px_0_rgba(26,11,46,.35)]">{ing.emoji}</span>
            </span>
          ))}

          <Link
            href={`/product/${p.slug}`}
            className="relative block transition-transform duration-200 ease-out"
            style={{ transform: `rotateY(${tilt.x * 20}deg) rotateX(${-tilt.y * 14}deg)` }}
            aria-label={p.name}
          >
            <div key={p.slug} className="animate-drop-in">
              <Pack product={p} look={tilt} className="h-[62vw] max-h-[380px] w-auto drop-shadow-[10px_14px_0_rgba(26,11,46,.25)] sm:h-[380px]" />
            </div>
          </Link>

          <Burst color="#fff" spin className="absolute right-0 top-4 h-24 w-24 sm:right-4 sm:h-28 sm:w-28">
            <span className="block text-xs">sirf</span>
            <span className="block text-2xl">{rupees(p.price)}</span>
          </Burst>
          <div className="absolute bottom-6 left-0 hidden -rotate-6 sm:block">
            <p className="font-hand text-xl font-bold">{p.name}</p>
            <Spice level={p.spice} />
          </div>
        </div>
      </div>

      {/* flavour switcher */}
      <div className="relative mx-auto mt-4 max-w-6xl px-3">
        <p className="font-hand mb-1 text-center text-lg font-bold">apna flavour chuno 👇</p>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-2 pb-4 pt-3 sm:justify-center">
          {PRODUCTS.map((q, i) => (
            <button
              key={q.slug}
              onClick={() => {
                setIdx(i);
                setAuto(false);
              }}
              className={`shrink-0 rounded-2xl p-1 transition ${i === idx ? "brutal-sm -translate-y-2 scale-110 bg-white" : "opacity-80 hover:-translate-y-1 hover:opacity-100"}`}
              aria-label={q.name}
            >
              <Pack product={q} className="h-16 w-12" showFace={i === idx} />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3">
          <AddButton product={p} className="text-lg" />
          <Link href="/shop" className="btn-pop rounded-full bg-ink px-5 py-2 font-extrabold text-white sm:hidden">
            All snacks →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── MARQUEES ──────────────────────────── */

export function Marquees() {
  return (
    <div className="relative z-10 -my-2 py-6">
      <Marquee
        className="brutal -rotate-2 bg-pink py-3 text-white"
        items={["No palm oil", "Asli masala", "Kettle cooked", "Made in India", "100% veg", "Nitrogen packed"].map((t) => (
          <span key={t} className="display text-3xl sm:text-4xl">{t}</span>
        ))}
        separator={<span className="text-3xl">🌶️</span>}
        speed={30}
      />
      <Marquee
        className="brutal mt-[-6px] rotate-1 bg-lime py-3"
        items={["Kurkura", "Chatpata", "Dhamakedar", "Masaledaar", "Crunch karo", "Ek aur!"].map((t) => (
          <span key={t} className="display text-3xl sm:text-4xl">{t}</span>
        ))}
        separator={<span className="text-3xl">💥</span>}
        speed={36}
        reverse
      />
    </div>
  );
}

/* ──────────────────────────── FLAVOURS ──────────────────────────── */

export function useFiltered(filter: string) {
  return PRODUCTS.filter((p) => filter === "all" || (filter === "spicy" ? p.spice >= 3 : p.category === filter));
}

export function FilterPills({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-1 pb-2 sm:justify-center">
      {CATEGORY_FILTERS.map((f) => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`brutal-sm shrink-0 rounded-full px-4 py-2 font-extrabold transition ${value === f.id ? "-rotate-2 bg-ink text-white" : "bg-white hover:bg-haldi"}`}
        >
          {f.emoji} {f.label}
        </button>
      ))}
    </div>
  );
}

export function Flavours() {
  const [filter, setFilter] = useState("all");
  const list = useFiltered(filter);
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16">
      <Reveal className="text-center">
        <p className="font-hand text-2xl font-bold text-pink">mood kya hai aaj?</p>
        <h2 className="display mt-1 text-5xl sm:text-7xl">
          Pick your <span className="stroke-ink text-haldi">flavour</span>
        </h2>
        <Squiggle className="mx-auto mt-2 h-4 w-40 text-pink" />
      </Reveal>
      <div className="mt-6">
        <FilterPills value={filter} onChange={setFilter} />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-7 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 80}>
            <ProductCard product={p} i={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── ANDAR KYA HAI ───────────────────────── */

export function Inside() {
  const [slug, setSlug] = useState(PRODUCTS[0].slug);
  const [open, setOpen] = useState(false);
  const p = findProduct(slug)!;
  const n = p.ingredients.length;

  return (
    <section className="relative mt-24 overflow-hidden border-y-[3px] border-ink bg-grape py-16 text-white">
      <div className="halftone absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="text-center">
          <p className="font-hand text-2xl font-bold text-haldi">no secrets, no chemicals</p>
          <h2 className="display stroke-ink mt-1 text-5xl text-white sm:text-7xl">Andar kya hai?</h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">Tap the pack to open it up and see exactly what goes in. Short list, real names.</p>
        </Reveal>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2 sm:justify-center">
          {PRODUCTS.map((q) => (
            <button
              key={q.slug}
              onClick={() => {
                setSlug(q.slug);
                setOpen(false);
              }}
              className={`brutal-sm shrink-0 rounded-full px-3 py-1.5 text-sm font-extrabold ${q.slug === slug ? "bg-haldi text-ink" : "bg-white/90 text-ink"}`}
            >
              {q.packLine.join(" ")}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mt-6 grid h-[440px] max-w-xl place-items-center sm:h-[500px]">
          {p.ingredients.map((ing, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            return (
              <div
                key={`${slug}-${ing.name}`}
                className="brutal-sm absolute flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-ink transition-all duration-700 ease-[cubic-bezier(.3,1.5,.5,1)]"
                style={{
                  left: `calc(50% + ${open ? Math.cos(a) * 36 : 0}%)`,
                  top: `calc(50% + ${open ? Math.sin(a) * 42 : 0}%)`,
                  transform: `translate(-50%, -50%) rotate(${open ? (i % 2 ? 6 : -6) : 0}deg) scale(${open ? 1 : 0.2})`,
                  opacity: open ? 1 : 0,
                  transitionDelay: `${i * 70}ms`,
                  zIndex: 20,
                }}
              >
                <span className="text-3xl">{ing.emoji}</span>
                <span className="whitespace-nowrap text-sm font-extrabold">{ing.name}</span>
              </div>
            );
          })}
          <button
            onClick={() => setOpen((o) => !o)}
            className={`relative z-10 transition-transform duration-500 ${open ? "scale-75" : "animate-jiggle hover:scale-105"}`}
            aria-label={open ? "Close pack" : "Open pack"}
          >
            <Pack product={p} mood={open ? "shocked" : p.mood} className="h-64 w-auto drop-shadow-[8px_10px_0_rgba(0,0,0,.3)] sm:h-72" />
            <span className="brutal-sm display absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-haldi px-4 py-1.5 text-lg text-ink">
              {open ? "Band karo" : "Kholo! 👆"}
            </span>
          </button>
        </div>
        <p className="text-center text-sm text-white/70">
          Per 30g: {p.nutrition.energy} kcal · {p.nutrition.protein}g protein · {p.nutrition.fat}g fat ·{" "}
          <Link href={`/product/${p.slug}`} className="font-bold text-haldi underline">full details →</Link>
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── HOW IT'S MADE ───────────────────────── */

export const STEPS = [
  { emoji: "🌾", title: "Farm se seedha", text: "Potatoes, bananas & millets bought directly from farmer groups in Punjab, Gujarat & Kerala.", bg: "#B8F34A" },
  { emoji: "🔪", title: "Wash & slice", text: "Washed thrice, peeled, and sliced 1.4mm thin — the perfect crunch thickness.", bg: "#4CC9F0" },
  { emoji: "🔥", title: "Kettle cooked", text: "Small batches in rice-bran oil (coconut oil for Kerala kela). Zero palm oil. Ever.", bg: "#FF7A00" },
  { emoji: "🥁", title: "Masala tumble", text: "Hand-ground masala, tossed in a big drum that spins like a dhol at a baraat.", bg: "#FFD23F" },
  { emoji: "😋", title: "Taste test", text: "Every batch is tasted by our team. Tough job, but someone has to do it.", bg: "#FF3D7F" },
  { emoji: "🎈", title: "Nitrogen packed", text: "We fill packs with nitrogen, not air — it keeps chips crunchy with no preservatives. (That's the 'air' in the pack!)", bg: "#B794FF" },
  { emoji: "🚚", title: "Seedha aapke ghar", text: "Shipped within 48 hours of packing, sealed in recyclable boxes.", bg: "#19C27A" },
];

export function HowMade() {
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const scrollBy = (dir: number) => track.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section id="made" className="relative pt-24">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4">
        <Reveal>
          <p className="font-hand text-2xl font-bold text-pink">kaise banta hai?</p>
          <h2 className="display text-5xl sm:text-7xl">
            How we make <br />
            <span className="stroke-ink text-masala">the crunch</span>
          </h2>
        </Reveal>
        <div className="flex gap-2">
          <button onClick={() => scrollBy(-1)} className="btn-pop grid h-12 w-12 place-items-center rounded-full bg-white text-xl" aria-label="Previous">←</button>
          <button onClick={() => scrollBy(1)} className="btn-pop grid h-12 w-12 place-items-center rounded-full bg-haldi text-xl" aria-label="Next">→</button>
        </div>
      </div>

      <div
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget;
          setProgress(el.scrollLeft / Math.max(el.scrollWidth - el.clientWidth, 1));
        }}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1rem,calc((100vw-72rem)/2+1rem))] pb-10 pt-4"
      >
        {STEPS.map((s, i) => (
          <figure
            key={s.title}
            className="brutal group relative w-64 shrink-0 snap-center rounded-md bg-white p-3 pb-5 transition hover:!rotate-0 hover:-translate-y-2 sm:w-72"
            style={{ transform: `rotate(${[-3, 2, -1.5, 3, -2, 1.5, -2.5][i]}deg)` }}
          >
            <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-3 bg-haldi/80" aria-hidden />
            <div className="halftone relative grid aspect-square place-items-center overflow-hidden rounded-sm border-2 border-ink" style={{ background: s.bg }}>
              <span className="sunburst animate-spin-slow absolute inset-[-30%]" />
              <span className="relative text-[96px] transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">{s.emoji}</span>
              <span className="display stroke-ink absolute left-2 top-1 text-5xl text-white">0{i + 1}</span>
            </div>
            <figcaption className="mt-3 px-1">
              <p className="display text-2xl">{s.title}</p>
              <p className="font-hand mt-1 text-[15px] leading-snug text-ink/80">{s.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mx-auto h-3 max-w-md overflow-hidden rounded-full border-2 border-ink bg-white">
        <div className="h-full rounded-full bg-pink transition-[width]" style={{ width: `${10 + progress * 90}%` }} />
      </div>
    </section>
  );
}

/* ───────────────────────────── COMBOS ───────────────────────────── */

export function ComboCard({ combo, i = 0 }: { combo: Combo; i?: number }) {
  const addFrom = useAddFrom();
  const packs = combo.items.map((s) => findProduct(s)!);
  const full = packs.reduce((s, p) => s + p.price, 0);
  const unique = [...new Map(packs.map((p) => [p.slug, p])).values()];
  return (
    <article className="brutal group relative overflow-hidden rounded-[28px] bg-white" style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>
      <div className="halftone relative flex h-52 items-end justify-center overflow-hidden border-b-[3px] border-ink pb-2" style={{ background: combo.color }}>
        <span className="sunburst animate-spin-slow absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2" />
        {unique.slice(0, 5).map((p, j, arr) => {
          const mid = (arr.length - 1) / 2;
          return (
            <div
              key={p.slug}
              className="relative -mx-5 transition-transform duration-500 group-hover:-translate-y-3"
              style={{ transform: `rotate(${(j - mid) * 12}deg) translateY(${Math.abs(j - mid) * 12}px)`, zIndex: 10 - Math.abs(j - mid), transitionDelay: `${j * 50}ms` }}
            >
              <Pack product={p} className="h-40 w-auto" showFace={j === Math.round(mid)} />
            </div>
          );
        })}
        <Burst color="#FFD23F" className="absolute right-3 top-3 h-20 w-20 text-lg">
          {Math.round((1 - combo.price / full) * 100)}%<br />off
        </Burst>
        <span className="absolute left-4 top-3 text-4xl">{combo.emoji}</span>
      </div>
      <div className="p-5">
        <h3 className="display text-3xl">{combo.name}</h3>
        <p className="font-hand mt-1 text-ink/75">{combo.tagline}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p>
            <span className="display text-3xl">{rupees(combo.price)}</span>
            <span className="ml-2 text-sm font-bold text-ink/40 line-through">{rupees(full)}</span>
          </p>
          <button onClick={addFrom({ type: "combo", id: combo.id })} className="btn-pop rounded-full bg-pink px-5 py-2.5 font-extrabold text-white">
            Add combo +
          </button>
        </div>
      </div>
    </article>
  );
}

export function Combos() {
  return (
    <section id="combos" className="mx-auto max-w-6xl px-4 pt-24">
      <Reveal className="text-center">
        <p className="font-hand text-2xl font-bold text-pink">zyada packets, kam paise</p>
        <h2 className="display text-5xl sm:text-7xl">
          Combo <span className="stroke-ink text-pink">Dhamaka</span>
        </h2>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {COMBOS.map((c, i) => (
          <Reveal key={c.id} delay={(i % 2) * 100}>
            <ComboCard combo={c} i={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── TRUCK ART BANNER ───────────────────────── */

export function TruckBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24">
      <Reveal>
        <div className="truck-border brutal rounded-[36px] p-3 sm:p-4">
          <div className="relative overflow-hidden rounded-[26px] border-[3px] border-ink bg-ink px-6 py-10 text-center sm:py-14">
            <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 20%, #ff3d7f, transparent 40%), radial-gradient(circle at 80% 80%, #ffd23f, transparent 40%)" }} />
            <div className="absolute left-4 top-4 flex gap-1 sm:left-8 sm:top-8" aria-hidden>
              {["🧿", "🌼", "🧿"].map((e, i) => (
                <span key={i} className="animate-jiggle text-3xl" style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
              ))}
            </div>
            <div className="absolute right-4 top-4 flex gap-1 sm:right-8 sm:top-8" aria-hidden>
              {["🌼", "🧿", "🌼"].map((e, i) => (
                <span key={i} className="animate-jiggle text-3xl" style={{ animationDelay: `${i * 0.3}s` }}>{e}</span>
              ))}
            </div>
            <p className="font-hand text-lg text-lime">— Horn OK Please —</p>
            <h2 className="display mt-2 text-5xl leading-[0.95] text-haldi sm:text-8xl" style={{ textShadow: "4px 4px 0 #ff3d7f, 8px 8px 0 #4cc9f0" }}>
              Snack OK <br />Please!
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg font-semibold text-cream">
              Build your own snack box. Pick any <b className="text-lime">6 or 10 packs</b>, mix & match flavours and get up to <b className="text-pink">15% off</b>.
            </p>
            <Link href="/box" className="btn-pop display mt-7 inline-block rounded-full bg-pink px-8 py-4 text-2xl text-white">
              Build my box 📦
            </Link>
            <p className="font-hand mt-6 text-sm text-cream/60">Buri nazar wale, tera packet khaali 😜</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ──────────────────────── SUBSCRIBE + BULK ──────────────────────── */

export function Duo() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pt-24 md:grid-cols-2">
      <Reveal>
        <Link href="/subscribe" className="brutal group relative block h-full overflow-hidden rounded-[32px] bg-haldi p-7 transition hover:-rotate-1">
          <div className="halftone absolute inset-0" />
          <span className="absolute -right-6 -top-6 text-[140px] transition-transform duration-500 group-hover:rotate-[360deg]">🔁</span>
          <div className="relative">
            <p className="font-hand text-xl font-bold">har hafte, bina bhoole</p>
            <h3 className="display mt-1 text-5xl">Munch <br />Subscription</h3>
            <p className="mt-3 max-w-xs font-semibold">Fresh packs at your door every week or month. Free delivery. Pause or cancel anytime.</p>
            <span className="btn-pop display mt-5 inline-block rounded-full bg-ink px-6 py-3 text-lg text-white">From ₹169/week →</span>
          </div>
        </Link>
      </Reveal>
      <Reveal delay={100}>
        <Link href="/bulk" className="brutal group relative block h-full overflow-hidden rounded-[32px] bg-sky p-7 transition hover:rotate-1">
          <div className="halftone absolute inset-0" />
          <span className="absolute -right-4 -top-4 text-[130px] transition-transform duration-500 group-hover:scale-125">🎁</span>
          <div className="relative">
            <p className="font-hand text-xl font-bold">shaadi, Diwali, office party?</p>
            <h3 className="display mt-1 text-5xl">Bulk & <br />Gifting</h3>
            <p className="mt-3 max-w-xs font-semibold">Custom gift boxes, wedding favours, corporate pantry — from 25 to 25,000 packs. Custom branding available.</p>
            <span className="btn-pop display mt-5 inline-block rounded-full bg-ink px-6 py-3 text-lg text-white">Get a quote →</span>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}

/* ───────────────────────────── REVIEWS ───────────────────────────── */

const REVIEWS = [
  { who: "Rahul", city: "Delhi", face: "🧔", text: "Bhai, Peri Peri Pataka ne rula diya. 10/10, would cry again.", bg: "#FF3D7F" },
  { who: "Sneha", city: "Bengaluru", face: "👩‍💻", text: "Office mein ek packet khola. 2 minute mein khatam. Ab poora dabba mangwaya hai.", bg: "#FFD23F" },
  { who: "Anjali", city: "Pune", face: "👩‍👧", text: "Ragi Crunchies in my kids' tiffin — finally a healthy snack they actually finish!", bg: "#B8F34A" },
  { who: "Karan", city: "Gurugram", face: "🧑‍💼", text: "Ordered 300 Diwali boxes for our team. Everyone loved them. Custom sleeve was a nice touch.", bg: "#4CC9F0" },
  { who: "Meera", city: "Kochi", face: "👵", text: "Kerala banana chips taste exactly like ammachi used to make. Coconut oil, proper!", bg: "#FF7A00" },
  { who: "Imran", city: "Hyderabad", face: "🧑‍🎓", text: "Bhujia Bomb + chai = hostel ka best combo. Subscription le liya.", bg: "#B794FF" },
];

export function Reviews() {
  return (
    <section className="pt-24">
      <Reveal className="px-4 text-center">
        <p className="font-hand text-2xl font-bold text-pink">log kya kahenge? yeh kehte hain 👇</p>
        <h2 className="display text-5xl sm:text-7xl">
          Crunch <span className="stroke-ink text-lime">reviews</span>
        </h2>
      </Reveal>
      <Marquee
        className="mt-10 py-4"
        speed={50}
        separator=""
        items={REVIEWS.map((r, i) => (
          <figure key={r.who} className="w-72 whitespace-normal" style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}>
            <blockquote className="brutal relative rounded-3xl bg-white p-5 text-left">
              <p className="text-lg">⭐⭐⭐⭐⭐</p>
              <p className="font-hand mt-1 text-lg leading-snug">&ldquo;{r.text}&rdquo;</p>
              <span className="absolute -bottom-4 left-10 h-6 w-6 rotate-45 border-b-[3px] border-r-[3px] border-ink bg-white" />
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 pl-4">
              <span className="brutal-sm grid h-12 w-12 place-items-center rounded-full text-2xl" style={{ background: r.bg }}>{r.face}</span>
              <span className="text-left">
                <span className="display block text-lg">{r.who}</span>
                <span className="text-sm font-semibold text-ink/60">{r.city}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      />
    </section>
  );
}

