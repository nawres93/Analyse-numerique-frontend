import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Trophy, Star, Flame, GraduationCap, Activity, Gauge, Target } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { modules, weeklyHours, overviewStats } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsPage,
});

const achievements = [
  { icon: Trophy, name: "Convergence Master", desc: "Completed Root Finding", earned: true },
  { icon: Star, name: "First Steps", desc: "Finished your first chapter", earned: true },
  { icon: Flame, name: "6-day streak", desc: "Learn 6 days in a row", earned: true },
  { icon: GraduationCap, name: "Quadrature Pro", desc: "Score 90%+ on Integration", earned: false },
];

function AnalyticsPage() {
  const totalProgress = Math.round(modules.reduce((s, m) => s + m.progress, 0) / modules.length);
  const radar = modules.slice(0, 6).map((m) => ({
    subject: m.title.split(" ")[0],
    A: m.progress,
    fullMark: 100,
  }));

  const consistency = Math.round((weeklyHours.filter((d) => d.h >= 1.5).length / weeklyHours.length) * 100);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/60 bg-[image:var(--gradient-navy)] p-6 text-navy-foreground">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand/80">Student analytics</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Track mastery, consistency, and academic momentum.</h2>
            <p className="mt-3 max-w-2xl text-sm text-navy-foreground/75">
              This page combines learning analytics, achievements, and progress trends into a modern student command view.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Learning streak" value={`${overviewStats.currentStreak} days`} />
            <Metric label="Quiz average" value={`${overviewStats.averageQuiz}%`} />
            <Metric label="Consistency" value={`${consistency}%`} />
            <Metric label="Modules mastered" value={`${overviewStats.completedModules}`} />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} title="Overall progress" value={`${totalProgress}%`} desc="Across all modules" />
        <StatCard icon={Gauge} title="Weekly focus" value={`${overviewStats.learningHours.toFixed(1)}h`} desc="Average hours studied" />
        <StatCard icon={Target} title="Goal completion" value={`${Math.round((overviewStats.completedModules / overviewStats.totalModules) * 100)}%`} desc="Completed modules" />
        <StatCard icon={Trophy} title="Achievements" value="3 / 4" desc="Badges earned" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/60 p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Learning hours trend</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyHours}>
                <defs>
                  <linearGradient id="analyticsFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.24 26)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.58 0.24 26)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Area type="monotone" dataKey="h" stroke="oklch(0.58 0.24 26)" fill="url(#analyticsFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-border/60 p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Topic mastery</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar dataKey="A" stroke="oklch(0.58 0.24 26)" fill="oklch(0.58 0.24 26)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60 p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Achievements</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {achievements.map((b) => (
              <div
                key={b.name}
                className={`flex items-center gap-3 rounded-xl border p-4 ${
                  b.earned
                    ? "border-brand/30 bg-brand-soft/50"
                    : "border-dashed border-border bg-secondary/30 opacity-60"
                }`}
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${b.earned ? "bg-[image:var(--gradient-brand)] text-brand-foreground" : "bg-muted text-muted-foreground"}`}>
                  <b.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy">{b.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-border/60 p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Weekly summary</h3>
          <div className="mt-4 space-y-4">
            {[
              ["Focus sessions", "18"],
              ["Completed exercises", "42"],
              ["Average quiz score", `${overviewStats.averageQuiz}%`],
              ["Resources viewed", "27"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-2xl font-bold text-navy">{value}</p>
              </div>
            ))}
          </div>
          <Badge variant="outline" className="mt-4 border-brand/30 text-brand">
            Analytics refreshed today
          </Badge>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.2em] text-navy-foreground/60">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, desc }: { icon: typeof Activity; title: string; value: string; desc: string }) {
  return (
    <Card className="border-border/60 p-5">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-navy">{value}</p>
      <p className="text-sm font-medium text-navy">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </Card>
  );
}
