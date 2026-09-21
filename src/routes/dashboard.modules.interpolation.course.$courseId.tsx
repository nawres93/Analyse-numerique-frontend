import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, PlayCircle, ClipboardCheck } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/api";
import { MathContent } from "@/components/site/MathContent";
import { InterpolationSandbox } from "@/components/site/InterpolationSandbox";

// NOTE : pas de createFileRoute (TanStack) — routing réel via react-router-dom.
export const Route = {
  component: CourseContentPage,
};

interface CourseContentPublic {
  id: string;
  module_id: string;
  level: string;
  title: string;
  content_html: string;
  video_url: string;
}

function CourseContentPage() {
  const { courseId } = useParams();
  const location = useLocation();

  const [course, setCourse] = useState<CourseContentPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    apiRequest<CourseContentPublic>(`/courses/${courseId}`)
      .then(setCourse)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [courseId]);

  // Une fois le contenu chargé, si l'URL contient une ancre (#notion),
  // on scrolle automatiquement jusqu'à cette section — utile quand
  // l'étudiant revient du quiz final avec une lacune identifiée.
  useEffect(() => {
    if (!course || !location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("ring-2", "ring-brand", "rounded-lg");
        setTimeout(() => el.classList.remove("ring-2", "ring-brand", "rounded-lg"), 2500);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [course, location.hash]);

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <Card className="p-8 text-center">
        <p className="font-display text-lg font-semibold text-navy">
          Impossible de charger le cours
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/dashboard/modules/interpolation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au module
          </Link>
        </Button>
      </Card>
    );
  }

  const sandboxLevel = course.level as "facile" | "moyen" | "difficile";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard/modules/interpolation">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au module
          </Link>
        </Button>
        <Badge variant="outline" className="border-brand/30 text-brand capitalize">
          {course.level}
        </Badge>
      </div>

      <Card className="p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold text-navy">{course.title}</h1>

        {course.video_url ? (
          <div className="mt-5 aspect-video overflow-hidden rounded-xl border border-border/60">
            <video src={course.video_url} controls className="h-full w-full" />
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
            <PlayCircle className="h-4 w-4" />
            Vidéo explicative à venir pour ce cours.
          </div>
        )}

        {/* --- Simulateur interactif : manipule les points, vois la courbe changer en direct --- */}
        <InterpolationSandbox level={sandboxLevel} />

        <div className="mt-6">
          <MathContent html={course.content_html} />
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-border/60 pt-6">
          <Button asChild className="bg-[image:var(--gradient-brand)] text-brand-foreground">
            <Link to={`/dashboard/modules/interpolation/course/${course.id}/exercise`}>
              <ClipboardCheck className="mr-2 h-4 w-4" /> Passer à l'exercice
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
