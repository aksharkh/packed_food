import type { ReactNode } from "react";
import { Bunting } from "./Decor";

export function PageHeader({ kicker, title, sub, bg = "#FFD23F", children }: { kicker: string; title: ReactNode; sub?: string; bg?: string; children?: ReactNode }) {
  return (
    <section className="relative -mt-[76px] overflow-hidden border-b-[3px] border-ink pb-12 pt-28 text-center" style={{ background: bg }}>
      <div className="halftone absolute inset-0" />
      <div className="sunburst animate-spin-slow absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute inset-x-0 top-[76px] opacity-90">
        <Bunting count={16} />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 pt-8">
        <p className="font-hand text-2xl font-bold">{kicker}</p>
        <h1 className="display stroke-ink pop-shadow mt-1 text-6xl text-white sm:text-8xl">{title}</h1>
        {sub && <p className="mx-auto mt-4 max-w-lg text-lg font-semibold">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
