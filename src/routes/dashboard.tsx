import { Outlet, useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";

import { RoleGate } from "@/components/site/RoleGate";
import { StudentSidebar } from "@/components/site/StudentSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/ThemeToggle";

// NOTE : createFileRoute (TanStack) est retiré — il n'a pas de sens ici
// puisque le vrai routing de l'app est fait par react-router-dom (voir App.tsx).
// On garde juste `Route.component` pour respecter la convention déjà utilisée
// partout ailleurs (lazy(() => import(...).then(m => m.Route.component))).
export const Route = {
  component: () => (
    <RoleGate role="student">
      <DashboardLayout />
    </RoleGate>
  ),
};

const titles: Record<string, { title: string; sub?: string }> = {
  "/dashboard": { title: "Overview", sub: "Your learning at a glance." },
  "/dashboard/modules": { title: "Learning Modules", sub: "Every numerical method, ready to explore." },
  "/dashboard/visualizations": { title: "Interactive Visualizations", sub: "Live graphs powered by Desmos." },
  "/dashboard/algorithms": { title: "Algorithms", sub: "Step-by-step interactive players." },
  "/dashboard/practice": { title: "Practice", sub: "Sharpen intuition with guided exercises." },
  "/dashboard/assignments": { title: "Assignments", sub: "Course work from your instructors." },
  "/dashboard/progress": { title: "Progress", sub: "Track mastery over time." },
  "/dashboard/analytics": { title: "Analytics", sub: "Charts, achievements, and learning insights." },
  "/dashboard/quiz": { title: "Quiz", sub: "Timed assessment with scoring and feedback." },
  "/dashboard/bookmarks": { title: "Bookmarks", sub: "Saved chapters, exercises and resources." },
  "/dashboard/resources": { title: "Resources", sub: "Notes, notebooks, references and links." },
  "/dashboard/profile": { title: "Profile", sub: "Manage how the platform knows you." },
  "/dashboard/settings": { title: "Settings", sub: "Preferences and notifications." },
};

function DashboardLayout() {
  const location = useLocation();
  const meta = titles[location.pathname] ?? { title: "Dashboard" };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-secondary/30">
        <StudentSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 px-4 sm:px-6">
            <SidebarTrigger className="shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-lg font-semibold text-navy">
                {meta.title}
              </h1>
              {meta.sub && (
                <p className="truncate text-xs text-muted-foreground">{meta.sub}</p>
              )}
            </div>
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search modules, methods, and resources"
                placeholder="Search modules, methods, resources..."
                className="h-9 w-72 pl-9"
              />
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </header>

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
