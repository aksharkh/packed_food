"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BULK_STATUSES, ORDER_STATUSES, SITE, rupees, type BulkStatus, type OrderStatus } from "@/lib/config";
import { findProduct } from "@/lib/products";

type OrderLine = { type: string; title: string; subtitle: string; unit: number; qty: number; packs: string[]; recurring?: string };
type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; phone: string; email?: string; address: string; city: string; pincode: string };
  payment: "cod" | "upi";
  notes?: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  hasSubscription: boolean;
};
type Bulk = {
  id: string;
  createdAt: string;
  status: BulkStatus;
  name: string;
  org?: string;
  phone: string;
  email?: string;
  occasion: string;
  quantity: number;
  city: string;
  date?: string;
  message?: string;
};

const NEXT: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  new: { to: "confirmed", label: "👍 Confirm" },
  confirmed: { to: "packed", label: "📦 Mark packed" },
  packed: { to: "shipped", label: "🚚 Mark shipped" },
  shipped: { to: "delivered", label: "🎉 Delivered" },
};

const TABS = [
  { id: "active", label: "Active orders" },
  { id: "subs", label: "Subscriptions" },
  { id: "bulk", label: "Bulk enquiries" },
  { id: "done", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
] as const;

const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.15, 0.3].forEach((t, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = [660, 880, 1320][i];
      g.gain.setValueAtTime(0.12, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.14);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.15);
    });
  } catch {}
}

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bulk, setBulk] = useState<Bulk[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("active");
  const seen = useRef<Set<string> | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    if (res.status === 401) return setAuthed(false);
    const data: { orders: Order[]; bulk: Bulk[] } = await res.json();
    setAuthed(true);
    const ids = [...data.orders, ...data.bulk].map((x) => x.id);
    if (seen.current && ids.some((id) => !seen.current!.has(id))) beep();
    seen.current = new Set(ids);
    setOrders(data.orders);
    setBulk(data.bulk);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch + polling
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [load]);

  const fresh = orders.filter((o) => o.status === "new").length + bulk.filter((b) => b.status === "new").length;
  useEffect(() => {
    document.title = fresh ? `(${fresh}) New · Dhamaka admin` : "Dhamaka admin";
  }, [fresh]);

  const stats = useMemo(() => {
    const live = orders.filter((o) => o.status !== "cancelled");
    const today = new Date().toDateString();
    return {
      today: live.filter((o) => new Date(o.createdAt).toDateString() === today).length,
      revenue: live.reduce((s, o) => s + o.total, 0),
      subs: live.filter((o) => o.hasSubscription).length,
      packs: live.reduce((s, o) => s + o.lines.reduce((n, l) => n + l.packs.length * l.qty, 0), 0),
    };
  }, [orders]);

  const visible = orders.filter((o) =>
    tab === "active"
      ? !["delivered", "cancelled"].includes(o.status)
      : tab === "subs"
        ? o.hasSubscription && o.status !== "cancelled"
        : tab === "done"
          ? o.status === "delivered"
          : o.status === "cancelled",
  );

  async function patch(url: string, status: string) {
    await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  if (authed === null) return <p className="font-hand grid min-h-dvh place-items-center text-2xl">Loading…</p>;
  if (!authed) return <Login onDone={load} />;

  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-20 border-b-[3px] border-ink bg-pink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="display stroke-ink text-3xl text-white">{SITE.name}! <span className="text-lg text-haldi">admin</span></p>
          <div className="flex gap-2">
            <Link href="/" className="brutal-sm rounded-full bg-white px-4 py-2 text-sm font-extrabold">View site</Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/login", { method: "DELETE" });
                setAuthed(false);
              }}
              className="brutal-sm rounded-full bg-white px-4 py-2 text-sm font-extrabold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Orders today", stats.today, "🧾", "#FFD23F"],
            ["Total revenue", rupees(stats.revenue), "💰", "#B8F34A"],
            ["Active subscriptions", stats.subs, "🔁", "#4CC9F0"],
            ["Packs sold", stats.packs, "📦", "#FF7A00"],
          ].map(([label, value, icon, bg]) => (
            <div key={label as string} className="brutal-sm rounded-3xl p-4" style={{ background: bg as string }}>
              <p className="text-2xl">{icon}</p>
              <p className="display mt-1 text-3xl">{value}</p>
              <p className="text-xs font-extrabold uppercase">{label}</p>
            </div>
          ))}
        </div>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => {
            const badge = t.id === "active" ? orders.filter((o) => o.status === "new").length : t.id === "bulk" ? bulk.filter((b) => b.status === "new").length : 0;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className={`brutal-sm shrink-0 rounded-full px-4 py-2 text-sm font-extrabold ${tab === t.id ? "bg-ink text-white" : "bg-white"}`}>
                {t.label}
                {badge > 0 && <span className="ml-1.5 rounded-full bg-pink px-1.5 text-xs text-white">{badge}</span>}
              </button>
            );
          })}
        </div>

        {tab === "bulk" ? (
          bulk.length === 0 ? (
            <Empty text="No bulk enquiries yet." />
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {bulk.map((b) => (
                <article key={b.id} className={`brutal-sm rounded-3xl bg-white p-5 ${b.status === "new" ? "ring-4 ring-pink/50" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono font-extrabold">#{b.id}</p>
                      <p className="text-xs text-ink/50">{when(b.createdAt)}</p>
                    </div>
                    <select
                      value={b.status}
                      onChange={(e) => patch(`/api/admin/bulk/${b.id}`, e.target.value)}
                      className="brutal-sm rounded-full bg-haldi px-3 py-1 text-sm font-extrabold uppercase"
                    >
                      {BULK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <p className="display mt-3 text-2xl">{b.quantity.toLocaleString("en-IN")} packs · {b.occasion}</p>
                  <p className="mt-1 font-bold">{b.name}{b.org ? ` — ${b.org}` : ""} · {b.city}</p>
                  {b.date && <p className="text-sm">Needed by: <b>{new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</b></p>}
                  {b.message && <p className="mt-2 rounded-xl bg-cream p-3 text-sm">{b.message}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={`tel:+91${b.phone}`} className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">📞 {b.phone}</a>
                    <a href={`https://wa.me/91${b.phone}?text=${encodeURIComponent(`Namaste ${b.name}! Thanks for your bulk enquiry (#${b.id}) with ${SITE.full}.`)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25d366] px-3 py-1 text-xs font-bold">WhatsApp</a>
                    {b.email && <a href={`mailto:${b.email}`} className="rounded-full bg-sky px-3 py-1 text-xs font-bold">✉️ Email</a>}
                  </div>
                </article>
              ))}
            </div>
          )
        ) : visible.length === 0 ? (
          <Empty text="Nothing here right now. New orders show up automatically (with a beep!)." />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {visible.map((o) => {
              const next = NEXT[o.status];
              const label = o.status === "cancelled" ? "Cancelled" : ORDER_STATUSES.find((s) => s.id === o.status)?.label;
              return (
                <article key={o.id} className={`brutal-sm rounded-3xl bg-white p-5 ${o.status === "new" ? "ring-4 ring-pink/50" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-lg font-extrabold">#{o.id}</p>
                      <p className="text-xs text-ink/50">{when(o.createdAt)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full bg-haldi px-3 py-1 text-xs font-extrabold uppercase">{label}</span>
                      {o.hasSubscription && <span className="rounded-full bg-sky px-3 py-1 text-xs font-extrabold">🔁 Subscription</span>}
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl bg-cream p-3 text-sm">
                    <p className="font-extrabold">{o.customer.name}</p>
                    <p className="text-ink/70">{o.customer.address}, {o.customer.city} – {o.customer.pincode}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a href={`tel:+91${o.customer.phone}`} className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">📞 {o.customer.phone}</a>
                      <a href={`https://wa.me/91${o.customer.phone}?text=${encodeURIComponent(`Namaste ${o.customer.name}! Your Dhamaka order #${o.id} is ${label?.toLowerCase()}.`)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25d366] px-3 py-1 text-xs font-bold">WhatsApp</a>
                      {o.customer.email && <a href={`mailto:${o.customer.email}`} className="rounded-full bg-sky px-3 py-1 text-xs font-bold">✉️ Email</a>}
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {o.lines.map((l, i) => (
                      <li key={i}>
                        <div className="flex justify-between gap-2">
                          <span><b>{l.qty}×</b> {l.title}</span>
                          <span className="font-bold">{rupees(l.unit * l.qty)}{l.recurring ? `/${l.recurring}` : ""}</span>
                        </div>
                        {l.type !== "product" && l.packs.length > 0 && (
                          <p className="text-xs text-ink/60">↳ {l.packs.map((s) => findProduct(s)?.packLine.join(" ") ?? s).join(", ")}</p>
                        )}
                        {l.type === "sub" && <p className="text-xs text-ink/60">↳ {l.subtitle}</p>}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-right text-sm">
                    {o.payment === "upi" ? "📲 UPI" : "💵 Cash"} on delivery · <b className="display text-lg">{rupees(o.total)}</b>
                  </p>
                  {o.notes && <p className="mt-2 rounded-xl bg-pink/10 px-3 py-2 text-sm font-bold text-pink">📝 {o.notes}</p>}
                  <div className="mt-4 flex gap-2">
                    {next && (
                      <button onClick={() => patch(`/api/admin/orders/${o.id}`, next.to)} className="btn-pop flex-1 rounded-full bg-lime py-2.5 font-extrabold">
                        {next.label}
                      </button>
                    )}
                    {!["delivered", "cancelled"].includes(o.status) && (
                      <button onClick={() => confirm(`Cancel order #${o.id}?`) && patch(`/api/admin/orders/${o.id}`, "cancelled")} className="rounded-full border-2 border-ink/20 px-4 text-sm font-bold text-ink/60 hover:border-mirchi hover:text-mirchi">
                        Cancel
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="py-24 text-center">
      <div className="text-6xl">😴</div>
      <p className="mt-3 font-bold text-ink/60">{text}</p>
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="halftone grid min-h-dvh place-items-center bg-haldi px-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setErr("");
          const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ passcode: pass }) });
          if (res.ok) onDone();
          else setErr((await res.json()).error ?? "Login failed");
        }}
        className="brutal w-full max-w-sm rounded-[32px] bg-white p-8 text-center"
      >
        <div className="text-6xl">🔐</div>
        <p className="display stroke-ink mt-2 text-4xl text-pink">{SITE.name}!</p>
        <h1 className="display text-2xl">Admin login</h1>
        <input type="password" autoFocus value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Passcode" className="brutal-sm mt-6 w-full rounded-full px-5 py-3 text-center outline-none" />
        {err && <p className="mt-3 text-sm font-bold text-mirchi">{err}</p>}
        <button className="btn-pop display mt-4 w-full rounded-full bg-pink py-3 text-xl text-white">Enter →</button>
      </form>
    </div>
  );
}
