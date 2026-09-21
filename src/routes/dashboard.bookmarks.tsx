import { createFileRoute } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { modules } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/bookmarks")({
  component: BookmarksPage,
});

function BookmarksPage() {
  const bookmarked = modules.filter((m) => m.progress > 0).slice(0, 3);
  return (
    <div className="space-y-4">
      {bookmarked.map((m) => (
        <Card key={m.id} className="flex items-center gap-4 p-5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <m.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-navy">{m.title}</p>
            <p className="truncate text-xs text-muted-foreground">Bookmarked chapter</p>
          </div>
          <Button variant="ghost" size="icon">
            <Bookmark className="h-4 w-4 fill-brand text-brand" />
          </Button>
        </Card>
      ))}
      {bookmarked.length === 0 && (
        <Card className="p-12 text-center text-sm text-muted-foreground">
          You haven't bookmarked anything yet.
        </Card>
      )}
    </div>
  );
}
