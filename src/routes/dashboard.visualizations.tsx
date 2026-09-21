import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, FunctionSquare, Sigma, Waves, Target, Cpu } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/mock-data";

const labs = modules.slice(0, 4).map((m, i) => ({
  ...m,
  subtitle: [
    "Equation editor + live slider control",
    "Matrix playground + elimination trace",
    "Interpolation canvas + draggable nodes",
    "Optimization path + learning-rate control",
  ][i],
}));

export const Route = createFileRoute("/dashboard/visualizations")({
  component: VisualizationsPage,
});

function VisualizationsPage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/60 bg-[image:var(--gradient-navy)] p-6 text-navy-foreground">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand/80">Interactive visualization lab</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Graph, animate, and manipulate the math live.</h2>
            <p className="mt-3 max-w-2xl text-sm text-navy-foreground/70">
              This section is designed like a Desmos-powered studio with room for animated derivations, function sliders, and comparative graph analysis.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Live functions", "12"],
              ["Drag sliders", "7"],
              ["Animation clips", "5"],
              ["Zoom modes", "3"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-navy-foreground/60">{label}</p>
                <p className="mt-1 font-display text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: FunctionSquare, title: "Equation Input", desc: "Type an equation and render the curve instantly." },
          { icon: Sigma, title: "Integral Area", desc: "Fill areas under curves with animated quadrature." },
          { icon: Waves, title: "Interpolation", desc: "Move points and see the fitted curve respond." },
          { icon: Target, title: "Optimization", desc: "Trace gradient paths and convergence speed." },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full border-border/60 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-navy">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {labs.map((lab, i) => (
          <Card key={lab.id} className="group overflow-hidden border-border/60 p-0 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
            <div className="relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(225,29,72,0.10),_transparent_42%)]" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-[image:var(--gradient-brand)] group-hover:text-brand-foreground">
                  <lab.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary">Live lab</Badge>
              </div>
              <h3 className="relative mt-5 font-display text-xl font-semibold text-navy">{lab.title}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{lab.subtitle}</p>
            </div>
            <div className="border-t border-border/60 p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-secondary/50 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Equations</p>
                  <p className="mt-1 text-sm font-semibold text-navy">3 editable</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Animations</p>
                  <p className="mt-1 text-sm font-semibold text-navy">2 synced</p>
                </div>
                <div className="rounded-xl bg-secondary/50 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Mode</p>
                  <p className="mt-1 text-sm font-semibold text-navy">Interactive</p>
                </div>
              </div>
              <Button className="mt-5 bg-[image:var(--gradient-brand)] text-brand-foreground">
                Open lab <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
