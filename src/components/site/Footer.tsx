import { Sigma } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-[image:var(--gradient-navy)] text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <a href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-brand)]">
              <Sigma className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold">NumLab.</span>
          </a>
          <p className="max-w-xs text-sm text-navy-foreground/70">
            An interactive numerical analysis platform crafted with the ESPRIT School of
            Engineering visual identity.
          </p>
        </div>

        {[
          { title: "Platform", links: ["Modules", "Visualizations", "Practice", "Quizzes"] },
          { title: "Company", links: ["About", "Contact", "Careers", "Blog"] },
          { title: "Legal", links: ["Privacy Policy", "Terms", "Documentation", "Cookies"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-navy-foreground/60">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-navy-foreground/80 transition-colors hover:text-brand"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-navy-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} NumLab · ESPRIT School of Engineering.</p>
          <p>Made with rigor for numerical analysts.</p>
        </div>
      </div>
    </footer>
  );
}
