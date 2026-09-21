import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, RotateCcw, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/api";

// NOTE : pas de createFileRoute (TanStack) — routing réel via react-router-dom.
export const Route = {
  component: FinalQuizPage,
};

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

interface FinalQuizResult {
  passed: boolean;
  score: number;
  max_score: number;
  next_course_id: string | null;
  retry_course_id: string | null;
  lacune: string | null;
  details: {
    question: string;
    options: string[];
    given_index: number;
    correct_index: number;
    correct: boolean;
    explanation: string;
  }[];
}

function FinalQuizPage() {
  const { courseId } = useParams();

  const [quiz, setQuiz] = useState<QuizPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const [result, setResult] = useState<FinalQuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    apiRequest<QuizPublic>(`/courses/${courseId}/final-quiz`)
      .then((data) => {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [courseId]);

  function selectAnswer(optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  }

  async function handleSubmit() {
    if (!quiz || !courseId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiRequest<FinalQuizResult>(
        `/courses/${courseId}/final-quiz/submit`,
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
          Impossible de charger le quiz final
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (!quiz || !courseId) return null;

  // --- Écran de résultat ---
  if (result) {
    const percentage = Math.round((result.score / result.max_score) * 100);

    return (
      <Card className="mx-auto max-w-xl p-8 text-center">
        {result.passed ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-destructive" />
        )}

        <h2 className="mt-4 font-display text-2xl font-bold text-navy">
          {result.passed ? "Bravo, tu as réussi !" : "Pas encore validé"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Score : {result.score} / {result.max_score} ({percentage}%)
        </p>
        <Progress value={percentage} className="mt-4" />

        {!result.passed && result.lacune && (
          <div className="mt-5 rounded-xl border border-border/60 bg-secondary/40 p-4 text-left">
            <p className="text-sm text-muted-foreground">
              Il te manque des bases sur :{" "}
              <span className="font-medium text-navy">
                {result.lacune.replaceAll("_", " ")}
              </span>
              . Retourne d'abord revoir cette section du cours avant de retenter le quiz.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          {result.passed && result.next_course_id ? (
            <Button asChild className="bg-[image:var(--gradient-brand)] text-brand-foreground">
              <Link to={`/dashboard/modules/interpolation/course/${result.next_course_id}`}>
                <ArrowRight className="mr-2 h-4 w-4" /> Cours suivant
              </Link>
            </Button>
          ) : result.passed ? (
            <Button asChild className="bg-[image:var(--gradient-brand)] text-brand-foreground">
              <Link to="/dashboard/modules">Terminer le module</Link>
            </Button>
          ) : (
            <Button asChild className="bg-[image:var(--gradient-brand)] text-brand-foreground">
              <Link
                to={`/dashboard/modules/interpolation/course/${result.retry_course_id}${
                  result.lacune ? `#${result.lacune}` : ""
                }`}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Revoir cette section du cours
              </Link>
            </Button>
          )}
        </div>

        {/* Correction commentée */}
        <div className="mt-8 border-t border-border/60 pt-6 text-left">
          <button
            onClick={() => setShowCorrection((s) => !s)}
            className="flex w-full items-center justify-between text-sm font-medium text-navy"
          >
            Voir la correction détaillée
            {showCorrection ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {showCorrection && (
            <div className="mt-4 space-y-3">
              {result.details.map((d, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-4 text-sm ${
                    d.correct
                      ? "border-green-200 bg-green-50"
                      : "border-destructive/30 bg-destructive/5"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {d.correct ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium text-navy">{d.question}</p>
                      {!d.correct && (
                        <p className="mt-1 text-muted-foreground">
                          Ta réponse : {d.options[d.given_index]}
                        </p>
                      )}
                      <p className="mt-1 text-muted-foreground">{d.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
          <span>Quiz final</span>
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
            <RadioGroupItem value={i.toString()} id={`fq-option-${i}`} />
            <Label htmlFor={`fq-option-${i}`} className="flex-1 cursor-pointer text-sm">
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
            {submitting ? "Envoi..." : "Valider le quiz final"}
          </Button>
        )}
      </div>
    </Card>
  );
}
