import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { AuthLayout } from "@/components/site/AuthLayout";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/auth-api";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify email · NumLab" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") ?? "demo";
    verifyEmail(token)
      .then(() => setState("ok"))
      .catch(() => setState("error"));
  }, []);

  return (
    <AuthLayout title="Verify your email" subtitle="Just a moment while we confirm your address.">
      <div className="rounded-xl border border-border bg-secondary/40 p-8 text-center">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-brand" />
            <p className="mt-4 text-sm text-muted-foreground">Verifying…</p>
          </>
        )}
        {state === "ok" && (
          <>
            <CheckCircle2 className="mx-auto h-10 w-10 text-brand" />
            <p className="mt-4 font-display text-lg font-semibold text-navy">
              Email verified
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your account is ready. Welcome to NumLab.
            </p>
            <Button
              asChild
              className="mt-6 bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)]"
            >
              <Link to="/login">Continue to sign in</Link>
            </Button>
          </>
        )}
        {state === "error" && (
          <>
            <XCircle className="mx-auto h-10 w-10 text-destructive" />
            <p className="mt-4 font-display text-lg font-semibold text-navy">
              Verification failed
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              This link may have expired. Request a new one from the sign-in page.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/login">Back to sign in</Link>
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
