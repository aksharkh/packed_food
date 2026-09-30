"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Mood } from "@/lib/products";
import { ADD_EVENT } from "./blast";
import { useCart } from "./CartContext";
import { Face } from "./Pack";

const INK = "#1a0b2e";

export function SamosaSvg({ mood, look, wave = false, className = "" }: { mood: Mood; look: { x: number; y: number }; wave?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <ellipse cx="100" cy="192" rx="62" ry="6" fill="#000" opacity="0.2" />
      {/* arms */}
      <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M34 130 Q14 118 12 96" className={wave ? "animate-jiggle" : ""} style={{ transformOrigin: "34px 130px" }} />
        <path d="M166 130 Q186 140 188 158" />
      </g>
      <circle cx="12" cy="92" r="8" fill="#f5b942" stroke={INK} strokeWidth="4" />
      <circle cx="188" cy="162" r="8" fill="#f5b942" stroke={INK} strokeWidth="4" />
      {/* legs */}
      <path d="M78 184 v8 h-10 M122 184 v8 h10" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* body */}
      <path
        d="M100 12 C110 12 118 20 124 32 L184 148 C194 168 182 186 160 186 L40 186 C18 186 6 168 16 148 L76 32 C82 20 90 12 100 12Z"
        fill="#f5b942"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M100 22 C106 22 111 28 115 36 L150 104" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.35" fill="none" />
      {/* crust bubbles */}
      <g fill="#d98b1f" opacity="0.7">
        <circle cx="70" cy="80" r="3" />
        <circle cx="136" cy="96" r="2.5" />
        <circle cx="58" cy="150" r="3.5" />
        <circle cx="150" cy="160" r="3" />
        <circle cx="96" cy="58" r="2" />
      </g>
      {/* fork crimp along the bottom */}
      <g stroke="#b86e12" strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={42 + i * 10.5} y1="176" x2={42 + i * 10.5} y2="184" />
        ))}
      </g>
      <g transform="translate(100 124) scale(1.05)">
        <Face mood={mood} look={look} />
      </g>
    </svg>
  );
}

const ADD_LINES = ["Wah! Kya choice hai 😋", "Ek aur? Bilkul! 🙌", "Diet kal se 😅", "Crunch time, boss! 💥", "Mast pick! 🔥", "Dil garden garden ho gaya 🌸"];
const IDLE_LINES = [
  "Namaste! Main hoon Samosa Sam 👋",
  "Peri Peri Pataka try karo… if you dare 🌶️",
  "Apna khud ka snack box banao! 📦",
  "Diwali gifting? Bulk order karo 🪔",
  "Psst… scroll karo, aage masti hai 👇",
];

/** Floating mascot: eyes follow the cursor, reacts to add-to-cart, click to open cart. */
export function Mascot() {
  const path = usePathname();
  const { count, setOpen, open } = useCart();
  const ref = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [mood, setMood] = useState<Mood>("happy");
  const [say, setSay] = useState<string | null>(null);
  const [anim, setAnim] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const speak = (text: string, m: Mood, ms = 2600) => {
    clearTimeout(timer.current);
    setSay(text);
    setMood(m);
    setAnim((a) => a + 1);
    timer.current = setTimeout(() => {
      setSay(null);
      setMood("happy");
    }, ms);
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.max(Math.hypot(dx, dy), 1);
      setLook({ x: dx / d, y: dy / d });
    };
    const onAdd = () => speak(ADD_LINES[Math.floor(Math.random() * ADD_LINES.length)], Math.random() < 0.5 ? "love" : "crazy");
    window.addEventListener("pointermove", onMove);
    window.addEventListener(ADD_EVENT, onAdd);
    let i = 0;
    const hello = setTimeout(() => speak(IDLE_LINES[i++], "happy", 3500), 2500);
    const idle = setInterval(() => speak(IDLE_LINES[i++ % IDLE_LINES.length], "wink", 3500), 22000);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(ADD_EVENT, onAdd);
      clearTimeout(hello);
      clearInterval(idle);
      clearTimeout(timer.current);
    };
  }, []);

  if (path.startsWith("/admin") || open) return null;

  return (
    <div className="fixed bottom-3 left-3 z-40 sm:bottom-5 sm:left-5">
      {say && (
        <div
          key={say}
          className="animate-pop-in brutal-sm absolute bottom-[calc(100%+6px)] left-2 w-max max-w-[220px] rounded-2xl rounded-bl-none bg-white px-3 py-2 text-sm font-bold leading-tight"
        >
          {say}
        </div>
      )}
      <button
        ref={ref}
        key={anim}
        aria-label={count ? "Open cart" : "Samosa Sam, our mascot"}
        onMouseEnter={() => !say && setMood("love")}
        onMouseLeave={() => !say && setMood("happy")}
        onClick={() => (count ? setOpen(true) : speak("Arre! Gudgudi hoti hai 🤭 Pehle kuch add toh karo!", "shocked"))}
        className="animate-boing block h-20 w-20 cursor-pointer drop-shadow-[3px_4px_0_rgba(26,11,46,.25)] sm:h-24 sm:w-24"
      >
        <SamosaSvg mood={mood} look={look} wave={!!say} className="h-full w-full" />
        {count > 0 && (
          <span className="absolute -right-1 top-3 grid h-7 min-w-7 place-items-center rounded-full border-2 border-ink bg-pink px-1 text-sm font-extrabold text-white">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
