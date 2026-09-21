import { motion, useReducedMotion } from "framer-motion";

const tokens = [
  { t: "f(x) = sin(πx) + 0.1102", x: "8%", y: "18%", d: 0 },
  { t: "f'(x)", x: "82%", y: "22%", d: 0.4 },
  { t: "xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)", x: "12%", y: "72%", d: 0.8 },
  { t: "Σ wᵢ f(xᵢ)", x: "78%", y: "68%", d: 1.2 },
  { t: "A = LU", x: "48%", y: "10%", d: 1.6 },
  { t: "ε = |xₙ - x*|", x: "55%", y: "82%", d: 2 },
];

export function HeroMath() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-math opacity-40 animate-drift" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl animate-float-slow" />
      <div className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-navy/20 blur-3xl animate-float-slow" />

      {tokens.map((tok) => (
        <motion.span
          key={tok.t}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? { opacity: 0.28 } : { opacity: 0.35, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: tok.d, duration: 1.2, ease: "easeOut" }}
          className="absolute select-none font-display text-xs text-navy/80 sm:text-sm"
          style={{ left: tok.x, top: tok.y }}
        >
          {tok.t}
        </motion.span>
      ))}

      <svg
        className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 opacity-25 md:block"
        width="720"
        height="260"
        viewBox="0 0 720 260"
        role="img"
        aria-label="Decorative numerical analysis curve"
      >
        <defs>
          <linearGradient id="curveg" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.58 0.24 26)" />
            <stop offset="100%" stopColor="oklch(0.30 0.10 262)" />
          </linearGradient>
        </defs>
        <motion.path
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 2.4, ease: "easeInOut" }}
          d="M0 210 C 120 40, 240 40, 360 130 S 600 260, 720 60"
          fill="none"
          stroke="url(#curveg)"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
