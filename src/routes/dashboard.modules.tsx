import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { modules, type ModuleItem } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/modules")({
  component: ModulesPage,
});

function ModulesPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "in-progress" | "completed" | "not-started">("all");

  const filtered = useMemo(() => {
    return modules.filter((m) => {
      if (q && !`${m.title} ${m.description} ${m.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (tab === "in-progress") return m.progress > 0 && m.progress < 100;
      if (tab === "completed") return m.progress === 100;
      if (tab === "not-started") return m.progress === 0;
      return true;
    });
  }, [q, tab]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/60 bg-[image:var(--gradient-navy)] p-6 text-navy-foreground">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand/80">Module library</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Browse your numerical analysis curriculum.</h2>
            <p className="mt-3 max-w-2xl text-sm text-navy-foreground/70">
              Every module is structured like a micro-product: theory, derivation, interactive examples, quizzes and references.
            </p>
          </div>
          <Button className="bg-[image:var(--gradient-brand)] text-brand-foreground">
            <BookOpen className="mr-2 h-4 w-4" /> Start first module
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search modules…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in-progress">In progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="not-started">New</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m) => (
          <ModuleCard key={m.id} m={m} />
        ))}
      </div>
      {filtered.length === 0 && (
        <Card className="p-12 text-center text-sm text-muted-foreground">
          No modules match your search.
        </Card>
      )}
    </div>
  );
}

function ModuleCard({ m }: { m: ModuleItem }) {
  const status = m.progress === 100 ? "Completed" : m.progress > 0 ? "In progress" : "Not started";
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/60 p-0 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <div className="relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(225,29,72,0.12),_transparent_38%)]" />
        <div className="relative flex items-start justify-between">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-[image:var(--gradient-brand)] group-hover:text-brand-foreground">
            <m.icon className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="border-brand/30 text-brand">
            {m.difficulty}
          </Badge>
        </div>
        <h3 className="relative mt-5 font-display text-lg font-semibold text-navy">{m.title}</h3>
        <p className="relative mt-1 text-sm text-muted-foreground">{m.description}</p>
      </div>
      <div className="mt-auto border-t border-border/60 p-6">
        <div className="flex flex-wrap gap-1.5">
          {m.tags.map((t) => (
            <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{status}</span>
            <span className="font-medium text-navy">{m.progress}%</span>
          </div>
          <Progress value={m.progress} />
        </div>
        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{m.chapters} chapters · {m.hours}h</span>
          <Button asChild size="sm" variant={m.progress > 0 ? "default" : "outline"} className={m.progress > 0 ? "bg-[image:var(--gradient-brand)] text-brand-foreground" : ""}>
            <Link to={`/dashboard/modules/${m.slug}`}>
              {m.progress === 100 ? "Review" : m.progress > 0 ? "Resume" : "Start"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
