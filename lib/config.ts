// Brand + business details — change these to your own.
export const SITE = {
  name: "Dhamaka",
  full: "Dhamaka Snacks",
  tagline: "Bhook lagi? Crunch karo!",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "hello@dhamakasnacks.in",
  address: "Plot 7, MIDC Food Park, Pune 411019",
  fssai: "FSSAI Lic. No. 1XXXXXXXXXXXXX",
  shippingFee: 49,
  freeShippingAbove: 399,
};

export const ORDER_STATUSES = [
  { id: "new", label: "Order placed", emoji: "🧾" },
  { id: "confirmed", label: "Confirmed", emoji: "👍" },
  { id: "packed", label: "Packed", emoji: "📦" },
  { id: "shipped", label: "Shipped", emoji: "🚚" },
  { id: "delivered", label: "Delivered", emoji: "🎉" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["id"] | "cancelled";

export const BULK_STATUSES = ["new", "contacted", "won", "lost"] as const;
export type BulkStatus = (typeof BULK_STATUSES)[number];

export const OCCASIONS = [
  "🪔 Diwali / festive gifting",
  "💍 Wedding favours",
  "🏢 Corporate / office pantry",
  "🎂 Birthday / kitty party",
  "🏫 School / college event",
  "🛒 Retail / reseller",
  "Something else",
];

export function rupees(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function shippingFor(subtotal: number) {
  return subtotal === 0 || subtotal >= SITE.freeShippingAbove ? 0 : SITE.shippingFee;
}
