"use client";

import { useState } from "react";
import { blast } from "@/components/blast";
import { Burst } from "@/components/Decor";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { OCCASIONS } from "@/lib/config";

const TIERS = [
  { range: "25 – 99 packs", off: "10% off", note: "Kitty parties, birthdays, small offices", color: "#B8F34A" },
  { range: "100 – 499 packs", off: "15% off", note: "Weddings, Diwali gifting, school events", color: "#FFD23F" },
  { range: "500+ packs", off: "Custom quote", note: "Corporate gifting with your logo on the box & sleeve", color: "#FF3D7F" },
];

const field = "w-full rounded-2xl border-[2.5px] border-ink bg-white px-4 py-3 outline-none transition placeholder:text-ink/40 focus:shadow-[3px_3px_0_#1a0b2e]";

export default function Bulk() {
  const [form, setForm] = useState({ name: "", org: "", phone: "", email: "", occasion: OCCASIONS[0], quantity: "100", city: "", date: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const btn = e.currentTarget.querySelector("button[type=submit]")?.getBoundingClientRect();
    try {
      const res = await fetch("/api/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (btn) blast(btn.left + btn.width / 2, btn.top, 40);
      setDone(data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Nav />
      <main>
        <PageHeader kicker="shaadi · Diwali · office · party" title="Bulk & Gifting" sub="From 25 packs for a kitty party to 25,000 for Diwali — custom boxes, custom sleeves, delivered pan-India." bg="#4CC9F0" />

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pt-12 md:grid-cols-3">
          {TIERS.map((t, i) => (
            <div key={t.range} className="brutal rounded-[28px] p-6" style={{ background: t.color, transform: `rotate(${[-1.5, 1, -1][i]}deg)` }}>
              <p className="display text-3xl">{t.range}</p>
              <p className="display stroke-ink mt-1 text-4xl text-white">{t.off}</p>
              <p className="mt-2 font-semibold">{t.note}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pt-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="display text-5xl">Kya milega?</h2>
            <ul className="mt-5 space-y-4 text-lg font-semibold">
              {[
                ["🎁", "Festive gift boxes with diya-print sleeves & a handwritten-style note"],
                ["🏷️", "Your logo / couple names printed on the box (500+ packs)"],
                ["🎨", "Mix any flavours — or let us curate for your crowd"],
                ["🚚", "Pan-India delivery to one address or many (we handle the list!)"],
                ["🧾", "GST invoice for corporate orders"],
              ].map(([e, t]) => (
                <li key={t} className="flex gap-3">
                  <span className="text-3xl">{e}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Burst color="#FFD23F" spin className="mt-8 h-36 w-36 text-xl">
              Reply in <br /> 24 hrs!
            </Burst>
          </div>

          {done ? (
            <div className="brutal animate-pop-in grid place-items-center rounded-[32px] bg-lime p-10 text-center">
              <div>
                <div className="animate-jiggle text-8xl">🥳</div>
                <h2 className="display mt-4 text-5xl">Enquiry mil gayi!</h2>
                <p className="mt-2 text-lg font-semibold">Reference #{done}. Our team will call or WhatsApp you within 24 hours with a quote.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="brutal space-y-3 rounded-[32px] bg-white p-6 sm:p-8">
              <h2 className="display text-3xl">Get a quote</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input required className={field} placeholder="Your name" value={form.name} onChange={set("name")} autoComplete="name" />
                <input className={field} placeholder="Company / family (optional)" value={form.org} onChange={set("org")} />
                <input required className={field} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} pattern="[6-9][0-9]{9}" title="10-digit Indian mobile number" value={form.phone} onChange={set("phone")} autoComplete="tel-national" />
                <input type="email" className={field} placeholder="Email (optional)" value={form.email} onChange={set("email")} autoComplete="email" />
              </div>
              <div>
                <p className="mb-2 font-extrabold">Occasion</p>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      type="button"
                      key={o}
                      onClick={() => setForm((f) => ({ ...f, occasion: o }))}
                      className={`brutal-sm rounded-full px-3 py-1.5 text-sm font-extrabold ${form.occasion === o ? "bg-ink text-white" : "bg-cream hover:bg-haldi"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-extrabold">How many packs?</span>
                  <input required type="number" min={25} className={field} value={form.quantity} onChange={set("quantity")} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-extrabold">City</span>
                  <input required className={field} placeholder="e.g. Mumbai" value={form.city} onChange={set("city")} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-extrabold">Needed by</span>
                  <input type="date" className={field} value={form.date} onChange={set("date")} />
                </label>
              </div>
              <textarea rows={3} className={field} placeholder="Anything else? Flavours, budget per box, branding ideas…" value={form.message} onChange={set("message")} />
              {error && <p className="rounded-xl bg-mirchi/15 px-4 py-2 font-bold text-mirchi">{error}</p>}
              <button type="submit" disabled={busy} className="btn-pop display w-full rounded-full bg-pink px-6 py-4 text-2xl text-white disabled:opacity-50">
                {busy ? "Bhej rahe hain…" : "Send enquiry 🚀"}
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
