import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Trophy } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";

// NOTE : pas de createFileRoute (TanStack) — routing réel via react-router-dom.
export const Route = {
  component: ExercisePage,
};

// Clé de démonstration Desmos, fournie publiquement pour le développement.
// À remplacer par une vraie clé (obtenue via partnerships@desmos.com) avant la mise en production.
const DESMOS_API_KEY = "dcb31709b452b1cf9dc26972add0fda6";
const DESMOS_SCRIPT_URL = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${DESMOS_API_KEY}`;

interface ExercisePublic {
  id: string;
  course_id: string;
  type: string;
  instructions: string;
  given_points: number[][];
  check_x: number[];
}

interface ExerciseResultDetail {
  x: number;
  expected_y: number;
  given_y: number;
  ok: boolean;
}

interface ExerciseResult {
  success: boolean;
  details: ExerciseResultDetail[];
}

// Charge le script Desmos une seule fois, même si le composant est remonté.
let desmosLoadingPromise: Promise<void> | null = null;
function loadDesmosScript(): Promise<void> {
  if (typeof window !== "undefined" && (window as any).Desmos) {
    return Promise.resolve();
  }
  if (!desmosLoadingPromise) {
    desmosLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = DESMOS_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Impossible de charger Desmos"));
      document.head.appendChild(script);
    });
  }
  return desmosLoadingPromise;
}

function ExercisePage() {
  const { courseId } = useParams();

  const [exercise, setExercise] = useState<ExercisePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const calculatorRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<any>(null);

  // --- Chargement des données de l'exercice ---
  useEffect(() => {
    if (!courseId) return;
    apiRequest<ExercisePublic>(`/courses/${courseId}/exercise`)
      .then((data) => {
        setExercise(data);
        setAnswers(new Array(data.check_x.length).fill(""));
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [courseId]);

  // --- Initialisation de la calculatrice Desmos une fois l'exercice chargé ---
  useEffect(() => {
    if (!exercise || !calculatorRef.current) return;

    let cancelled = false;

    loadDesmosScript()
      .then(() => {
        if (cancelled || !calculatorRef.current) return;
        const Desmos = (window as any).Desmos;
        calculatorInstance.current = Desmos.GraphingCalculator(calculatorRef.current, {
          expressionsCollapsed: true,
          keypad: false,
        });

        // Affiche les points donnés dans l'énoncé
        exercise.given_points.forEach((point, i) => {
          calculatorInstance.current.setExpression({
            id: `given-${i}`,
            latex: `(${point[0]}, ${point[1]})`,
            color: Desmos.Colors.RED,
          });
        });

        // Trace la droite passant par ces points (aide visuelle), si exactement 2 points
        if (exercise.given_points.length === 2) {
          const [p0, p1] = exercise.given_points;
          calculatorInstance.current.setExpression({
            id: "regression-line",
            latex: `y = ${p0[1]} + (x - ${p0[0]}) * (${p1[1]} - ${p0[1]}) / (${p1[0]} - ${p0[0]})`,
            color: Desmos.Colors.BLUE,
          });
        }

        // Ajuste la zone visible du graphique à l'échelle des vraies données
        // (sans ça, Desmos zoome parfois automatiquement à une échelle énorme,
        // rendant les points illisibles).
        const allX = exercise.given_points.map((p) => p[0]);
        const allY = exercise.given_points.map((p) => p[1]);
        const minX = Math.min(...allX);
        const maxX = Math.max(...allX);
        const minY = Math.min(...allY);
        const maxY = Math.max(...allY);
        const marginX = Math.max((maxX - minX) * 0.3, 1);
        const marginY = Math.max((maxY - minY) * 0.3, 1);

        calculatorInstance.current.setMathBounds({
          left: minX - marginX,
          right: maxX + marginX,
          bottom: minY - marginY,
          top: maxY + marginY,
        });
      })
      .catch((err) => setError(err.message));

    return () => {
      cancelled = true;
      if (calculatorInstance.current) {
        calculatorInstance.current.destroy();
        calculatorInstance.current = null;
      }
    };
  }, [exercise]);

  function updateAnswer(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit() {
    if (!exercise || !courseId) return;
    setSubmitting(true);
    setError(null);
    try {
      const submitted_points = exercise.check_x.map((x, i) => [x, parseFloat(answers[i])]);
      const res = await apiRequest<ExerciseResult>(`/courses/${courseId}/exercise/submit`, {
        method: "POST",
        body: JSON.stringify({ submitted_points }),
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  const allFilled = answers.every((a) => a.trim() !== "" && !isNaN(parseFloat(a)));

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error && !exercise) {
    return (
      <Card className="p-8 text-center">
        <p className="font-display text-lg font-semibold text-navy">
          Impossible de charger l'exercice
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (!exercise || !courseId) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/dashboard/modules/interpolation/course/${courseId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au cours
          </Link>
        </Button>
      </div>

      <Card className="p-6 sm:p-8">
        <h1 className="font-display text-xl font-bold text-navy">Exercice pratique</h1>
        <p className="mt-2 text-sm text-muted-foreground">{exercise.instructions}</p>

        {/* La calculatrice Desmos */}
        <div
          ref={calculatorRef}
          className="mt-5 h-[400px] w-full overflow-hidden rounded-xl border border-border/60"
        />

        {/* Les champs de réponse, un par x à vérifier */}
        <div className="mt-6 space-y-4">
          <p className="text-sm font-medium text-navy">Tes réponses :</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {exercise.check_x.map((x, i) => (
              <div key={i} className="space-y-1.5">
                <Label htmlFor={`answer-${i}`}>Valeur à x = {x}</Label>
                <Input
                  id={`answer-${i}`}
                  type="number"
                  step="any"
                  value={answers[i] ?? ""}
                  onChange={(e) => updateAnswer(i, e.target.value)}
                  disabled={!!result}
                  placeholder="Ta réponse"
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-4 flex items-center gap-2 text-sm text-destructive">
            <XCircle className="h-4 w-4" /> {error}
          </p>
        )}

        {/* Résultat après soumission */}
        {result && (
          <div className="mt-6 rounded-xl border border-border/60 p-4">
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <p className="font-medium text-navy">
                {result.success ? "Bien joué, tes réponses sont correctes !" : "Pas tout à fait — regarde le détail ci-dessous."}
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {result.details.map((d, i) => (
                <li key={i} className="flex items-center gap-2">
                  {d.ok ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                  )}
                  x = {d.x} : ta réponse {d.given_y}, attendu ≈ {d.expected_y}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3 border-t border-border/60 pt-6">
          {!result ? (
            <Button
              onClick={handleSubmit}
              disabled={!allFilled || submitting}
              className="bg-[image:var(--gradient-brand)] text-brand-foreground"
            >
              {submitting ? "Envoi..." : "Vérifier mes réponses"}
            </Button>
          ) : (
            <Button asChild className="bg-[image:var(--gradient-brand)] text-brand-foreground">
              <Link to={`/dashboard/modules/interpolation/course/${courseId}/quiz`}>
                <Trophy className="mr-2 h-4 w-4" /> Passer au quiz final
              </Link>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
