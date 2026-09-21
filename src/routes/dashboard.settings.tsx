import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
      <Card className="border-border/60 p-6">
        <h3 className="font-display text-lg font-semibold text-navy">Appearance</h3>
        <p className="mt-1 text-sm text-muted-foreground">Shape the interface the way you like it.</p>
        <Separator className="my-4" />
        <Row
          label="Dark mode"
          desc="Use a dark palette across the platform."
          checked={theme === "dark"}
          onChange={(v) => setTheme(v ? "dark" : "light")}
        />
      </Card>

      <div className="space-y-6">
        <Card className="border-border/60 p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Notifications</h3>
          <p className="mt-1 text-sm text-muted-foreground">Manage reminders and release notifications.</p>
          <Separator className="my-4" />
          <Row label="Assignment reminders" desc="Email me when a new assignment is posted." checked />
          <Row label="Weekly progress digest" desc="A summary every Sunday evening." checked />
          <Row label="New module releases" desc="Announcements when new modules ship." />
        </Card>

        <Card className="border-border/60 p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Account</h3>
          <p className="mt-1 text-sm text-muted-foreground">Manage access and sign-out behavior.</p>
          <Separator className="my-4" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-navy">Sign out of this device</p>
              <p className="text-xs text-muted-foreground">You&apos;ll need to sign back in to continue learning.</p>
            </div>
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="pr-4">
        <Label className="text-sm font-medium text-navy">{label}</Label>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
