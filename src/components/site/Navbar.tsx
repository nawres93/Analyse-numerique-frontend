import { Sigma, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/site/ThemeToggle";

const nav = [
  { label: "Modules", href: "/#modules" },
  { label: "Features", href: "/#features" },
  { label: "Why us", href: "/#why" },
  { label: "FAQ", href: "/#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg">
        Skip to content
      </a>
      <div className="glass border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] transition-transform group-hover:scale-105">
              <Sigma className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-navy">
              NumLab<span className="text-brand">.</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-navy">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Hi, <span className="font-semibold text-navy">{user?.name?.split(" ")[0] ?? ""}</span>
                </span>
                <Button asChild variant="outline">
                  <a href={user?.role === "admin" ? "/admin" : "/dashboard"}>Dashboard</a>
                </Button>
                <Button variant="ghost" onClick={signOut}>Sign out</Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <a href="/login">Sign in</a>
                </Button>
                <Button asChild className="bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95">
                  <a href="/register">Get started</a>
                </Button>
              </>
            )}
          </div>

          <button type="button" className="grid h-10 w-10 place-items-center rounded-lg text-navy md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-primary-navigation">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border/60 bg-background/95 md:hidden">
            <nav id="mobile-primary-navigation" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {nav.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-navy hover:bg-secondary">
                  {item.label}
                </a>
              ))}
              <div className="mt-2 flex gap-2">
                {isAuthenticated ? (
                  <Button asChild className="flex-1">
                    <a href={user?.role === "admin" ? "/admin" : "/dashboard"}>Dashboard</a>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="flex-1">
                      <a href="/login">Sign in</a>
                    </Button>
                    <Button asChild className="flex-1 bg-[image:var(--gradient-brand)] text-brand-foreground">
                      <a href="/register">Get started</a>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}