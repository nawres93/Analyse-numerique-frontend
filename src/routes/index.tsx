import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  LineChart,
  Play,
  BookOpen,
  Cpu,
  Target,
  Trophy,
  Wand2,
  Grid3x3,
  Sigma,
  FunctionSquare,
  Compass,
  Binary,
  Ruler,
  Waves,
  Atom,
  ChevronDown,
  Quote,
  Zap,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { HeroMath } from "@/components/site/HeroMath";
import { Hero3D } from "@/components/site/Hero3D";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NumLab â€” Interactive Numerical Analysis for Engineers" },
      {
        name: "description",
        content:
          "Learn numerical analysis at ESPRIT with interactive Desmos graphs, step-by-step algorithm visualizations, and MANIM animations built for university students.",
      },
      { property: "og:title", content: "NumLab â€” Interactive Numerical Analysis for Engineers" },
      {
        property: "og:description",
        content:
          "Learn numerical analysis at ESPRIT with interactive Desmos graphs, step-by-step algorithm visualizations, and MANIM animations built for university students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: LineChart, title: "Interactive Visualizations", desc: "Explore functions with Desmos-powered live graphs, sliders and zoom." },
  { icon: Cpu, title: "Numerical Algorithms", desc: "See every step of Gaussian elimination, Newtonâ€“Raphson, Simpson and more." },
  { icon: Play, title: "MANIM Animations", desc: "Cinematic derivations that turn abstract theory into intuition." },
  { icon: Target, title: "Practice Exercises", desc: "Hints, guided solutions and instant feedback on every problem." },
  { icon: BookOpen, title: "Real-time Graphing", desc: "Modify parameters and watch convergence, error and residuals update live." },
  { icon: Trophy, title: "Progress Tracking", desc: "Badges, streaks and analytics that keep learning on track." },
];

const topics = [
  { icon: Grid3x3, title: "Linear Systems", desc: "Gauss, LU, Cholesky, Jacobi, Gaussâ€“Seidel." },
  { icon: FunctionSquare, title: "Root Finding", desc: "Bisection, Newtonâ€“Raphson, Secant, Fixed Point." },
  { icon: Waves, title: "Interpolation", desc: "Lagrange, Newton, cubic splines, least squares." },
  { icon: Compass, title: "Approximation", desc: "Best-fit polynomials and orthogonal bases." },
  { icon: Sigma, title: "Numerical Integration", desc: "Trapezoidal, Simpson, midpoint, Gaussian quadrature." },
  { icon: Ruler, title: "Numerical Differentiation", desc: "Forward, backward and central differences." },
  { icon: Target, title: "Optimization", desc: "Gradient descent, Newton, golden-section search." },
  { icon: ShieldCheck, title: "Error Analysis", desc: "Absolute, relative, truncation and round-off." },
  { icon: Binary, title: "Matrix Operations", desc: "Decompositions, conditioning, sparse structures." },
  { icon: Atom, title: "Eigenvalues & Eigenvectors", desc: "Power method, QR algorithm, spectral views." },
];

const why = [
  { icon: Wand2, title: "Learn by seeing", desc: "Every algorithm has a synchronized animation and interactive plot." },
  { icon: Zap, title: "Built for engineers", desc: "Problems and datasets modelled on ESPRIT curriculum." },
  { icon: GraduationCap, title: "Assessment ready", desc: "Auto-graded quizzes, adaptive practice and transcripts." },
];

const stats = [
  { label: "Students", value: 12500 },
  { label: "Learning Modules", value: 48 },
  { label: "Interactive Simulations", value: 120, suffix: "+" },
  { label: "Algorithms", value: 60 },
];

const testimonials = [
  {
    quote:
      "The animated Newtonâ€“Raphson finally made convergence click. I stopped memorizing and started reasoning.",
    author: "Ines K.",
    role: "3rd year, Computer Engineering",
  },
  {
    quote:
      "Assigning modules and tracking cohort mastery is exactly what our numerical methods course needed.",
    author: "Dr. Ben Amor",
    role: "Lecturer, ESPRIT",
  },
  {
    quote:
      "The Desmos integration and MANIM clips feel like a masterclass. Best EdTech product I've used.",
    author: "Mohamed S.",
    role: "Masters, Applied Math",
  },
];

const faqs = [
  {
    q: "Is NumLab aligned with the ESPRIT numerical analysis curriculum?",
    a: "Yes. Every module maps to the topics taught at ESPRIT, from direct methods for linear systems through eigenvalue problems.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Everything runs in the browser â€” Desmos graphs, algorithm players and MANIM animations are streamed on demand.",
  },
  {
    q: "Can instructors track student progress?",
    a: "Administrators get a dedicated dashboard with cohort analytics, per-student mastery and exportable reports.",
  },
  {
    q: "Will there be an AI tutor?",
    a: "The architecture is designed for it. Adaptive quizzes, guided explanations and AI-generated practice are on the roadmap.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <HeroMath />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-4 py-1.5 text-xs font-medium text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              ESPRIT School of Engineering Â· Numerical Analysis
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-navy sm:text-5xl md:text-6xl">
              Numerical analysis,{" "}
              <span className="bg-[image:var(--gradient-brand)] bg-clip-text text-transparent">
                seen and felt.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              A premium learning platform where every method, matrix and iteration becomes
              interactive. Graphs, animations and step-by-step algorithms â€” engineered for
              engineers.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
              >
                <Link to="/register">
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8">
                <a href="#modules">Explore modules</a>
              </Button>
            </div>
          </motion.div>

          {/* Preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mx-auto mt-16 max-w-6xl"
          >
            <div className="glass rounded-2xl p-2 shadow-[var(--shadow-elegant)]">
              <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
                <div className="flex items-center gap-1.5 border-b border-border/60 bg-secondary/50 px-4 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                  <span className="h-2.5 w-2.5 rounded-full bg-navy/40" />
                  <span className="ml-3 font-mono text-xs text-muted-foreground">
                    module: numerical-integration · Simpson's 1/3 rule
                  </span>
                </div>
                <div className="grid gap-0 md:grid-cols-[1.35fr_1fr]">
                  <div className="relative bg-gradient-to-br from-secondary/60 to-background p-4 sm:p-6">
                    <Hero3D />
                  </div>
                  <div className="space-y-4 border-t border-border/60 p-6 md:border-l md:border-t-0">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        approximation
                      </p>
                      <p className="mt-1 font-display text-2xl font-bold text-navy">
                        ∫₀¹ [sin(πx) + 0.1102] dx ≈ 0.7468
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <Row label="Rule" value="Simpson's 1/3" />
                      <Row label="Function" value="sin(πx) + 0.1102" />
                      <Row label="Subdivisions n" value="8" />
                      <Row label="Convergence" value="O(h⁴)" />
                    </div>
                    <div className="rounded-lg border border-border/60 bg-secondary/40 p-3 text-xs text-muted-foreground">
                      The curve and the displayed approximation both follow Simpson's 1/3 rule on [0, 1].
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Features"
          title="Everything a numerical analyst needs"
          subtitle="Six primitives that make abstract theory tangible from the first click."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <Card className="group h-full border-border/70 p-6 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-[var(--shadow-soft)]">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOPICS */}
      <section id="modules" className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Learning topics"
            title="Ten pillars of numerical analysis"
            subtitle="Each module blends theory, animated derivation, live graphing and graded practice."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {topics.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 5) * 0.05, duration: 0.4 }}
              >
                <Card className="group relative h-full overflow-hidden border-border/70 bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
                  <div className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[image:var(--gradient-brand)] opacity-0 blur-2xl transition-opacity group-hover:opacity-30" />
                  <div className="relative">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-navy transition-colors group-hover:bg-[image:var(--gradient-brand)] group-hover:text-brand-foreground">
                      <t.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-semibold text-navy">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Why NumLab"
              title="A rigorous platform, without the friction."
              subtitle="We removed everything between a student and the aha moment â€” installs, jargon, and passive slides."
            />
            <div className="mt-10 space-y-5">
              {why.map((w) => (
                <div key={w.title} className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <w.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-semibold text-navy">
                      {w.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-[image:var(--gradient-brand)] opacity-10 blur-2xl" />
            <div className="glass relative rounded-2xl p-6 shadow-[var(--shadow-elegant)]">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-border/60 bg-card p-6">
                    <p className="font-display text-4xl font-bold text-navy">
                      <AnimatedCounter value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-border/60 bg-[image:var(--gradient-navy)] p-6 text-navy-foreground">
                <p className="font-display text-sm uppercase tracking-widest text-navy-foreground/60">
                  Live snapshot
                </p>
                <p className="mt-2 text-lg">
                  1,284 iterations of Newtonâ€“Raphson executed in the last hour.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[image:var(--gradient-navy)] py-24 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            invert
            eyebrow="Testimonials"
            title="Loved by students and lecturers"
            subtitle="Feedback from ESPRIT classrooms and beyond."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <Quote className="h-6 w-6 text-brand" />
                <p className="mt-4 text-sm leading-relaxed text-navy-foreground/90">
                  "{t.quote}"
                </p>
                <div className="mt-6">
                  <p className="font-display text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-navy-foreground/60">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions, answered"
          subtitle="Everything you need before your first module."
        />
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left font-display text-base text-navy hover:no-underline [&[data-state=open]>svg]:rotate-180">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[image:var(--gradient-navy)] p-10 text-center text-navy-foreground sm:p-16">
          <div className="absolute inset-0 grid-math opacity-10" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold sm:text-4xl">
              Start solving numerical problems the way engineers should.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-navy-foreground/70">
              Free to try. Built with ESPRIT precision. No installation required.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
              >
                <Link to="/register">
                  Create your account <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/20 bg-white/5 px-8 text-navy-foreground hover:bg-white/10"
              >
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-border/60 py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium text-navy">{value}</span>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  invert = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  invert?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p
        className={`font-mono text-xs font-semibold uppercase tracking-[0.2em] ${
          invert ? "text-brand" : "text-brand"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-3xl font-bold sm:text-4xl ${
          invert ? "text-navy-foreground" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base ${
            invert ? "text-navy-foreground/70" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Unused import guard so tree-shaking keeps intentional icons available for later.
void ChevronDown;

