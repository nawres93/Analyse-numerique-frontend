import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Timer, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { modules } from "@/lib/mock-data";

const packs = modules.slice(0, 6).map((m, i) => ({
  ...m,
  problems: 8 + i,
  minutes: 15 + (i % 3) * 10,
}));

export const Route = createFileRoute("/dashboard/practice")({
  component: PracticePage,
});

function PracticePage() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/60 bg-[image:var(--gradient-navy)] p-6 text-navy-foreground">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand/80">Practice studio</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Guided exercises, hints, and instant feedback.</h2>
            <p className="mt-3 max-w-2xl text-sm text-navy-foreground/70">
              The practice area is built to feel like a premium tutoring environment with difficulty levels, timers and progress cues.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Exercises", "48"],
              ["Hints", "120+"],
              ["Solutions", "48"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-navy-foreground/60">{label}</p>
                <p className="mt-1 font-display text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {packs.map((p, index) => (
          <Card key={p.id} className="group flex h-full flex-col border-border/60 p-0 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
            <div className="relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(225,29,72,0.08),_transparent_38%)]" />
              <div className="relative flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <p.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="border-brand/30 text-brand">{p.difficulty}</Badge>
              </div>
              <h3 className="relative mt-5 font-display text-lg font-semibold text-navy">{p.title}</h3>
              <p className="relative mt-1 text-sm text-muted-foreground">{p.problems} guided problems · {p.minutes} min</p>
            </div>
            <div className="mt-auto border-t border-border/60 p-6">
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand" /> Hints and step-by-step solutions</div>
                <div className="flex items-center gap-2"><Timer className="h-4 w-4 text-brand" /> Timed or untimed practice modes</div>
                <div className="flex items-center gap-2"><BrainCircuit className="h-4 w-4 text-brand" /> Adaptive difficulty based on mastery</div>
              </div>
              <Button className="mt-5 w-full bg-[image:var(--gradient-brand)] text-brand-foreground">
                Start practice
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
