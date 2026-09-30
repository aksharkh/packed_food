import { promises as fs } from "fs";
import path from "path";
import type { BulkStatus, OrderStatus } from "./config";

// Simple JSON-file storage. Fine to start with on a single server;
// swap for a real database (Supabase, Postgres, Firebase) before scaling.
const DATA_DIR = path.join(process.cwd(), "data");

export type OrderLine = {
  type: "product" | "combo" | "box" | "sub";
  title: string;
  subtitle: string;
  unit: number;
  qty: number;
  packs: string[];
  recurring?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
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

export type BulkEnquiry = {
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

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DATA_DIR, file), "utf8")) as T;
  } catch {
    return fallback;
  }
}

let queue: Promise<unknown> = Promise.resolve();

// Serialises read-modify-write so simultaneous orders don't overwrite each other.
function mutate<T, R>(file: string, fallback: T, fn: (data: T) => R): Promise<R> {
  const run = queue.then(async () => {
    const data = await readJson(file, fallback);
    const result = fn(data);
    await fs.mkdir(DATA_DIR, { recursive: true });
    const target = path.join(DATA_DIR, file);
    await fs.writeFile(`${target}.tmp`, JSON.stringify(data, null, 2));
    await fs.rename(`${target}.tmp`, target);
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

function newId(prefix: string, taken: { id: string }[]) {
  let id: string;
  do id = `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;
  while (taken.some((o) => o.id === id));
  return id;
}

export const getOrders = () => readJson<Order[]>("orders.json", []);

export async function getOrder(id: string) {
  return (await getOrders()).find((o) => o.id === id);
}

export function addOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt" | "status">) {
  return mutate<Order[], Order>("orders.json", [], (orders) => {
    const now = new Date().toISOString();
    const full: Order = { ...order, id: newId("DHM", orders), createdAt: now, updatedAt: now, status: "new" };
    orders.unshift(full);
    return full;
  });
}

export function setOrderStatus(id: string, status: OrderStatus) {
  return mutate<Order[], Order | undefined>("orders.json", [], (orders) => {
    const o = orders.find((x) => x.id === id);
    if (o) {
      o.status = status;
      o.updatedAt = new Date().toISOString();
    }
    return o;
  });
}

export const getBulk = () => readJson<BulkEnquiry[]>("bulk.json", []);

export function addBulk(e: Omit<BulkEnquiry, "id" | "createdAt" | "status">) {
  return mutate<BulkEnquiry[], BulkEnquiry>("bulk.json", [], (list) => {
    const full: BulkEnquiry = { ...e, id: newId("BLK", list), createdAt: new Date().toISOString(), status: "new" };
    list.unshift(full);
    return full;
  });
}

export function setBulkStatus(id: string, status: BulkStatus) {
  return mutate<BulkEnquiry[], BulkEnquiry | undefined>("bulk.json", [], (list) => {
    const e = list.find((x) => x.id === id);
    if (e) e.status = status;
    return e;
  });
}
