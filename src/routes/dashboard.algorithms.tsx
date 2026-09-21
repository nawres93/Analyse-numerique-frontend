import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { modules } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/algorithms")({
  component: () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {modules.map((m) => (
        <Card key={m.id} className="p-6">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
            <m.icon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-display text-base font-semibold text-navy">
            {m.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Step-by-step algorithm player
          </p>
        </Card>
      ))}
    </div>
  ),
});
