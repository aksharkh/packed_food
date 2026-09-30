"use client";

import { useId } from "react";
import type { Mood, Product } from "@/lib/products";

const INK = "#1a0b2e";

/** Cartoon face, centred on (0,0), roughly 90px wide. `look` moves the pupils (-1..1). */
export function Face({ mood, look = { x: 0, y: 0 }, blink = true }: { mood: Mood; look?: { x: number; y: number }; blink?: boolean }) {
  const px = look.x * 4.5;
  const py = look.y * 4;
  const eye = (cx: number, r = 11, pr = 5.5) => (
    <g className={blink ? "animate-blink" : undefined}>
      <circle cx={cx} cy={-6} r={r} fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx={cx + px} cy={-6 + py} r={pr} fill={INK} />
      <circle cx={cx + px + 2} cy={-8 + py} r={1.8} fill="#fff" />
    </g>
  );
  const heart = (cx: number) => (
    <path
      transform={`translate(${cx} -6) scale(1.1)`}
      d="M0 8 C -14 -2, -10 -14, 0 -6 C 10 -14, 14 -2, 0 8Z"
      fill="#ff3d7f"
      stroke={INK}
      strokeWidth="2.5"
    />
  );

  return (
    <g>
      {/* cheeks */}
      <ellipse cx={-27} cy={10} rx={7} ry={4.5} fill="#ff3d7f" opacity="0.45" />
      <ellipse cx={27} cy={10} rx={7} ry={4.5} fill="#ff3d7f" opacity="0.45" />

      {mood === "happy" && (
        <>
          {eye(-15)}
          {eye(15)}
          <path d="M-15 9 Q0 30 15 9 Z" fill={INK} />
          <ellipse cx={0} cy={19} rx={6} ry={3.5} fill="#ff6b8b" />
        </>
      )}
      {mood === "love" && (
        <>
          {heart(-15)}
          {heart(15)}
          <path d="M-13 10 Q0 24 13 10" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === "cool" && (
        <>
          <rect x={-29} y={-15} width={25} height={17} rx={6} fill={INK} />
          <rect x={4} y={-15} width={25} height={17} rx={6} fill={INK} />
          <path d="M-4 -9 H4" stroke={INK} strokeWidth="3.5" />
          <path d="M-24 -11 l6 0" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M9 -11 l6 0" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <path d="M-8 14 Q5 21 14 9" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === "wink" && (
        <>
          {eye(-15)}
          <path d="M8 -5 Q15 -13 22 -5" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M-14 9 Q0 24 14 9" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M2 15 q4 12 10 2 z" fill="#ff6b8b" stroke={INK} strokeWidth="2" />
        </>
      )}
      {mood === "fire" && (
        <>
          <path d="M-26 -22 L-6 -15" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <path d="M26 -22 L6 -15" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          {eye(-15, 10, 5)}
          {eye(15, 10, 5)}
          <path d="M-17 8 H17 Q14 26 0 26 Q-14 26 -17 8Z" fill={INK} />
          <path d="M-14 9 H14 V14 H-14Z" fill="#fff" />
          <path d="M30 -20 q6 8 0 12 q-6 -4 0 -12z" fill="#4cc9f0" stroke={INK} strokeWidth="1.5" />
        </>
      )}
      {mood === "crazy" && (
        <>
          {eye(-16, 13, 4)}
          {eye(15, 8, 4.5)}
          <path d="M-14 11 Q0 22 16 8" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M4 16 q10 14 14 -2 z" fill="#ff6b8b" stroke={INK} strokeWidth="2" />
        </>
      )}
      {mood === "shocked" && (
        <>
          {eye(-15, 12, 3.5)}
          {eye(15, 12, 3.5)}
          <ellipse cx={0} cy={17} rx={7} ry={9} fill={INK} />
        </>
      )}
    </g>
  );
}

function fitSize(text: string, max = 40, width = 170) {
  return Math.min(max, width / (text.length * 0.5));
}

/** A single golden chip. */
export function Chip({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg viewBox="0 0 120 90" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={`chip${uid}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ffe9a3" />
          <stop offset="0.55" stopColor="#f6c34a" />
          <stop offset="1" stopColor="#d9912a" />
        </radialGradient>
      </defs>
      <path d="M10 48 C6 20 40 4 68 8 C98 12 116 32 110 54 C104 78 70 88 42 82 C22 78 12 66 10 48Z" fill={`url(#chip${uid})`} />
      <path d="M26 40 C44 28 74 26 96 38 M22 56 C44 46 76 46 100 56" stroke="#c9801f" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.45" />
      <path d="M30 26 C44 16 64 14 80 18" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
      <g fill="#c2410c" opacity="0.75">
        <circle cx="50" cy="38" r="2" />
        <circle cx="72" cy="52" r="1.8" />
        <circle cx="84" cy="34" r="1.5" />
        <circle cx="38" cy="60" r="1.6" />
        <circle cx="62" cy="66" r="2" />
      </g>
    </svg>
  );
}

/** Glossy snack pouch render. Swap to a real photo by setting `product.image`.
 *  (`mood` / `look` / `showFace` are accepted for compatibility with the v1 cartoon pack.) */
export function Pack({
  product,
  className = "",
  showFace = true,
}: {
  product: Product;
  mood?: Mood;
  look?: { x: number; y: number };
  className?: string;
  showFace?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  if (product.image) {
    // eslint-disable-next-line @next/next/no-img-element -- user-supplied pack photos of unknown size
    return <img src={product.image} alt={product.name} className={`object-contain ${className}`} />;
  }
  const { color, accent, packLine } = product;
  const body = "M28 20 C70 12 150 12 192 20 C200 110 202 190 196 274 C150 286 70 286 24 274 C18 190 20 110 28 20Z";
  const font = { fontFamily: "var(--font-anton)", fontStyle: "italic" as const };

  return (
    <svg viewBox="0 0 220 300" className={className} role="img" aria-label={product.name}>
      <defs>
        <clipPath id={`clip${uid}`}>
          <path d={body} />
        </clipPath>
        <linearGradient id={`v${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.26" />
        </linearGradient>
        <linearGradient id={`h${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.32" />
          <stop offset="0.22" stopColor="#000" stopOpacity="0" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={`g${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`glow${uid}`} cx="50%" cy="58%" r="50%">
          <stop offset="0" stopColor={accent} stopOpacity="0.9" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="110" cy="291" rx="74" ry="6" fill="#000" opacity="0.22" />
      <g clipPath={`url(#clip${uid})`}>
        <rect width="220" height="300" fill={color} />
        <rect width="220" height="300" fill={`url(#glow${uid})`} />
        {/* swoosh */}
        <path d="M-10 150 C60 110 150 190 230 130 L230 300 L-10 300Z" fill="#000" opacity="0.09" />
        <rect width="220" height="300" fill={`url(#v${uid})`} />
        <rect width="220" height="300" fill={`url(#h${uid})`} />
        {/* crimps */}
        <rect y="12" width="220" height="22" fill="#fff" opacity="0.14" />
        <rect y="262" width="220" height="24" fill="#000" opacity="0.14" />
        {Array.from({ length: 27 }, (_, i) => (
          <g key={i} stroke="#fff" strokeWidth="1" opacity="0.28">
            <line x1={30 + i * 6} y1="15" x2={30 + i * 6} y2="32" />
            <line x1={30 + i * 6} y1="265" x2={30 + i * 6} y2="282" />
          </g>
        ))}
        {/* gloss streak */}
        <rect x="38" y="36" width="26" height="224" fill={`url(#g${uid})`} transform="skewX(-4)" />
      </g>

      {/* brand badge */}
      <g transform="translate(110 70)">
        <ellipse rx="62" ry="24" fill="#fff" />
        <ellipse rx="58" ry="20.5" fill={"#1a0b2e"} />
        <text textAnchor="middle" y="8.5" fontSize="23" fill={accent} style={{ ...font, letterSpacing: "1px" }}>
          DHAMAKA
        </text>
      </g>

      {/* flavour name */}
      {packLine.map((line, i) => (
        <text
          key={i}
          x="110"
          y={132 + i * 36}
          textAnchor="middle"
          fontSize={fitSize(line)}
          fill={i === 0 ? "#fff" : accent}
          style={{ ...font, filter: "drop-shadow(0 2px 0 rgba(0,0,0,.35))" }}
        >
          {line}
        </text>
      ))}

      {/* chips + hero ingredient */}
      {showFace && (
        <g>
          <g transform="translate(62 210) rotate(-18) scale(0.62)">
            <path d="M10 48 C6 20 40 4 68 8 C98 12 116 32 110 54 C104 78 70 88 42 82 C22 78 12 66 10 48Z" fill="#f2b93b" />
            <path d="M30 26 C44 16 64 14 80 18" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
          </g>
          <g transform="translate(100 196) rotate(14) scale(0.7)">
            <path d="M10 48 C6 20 40 4 68 8 C98 12 116 32 110 54 C104 78 70 88 42 82 C22 78 12 66 10 48Z" fill="#f8cf5c" />
            <path d="M26 40 C44 28 74 26 96 38" stroke="#c9801f" strokeWidth="3" fill="none" opacity="0.4" />
            <path d="M30 26 C44 16 64 14 80 18" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.55" />
          </g>
          <text x="58" y="206" fontSize="30">{product.ingredients[1]?.emoji ?? product.ingredients[0].emoji}</text>
        </g>
      )}

      <text x="186" y="256" textAnchor="end" fontSize="11" fill="#fff" opacity="0.85" style={font}>
        NET WT {product.weight}
      </text>
      <rect x="32" y="244" width="13" height="13" rx="2" fill="#fff" stroke="#1f8a3b" strokeWidth="2" />
      <circle cx="38.5" cy="250.5" r="3.4" fill="#1f8a3b" />
    </svg>
  );
}
