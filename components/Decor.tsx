"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function Marquee({
  items,
  className = "",
  speed = 25,
  reverse = false,
  separator = "✺",
}: {
  items: ReactNode[];
  className?: string;
  speed?: number;
  reverse?: boolean;
  separator?: ReactNode;
}) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-5">{it}</span>
          <span>{separator}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="animate-marquee flex w-max" style={{ "--speed": `${speed}s`, animationDirection: reverse ? "reverse" : "normal" } as CSSProperties}>
        {row(false)}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Jhandi / bunting flags — the triangle flag strings from every Indian mela and shaadi. */
export function Bunting({ count = 18, className = "" }: { count?: number; className?: string }) {
  const colors = ["#ff3d7f", "#ffd23f", "#19c27a", "#4cc9f0", "#ff7a00", "#7b2ff7"];
  return (
    <div className={`relative flex w-full justify-between ${className}`} aria-hidden>
      <svg className="absolute inset-x-0 top-0 h-6 w-full" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path d="M0 2 Q50 9 100 2" stroke="#1a0b2e" strokeWidth="0.6" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {Array.from({ length: count }, (_, i) => {
        const t = i / (count - 1);
        const sag = Math.sin(t * Math.PI) * 14;
        return (
          <svg
            key={i}
            width="28"
            height="34"
            viewBox="0 0 28 34"
            className="animate-flag relative"
            style={{ marginTop: sag, animationDelay: `${(i % 6) * 0.25}s` }}
          >
            <path d="M1 1 H27 L14 32Z" fill={colors[i % colors.length]} stroke="#1a0b2e" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="14" cy="10" r="3" fill="#fff" opacity="0.7" />
          </svg>
        );
      })}
    </div>
  );
}

/** Starburst sticker with text. */
export function Burst({
  children,
  color = "#ffd23f",
  className = "",
  spin = false,
  points = 14,
}: {
  children?: ReactNode;
  color?: string;
  className?: string;
  spin?: boolean;
  points?: number;
}) {
  const d = Array.from({ length: points * 2 }, (_, i) => {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 38 : 50;
    return `${i ? "L" : "M"}${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
  }).join(" ");
  return (
    <div className={`grid place-items-center ${className.includes("absolute") ? "" : "relative"} ${className}`}>
      <svg viewBox="-54 -54 108 108" className={`absolute inset-0 h-full w-full ${spin ? "animate-spin-slow" : ""}`} aria-hidden>
        <path d={`${d}Z`} fill={color} stroke="#1a0b2e" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <div className="display relative text-center leading-none">{children}</div>
    </div>
  );
}

export function Squiggle({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 20" className={className} fill="none" aria-hidden>
      <path d="M2 10 Q12 0 22 10 T42 10 T62 10 T82 10 T102 10 T118 10" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Spice({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={`Spice ${level}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < level ? "" : "opacity-20 grayscale"}>
          🌶️
        </span>
      ))}
    </span>
  );
}

export function VegMark() {
  return (
    <span className="inline-grid h-4 w-4 place-items-center rounded-[3px] border-2 border-[#1f8a3b] bg-white" title="100% veg">
      <span className="h-2 w-2 rounded-full bg-[#1f8a3b]" />
    </span>
  );
}
