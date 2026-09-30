"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { describe, keyFor, type CartLine, type Described, type NewLine } from "@/lib/cart";
import { shippingFor } from "@/lib/config";
import { ADD_EVENT, blast } from "./blast";

type Resolved = CartLine & { info: Described };

type CartState = {
  lines: Resolved[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  hasSub: boolean;
  qtyOf: (key: string) => number;
  add: (line: NewLine, from?: { x: number; y: number }) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  bump: number;
  ready: boolean;
};

const Ctx = createContext<CartState | null>(null);
const KEY = "dhm-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
      if (saved) setRaw(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(raw));
    } catch {}
  }, [raw, ready]);

  const add = useCallback((line: NewLine, from?: { x: number; y: number }) => {
    const key = keyFor(line);
    setRaw((ls) => {
      const existing = ls.find((l) => l.key === key);
      if (existing) {
        if (line.type === "sub") return ls;
        return ls.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + 1, 99) } : l));
      }
      // Only one subscription at a time.
      const base = line.type === "sub" ? ls.filter((l) => l.type !== "sub") : ls;
      return [...base, { ...line, key, qty: 1 } as CartLine];
    });
    setBump((b) => b + 1);
    if (from) blast(from.x, from.y);
    window.dispatchEvent(new CustomEvent(ADD_EVENT));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setRaw((ls) => (qty <= 0 ? ls.filter((l) => l.key !== key) : ls.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 99) } : l))));
  }, []);

  const value = useMemo<CartState>(() => {
    const lines = raw.map((l) => ({ ...l, info: describe(l)! })).filter((l) => l.info) as Resolved[];
    const subtotal = lines.reduce((s, l) => s + l.info.unit * l.qty, 0);
    const hasSub = lines.some((l) => l.type === "sub");
    const shipping = hasSub ? 0 : shippingFor(subtotal);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      hasSub,
      qtyOf: (key) => raw.find((l) => l.key === key)?.qty ?? 0,
      add,
      setQty,
      clear: () => setRaw([]),
      open,
      setOpen,
      bump,
      ready,
    };
  }, [raw, add, setQty, open, bump, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

/** Helper for click handlers: add + blast from the clicked element's centre. */
export function useAddFrom() {
  const { add } = useCart();
  return (line: NewLine) => (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    add(line, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
}
