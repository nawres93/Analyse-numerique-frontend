import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/lib/auth-api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password · NumLab" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPage,
});

const schema = z.object({ email: z.string().trim().email("Enter a valid email") });

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setErr(parsed.error.issues[0].message);
      return;
    }
    setErr(undefined);
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("If an account exists, we sent a reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-border bg-secondary/40 p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-brand" />
          <p className="mt-4 font-display text-lg font-semibold text-navy">
            Check your inbox
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a reset link to <span className="font-medium text-navy">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-9"
                placeholder="you@esprit.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!err}
              />
            </div>
            {err && <p className="text-xs text-destructive">{err}</p>}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
