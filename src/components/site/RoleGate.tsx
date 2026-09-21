import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/auth-api";

export function RoleGate({
  role,
  children,
}: {
  role?: UserRole;
  children: ReactNode;
}) {
  const { isAuthenticated, isHydrated, user } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      window.location.assign("/login");
      return;
    }
    if (role && user?.role !== role) {
      window.location.assign(user?.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [isHydrated, isAuthenticated, user, role]);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }
  return <>{children}</>;
}
