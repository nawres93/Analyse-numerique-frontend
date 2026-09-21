import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Trophy, Star, Flame, GraduationCap } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { modules, weeklyHours, overviewStats } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/progress")({
  component: ProgressPage,
});

const badges = [
  { icon: Trophy, name: "Convergence Master", desc: "Completed Root Finding", earned: true },
  { icon: Star, name: "First Steps", desc: "Finished your first chapter", earned: true },
  { icon: Flame, name: "6-day streak", desc: "Learn 6 days in a row", earned: true },
  { icon: GraduationCap, name: "Quadrature Pro", desc: "Score 90%+ on Integration", earned: false },
];

function ProgressPage() {
  const totalProgress = Math.round(
    modules.reduce((s, m) => s + m.progress, 0) / modules.length,
  );

  const radar = modules.slice(0, 6).map((m) => ({
    subject: m.title.split(" ")[0],
    A: m.progress,
    fullMark: 100,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Overall</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy">{totalProgress}%</p>
          <Progress value={totalProgress} className="mt-3" />
        </Card>
        <Card className="p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Quiz average</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy">
            {overviewStats.averageQuiz}%
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Across 14 quizzes taken</p>
        </Card>
        <Card className="p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Streak</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy">
            {overviewStats.currentStreak} days
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Best: 12 days</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Hours this week</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHours}>
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
                />
                <Bar dataKey="h" fill="oklch(0.58 0.24 26)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Mastery per topic</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  dataKey="A"
                  stroke="oklch(0.58 0.24 26)"
                  fill="oklch(0.58 0.24 26)"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-display text-lg font-semibold text-navy">Achievements</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
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
        <div className="mt-4">
          <Badge variant="outline" className="border-brand/30 text-brand">
            3 of 4 earned
          </Badge>
        </div>
      </Card>
    </div>
  );
}
