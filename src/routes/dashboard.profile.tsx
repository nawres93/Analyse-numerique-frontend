import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const initials = user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() ?? "S";
  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="overflow-hidden border-border/60 p-0">
        <div className="bg-[image:var(--gradient-navy)] p-6 text-center text-navy-foreground">
          <Avatar className="mx-auto h-24 w-24 ring-4 ring-white/10">
            <AvatarFallback className="bg-[image:var(--gradient-brand)] text-2xl text-brand-foreground">{initials}</AvatarFallback>
          </Avatar>
          <p className="mt-4 font-display text-xl font-semibold">{user?.name}</p>
          <p className="text-sm text-navy-foreground/70">{user?.email}</p>
          <Badge className="mt-3 bg-white/10 text-navy-foreground">ESPRIT · Student</Badge>
        </div>
        <div className="grid gap-3 p-6 sm:grid-cols-3">
          {[
            ["Certificates", "04"],
            ["Badges", "12"],
            ["Study streak", "6d"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-secondary/50 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
              <p className="mt-1 font-display text-2xl font-bold text-navy">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-border/60 p-6">
        <h3 className="font-display text-lg font-semibold text-navy">Personal information</h3>
        <p className="mt-1 text-sm text-muted-foreground">Edit your identity, academic details, and profile preferences.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Row label="Full name" defaultValue={user?.name ?? ""} />
          <Row label="Email" defaultValue={user?.email ?? ""} type="email" />
          <Row label="Phone" defaultValue={user?.phone ?? ""} placeholder="+216 ..." />
          <Row label="Birthday" defaultValue={user?.birthday ?? ""} type="date" />
          <Row label="University" defaultValue="ESPRIT School of Engineering" />
          <Row label="Program" defaultValue="Computer Engineering · S3" />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)]">Save changes</Button>
        </div>
      </Card>
    </div>
  );
}

function Row({
  label,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  defaultValue: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} type={type} placeholder={placeholder} />
    </div>
  );
}
