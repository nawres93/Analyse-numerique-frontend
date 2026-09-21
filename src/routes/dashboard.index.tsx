import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Flame,
  ArrowRight,
  CheckCircle2,
  Play,
  Brain,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { modules, overviewStats, recentActivity, weeklyHours } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { user } = useAuth();
  const inProgress = modules
    .filter((m) => m.progress > 0 && m.progress < 100)
    .sort((a, b) => b.progress - a.progress);
  const suggestion = inProgress[0] ?? modules.find((m) => m.progress === 0) ?? modules[0];

  const stats = [
    {
      icon: BookOpen,
      label: "Completed modules",
      value: `${overviewStats.completedModules} / ${overviewStats.totalModules}`,
    },
    { icon: TrendingUp, label: "Current progress", value: `${Math.round((inProgress.reduce((s, m) => s + m.progress, 0) + overviewStats.completedModules * 100) / overviewStats.totalModules)}%` },
    { icon: Award, label: "Quiz average", value: `${overviewStats.averageQuiz}%` },
    { icon: Clock, label: "Learning hours", value: `${overviewStats.learningHours.toFixed(1)}h` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl bg-[image:var(--gradient-navy)] p-6 text-navy-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brand">
            Welcome back
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold">
            Hi {user?.name.split(" ")[0]}, ready to keep going?
          </h2>
          <p className="mt-1 text-sm text-navy-foreground/70">
            {overviewStats.currentStreak}-day streak · {overviewStats.averageQuiz}% quiz average · keep it up.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Flame className="h-5 w-5 text-brand" />
            <div>
              <p className="font-display text-lg font-bold leading-none">
                {overviewStats.currentStreak}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-navy-foreground/60">
                day streak
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-navy">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand">
                Continue learning
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold text-navy">
                {suggestion.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {suggestion.description}
              </p>
            </div>
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <suggestion.icon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="font-medium text-navy">{suggestion.progress}%</span>
            </div>
            <Progress value={suggestion.progress} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              asChild
              className="bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95"
            >
              <Link to="/dashboard/modules">
                <Play className="mr-1 h-4 w-4" /> Resume
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard/modules">
                Browse all modules <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">
            This week
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-navy">
            Learning hours
          </h3>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyHours} margin={{ top: 6, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="hrs" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.24 26)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.58 0.24 26)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v}h`, "Hours"]}
                />
                <Area
                  type="monotone"
                  dataKey="h"
                  stroke="oklch(0.58 0.24 26)"
                  strokeWidth={2}
                  fill="url(#hrs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 p-6 lg:col-span-2">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">
            Challenge mode
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-navy">
            Timed quiz with instant feedback
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Practice the numerical methods you just studied with scoring, explanations, and a
            time limit that keeps the session focused.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Timer", "12 minutes"],
              ["Questions", "8 mixed prompts"],
              ["Goal", "Mastery + review"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border/60 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-lg font-semibold text-navy">{value}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="border-border/60 p-6">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
            <Brain className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-navy">Start the quiz</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Test your skills now and get a breakdown of what to review next.
          </p>
          <Button asChild className="mt-5 w-full bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95">
            <Link to="/dashboard/quiz">
              Open quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-navy">In progress</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard/modules">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {inProgress.slice(0, 4).map((m) => (
              <Link
                to="/dashboard/modules"
                key={m.id}
                className="flex items-center gap-4 rounded-xl border border-border/60 p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-navy">{m.title}</p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <Progress value={m.progress} className="h-1.5 flex-1" />
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                      {m.progress}%
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {m.difficulty}
                </Badge>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Recent activity</h3>
          <ol className="mt-4 space-y-4">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.detail}</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                    {a.when}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
