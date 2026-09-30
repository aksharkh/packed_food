"use client";

import Link from "next/link";
import { useState } from "react";
import { rupees } from "@/lib/config";
import type { Product } from "@/lib/products";
import { useAddFrom, useCart } from "./CartContext";
import { Spice } from "./Decor";
import { Pack } from "./Pack";

export function AddButton({ product, className = "" }: { product: Product; className?: string }) {
  const addFrom = useAddFrom();
  const { qtyOf, setQty } = useCart();
  const key = `p:${product.slug}`;
  const q = qtyOf(key);
  if (q > 0) {
    return (
      <div className={`brutal-sm flex items-center overflow-hidden rounded-full bg-ink font-extrabold text-white ${className}`}>
        <button onClick={() => setQty(key, q - 1)} className="px-3 py-2 hover:bg-white/15" aria-label="Remove one">−</button>
        <span key={q} className="animate-pop-in min-w-6 text-center">{q}</span>
        <button onClick={addFrom({ type: "product", slug: product.slug })} className="px-3 py-2 hover:bg-white/15" aria-label="Add one">+</button>
      </div>
    );
  }
  return (
    <button onClick={addFrom({ type: "product", slug: product.slug })} className={`btn-pop rounded-full bg-haldi px-5 py-2 font-extrabold ${className}`}>
      Add +
    </button>
  );
}

export function ProductCard({ product, i = 0 }: { product: Product; i?: number }) {
  const [hover, setHover] = useState(false);
  const tilt = [-2, 1.5, -1, 2, -1.5, 1][i % 6];
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="brutal group relative flex h-full flex-col overflow-hidden rounded-[28px] transition duration-300 hover:z-10 hover:!rotate-0 hover:scale-[1.03]"
      style={{ background: product.bg, transform: `rotate(${tilt}deg)` }}
    >
      <div className="halftone pointer-events-none absolute inset-0 opacity-60" />
      <div className="sunburst animate-spin-slow pointer-events-none absolute left-1/2 top-28 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {product.tags[0] && (
        <span className="brutal-sm absolute right-3 top-3 z-10 rotate-6 rounded-full bg-white px-3 py-1 text-xs font-extrabold uppercase">
          {product.tags[0]}
        </span>
      )}

      <Link href={`/product/${product.slug}`} className="relative block px-6 pt-6" aria-label={product.name}>
        <Pack
          product={product}
          mood={hover ? "love" : undefined}
          className="mx-auto h-44 w-auto transition-transform sm:h-56 duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover:-translate-y-3 group-hover:-rotate-6 group-hover:scale-105"
        />
      </Link>

      <div className="relative mt-auto rounded-t-[24px] border-t-[3px] border-ink bg-white p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="display text-2xl leading-none">{product.name}</h3>
        </Link>
        <p className="font-hand mt-1 line-clamp-2 text-sm leading-snug text-ink/75">{product.tagline}</p>
        <div className="mt-2 text-xs"><Spice level={product.spice} /></div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <p>
            <span className="display text-2xl">{rupees(product.price)}</span>
            <span className="ml-1 text-xs font-bold text-ink/50">{product.weight}</span>
          </p>
          <AddButton product={product} />
        </div>
      </div>
    </article>
  );
}
