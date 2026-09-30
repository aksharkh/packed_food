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

function fitSize(text: string, max = 36, width = 176) {
  return Math.min(max, width / (text.length * 0.62));
}

/** Illustrated snack pouch. Swap to a photo by setting `product.image`. */
export function Pack({
  product,
  mood,
  look,
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
  const body = "M28 22 C70 14 150 14 192 22 C200 110 202 190 196 272 C150 284 70 284 24 272 C18 190 20 110 28 22Z";

  return (
    <svg viewBox="0 0 220 300" className={className} role="img" aria-label={product.name}>
      <defs>
        <pattern id={`dots${uid}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#000" opacity="0.12" />
        </pattern>
        <clipPath id={`clip${uid}`}>
          <path d={body} />
        </clipPath>
        <linearGradient id={`shine${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="290" rx="78" ry="7" fill="#000" opacity="0.18" />
      <path d={body} fill={color} />
      <g clipPath={`url(#clip${uid})`}>
        <rect width="220" height="300" fill={`url(#dots${uid})`} />
        {/* sunburst behind the face */}
        <g transform="translate(110 138)" opacity="0.18">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d="M0 0 L-9 -140 L9 -140Z" fill="#fff" transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        {/* crimps */}
        <rect x="0" y="0" width="220" height="44" fill="#000" opacity="0.16" />
        <rect x="0" y="254" width="220" height="40" fill="#000" opacity="0.16" />
        {Array.from({ length: 20 }, (_, i) => (
          <g key={i} stroke={INK} strokeWidth="1.5" opacity="0.25">
            <line x1={34 + i * 8} y1="22" x2={34 + i * 8} y2="40" />
            <line x1={34 + i * 8} y1="258" x2={34 + i * 8} y2="276" />
          </g>
        ))}
        <rect x="40" y="50" width="16" height="200" rx="8" fill={`url(#shine${uid})`} />
      </g>
      <path d={body} fill="none" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />

      {/* brand */}
      <g transform="translate(110 70) rotate(-6)">
        <path d="M-70 -18 L70 -22 L66 16 L-66 18Z" fill={INK} />
        <text
          textAnchor="middle"
          y="9"
          fontSize="27"
          fill={accent}
          style={{ fontFamily: "var(--font-luckiest)", letterSpacing: "1px" }}
        >
          DHAMAKA!
        </text>
      </g>

      {/* veg mark + weight */}
      <rect x="34" y="96" width="15" height="15" rx="2" fill="#fff" stroke="#1f8a3b" strokeWidth="2.5" />
      <circle cx="41.5" cy="103.5" r="4" fill="#1f8a3b" />
      <g transform="translate(174 104) rotate(10)">
        <circle r="17" fill="#fff" stroke={INK} strokeWidth="3" />
        <text textAnchor="middle" y="5" fontSize="12" fill={INK} style={{ fontFamily: "var(--font-luckiest)" }}>
          {product.weight}
        </text>
      </g>

      {showFace && (
        <g transform="translate(110 146)">
          <circle r="44" fill={accent} stroke={INK} strokeWidth="4" />
          <Face mood={mood ?? product.mood} look={look} />
        </g>
      )}

      {/* flavour name */}
      {packLine.map((line, i) => (
        <text
          key={i}
          x="110"
          y={220 + i * 30}
          textAnchor="middle"
          fontSize={fitSize(line, i === 0 ? 30 : 36)}
          fill={i === 0 ? "#fff" : accent}
          stroke={INK}
          strokeWidth="6"
          paintOrder="stroke"
          strokeLinejoin="round"
          style={{ fontFamily: "var(--font-luckiest)" }}
        >
          {line}
        </text>
      ))}
    </svg>
  );
}
