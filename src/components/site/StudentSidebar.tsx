import {
  LayoutDashboard,
  BookOpen,
  LineChart,
  Cpu,
  Dumbbell,
  ClipboardList,
  TrendingUp,
  Bookmark,
  Library,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Sigma,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

const learn = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Learning Modules", url: "/dashboard/modules", icon: BookOpen },
  { title: "Visualizations", url: "/dashboard/visualizations", icon: LineChart },
  { title: "Algorithms", url: "/dashboard/algorithms", icon: Cpu },
  { title: "Practice", url: "/dashboard/practice", icon: Dumbbell },
  { title: "Assignments", url: "/dashboard/assignments", icon: ClipboardList },
];

const you = [
  { title: "Progress", url: "/dashboard/progress", icon: TrendingUp },
  { title: "Bookmarks", url: "/dashboard/bookmarks", icon: Bookmark },
  { title: "Resources", url: "/dashboard/resources", icon: Library },
];

const account = [
  { title: "Profile", url: "/dashboard/profile", icon: UserIcon },
  { title: "Settings", url: "/dashboard/settings", icon: SettingsIcon },
];

export function StudentSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = window.location.pathname;
  const { user, signOut } = useAuth();

  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);

  const initials =
    user?.name
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "S";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/70">
        <div className="flex items-center justify-between px-2 py-1">
          <a href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)]">
              <Sigma className="h-4 w-4" strokeWidth={2.5} />
            </span>
            {!collapsed && (
              <span className="font-display text-base font-bold tracking-tight">
                NumLab<span className="text-brand">.</span>
              </span>
            )}
          </a>
          {!collapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden"
              aria-label="Collapse sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Learn</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {learn.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your journey</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {you.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {account.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={signOut} className="text-brand">
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Sign out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-border/70">
            <AvatarFallback className="bg-[image:var(--gradient-brand)] text-brand-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-sidebar-foreground">
                  {user?.name ?? "Student"}
                </p>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {user?.role ?? "student"}
                </Badge>
              </div>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {user?.email ?? "—"}
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
