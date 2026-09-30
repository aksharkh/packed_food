"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { MobileCartBar } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Pack } from "@/components/Pack";
import { PageHeader } from "@/components/PageHeader";
import { blast } from "@/components/blast";
import { rupees } from "@/lib/config";
import { BOX_SIZES, PRODUCTS, findProduct } from "@/lib/products";

export default function BoxBuilder() {
  const { add, setOpen } = useCart();
  const [size, setSize] = useState<number>(6);
  const [items, setItems] = useState<string[]>([]);
  const box = BOX_SIZES.find((b) => b.size === size)!;
  const full = items.reduce((s, slug) => s + findProduct(slug)!.price, 0);
  const price = Math.round(full * (1 - box.discount));
  const left = size - items.length;

  const put = (slug: string) => setItems((xs) => (xs.length < size ? [...xs, slug] : xs));
  const takeOne = (slug: string) =>
    setItems((xs) => {
      const i = xs.lastIndexOf(slug);
      return i < 0 ? xs : [...xs.slice(0, i), ...xs.slice(i + 1)];
    });

  const surprise = () => {
    const picks = [...items];
    while (picks.length < size) picks.push(PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)].slug);
    setItems(picks);
  };

  return (
    <>
      <Nav />
      <main className="pb-10">
        <PageHeader kicker="apna dabba, apni marzi" title="Build a Box" sub="Pick any packs, mix any flavours. The bigger the box, the bigger the discount." bg="#FF3D7F" />

        <div className="mx-auto mt-8 flex max-w-md justify-center gap-3 px-4">
          {BOX_SIZES.map((b) => (
            <button
              key={b.size}
              onClick={() => {
                setSize(b.size);
                setItems((xs) => xs.slice(0, b.size));
              }}
              className={`brutal-sm flex-1 rounded-2xl p-3 text-center transition ${size === b.size ? "-rotate-2 bg-haldi" : "bg-white hover:bg-cream"}`}
            >
              <span className="display block text-2xl">{b.label}</span>
              <span className="text-sm font-bold">{b.note}</span>
            </button>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_420px]">
          {/* shelf */}
          <div>
            <h2 className="display text-3xl">1. Packs chuno</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {PRODUCTS.map((p) => {
                const n = items.filter((s) => s === p.slug).length;
                return (
                  <div key={p.slug} className={`brutal-sm relative rounded-3xl p-3 text-center transition ${n ? "bg-lime" : "bg-white"}`}>
                    {n > 0 && (
                      <span key={n} className="animate-pop-in absolute -right-2 -top-2 z-10 grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-pink font-extrabold text-white">
                        {n}
                      </span>
                    )}
                    <button onClick={() => put(p.slug)} disabled={!left} className="block w-full transition hover:-translate-y-1 hover:-rotate-3 disabled:opacity-50" aria-label={`Add ${p.name}`}>
                      <Pack product={p} className="mx-auto h-32 w-auto" />
                    </button>
                    <p className="display mt-1 text-lg leading-tight">{p.packLine.join(" ")}</p>
                    <p className="text-sm font-bold text-ink/60">{rupees(p.price)}</p>
                    <div className="mt-2 flex justify-center gap-2">
                      <button onClick={() => takeOne(p.slug)} disabled={!n} className="brutal-sm h-9 w-9 rounded-full bg-white font-extrabold disabled:opacity-30" aria-label="Remove one">−</button>
                      <button onClick={() => put(p.slug)} disabled={!left} className="brutal-sm h-9 w-9 rounded-full bg-haldi font-extrabold disabled:opacity-30" aria-label="Add one">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* the box */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="display text-3xl">2. Box bharo</h2>
            <div className="brutal mt-4 rounded-[28px] bg-[#c98a4b] p-4">
              <div className="-mx-4 -mt-4 mb-4 flex items-center justify-between rounded-t-[25px] border-b-[3px] border-ink bg-[#e0a867] px-4 py-2">
                <span className="display text-lg">📦 Dhamaka {box.label}</span>
                <span className="font-extrabold">{items.length}/{size}</span>
              </div>
              <div className={`grid gap-2 ${size === 6 ? "grid-cols-3" : "grid-cols-5"}`}>
                {Array.from({ length: size }, (_, i) => {
                  const slug = items[i];
                  const p = slug ? findProduct(slug) : null;
                  return (
                    <button
                      key={`${i}-${slug ?? "empty"}`}
                      onClick={() => slug && setItems((xs) => [...xs.slice(0, i), ...xs.slice(i + 1)])}
                      className="grid aspect-[3/4] place-items-center rounded-xl border-2 border-dashed border-ink/40 bg-[#b5773b]"
                      aria-label={p ? `Remove ${p.name}` : "Empty slot"}
                    >
                      {p ? <Pack product={p} className="animate-drop-in h-full w-auto" showFace={size === 6} /> : <span className="text-2xl opacity-40">?</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="brutal mt-5 rounded-[28px] bg-white p-5">
              <p className="font-hand text-xl font-bold">
                {left > 0 ? `${left} aur daalo! 👉` : "Box full! Ek dum perfect 👌"}
              </p>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <span className="display text-4xl">{rupees(price)}</span>
                  {full > 0 && <span className="ml-2 font-bold text-ink/40 line-through">{rupees(full)}</span>}
                </div>
                <span className="brutal-sm rounded-full bg-lime px-3 py-1 text-sm font-extrabold">{Math.round(box.discount * 100)}% OFF</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={surprise} disabled={!left} className="btn-pop flex-1 rounded-full bg-white px-4 py-3 font-extrabold disabled:opacity-40">
                  🎲 Surprise me
                </button>
                <button onClick={() => setItems([])} disabled={!items.length} className="btn-pop rounded-full bg-white px-4 py-3 font-extrabold disabled:opacity-40">
                  Reset
                </button>
              </div>
              <button
                disabled={left > 0}
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  add({ type: "box", items }, { x: r.left + r.width / 2, y: r.top });
                  blast(r.left + r.width / 4, r.top, 16);
                  setItems([]);
                  setTimeout(() => setOpen(true), 700);
                }}
                className="btn-pop display mt-3 w-full rounded-full bg-pink px-6 py-4 text-2xl text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add box to cart →
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileCartBar />
    </>
  );
}
