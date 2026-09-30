"use client";

import { useState } from "react";
import { MobileCartBar } from "@/components/CartDrawer";
import { Reveal } from "@/components/Decor";
import { Footer } from "@/components/Footer";
import { Combos, FilterPills, TruckBanner, useFiltered } from "@/components/Home";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";

export default function Shop() {
  const [filter, setFilter] = useState("all");
  const list = useFiltered(filter);
  return (
    <>
      <Nav />
      <main>
        <PageHeader kicker="kya khaoge aaj?" title="Snack Shop" sub="Every flavour we make. Tap a pack to see what's inside, how it's made & how it's packed." bg="#FF7A00" />
        <section className="mx-auto max-w-6xl px-4 pt-10">
          <FilterPills value={filter} onChange={setFilter} />
          <div className="mt-8 grid grid-cols-1 gap-7 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80}>
                <ProductCard product={p} i={i} />
              </Reveal>
            ))}
          </div>
        </section>
        <Combos />
        <TruckBanner />
      </main>
      <Footer />
      <MobileCartBar />
    </>
  );
}
