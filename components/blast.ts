const BITS = ["🌶️", "✨", "🥔", "💥", "⭐", "🔥", "🧂", "🌿"];
const COLORS = ["#ff3d7f", "#ff7a00", "#ffd23f", "#b8f34a", "#7b2ff7", "#4cc9f0"];

/** "Masala blast" — a burst of spice-confetti from a screen point. */
export function blast(x: number, y: number, count = 26) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    const emoji = Math.random() < 0.45;
    const size = emoji ? 16 + Math.random() * 14 : 6 + Math.random() * 8;
    Object.assign(el.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      zIndex: "9999",
      pointerEvents: "none",
      fontSize: `${size}px`,
      width: emoji ? "auto" : `${size}px`,
      height: emoji ? "auto" : `${size * (Math.random() < 0.5 ? 1 : 0.45)}px`,
      background: emoji ? "none" : COLORS[i % COLORS.length],
      borderRadius: Math.random() < 0.5 ? "50%" : "2px",
      lineHeight: "1",
    });
    if (emoji) el.textContent = BITS[Math.floor(Math.random() * BITS.length)];
    document.body.appendChild(el);
    const angle = Math.random() * Math.PI * 2;
    const power = 90 + Math.random() * 170;
    const dx = Math.cos(angle) * power;
    const dy = Math.sin(angle) * power - 120;
    const rot = (Math.random() - 0.5) * 900;
    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.2) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.45 },
        { transform: `translate(calc(-50% + ${dx * 1.3}px), calc(-50% + ${dy + 260}px)) scale(0.8) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.4,1)" },
    ).onfinish = () => el.remove();
  }
}

export const ADD_EVENT = "dhamaka:add";
