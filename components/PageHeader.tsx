import type { ReactNode } from "react";
import { Chip } from "./Pack";

export function PageHeader({ kicker, title, sub, bg = "#FF7A00", children }: { kicker: string; title: ReactNode; sub?: string; bg?: string; children?: ReactNode }) {
  return (
    <section className="relative -mt-[76px] overflow-hidden pb-14 pt-32 text-center text-white" style={{ background: `radial-gradient(120% 120% at 50% 0%, ${bg} 0%, #1a0b2e 120%)` }}>
      <Chip className="animate-drift absolute left-[6%] top-28 w-20 opacity-90" style={{ "--r": "-20deg" } as React.CSSProperties} />
      <Chip className="animate-drift absolute right-[8%] top-40 w-28 blur-[1px]" style={{ "--r": "30deg", "--dur": "7s" } as React.CSSProperties} />
      <Chip className="animate-drift absolute bottom-6 left-[22%] w-14 blur-[2px]" style={{ "--r": "60deg", "--dur": "8s" } as React.CSSProperties} />
      <div className="relative mx-auto max-w-3xl px-4">
        <p className="text-sm font-extrabold uppercase tracking-[.3em] text-white/70">{kicker}</p>
        <h1 className="display pop-shadow mt-3 text-7xl sm:text-9xl">{title}</h1>
        {sub && <p className="mx-auto mt-4 max-w-lg text-lg font-medium text-white/85">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
