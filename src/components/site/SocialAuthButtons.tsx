import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { oauthSignIn, type OAuthProvider } from "@/lib/auth-api";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.5-1.68 4.4-5.5 4.4a6.1 6.1 0 1 1 0-12.2 5.5 5.5 0 0 1 3.9 1.5l2.6-2.5A9.4 9.4 0 0 0 12 2.6 9.4 9.4 0 1 0 21.4 12c0-.63-.06-1.24-.16-1.8H12z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#1877F2" d="M22 12a10 10 0 1 0-11.6 9.88v-7H8v-2.88h2.4V9.8c0-2.37 1.4-3.67 3.55-3.67 1.03 0 2.1.18 2.1.18v2.32h-1.18c-1.17 0-1.53.72-1.53 1.46v1.76h2.6l-.42 2.88h-2.18v7A10 10 0 0 0 22 12z"/>
    </svg>
  );
}

export function SocialAuthButtons({ label = "Continue with" }: { label?: string }) {
  const [pending, setPending] = useState<OAuthProvider | null>(null);

  async function handle(provider: OAuthProvider) {
    setPending(provider);
    try {
      // Déclenche la redirection vers FastAPI puis Google
      await oauthSignIn(provider);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Social sign-in failed.");
      setPending(null); // On arrête le chargement uniquement s'il y a une erreur immédiate
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {/* BOUTON GOOGLE */}
        <Button
          type="button"
          variant="outline"
          onClick={() => handle("google")}
          disabled={pending !== null}
          className="h-11"
        >
          {pending === "google" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <GoogleIcon />
              <span>{label} Google</span>
            </div>
          )}
        </Button>

        {/* BOUTON FACEBOOK */}
        <Button
          type="button"
          variant="outline"
          onClick={() => handle("facebook")}
          disabled={pending !== null}
          className="h-11"
        >
          {pending === "facebook" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <FacebookIcon />
              <span>{label} Facebook</span>
            </div>
          )}
        </Button>
      </div>

      {/* LIGNE DE SÉPARATION "OR WITH EMAIL" */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs uppercase tracking-widest text-muted-foreground">
            or with email
          </span>
        </div>
      </div>
    </div>
  );
}
