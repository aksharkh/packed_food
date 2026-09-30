"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { rupees } from "@/lib/config";
import { CATEGORY_FILTERS, COMBOS, PRODUCTS, findProduct, type Combo } from "@/lib/products";
import { useAddFrom } from "./CartContext";
import { Marquee, Reveal, Spice } from "./Decor";
import { Chip, Pack } from "./Pack";
import { AddButton, ProductCard } from "./ProductCard";

/* ───────────────────────── HERO: FLAVOUR WORLD ───────────────────────── */

// Flying chips: position (%), width (px), rotation, parallax depth, blur.
const CHIPS = [
  { x: 6, y: 20, w: 110, r: -24, d: 2.2, blur: 0 },
  { x: 82, y: 14, w: 84, r: 32, d: 1.4, blur: 1 },
  { x: 14, y: 66, w: 64, r: 50, d: 0.9, blur: 2 },
  { x: 74, y: 62, w: 130, r: -12, d: 2.6, blur: 0 },
  { x: 30, y: 10, w: 48, r: 80, d: 0.6, blur: 3 },
  { x: 62, y: 84, w: 56, r: -60, d: 0.8, blur: 2 },
  { x: 90, y: 44, w: 60, r: 10, d: 1.1, blur: 2 },
  { x: 2, y: 46, w: 52, r: -70, d: 0.7, blur: 3 },
];

export function Hero() {
  const [idx, setIdx] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [auto, setAuto] = useState(true);
  const n = PRODUCTS.length;
  const p = PRODUCTS[idx];
  const go = (i: number) => {
    setIdx((i + n) % n);
    setAuto(false);
  };

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 5000);
    return () => clearInterval(t);
  }, [auto, n]);

  useEffect(() => {
    const on = () => setScroll(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <section
      className="relative -mt-[76px] flex min-h-dvh flex-col overflow-hidden pt-24 text-white transition-[background] duration-700"
      style={{ background: `radial-gradient(90% 80% at 50% 42%, ${p.bg} 0%, ${p.color} 48%, #1a0b2e 135%)` }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({ x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {/* giant flavour word */}
      <p
        key={`w-${p.slug}`}
        className="display animate-word-in pointer-events-none absolute inset-x-0 top-[16%] select-none whitespace-nowrap text-center text-[34vw] leading-none text-white/15 lg:top-[8%] lg:text-[26vw]"
        aria-hidden
      >
        {p.packLine[0].split(" ")[0]}
      </p>

      {/* flying chips with mouse + scroll parallax */}
      {CHIPS.map((c, i) => (
        <div
          key={i}
          className="pointer-events-none absolute transition-transform duration-300 ease-out"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `clamp(${c.w * 0.55}px, ${c.w / 12}vw, ${c.w}px)`,
            filter: c.blur ? `blur(${c.blur}px)` : undefined,
            transform: `translate(${tilt.x * c.d * -26}px, ${tilt.y * c.d * -18 - scroll * c.d * 0.18}px)`,
            zIndex: c.d > 2 ? 20 : 1,
          }}
        >
          <Chip className="animate-drift w-full" style={{ "--r": `${c.r}deg`, "--dur": `${5 + i}s`, animationDelay: `${-i}s` } as React.CSSProperties} />
        </div>
      ))}

      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-2 px-5 lg:grid-cols-[1fr_auto_1fr]">
        {/* left: copy */}
        <div className="order-2 text-center lg:order-1 lg:self-end lg:pb-16 lg:text-left">
          <h1 className="text-xs font-extrabold uppercase tracking-[.3em] text-white/75">Bhook lagi? Crunch karo.</h1>
          <div key={p.slug} className="animate-pop-in">
            <h2 className="display pop-shadow mt-2 text-5xl sm:text-7xl">{p.name}</h2>
            <p className="mx-auto mt-3 max-w-sm font-medium text-white/85 lg:mx-0">{p.tagline}</p>
            <p className="mt-2 text-sm"><Spice level={p.spice} /></p>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <span className="display text-4xl">{rupees(p.price)}</span>
            <AddButton product={p} light className="px-6 py-3 text-base" />
            <Link href={`/product/${p.slug}`} className="glass rounded-full px-5 py-3 text-sm font-extrabold uppercase tracking-wide transition hover:bg-white/25">
              Explore →
            </Link>
          </div>
        </div>

        {/* centre: the pack */}
        <div className="relative order-1 mx-auto grid place-items-center lg:order-2" style={{ perspective: 1000 }}>
          <div className="sunburst absolute h-[120%] w-[160%]" />
          <Link
            href={`/product/${p.slug}`}
            aria-label={p.name}
            className="relative block transition-transform duration-200 ease-out"
            style={{ transform: `rotateY(${tilt.x * 18}deg) rotateX(${-tilt.y * 12}deg) rotate(${-6 + tilt.x * 4}deg)` }}
          >
            <div key={p.slug} className="animate-swoosh-in">
              <Pack product={p} className="animate-bob h-[44dvh] max-h-[520px] w-auto drop-shadow-[0_40px_40px_rgba(0,0,0,.45)] lg:h-[66dvh]" />
            </div>
          </Link>
        </div>

        {/* right: flavour index */}
        <div className="order-3 hidden justify-self-end lg:block">
          <p className="mb-3 text-right text-xs font-extrabold uppercase tracking-[.3em] text-white/50">
            {String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
          <ul className="space-y-1 text-right">
            {PRODUCTS.map((q, i) => (
              <li key={q.slug}>
                <button
                  onClick={() => go(i)}
                  className={`display inline-flex items-center gap-3 text-xl transition-all ${i === idx ? "text-white" : "text-white/35 hover:text-white/70"}`}
                >
                  {q.packLine.join(" ")}
                  <span className={`h-0.5 rounded-full bg-white transition-all ${i === idx ? "w-10" : "w-3 opacity-40"}`} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* bottom controls */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 pb-6 pt-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto py-2 pl-24 lg:hidden">
          {PRODUCTS.map((q, i) => (
            <button
              key={q.slug}
              onClick={() => go(i)}
              aria-label={q.name}
              className={`shrink-0 rounded-2xl p-1.5 transition ${i === idx ? "glass -translate-y-1" : "opacity-60"}`}
            >
              <Pack product={q} className="h-14 w-10" showFace={false} />
            </button>
          ))}
        </div>
        <p className="hidden text-xs font-bold uppercase tracking-[.3em] text-white/50 lg:block">Scroll to explore ↓</p>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => go(idx - 1)} className="glass grid h-12 w-12 place-items-center rounded-full text-lg transition hover:bg-white/25" aria-label="Previous flavour">←</button>
          <button onClick={() => go(idx + 1)} className="glass grid h-12 w-12 place-items-center rounded-full text-lg transition hover:bg-white/25" aria-label="Next flavour">→</button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── MARQUEE ─────────────────────────────── */

export function Marquees() {
  return (
    <Marquee
      className="bg-ink py-4 text-white"
      items={["No palm oil", "Asli masala", "Kettle cooked", "Made in India", "100% veg", "Nitrogen packed"].map((t) => (
        <span key={t} className="display text-3xl sm:text-5xl">{t}</span>
      ))}
      separator={<span className="text-2xl text-haldi sm:text-4xl">✦</span>}
      speed={32}
    />
  );
}

/* ─────────────────────────────── LINE-UP ─────────────────────────────── */

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
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide transition ${value === f.id ? "bg-ink text-white" : "bg-white text-ink/70 hover:text-ink"}`}
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
    <section className="mx-auto max-w-6xl px-4 pt-20">
      <Reveal className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-[.3em] text-pink">The line-up</p>
        <h2 className="display mt-2 text-6xl sm:text-8xl">Find your flavour</h2>
      </Reveal>
      <div className="mt-6">
        <FilterPills value={filter} onChange={setFilter} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 min-[520px]:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 80}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────── SCROLL STORY: FARM → PACK ─────────────────────── */

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
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const s = STEPS[active];

  return (
    <section id="made" className="relative mt-24 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-2">
        {/* sticky visual */}
        <div className="sticky top-[76px] z-10 -mx-5 flex items-center gap-4 bg-ink/90 px-5 py-4 backdrop-blur lg:top-0 lg:mx-0 lg:h-dvh lg:flex-col lg:justify-center lg:bg-transparent lg:backdrop-blur-none">
          <div className="lg:text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.3em] text-white/50">How we make the crunch</p>
            <h2 className="display mt-1 text-3xl sm:text-5xl lg:text-7xl">Farm to pack</h2>
          </div>
          <div className="relative ml-auto grid h-16 w-16 shrink-0 place-items-center lg:ml-0 lg:mt-8 lg:h-[340px] lg:w-[340px]">
            <span className="absolute inset-0 rounded-full blur-2xl transition-colors duration-700 lg:blur-3xl" style={{ background: s.bg, opacity: 0.55 }} />
            <span className="absolute inset-0 rounded-full border border-white/15 transition-colors duration-700 lg:inset-6" style={{ background: `${s.bg}30` }} />
            <span key={active} className="animate-pop-in relative text-4xl lg:text-[150px]">{s.emoji}</span>
            <Chip className="animate-drift absolute -right-6 top-2 hidden w-20 lg:block" style={{ "--r": "24deg" } as React.CSSProperties} />
            <Chip className="animate-drift absolute -left-4 bottom-6 hidden w-14 blur-[1px] lg:block" style={{ "--r": "-40deg", "--dur": "8s" } as React.CSSProperties} />
          </div>
          {/* progress */}
          <div className="hidden w-64 lg:mt-8 lg:block">
            <div className="h-1 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((active + 1) / STEPS.length) * 100}%`, background: s.bg }} />
            </div>
            <p className="mt-2 text-center text-xs font-bold tracking-[.3em] text-white/50">STEP {active + 1} OF {STEPS.length}</p>
          </div>
        </div>

        {/* scrolling steps */}
        <ol className="pb-[20vh] pt-[6vh] lg:py-[35vh]">
          {STEPS.map((st, i) => (
            <li
              key={st.title}
              data-i={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={`py-[9vh] transition-all duration-500 lg:py-[14vh] ${i === active ? "opacity-100" : "opacity-25"}`}
            >
              <p className="display text-7xl transition-colors duration-500 lg:text-8xl" style={{ color: i === active ? st.bg : undefined }}>
                0{i + 1}
              </p>
              <h3 className="display mt-2 text-4xl lg:text-6xl">{st.title}</h3>
              <p className="mt-3 max-w-md text-lg text-white/75">{st.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────────────────────── COMBOS ─────────────────────────────── */

export function ComboCard({ combo }: { combo: Combo; i?: number }) {
  const addFrom = useAddFrom();
  const packs = combo.items.map((s) => findProduct(s)!);
  const full = packs.reduce((s, p) => s + p.price, 0);
  const unique = [...new Map(packs.map((p) => [p.slug, p])).values()].slice(0, 4);
  return (
    <article
      className="group relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-[32px] p-6 text-white shadow-[0_30px_50px_-30px_rgba(26,11,46,.7)]"
      style={{ background: `linear-gradient(135deg, ${combo.color} 0%, #1a0b2e 130%)` }}
    >
      <div className="absolute -right-4 -top-2 flex">
        {unique.map((p, j) => (
          <div key={p.slug} className="-ml-12 transition-transform duration-500 group-hover:-translate-y-2" style={{ transform: `rotate(${(j - 1.5) * 9}deg)`, transitionDelay: `${j * 40}ms` }}>
            <Pack product={p} className="h-44 w-auto drop-shadow-[0_16px_16px_rgba(0,0,0,.4)] sm:h-52" showFace={j % 2 === 0} />
          </div>
        ))}
      </div>
      <span className="glass absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
        {combo.emoji} Save {Math.round((1 - combo.price / full) * 100)}%
      </span>
      <div className="relative mt-40">
        <p className="text-xs font-extrabold uppercase tracking-[.25em] text-white/60">{combo.items.length} packs</p>
        <h3 className="display mt-1 text-4xl sm:text-5xl">{combo.name}</h3>
        <p className="mt-1.5 max-w-sm text-sm font-medium text-white/75">{combo.tagline}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p>
            <span className="display text-4xl">{rupees(combo.price)}</span>
            <span className="ml-2 text-sm font-bold text-white/45 line-through">{rupees(full)}</span>
          </p>
          <button onClick={addFrom({ type: "combo", id: combo.id })} className="btn-pop rounded-full bg-white px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-ink">
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
        <p className="text-xs font-extrabold uppercase tracking-[.3em] text-pink">More packs, less paisa</p>
        <h2 className="display mt-2 text-6xl sm:text-8xl">Combo deals</h2>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {COMBOS.map((c, i) => (
          <Reveal key={c.id} delay={(i % 2) * 100}>
            <ComboCard combo={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── BUILD-A-BOX BANNER ─────────────────────────── */

export function TruckBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24">
      <Reveal>
        <div className="truck-border relative overflow-hidden rounded-[40px] px-6 py-14 text-center text-white sm:py-20">
          <Chip className="animate-drift absolute left-[5%] top-8 w-24" style={{ "--r": "-25deg" } as React.CSSProperties} />
          <Chip className="animate-drift absolute bottom-8 right-[6%] w-32 blur-[1px]" style={{ "--r": "35deg", "--dur": "7s" } as React.CSSProperties} />
          <Chip className="animate-drift absolute right-[24%] top-6 w-12 blur-[2px]" style={{ "--r": "70deg", "--dur": "9s" } as React.CSSProperties} />
          <p className="relative text-xs font-extrabold uppercase tracking-[.3em] text-white/80">Snack OK Please</p>
          <h2 className="display pop-shadow relative mt-3 text-6xl sm:text-9xl">
            Your box. <br />Your rules.
          </h2>
          <p className="relative mx-auto mt-5 max-w-md text-lg font-medium text-white/90">
            Pick any 6 or 10 packs, mix every flavour you love, and save up to 15%.
          </p>
          <Link href="/box" className="btn-pop relative mt-7 inline-block rounded-full bg-ink px-8 py-4 text-sm font-extrabold uppercase tracking-widest text-white">
            Build my box →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────── SUBSCRIBE + BULK ─────────────────────────── */

export function Duo() {
  const tiles = [
    { href: "/subscribe", kicker: "Munch Club", title: "Never run out", text: "Fresh packs at your door every week or month. Free delivery. Pause anytime.", cta: "From ₹169 / week", glow: "#FFD23F", emoji: "🔁" },
    { href: "/bulk", kicker: "Bulk & gifting", title: "Party-size orders", text: "Diwali boxes, wedding favours, office pantry — 25 to 25,000 packs with custom branding.", cta: "Get a quote", glow: "#4CC9F0", emoji: "🎁" },
  ];
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pt-6 md:grid-cols-2">
      {tiles.map((t, i) => (
        <Reveal key={t.href} delay={i * 100}>
          <Link href={t.href} className="group relative block h-full overflow-hidden rounded-[32px] bg-ink p-8 text-white">
            <span className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-50 blur-3xl transition-opacity duration-500 group-hover:opacity-90" style={{ background: t.glow }} />
            <span className="absolute right-6 top-6 text-6xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125">{t.emoji}</span>
            <p className="relative text-xs font-extrabold uppercase tracking-[.3em]" style={{ color: t.glow }}>{t.kicker}</p>
            <h3 className="display relative mt-2 text-5xl sm:text-6xl">{t.title}</h3>
            <p className="relative mt-3 max-w-sm font-medium text-white/70">{t.text}</p>
            <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest">
              {t.cta} <span className="transition-transform group-hover:translate-x-2">→</span>
            </span>
          </Link>
        </Reveal>
      ))}
    </section>
  );
}

/* ─────────────────────────────── REVIEWS ─────────────────────────────── */

const REVIEWS = [
  { who: "Rahul", city: "Delhi", text: "Bhai, Peri Peri Pataka ne rula diya. 10/10, would cry again." },
  { who: "Sneha", city: "Bengaluru", text: "Office mein ek packet khola. 2 minute mein khatam. Ab poora dabba mangwaya hai." },
  { who: "Anjali", city: "Pune", text: "Ragi Crunchies in my kids' tiffin — finally a healthy snack they actually finish!" },
  { who: "Karan", city: "Gurugram", text: "Ordered 300 Diwali boxes for our team. Everyone loved them." },
  { who: "Meera", city: "Kochi", text: "Kerala banana chips taste exactly like ammachi used to make." },
  { who: "Imran", city: "Hyderabad", text: "Bhujia Bomb + chai = hostel ka best combo. Subscription le liya." },
];

export function Reviews() {
  return (
    <section className="pt-24">
      <Reveal className="px-4 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[.3em] text-pink">Crunch reviews</p>
        <h2 className="display mt-2 text-6xl sm:text-8xl">India is munching</h2>
      </Reveal>
      <Marquee
        className="mt-8 py-4"
        speed={55}
        separator=""
        items={REVIEWS.map((r) => (
          <figure key={r.who} className="brutal w-80 whitespace-normal rounded-3xl bg-white p-6 text-left">
            <p className="text-sm tracking-widest text-masala">★★★★★</p>
            <blockquote className="mt-2 text-lg font-semibold leading-snug">“{r.text}”</blockquote>
            <figcaption className="mt-4 text-sm font-bold text-ink/50">
              {r.who} · {r.city}
            </figcaption>
          </figure>
        ))}
      />
    </section>
  );
}
