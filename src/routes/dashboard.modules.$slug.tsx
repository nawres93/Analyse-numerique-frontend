import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Play, BookOpen, Sigma, Flame, LineChart, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { modules } from "@/lib/mock-data";

// NOTE : createFileRoute (TanStack) retiré — le vrai routing de l'app est
// fait par react-router-dom (voir App.tsx). On garde juste `Route.component`
// pour respecter la convention utilisée par les imports lazy() de App.tsx.
export const Route = {
  component: ModuleDetailPage,
};

function ModuleDetailPage() {
  const { slug } = useParams();
  const module = modules.find((m) => m.slug === slug);

  if (!module) {
    return (
      <Card className="p-12 text-center">
        <p className="font-display text-xl font-semibold text-navy">Module not found</p>
        <p className="mt-2 text-sm text-muted-foreground">This module may have been renamed or removed.</p>
        <Button asChild className="mt-4 bg-[image:var(--gradient-brand)] text-brand-foreground">
          <Link to="/dashboard/modules">Back to modules</Link>
        </Button>
      </Card>
    );
  }

  const sections = [
    "Introduction",
    "Theory",
    "Mathematical derivation",
    "Interactive example",
    "Desmos visualization",
    "MANIM animation",
    "Worked examples",
    "Exercises",
    "Quiz",
    "References",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard/modules">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to modules
          </Link>
        </Button>
        <Badge variant="outline" className="border-brand/30 text-brand">{module.difficulty}</Badge>
      </div>

      <Card className="overflow-hidden border-border/60 bg-[image:var(--gradient-navy)] p-6 text-navy-foreground">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand/80">Module detail</p>
            <h1 className="mt-2 font-display text-3xl font-bold">{module.title}</h1>
            <p className="mt-3 max-w-2xl text-sm text-navy-foreground/75">{module.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {slug === "interpolation" ? (
                <Button asChild className="bg-[image:var(--gradient-brand)] text-brand-foreground">
                  <Link to="/dashboard/modules/interpolation/placement">
                    <Play className="mr-2 h-4 w-4" /> Commencer (quiz de placement)
                  </Link>
                </Button>
              ) : (
                <Button className="bg-[image:var(--gradient-brand)] text-brand-foreground" disabled>
                  <Play className="mr-2 h-4 w-4" /> Bientôt disponible
                </Button>
              )}
              <Button variant="outline" className="border-white/20 bg-white/5 text-navy-foreground hover:bg-white/10">
                Open visualization
              </Button>
            </div>
          </div>
          <Card className="border-white/10 bg-white/5 p-5 text-navy-foreground backdrop-blur">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Chapters" value={`${module.chapters}`} />
              <MiniStat label="Duration" value={`${module.hours}h`} />
              <MiniStat label="Progress" value={`${module.progress}%`} />
              <MiniStat label="Status" value={module.progress === 100 ? "Done" : "Active"} />
            </div>
            <Progress value={module.progress} className="mt-4" />
          </Card>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/60 p-6">
          <h2 className="font-display text-xl font-semibold text-navy">Learning flow</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {sections.map((section, index) => (
              <div key={section} className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-navy">{section}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 p-6">
          <h2 className="font-display text-xl font-semibold text-navy">Method snapshot</h2>
          <div className="mt-4 space-y-4 text-sm text-muted-foreground">
            <p><span className="font-semibold text-navy">Type:</span> Numerical analysis module</p>
            <p><span className="font-semibold text-navy">Focus:</span> Theory + live exploration + assessment</p>
            <p><span className="font-semibold text-navy">Assessment:</span> Quiz and guided exercises</p>
          </div>
          <div className="mt-5 grid gap-3">
            <Feature icon={BookOpen} text="Textbook-style explanations" />
            <Feature icon={LineChart} text="Interactive graphs and slider controls" />
            <Feature icon={Sigma} text="Step-by-step mathematical derivations" />
            <Feature icon={Flame} text="Progress and mastery tracking" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-navy-foreground/60">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold">{value}</p>
    </div>
  );
}

function Feature({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm text-navy">{text}</p>
    </div>
  );
}
