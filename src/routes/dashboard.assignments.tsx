import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/assignments")({
  component: () => (
    <Card className="p-12 text-center">
      <p className="font-display text-lg font-semibold text-navy">No assignments yet</p>
      <p className="mt-2 text-sm text-muted-foreground">
        When your instructor publishes an assignment it will appear here.
      </p>
    </Card>
  ),
});
