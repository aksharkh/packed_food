"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";

export default function TrackOrder() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read browser-only storage after mount
      setRecent(JSON.parse(localStorage.getItem("dhm-orders") ?? "[]"));
    } catch {}
  }, []);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="animate-bob text-7xl">🚚</div>
        <h1 className="display stroke-ink pop-shadow mt-3 text-6xl text-haldi">Track order</h1>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (id.trim()) router.push(`/order/${id.trim().toUpperCase()}`);
          }}
        >
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. DHM-12345" className="brutal-sm min-w-0 flex-1 rounded-full bg-white px-5 py-3 uppercase outline-none" />
          <button className="btn-pop rounded-full bg-pink px-6 font-extrabold text-white">Go</button>
        </form>
        {recent.length > 0 && (
          <div className="mt-8">
            <p className="font-hand text-lg">your recent orders</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {recent.map((r) => (
                <Link key={r} href={`/order/${r}`} className="brutal-sm rounded-full bg-lime px-4 py-2 font-mono text-sm font-bold">#{r}</Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
