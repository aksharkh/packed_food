"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { LineThumb } from "@/components/CartDrawer";
import { Nav } from "@/components/Nav";
import { rupees } from "@/lib/config";

const field = "w-full rounded-2xl border-[2.5px] border-ink bg-white px-4 py-3 outline-none transition placeholder:text-ink/40 focus:shadow-[3px_3px_0_#1a0b2e]";

export default function Checkout() {
  const router = useRouter();
  const cart = useCart();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", pincode: "", notes: "" });
  const [payment, setPayment] = useState<"cod" | "upi">("cod");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          notes: form.notes,
          payment,
          lines: cart.lines.map((l) => ({ type: l.type, slug: "slug" in l ? l.slug : undefined, id: "id" in l ? l.id : undefined, items: "items" in l ? l.items : undefined, plan: "plan" in l ? l.plan : undefined, pref: "pref" in l ? l.pref : undefined, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      try {
        const prev = JSON.parse(localStorage.getItem("dhm-orders") ?? "[]") as string[];
        localStorage.setItem("dhm-orders", JSON.stringify([data.id, ...prev].slice(0, 10)));
      } catch {}
      setPlaced(data.id);
      cart.clear();
      router.push(`/order/${data.id}?new=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  if (!cart.ready) return <Nav />;

  if (placed) {
    return (
      <main className="halftone grid min-h-dvh place-items-center bg-lime px-4 text-center">
        <div className="animate-pop-in">
          <div className="animate-jiggle text-8xl">🎉</div>
          <h1 className="display stroke-ink pop-shadow mt-4 text-6xl text-white">Order ho gaya!</h1>
          <p className="font-hand mt-2 text-2xl font-bold">#{placed} — packing shuru 📦</p>
        </div>
      </main>
    );
  }

  if (cart.count === 0) {
    return (
      <>
        <Nav />
        <main className="grid min-h-[70vh] place-items-center px-4 text-center">
          <div>
            <div className="animate-jiggle text-8xl">🥲</div>
            <h1 className="display mt-4 text-5xl">Cart khaali hai</h1>
            <Link href="/shop" className="btn-pop display mt-6 inline-block rounded-full bg-pink px-7 py-4 text-xl text-white">Go shopping →</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <div className="text-center">
          <p className="font-hand text-2xl font-bold text-pink">bas thoda sa aur…</p>
          <h1 className="display stroke-ink pop-shadow text-6xl text-haldi sm:text-8xl">Checkout</h1>
        </div>

        <form onSubmit={submit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <section className="brutal rounded-[28px] bg-white p-5 sm:p-7">
              <h2 className="display mb-4 text-2xl">📇 Kaun ho aap?</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required className={field} placeholder="Full name" value={form.name} onChange={set("name")} autoComplete="name" />
                <input required className={field} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} pattern="[6-9][0-9]{9}" title="10-digit Indian mobile number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))} autoComplete="tel-national" />
                <input type="email" className={`${field} sm:col-span-2`} placeholder="Email for order updates (optional)" value={form.email} onChange={set("email")} autoComplete="email" />
              </div>
            </section>
            <section className="brutal rounded-[28px] bg-white p-5 sm:p-7">
              <h2 className="display mb-4 text-2xl">🏠 Kahan bhejein?</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <textarea required rows={3} className={`${field} sm:col-span-2`} placeholder="House / flat, street, area, landmark" value={form.address} onChange={set("address")} autoComplete="street-address" />
                <input required className={field} placeholder="City" value={form.city} onChange={set("city")} autoComplete="address-level2" />
                <input required className={field} placeholder="Pincode" inputMode="numeric" maxLength={6} pattern="[1-9][0-9]{5}" title="6-digit pincode" value={form.pincode} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "") }))} autoComplete="postal-code" />
              </div>
            </section>
            <section className="brutal rounded-[28px] bg-white p-5 sm:p-7">
              <h2 className="display mb-4 text-2xl">💸 Payment</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "cod" as const, label: "Cash on delivery", icon: "💵" },
                  { id: "upi" as const, label: "UPI on delivery", icon: "📲" },
                ].map((p) => (
                  <label key={p.id} className={`brutal-sm cursor-pointer rounded-2xl p-4 transition ${payment === p.id ? "-rotate-1 bg-haldi" : "bg-cream"}`}>
                    <input type="radio" name="payment" className="sr-only" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                    <span className="text-3xl">{p.icon}</span>
                    <span className="block font-extrabold">{p.label}</span>
                  </label>
                ))}
              </div>
              {cart.hasSub && <p className="mt-3 rounded-xl bg-lime/40 px-3 py-2 text-sm font-bold">🔁 Your subscription is paid on each delivery. We&apos;ll WhatsApp you before every box.</p>}
              <textarea rows={2} className={`${field} mt-4`} placeholder="Note for us? (gift message, delivery instructions…)" value={form.notes} onChange={set("notes")} />
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="brutal rounded-[28px] bg-haldi p-5 sm:p-7">
              <h2 className="display text-3xl">Your jhola</h2>
              <ul className="mt-4 space-y-3">
                {cart.lines.map((l) => (
                  <li key={l.key} className="flex items-center gap-3 rounded-2xl bg-white p-2 pr-3">
                    <LineThumb packs={l.info.packs} emoji={l.info.emoji} color={l.info.color} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-extrabold leading-tight">{l.info.title}</p>
                      <p className="truncate text-xs text-ink/60">{l.info.subtitle}</p>
                    </div>
                    <p className="text-right text-sm font-extrabold">
                      {l.qty > 1 && <span className="block text-xs text-ink/50">×{l.qty}</span>}
                      {rupees(l.info.unit * l.qty)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-1 border-t-[3px] border-dashed border-ink/40 pt-4 font-semibold">
                <div className="flex justify-between"><span>Subtotal</span><span>{rupees(cart.subtotal)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{cart.shipping ? rupees(cart.shipping) : "FREE 🎉"}</span></div>
                <div className="display flex justify-between pt-2 text-3xl"><span>Total</span><span>{rupees(cart.total)}</span></div>
              </div>
              {error && <p className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-bold text-mirchi">⚠️ {error}</p>}
              <button disabled={busy} className="btn-pop display mt-5 w-full rounded-full bg-pink px-6 py-4 text-2xl text-white disabled:opacity-50">
                {busy ? "Placing…" : `Place order · ${rupees(cart.total)}`}
              </button>
            </div>
          </aside>
        </form>
      </main>
    </>
  );
}
