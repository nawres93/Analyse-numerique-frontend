import { useEffect, useRef, useState } from "react";
import { Sparkles, Eye, EyeOff } from "lucide-react";

const DESMOS_API_KEY = "dcb31709b452b1cf9dc26972add0fda6";
const DESMOS_SCRIPT_URL = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${DESMOS_API_KEY}`;

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

interface InterpolationSandboxProps {
  level: "facile" | "moyen" | "difficile";
}

export function InterpolationSandbox({ level }: InterpolationSandboxProps) {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<any>(null);
  const [showEquidistant, setShowEquidistant] = useState(true);
  const [showChebyshev, setShowChebyshev] = useState(true);

  useEffect(() => {
    if (!calculatorRef.current) return;
    let cancelled = false;

    loadDesmosScript().then(() => {
      if (cancelled || !calculatorRef.current) return;
      const Desmos = (window as any).Desmos;
      const calc = Desmos.GraphingCalculator(calculatorRef.current, {
        expressionsCollapsed: false,
        keypad: false,
        settingsMenu: false,
      });
      calculatorInstance.current = calc;

      if (level === "facile") {
        calc.setMathBounds({ left: -1, right: 11, bottom: 0, top: 40 });
        calc.setExpression({ id: "p1", latex: "P_1=(0,20)", color: Desmos.Colors.RED });
        calc.setExpression({ id: "p2", latex: "P_2=(10,35)", color: Desmos.Colors.RED });
        calc.setExpression({
          id: "line",
          latex: "y=P_1.y+(x-P_1.x)\\left(P_2.y-P_1.y\\right)/\\left(P_2.x-P_1.x\\right)",
          color: Desmos.Colors.BLUE,
        });
      }

      if (level === "moyen") {
        calc.setMathBounds({ left: -3, right: 2, bottom: -2, top: 12 });
        calc.setExpression({ id: "p1", latex: "P_1=(-2,10)", color: Desmos.Colors.RED });
        calc.setExpression({ id: "p2", latex: "P_2=(-1,4)", color: Desmos.Colors.GREEN });
        calc.setExpression({ id: "p3", latex: "P_3=(1,6)", color: Desmos.Colors.ORANGE });
        calc.setExpression({
          id: "L1",
          latex: "L_1=(x-P_2.x)(x-P_3.x)/((P_1.x-P_2.x)(P_1.x-P_3.x))",
          hidden: true,
        });
        calc.setExpression({
          id: "L2",
          latex: "L_2=(x-P_1.x)(x-P_3.x)/((P_2.x-P_1.x)(P_2.x-P_3.x))",
          hidden: true,
        });
        calc.setExpression({
          id: "L3",
          latex: "L_3=(x-P_1.x)(x-P_2.x)/((P_3.x-P_1.x)(P_3.x-P_2.x))",
          hidden: true,
        });
        calc.setExpression({
          id: "curve",
          latex: "y=P_1.y\\cdot L_1+P_2.y\\cdot L_2+P_3.y\\cdot L_3",
          color: Desmos.Colors.BLUE,
        });
      }

      if (level === "difficile") {
        calc.setMathBounds({ left: -1.1, right: 1.1, bottom: -0.5, top: 1.3 });
        calc.setExpression({
          id: "f",
          latex: "f(x)=\\frac{1}{1+25x^2}",
          color: Desmos.Colors.BLACK,
          lineStyle: Desmos.Styles.DASHED,
        });
        calc.setExpression({
          id: "equidistant",
          latex:
            "y=-220.941742x^{10}+494.909502x^{8}-381.433824x^{6}+123.359729x^{4}-16.855204x^{2}+1",
          color: Desmos.Colors.RED,
        });
        calc.setExpression({
          id: "chebyshev",
          latex:
            "y=-46.632917x^{10}+130.105839x^{8}-133.444756x^{6}+61.443019x^{4}-12.476512x^{2}+1",
          color: Desmos.Colors.GREEN,
        });
      }
    });

    return () => {
      cancelled = true;
      if (calculatorInstance.current) {
        calculatorInstance.current.destroy();
        calculatorInstance.current = null;
      }
    };
  }, [level]);

  // Pour le niveau difficile : boutons pour afficher/masquer chaque courbe
  function toggleCurve(id: "equidistant" | "chebyshev") {
    if (!calculatorInstance.current) return;
    if (id === "equidistant") {
      const next = !showEquidistant;
      setShowEquidistant(next);
      calculatorInstance.current.setExpression({ id: "equidistant", hidden: !next });
    } else {
      const next = !showChebyshev;
      setShowChebyshev(next);
      calculatorInstance.current.setExpression({ id: "chebyshev", hidden: !next });
    }
  }

  const captions: Record<string, string> = {
    facile: "Déplace les deux points rouges : la droite se redessine en direct.",
    moyen: "Déplace les trois points : la parabole d'interpolation suit instantanément.",
    difficile:
      "Compare les deux polynômes de degré 10 : celui à points équidistants (rouge) oscille violemment aux bords, celui aux points de Chebyshev (vert) reste fidèle à la vraie fonction (pointillés).",
  };

  return (
    <div className="my-6 rounded-xl border border-brand/30 bg-brand-soft/30 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand">
        <Sparkles className="h-4 w-4" />
        Simulateur interactif
      </div>
      <p className="mb-3 text-sm text-muted-foreground">{captions[level]}</p>

      <div ref={calculatorRef} className="h-[400px] w-full overflow-hidden rounded-lg border border-border/60" />

      {level === "difficile" && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => toggleCurve("equidistant")}
            className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-navy hover:bg-secondary/50"
          >
            {showEquidistant ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            Points équidistants
          </button>
          <button
            onClick={() => toggleCurve("chebyshev")}
            className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-navy hover:bg-secondary/50"
          >
            {showChebyshev ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            Points de Chebyshev
          </button>
        </div>
      )}
    </div>
  );
}
