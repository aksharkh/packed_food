"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { blast } from "@/components/blast";
import { Nav } from "@/components/Nav";
import { SamosaSvg } from "@/components/Mascot";
import { ORDER_STATUSES, SITE, rupees, type OrderStatus } from "@/lib/config";

type Tracked = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  name: string;
  city: string;
  payment: "cod" | "upi";
  lines: { type: string; title: string; subtitle: string; unit: number; qty: number; recurring?: string }[];
  subtotal: number;
  shipping: number;
  total: number;
};

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Tracked | null>(null);
  const [error, setError] = useState("");
  const [fresh, setFresh] = useState(false);

  useEffect(() => {
    const isNew = new URLSearchParams(window.location.search).has("new");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off read of the URL on mount
    setFresh(isNew);
    if (isNew) setTimeout(() => blast(window.innerWidth / 2, window.innerHeight / 3, 50), 400);
    let alive = true;
    const load = () =>
      fetch(`/api/orders/${id}`, { cache: "no-store" })
        .then(async (r) => {
          const d = await r.json();
          if (!alive) return;
          if (r.ok) setOrder(d);
          else setError(d.error || "Order not found");
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [id]);

  const step = order ? ORDER_STATUSES.findIndex((s) => s.id === order.status) : -1;
  const cancelled = order?.status === "cancelled";

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-8">
        {error && (
          <div className="py-20 text-center">
            <div className="text-7xl">🤔</div>
            <h1 className="display mt-3 text-4xl">{error}</h1>
            <Link href="/order" className="btn-pop mt-6 inline-block rounded-full bg-ink px-6 py-3 font-extrabold text-white">Try another ID</Link>
          </div>
        )}
        {!order && !error && <p className="font-hand py-24 text-center text-2xl">Dhoondh rahe hain… 🔍</p>}
        {order && (
          <>
            <div className="text-center">
              <SamosaSvg mood={cancelled ? "shocked" : step >= 4 ? "love" : "happy"} look={{ x: 0, y: 0.3 }} wave className="animate-bob mx-auto h-40 w-40" />
              <p className="font-hand text-2xl font-bold text-pink">
                {fresh && order.status === "new" ? `Shukriya, ${order.name}! 🙏` : `Hello ${order.name}!`}
              </p>
              <h1 className="display stroke-ink mt-1 text-5xl text-pink sm:text-7xl">
                {cancelled ? "Cancelled" : ORDER_STATUSES[step]?.label}
              </h1>
              <p className="brutal-sm mt-4 inline-block rounded-full bg-white px-4 py-1 font-mono font-bold">#{order.id}</p>
            </div>

            {!cancelled && (
              <ol className="mt-10 grid grid-cols-5 gap-1">
                {ORDER_STATUSES.map((s, i) => (
                  <li key={s.id} className="flex flex-col items-center text-center">
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-full border-[3px] border-ink text-2xl transition ${
                        i < step ? "bg-lime" : i === step ? "animate-jiggle bg-haldi shadow-[3px_3px_0_#1a0b2e]" : "bg-white opacity-40 grayscale"
                      }`}
                    >
                      {s.emoji}
                    </span>
                    <span className={`mt-2 text-xs font-extrabold ${i <= step ? "" : "text-ink/40"}`}>{s.label}</span>
                  </li>
                ))}
              </ol>
            )}

            <section className="brutal mt-10 rounded-[28px] bg-white p-5 sm:p-7">
              <p className="text-sm font-bold text-ink/60">Delivering to {order.city} · {order.payment === "upi" ? "UPI" : "Cash"} on delivery</p>
              <ul className="mt-4 space-y-2 border-t-[3px] border-dashed border-ink/20 pt-4">
                {order.lines.map((l, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span>
                      <b>{l.qty}× {l.title}</b>
                      <span className="block text-xs text-ink/60">{l.subtitle}</span>
                    </span>
                    <span className="font-extrabold">{rupees(l.unit * l.qty)}{l.recurring ? `/${l.recurring}` : ""}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1 border-t-[3px] border-dashed border-ink/20 pt-4">
                <div className="flex justify-between"><span>Delivery</span><span>{order.shipping ? rupees(order.shipping) : "FREE"}</span></div>
                <div className="display flex justify-between text-3xl"><span>Total</span><span>{rupees(order.total)}</span></div>
              </div>
            </section>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hi Dhamaka! About my order #${order.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pop rounded-full bg-[#25d366] px-6 py-3 font-extrabold"
              >
                💬 WhatsApp us
              </a>
              <Link href="/shop" className="btn-pop rounded-full bg-pink px-6 py-3 font-extrabold text-white">Aur snacks →</Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}
