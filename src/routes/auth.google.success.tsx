import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleGoogleCallback } from "@/lib/auth-api";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth/google/success")({
  component: GoogleSuccessPage,
});

function GoogleSuccessPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [status, setStatus] = useState("Vérification des accès Google...");

  useEffect(() => {
    // Extraction native et sécurisée des query parameters
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      setStatus("Création de votre session NumLab...");
      
      handleGoogleCallback(accessToken, refreshToken)
        .then((res) => {
          // Met à jour votre contexte global react pour connecter l'utilisateur
          setAuth(res.token, res.user);
          toast.success("Welcome to NumLab!");
          navigate({ to: "/dashboard" });
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load user profile.");
          navigate({ to: "/login" });
        });
    } else {
      toast.error("Google authentication failed.");
      navigate({ to: "/login" });
    }
  }, [navigate, setAuth]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-background font-sans">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
      <h2 className="text-xl font-semibold text-foreground">Signing in</h2>
      <p className="text-sm text-muted-foreground">{status}</p>
    </div>
  );
}
