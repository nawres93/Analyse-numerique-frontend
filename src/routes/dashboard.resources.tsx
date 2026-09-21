import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, NotebookPen, BookMarked, PlayCircle, Link as LinkIcon, Search, Download, LibraryBig } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { resources, type ResourceItem } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/resources")({
  component: ResourcesPage,
});

const iconFor = (k: ResourceItem["kind"]) => {
  switch (k) {
    case "PDF": return FileText;
    case "Notebook": return NotebookPen;
    case "Reference": return BookMarked;
    case "Video": return PlayCircle;
    default: return LinkIcon;
  }
};

function ResourcesPage() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<ResourceItem["kind"] | "All">("All");
  const kinds: (ResourceItem["kind"] | "All")[] = ["All", "PDF", "Notebook", "Reference", "Video", "Link"];

  const filtered = useMemo(() => resources.filter((r) => {
    if (kind !== "All" && r.kind !== kind) return false;
    if (q && !`${r.title} ${r.module ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, kind]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/60 bg-[image:var(--gradient-navy)] p-6 text-navy-foreground">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand/80">Resources library</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Lecture notes, notebooks, references and media.</h2>
            <p className="mt-3 max-w-2xl text-sm text-navy-foreground/70">A curated resource hub designed like a premium academic library.</p>
          </div>
          <Button className="bg-[image:var(--gradient-brand)] text-brand-foreground"><LibraryBig className="mr-2 h-4 w-4" /> Browse all</Button>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search resources…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <Button key={k} size="sm" variant={kind === k ? "default" : "outline"} onClick={() => setKind(k)} className={kind === k ? "bg-[image:var(--gradient-brand)] text-brand-foreground" : ""}>
              {k}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map((r) => {
          const Icon = iconFor(r.kind);
          return (
            <Card key={r.id} className="flex items-center gap-4 border-border/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{r.title}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-[10px]">{r.kind}</Badge>
                  {r.module && <span>· {r.module}</span>}
                  {r.size && <span>· {r.size}</span>}
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <a href={r.href} target="_blank" rel="noreferrer"><Download className="mr-1 h-4 w-4" /> Open</a>
              </Button>
            </Card>
          );
        })}
        {filtered.length === 0 && <Card className="p-12 text-center text-sm text-muted-foreground">No resources match your filters.</Card>}
      </div>
    </div>
  );
}
