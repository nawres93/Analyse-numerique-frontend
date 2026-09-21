// Mock data layer for the student experience. Swap for real API responses later.

import type { LucideIcon } from "lucide-react";
import {
  Grid3x3,
  FunctionSquare,
  Waves,
  Compass,
  Sigma,
  Ruler,
  Target,
  ShieldCheck,
  Binary,
  Atom,
} from "lucide-react";

export interface ModuleItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  chapters: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number; // 0-100
  hours: number;
  icon: LucideIcon;
  tags: string[];
}

export const modules: ModuleItem[] = [
  {
    id: "m1",
    slug: "linear-systems",
    title: "Linear Systems",
    description: "Gaussian elimination, LU, Cholesky, Jacobi and Gauss–Seidel.",
    chapters: 8,
    difficulty: "Intermediate",
    progress: 68,
    hours: 6,
    icon: Grid3x3,
    tags: ["matrices", "direct", "iterative"],
  },
  {
    id: "m2",
    slug: "root-finding",
    title: "Root Finding",
    description: "Bisection, Newton–Raphson, Secant and Fixed Point iterations.",
    chapters: 6,
    difficulty: "Beginner",
    progress: 100,
    hours: 4,
    icon: FunctionSquare,
    tags: ["convergence", "nonlinear"],
  },
  {
    id: "m3",
    slug: "interpolation",
    title: "Interpolation",
    description: "Lagrange, Newton divided differences and cubic splines.",
    chapters: 5,
    difficulty: "Intermediate",
    progress: 42,
    hours: 5,
    icon: Waves,
    tags: ["polynomials", "splines"],
  },
  {
    id: "m4",
    slug: "approximation",
    title: "Approximation",
    description: "Least squares and orthogonal polynomial bases.",
    chapters: 4,
    difficulty: "Intermediate",
    progress: 0,
    hours: 4,
    icon: Compass,
    tags: ["fitting"],
  },
  {
    id: "m5",
    slug: "numerical-integration",
    title: "Numerical Integration",
    description: "Trapezoidal, Simpson, midpoint and Gaussian quadrature.",
    chapters: 7,
    difficulty: "Intermediate",
    progress: 12,
    hours: 5,
    icon: Sigma,
    tags: ["quadrature"],
  },
  {
    id: "m6",
    slug: "numerical-differentiation",
    title: "Numerical Differentiation",
    description: "Forward, backward and central difference schemes.",
    chapters: 3,
    difficulty: "Beginner",
    progress: 55,
    hours: 3,
    icon: Ruler,
    tags: ["derivatives"],
  },
  {
    id: "m7",
    slug: "optimization",
    title: "Optimization",
    description: "Gradient descent, Newton and golden-section search.",
    chapters: 6,
    difficulty: "Advanced",
    progress: 0,
    hours: 6,
    icon: Target,
    tags: ["gradient", "convex"],
  },
  {
    id: "m8",
    slug: "error-analysis",
    title: "Error Analysis",
    description: "Absolute, relative, truncation and round-off error.",
    chapters: 4,
    difficulty: "Beginner",
    progress: 90,
    hours: 3,
    icon: ShieldCheck,
    tags: ["numerics"],
  },
  {
    id: "m9",
    slug: "matrix-operations",
    title: "Matrix Operations",
    description: "Decompositions, conditioning and sparse structures.",
    chapters: 5,
    difficulty: "Advanced",
    progress: 0,
    hours: 5,
    icon: Binary,
    tags: ["linear algebra"],
  },
  {
    id: "m10",
    slug: "eigenvalues",
    title: "Eigenvalues & Eigenvectors",
    description: "Power method, QR algorithm and spectral views.",
    chapters: 5,
    difficulty: "Advanced",
    progress: 0,
    hours: 6,
    icon: Atom,
    tags: ["spectral"],
  },
];

export interface ResourceItem {
  id: string;
  title: string;
  kind: "PDF" | "Notebook" | "Reference" | "Video" | "Link";
  size?: string;
  href: string;
  module?: string;
}

export const resources: ResourceItem[] = [
  { id: "r1", title: "Numerical Analysis — Lecture Notes vol. 1", kind: "PDF", size: "2.4 MB", href: "#", module: "Linear Systems" },
  { id: "r2", title: "Newton–Raphson worked examples", kind: "PDF", size: "820 KB", href: "#", module: "Root Finding" },
  { id: "r3", title: "Simpson's rule — Jupyter notebook", kind: "Notebook", size: "310 KB", href: "#", module: "Numerical Integration" },
  { id: "r4", title: "Burden & Faires, Numerical Analysis (10th ed.)", kind: "Reference", href: "#" },
  { id: "r5", title: "MATLAB — cubic spline demo", kind: "Notebook", size: "150 KB", href: "#", module: "Interpolation" },
  { id: "r6", title: "3Blue1Brown — Essence of linear algebra", kind: "Video", href: "https://www.youtube.com/@3blue1brown" },
  { id: "r7", title: "SciPy documentation — scipy.optimize", kind: "Link", href: "https://docs.scipy.org/doc/scipy/reference/optimize.html", module: "Optimization" },
  { id: "r8", title: "ESPRIT — Course syllabus", kind: "PDF", size: "180 KB", href: "#" },
];

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  when: string;
  kind: "quiz" | "module" | "practice" | "badge";
}
export const recentActivity: ActivityItem[] = [
  { id: "a1", title: "Completed quiz", detail: "Root Finding · scored 92%", when: "2h ago", kind: "quiz" },
  { id: "a2", title: "Finished chapter", detail: "Gauss–Seidel iteration", when: "yesterday", kind: "module" },
  { id: "a3", title: "Earned badge", detail: "Convergence Master", when: "2 days ago", kind: "badge" },
  { id: "a4", title: "Solved 8 exercises", detail: "Numerical differentiation", when: "3 days ago", kind: "practice" },
];

export const weeklyHours = [
  { day: "Mon", h: 1.2 },
  { day: "Tue", h: 2.1 },
  { day: "Wed", h: 0.8 },
  { day: "Thu", h: 1.7 },
  { day: "Fri", h: 2.4 },
  { day: "Sat", h: 3.1 },
  { day: "Sun", h: 1.4 },
];

export const overviewStats = {
  completedModules: modules.filter((m) => m.progress === 100).length,
  totalModules: modules.length,
  averageQuiz: 87,
  learningHours: weeklyHours.reduce((s, d) => s + d.h, 0),
  currentStreak: 6,
};

export interface AdminStudentItem {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Instructor" | "TA";
  progress: number;
  status: "Active" | "Inactive" | "Pending";
}

export const adminStudents: AdminStudentItem[] = [
  { id: "s1", name: "Ines Kamel", email: "ines.kamel@esprit.tn", role: "Student", progress: 92, status: "Active" },
  { id: "s2", name: "Mohamed Ali", email: "mohamed.ali@esprit.tn", role: "Student", progress: 76, status: "Active" },
  { id: "s3", name: "Sarra Ben Salah", email: "sarra.bensalah@esprit.tn", role: "Student", progress: 48, status: "Pending" },
  { id: "s4", name: "Dr. Ben Amor", email: "ben.amor@esprit.tn", role: "Instructor", progress: 100, status: "Active" },
  { id: "s5", name: "Aya Trabelsi", email: "aya.trabelsi@esprit.tn", role: "TA", progress: 88, status: "Inactive" },
];

export interface AdminModuleItem {
  title: string;
  description: string;
  lessons: number;
  resources: number;
  visibility: "Draft" | "Published" | "Archived";
  status: "Needs review" | "Published" | "Draft";
}

export const adminModules: AdminModuleItem[] = [
  {
    title: "Linear Systems",
    description: "Gaussian elimination, LU factorization and iterative methods.",
    lessons: 8,
    resources: 14,
    visibility: "Published",
    status: "Published",
  },
  {
    title: "Root Finding",
    description: "Bisection, Newton-Raphson, secant and false position methods.",
    lessons: 6,
    resources: 11,
    visibility: "Published",
    status: "Published",
  },
  {
    title: "Interpolation",
    description: "Lagrange, Newton, spline and least squares visual modules.",
    lessons: 5,
    resources: 9,
    visibility: "Draft",
    status: "Needs review",
  },
  {
    title: "Optimization",
    description: "Gradient descent and golden-section search with plots.",
    lessons: 6,
    resources: 7,
    visibility: "Draft",
    status: "Draft",
  },
];

export interface AdminQuizItem {
  title: string;
  description: string;
  questions: number;
  time: number;
  attempts: number;
  status: "Published" | "Draft" | "Review";
}

export const adminQuizzes: AdminQuizItem[] = [
  {
    title: "Numerical Integration Quiz 01",
    description: "Simpson, midpoint and error estimation questions.",
    questions: 10,
    time: 20,
    attempts: 148,
    status: "Published",
  },
  {
    title: "Root Finding Assessment",
    description: "Convergence and iteration analysis with function input.",
    questions: 12,
    time: 25,
    attempts: 91,
    status: "Review",
  },
  {
    title: "Matrix Operations Checkpoint",
    description: "Matrix arithmetic, determinants and decompositions.",
    questions: 8,
    time: 15,
    attempts: 66,
    status: "Draft",
  },
];

export const adminUsage = [
  { month: "Jan", students: 420, engagement: 52 },
  { month: "Feb", students: 520, engagement: 58 },
  { month: "Mar", students: 610, engagement: 64 },
  { month: "Apr", students: 720, engagement: 69 },
  { month: "May", students: 860, engagement: 72 },
  { month: "Jun", students: 1024, engagement: 78 },
  { month: "Jul", students: 1284, engagement: 84 },
];

export const adminAnalytics = [
  { name: "Modules", value: 38 },
  { name: "Quizzes", value: 22 },
  { name: "Practice", value: 18 },
  { name: "Resources", value: 12 },
];

export const adminReports = [
  {
    title: "Monthly performance summary",
    description: "PDF snapshot of student engagement, grades and retention.",
  },
  {
    title: "Module publication report",
    description: "What was published, updated, or scheduled this month.",
  },
  {
    title: "Export for accreditation",
    description: "CSV and PDF bundle for department review and reporting.",
  },
];
