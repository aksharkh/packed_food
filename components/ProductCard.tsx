"use client";

import Link from "next/link";
import { rupees } from "@/lib/config";
import type { Product } from "@/lib/products";
import { useAddFrom, useCart } from "./CartContext";
import { Spice } from "./Decor";
import { Pack } from "./Pack";

export function AddButton({ product, className = "", light = false }: { product: Product; className?: string; light?: boolean }) {
  const addFrom = useAddFrom();
  const { qtyOf, setQty } = useCart();
  const key = `p:${product.slug}`;
  const q = qtyOf(key);
  if (q > 0) {
    return (
      <div className={`flex items-center overflow-hidden rounded-full font-extrabold ${light ? "bg-white text-ink" : "bg-ink text-white"} ${className}`}>
        <button onClick={() => setQty(key, q - 1)} className="px-3.5 py-2 hover:opacity-60" aria-label="Remove one">−</button>
        <span key={q} className="animate-pop-in min-w-6 text-center">{q}</span>
        <button onClick={addFrom({ type: "product", slug: product.slug })} className="px-3.5 py-2 hover:opacity-60" aria-label="Add one">+</button>
      </div>
    );
  }
  return (
    <button
      onClick={addFrom({ type: "product", slug: product.slug })}
      className={`btn-pop rounded-full px-5 py-2 font-extrabold uppercase tracking-wide ${light ? "bg-white text-ink" : "bg-ink text-white"} ${className}`}
    >
      Add +
    </button>
  );
}

/** Tall gradient card: the pack breaks out of the top, colour fills the whole card. */
export function ProductCard({ product }: { product: Product; i?: number }) {
  return (
    <article className="group relative mt-16 flex h-full flex-col rounded-[32px] px-5 pb-5 pt-36 text-white shadow-[0_30px_50px_-30px_rgba(26,11,46,.7)] transition duration-300 hover:-translate-y-2"
      style={{ background: `linear-gradient(160deg, ${product.bg} -10%, ${product.color} 45%, #1a0b2e 170%)` }}
    >
      <span className="display pointer-events-none absolute inset-x-0 top-10 overflow-hidden text-center text-7xl text-white/15" aria-hidden>
        {product.packLine[0].split(" ")[0]}
      </span>
      <Link href={`/product/${product.slug}`} className="absolute inset-x-0 -top-16 flex justify-center" aria-label={product.name}>
        <Pack
          product={product}
          className="h-52 w-auto drop-shadow-[0_24px_24px_rgba(0,0,0,.35)] transition duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover:-translate-y-3 group-hover:-rotate-6 group-hover:scale-110"
        />
      </Link>
      {product.tags[0] && <span className="glass absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">{product.tags[0]}</span>}

      <Link href={`/product/${product.slug}`} className="relative mt-4">
        <h3 className="display text-3xl">{product.name}</h3>
      </Link>
      <p className="relative mt-1.5 line-clamp-2 text-sm font-medium text-white/80">{product.tagline}</p>
      <div className="relative mt-2 text-xs"><Spice level={product.spice} /></div>
      <div className="relative mt-auto flex items-center justify-between gap-2 pt-4">
        <p>
          <span className="display text-3xl">{rupees(product.price)}</span>
          <span className="ml-1.5 text-xs font-bold text-white/60">{product.weight}</span>
        </p>
        <AddButton product={product} light />
      </div>
    </article>
  );
}
