import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/api";

// NOTE : createFileRoute (TanStack) retiré — routing réel fait par
// react-router-dom (voir App.tsx). On garde juste `Route.component`
// pour respecter la convention des imports lazy() de App.tsx.
export const Route = {
  component: PlacementQuizPage,
};

// --- Types miroir des schémas Pydantic du backend ---
interface QuizQuestion {
  question: string;
  options: string[];
}

interface QuizPublic {
  id: string;
  quiz_type: string;
  module_id: string;
  questions: QuizQuestion[];
}

interface PlacementResult {
  score: number;
  max_score: number;
  level_detected: string;
  course_id: string;
}

const MODULE_ID = "interpolation";

export function PlacementQuizPage() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const [result, setResult] = useState<PlacementResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiRequest<QuizPublic>(`/modules/${MODULE_ID}/placement-quiz`)
      .then((data) => {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  function selectAnswer(optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  }

  async function handleSubmit() {
    if (!quiz) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiRequest<PlacementResult>(
        `/modules/${MODULE_ID}/placement-quiz/submit`,
        {
          method: "POST",
          body: JSON.stringify({ answers }),
        }
      );
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <Card className="p-8 text-center">
        <p className="font-display text-lg font-semibold text-navy">
          Impossible de charger le quiz
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (!quiz) return null;

  // --- Écran de résultat ---
  if (result) {
    const percentage = Math.round((result.score / result.max_score) * 100);
    return (
      <Card className="mx-auto max-w-xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand" />
        <h2 className="mt-4 font-display text-2xl font-bold text-navy">
          Niveau détecté :{" "}
          <span className="capitalize text-brand">{result.level_detected}</span>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Score : {result.score} / {result.max_score} ({percentage}%)
        </p>
        <Progress value={percentage} className="mt-4" />
        <Button
          asChild
          className="mt-6 bg-[image:var(--gradient-brand)] text-brand-foreground"
        >
          <Link to={`/dashboard/modules/interpolation/course/${result.course_id}`}>
            Commencer le cours adapté
          </Link>
        </Button>
      </Card>
    );
  }

  // --- Écran du quiz ---
  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const answered = answers[currentIndex] !== null;
  const progressPct = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Question {currentIndex + 1} / {quiz.questions.length}
          </span>
          <span>Quiz de placement — Interpolation</span>
        </div>
        <Progress value={progressPct} />
      </div>

      <h2 className="font-display text-lg font-semibold text-navy">
        {question.question}
      </h2>

      <RadioGroup
        className="mt-5 space-y-3"
        value={answers[currentIndex]?.toString() ?? ""}
        onValueChange={(val) => selectAnswer(Number(val))}
      >
        {question.options.map((option, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border/60 p-4 hover:bg-secondary/40"
          >
            <RadioGroupItem value={i.toString()} id={`option-${i}`} />
            <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer text-sm">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <p className="mt-4 flex items-center gap-2 text-sm text-destructive">
          <XCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        {currentIndex > 0 && (
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={submitting}
          >
            Précédent
          </Button>
        )}
        {!isLast ? (
          <Button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={!answered}
            className="bg-[image:var(--gradient-brand)] text-brand-foreground"
          >
            Suivant
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!answered || submitting}
            className="bg-[image:var(--gradient-brand)] text-brand-foreground"
          >
            {submitting ? "Envoi..." : "Valider le quiz"}
          </Button>
        )}
      </div>
    </Card>
  );
}
