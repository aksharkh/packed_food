import { BOX_SIZES, PREFS, findCombo, findPlan, findProduct, type Product } from "./products";

export type CartLine =
  | { key: string; type: "product"; slug: string; qty: number }
  | { key: string; type: "combo"; id: string; qty: number }
  | { key: string; type: "box"; items: string[]; qty: number }
  | { key: string; type: "sub"; plan: string; pref: string; qty: number };

export type NewLine =
  | { type: "product"; slug: string }
  | { type: "combo"; id: string }
  | { type: "box"; items: string[] }
  | { type: "sub"; plan: string; pref: string };

export function keyFor(l: NewLine) {
  switch (l.type) {
    case "product":
      return `p:${l.slug}`;
    case "combo":
      return `c:${l.id}`;
    case "box":
      return `b:${[...l.items].sort().join(",")}`;
    case "sub":
      return `s:${l.plan}:${l.pref}`;
  }
}

export type Described = {
  title: string;
  subtitle: string;
  unit: number;
  color: string;
  packs: Product[];
  emoji?: string;
  recurring?: string;
};

/** Single source of truth for what a cart line is and what it costs. Returns null if invalid. */
export function describe(line: NewLine): Described | null {
  switch (line.type) {
    case "product": {
      const p = findProduct(line.slug);
      return p ? { title: p.name, subtitle: p.weight, unit: p.price, color: p.color, packs: [p] } : null;
    }
    case "combo": {
      const c = findCombo(line.id);
      if (!c) return null;
      return { title: c.name, subtitle: `${c.items.length} packs combo`, unit: c.price, color: c.color, packs: c.items.map((s) => findProduct(s)!), emoji: c.emoji };
    }
    case "box": {
      const box = BOX_SIZES.find((b) => b.size === line.items.length);
      const packs = line.items.map((s) => findProduct(s));
      if (!box || packs.some((p) => !p)) return null;
      const full = packs.reduce((s, p) => s + p!.price, 0);
      return {
        title: `Custom ${box.label}`,
        subtitle: `${box.size} packs of your choice · ${Math.round(box.discount * 100)}% off`,
        unit: Math.round(full * (1 - box.discount)),
        color: "#FF3D7F",
        packs: packs as Product[],
        emoji: "📦",
      };
    }
    case "sub": {
      const plan = findPlan(line.plan);
      const pref = PREFS.find((p) => p.id === line.pref);
      if (!plan || !pref) return null;
      return {
        title: `${plan.name} subscription`,
        subtitle: `${plan.packs} packs every ${plan.every} · ${pref.label}`,
        unit: plan.price,
        color: plan.color,
        packs: [],
        emoji: plan.emoji,
        recurring: plan.every,
      };
    }
  }
}
