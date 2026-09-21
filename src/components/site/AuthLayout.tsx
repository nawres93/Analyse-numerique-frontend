import { Sigma } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[image:var(--gradient-navy)] text-navy-foreground lg:block">
        <div className="absolute inset-0 grid-math opacity-20 animate-drift" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand/30 blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between gap-10 p-10 xl:p-12">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[image:var(--gradient-brand)] shadow-[var(--shadow-glow)]">
              <Sigma className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold">NumLab.</span>
          </a>

          <div className="max-w-md space-y-6">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand">
              ESPRIT · Numerical Analysis
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight">
              Learn every method through interactive graphs and animated derivations.
            </h2>
            <div className="space-y-3 text-sm text-navy-foreground/75">
              <p>
                <span className="font-mono text-brand">→</span> Desmos-powered live plots.
              </p>
              <p>
                <span className="font-mono text-brand">→</span> MANIM step-by-step animations.
              </p>
              <p>
                <span className="font-mono text-brand">→</span> Auto-graded practice with hints.
              </p>
            </div>
          </div>

          <p className="text-xs text-navy-foreground/55">
            © {new Date().getFullYear()} NumLab · ESPRIT School of Engineering
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md lg:max-w-lg">
          <a href="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)]">
              <Sigma className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold text-navy">NumLab.</span>
          </a>
          <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
          {footer && (
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
