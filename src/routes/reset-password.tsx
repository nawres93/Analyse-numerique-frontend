import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength, scorePassword } from "@/components/site/PasswordStrength";
import { resetPassword } from "@/lib/auth-api";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password · NumLab" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return setErr("At least 8 characters");
    if (scorePassword(pw) < 2) return setErr("Choose a stronger password");
    if (pw !== pw2) return setErr("Passwords do not match");
    setErr(undefined);
    setLoading(true);
    try {
      const token = new URLSearchParams(window.location.search).get("token") ?? "demo";
      await resetPassword(token, pw);
      toast.success("Password updated. You can sign in now.");
      navigate({ to: "/login" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose something you'll remember but no one can guess."
      footer={
        <>
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="pw">New password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="pw"
              type="password"
              className="pl-9"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
          <PasswordStrength value={pw} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw2">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="pw2"
              type="password"
              className="pl-9"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
            />
          </div>
        </div>
        {err && <p className="text-xs text-destructive">{err}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
