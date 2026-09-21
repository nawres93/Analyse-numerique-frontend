import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock3, RotateCcw, ShieldCheck, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  topic: string;
};

const quiz: Question[] = [
  {
    prompt: "Which method repeatedly brackets a root and guarantees convergence when the initial interval contains a sign change?",
    options: ["Newton-Raphson", "Secant method", "Bisection method", "Gauss elimination"],
    answer: 2,
    explanation: "Bisection guarantees convergence by halving an interval with a sign change on every step.",
    topic: "Root finding",
  },
  {
    prompt: "In Simpson's 1/3 rule, the number of subintervals must be:",
    options: ["Odd", "Even", "Prime", "Any positive integer"],
    answer: 1,
    explanation: "Composite Simpson's 1/3 rule works with an even number of subintervals.",
    topic: "Integration",
  },
  {
    prompt: "What is the primary advantage of iterative solvers over direct elimination for large sparse systems?",
    options: ["They always produce exact answers", "They need no initial guess", "They scale better with sparsity", "They remove round-off error completely"],
    answer: 2,
    explanation: "Iterative methods often exploit sparsity and are more memory efficient on large systems.",
    topic: "Linear systems",
  },
  {
    prompt: "Which quantity tracks how far the current solution is from satisfying the equation system?",
    options: ["Residual", "Interpolation node", "Jacobian determinant", "Condition number"],
    answer: 0,
    explanation: "The residual measures the mismatch between the left and right sides of the model.",
    topic: "Error analysis",
  },
  {
    prompt: "A smaller step size in numerical differentiation usually reduces truncation error but can increase:",
    options: ["Overflow risk", "Round-off error", "Matrix rank", "Eigenvalue multiplicity"],
    answer: 1,
    explanation: "Very small steps can magnify floating-point round-off, so differentiation needs balance.",
    topic: "Differentiation",
  },
];

export const Route = createFileRoute("/dashboard/quiz")({
  component: QuizPage,
});

function QuizPage() {
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [selected, setSelected] = useState<number[]>(Array(quiz.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (submitted) return;
    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);

  const score = useMemo(
    () => selected.reduce((total, answer, index) => total + (answer === quiz[index].answer ? 1 : 0), 0),
    [selected],
  );

  const percent = Math.round((score / quiz.length) * 100);
  const answeredCount = selected.filter((answer) => answer !== -1).length;
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const finishQuiz = () => {
    setSubmitted(true);
    setCurrent(0);
  };

  const restartQuiz = () => {
    setSelected(Array(quiz.length).fill(-1));
    setSubmitted(false);
    setCurrent(0);
    setTimeLeft(12 * 60);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
        <Badge className="bg-brand-soft text-brand">Timed assessment</Badge>
      </div>

      <Card className="overflow-hidden border-border/60 bg-[image:var(--gradient-navy)] p-6 text-navy-foreground">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand/90">Quiz arena</p>
            <h1 className="mt-2 font-display text-3xl font-bold">Mastery check</h1>
            <p className="mt-2 max-w-2xl text-sm text-navy-foreground/75">
              Answer carefully, manage your time, and review the explanations to lock in the concept.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3" aria-label="Quiz summary">
            <Stat label="Time left" value={`${minutes}:${seconds}`} icon={Clock3} />
            <Stat label="Answered" value={`${answeredCount}/${quiz.length}`} icon={CheckCircle2} />
            <Stat label="Score" value={`${score}/${quiz.length}`} icon={Trophy} />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-6">
          {submitted ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-brand/20 bg-brand-soft/40 p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-brand-foreground">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-navy">
                      Quiz complete
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      You scored {score} out of {quiz.length} ({percent}%).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {quiz.map((question, index) => {
                  const correct = selected[index] === question.answer;
                  return (
                    <div key={question.prompt} className="rounded-2xl border border-border/60 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={correct ? "default" : "secondary"} className={correct ? "bg-emerald-600" : ""}>
                          {correct ? "Correct" : "Review"}
                        </Badge>
                        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {question.topic}
                        </span>
                      </div>
                      <p className="mt-3 font-medium text-navy">{question.prompt}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{question.explanation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-brand">Question {current + 1}</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-navy">{quiz[current].topic}</h2>
                </div>
                <Button variant="outline" onClick={finishQuiz}>
                  Submit quiz
                </Button>
              </div>

              <Progress value={((current + 1) / quiz.length) * 100} />

              <div className="flex flex-wrap gap-2">
                {quiz.map((question, index) => {
                  const active = index === current;
                  const answered = selected[index] !== -1;
                  return (
                    <button
                      key={question.topic}
                      type="button"
                      onClick={() => setCurrent(index)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "border-brand bg-brand text-brand-foreground"
                          : answered
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-border/60 bg-background text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
                <p className="font-medium text-navy">{quiz[current].prompt}</p>
                <div className="mt-4 grid gap-3">
                  {quiz[current].options.map((option, index) => {
                    const active = selected[current] === index;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          const next = [...selected];
                          next[current] = index;
                          setSelected(next);
                        }}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          active
                            ? "border-brand bg-brand-soft text-navy shadow-[var(--shadow-glow)]"
                            : "border-border/60 bg-background hover:border-brand/50 hover:bg-secondary/60"
                        }`}
                      >
                        <span className="block text-sm font-medium">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrent((value) => Math.max(0, value - 1))}
                  disabled={current === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {current < quiz.length - 1 ? (
                  <Button
                    onClick={() => setCurrent((value) => Math.min(quiz.length - 1, value + 1))}
                    className="bg-[image:var(--gradient-brand)] text-brand-foreground"
                  >
                    Next question
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={finishQuiz} className="bg-[image:var(--gradient-brand)] text-brand-foreground">
                    Finish and score
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold text-navy">Session panel</h3>
          <div className="mt-4 space-y-4" aria-live="polite">
            <Metric label="Completion" value={`${Math.round((answeredCount / quiz.length) * 100)}%`} />
            <Metric label="Accuracy" value={submitted ? `${percent}%` : "Pending"} />
            <Metric label="Remaining" value={submitted ? "Done" : `${timeLeft}s`} />
          </div>
          <div className="mt-5 rounded-2xl border border-border/60 bg-background/80 p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Feedback guide</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Correct answers glow green, missed items are surfaced with explanations after submission.
            </p>
          </div>
          <div className="mt-6 rounded-2xl border border-brand/20 bg-brand-soft/40 p-4 text-sm text-muted-foreground">
            Answers are saved locally in the browser for this practice session. Use the explanations
            to review missed concepts.
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Button variant="outline" onClick={restartQuiz}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart quiz
            </Button>
            <Button asChild className="bg-[image:var(--gradient-brand)] text-brand-foreground">
              <Link to="/dashboard/modules">Browse modules</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Clock3 }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-navy-foreground/70">
        <Icon className="h-4 w-4 text-brand" />
        <p className="text-[10px] uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="mt-2 font-display text-xl font-semibold">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-display text-base font-semibold text-navy">{value}</span>
    </div>
  );
}
