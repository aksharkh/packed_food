"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { MobileCartBar } from "@/components/CartDrawer";
import { Reveal } from "@/components/Decor";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { rupees } from "@/lib/config";
import { PLANS, PREFS } from "@/lib/products";

const FAQ = [
  ["Can I pause or skip?", "Haan, bilkul. WhatsApp us before your next delivery and we'll skip or pause it. No questions asked."],
  ["How do I pay?", "Pay on each delivery by cash or UPI. No card on file, no auto-debit surprises."],
  ["Which flavours will I get?", "Based on your taste preference, we mix bestsellers and new launches. You'll often get new flavours before anyone else!"],
  ["Can I cancel?", "Anytime. Just message us. We'll be sad, but we'll understand 🥲"],
];

export default function Subscribe() {
  const { add, setOpen } = useCart();
  const [pref, setPref] = useState<string>("surprise");

  return (
    <>
      <Nav />
      <main>
        <PageHeader kicker="har hafte, bina bhoole" title="Munch Club" sub="A box of fresh packs at your door every week or month. Free delivery, pay on delivery, pause anytime." bg="#FFD23F" />

        <section className="mx-auto max-w-4xl px-4 pt-10 text-center">
          <h2 className="display text-3xl">1. Aapka taste?</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {PREFS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPref(p.id)}
                className={`brutal-sm rounded-full px-4 py-2 font-extrabold transition ${pref === p.id ? "-rotate-2 bg-ink text-white" : "bg-white hover:bg-haldi"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pt-12">
          <h2 className="display text-center text-3xl">2. Plan chuno</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 100}>
                <article
                  className={`brutal relative flex h-full flex-col rounded-[32px] bg-white p-6 ${"popular" in plan && plan.popular ? "md:-translate-y-4" : ""}`}
                  style={{ transform: `rotate(${[-1.5, 0, 1.5][i]}deg)` }}
                >
                  {"popular" in plan && plan.popular && (
                    <span className="brutal-sm display absolute -top-4 left-1/2 -translate-x-1/2 rotate-2 rounded-full bg-pink px-4 py-1 text-white">Most popular</span>
                  )}
                  <div className="brutal-sm grid h-20 w-20 place-items-center rounded-3xl text-5xl" style={{ background: plan.color }}>{plan.emoji}</div>
                  <h3 className="display mt-4 text-3xl">{plan.name}</h3>
                  <p className="mt-1">
                    <span className="display text-5xl">{rupees(plan.price)}</span>
                    <span className="font-bold text-ink/60"> / {plan.every}</span>
                  </p>
                  <p className="text-sm font-bold text-ink/50">≈ {rupees(Math.round(plan.price / plan.packs))} per pack</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2 font-semibold">
                        <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-lime text-xs">✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      add({ type: "sub", plan: plan.id, pref }, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
                      setTimeout(() => setOpen(true), 600);
                    }}
                    className="btn-pop display mt-6 rounded-full px-6 py-4 text-xl"
                    style={{ background: plan.color }}
                  >
                    Join {plan.name} →
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pt-20">
          <h2 className="display text-center text-4xl">Sawaal? Jawaab! 🙋</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="brutal-sm group rounded-2xl bg-white p-4 open:bg-cream">
                <summary className="flex cursor-pointer list-none items-center justify-between font-extrabold">
                  {q}
                  <span className="text-2xl transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-ink/75">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileCartBar />
    </>
  );
}
