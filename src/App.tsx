import { lazy, Suspense, type ComponentType } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const Home = lazy(() => import("./routes/index").then((m) => ({ default: m.Route.component })));
const Login = lazy(() => import("./routes/login").then((m) => ({ default: m.Route.component })));
const Register = lazy(() => import("./routes/register").then((m) => ({ default: m.Route.component })));
const ForgotPassword = lazy(() => import("./routes/forgot-password").then((m) => ({ default: m.Route.component })));
const ResetPassword = lazy(() => import("./routes/reset-password").then((m) => ({ default: m.Route.component })));
const VerifyEmail = lazy(() => import("./routes/verify-email").then((m) => ({ default: m.Route.component })));
const Admin = lazy(() => import("./routes/admin").then((m) => ({ default: m.Route.component })));
const DashboardLayout = lazy(() => import("./routes/dashboard").then((m) => ({ default: m.Route.component })));
const DashboardHome = lazy(() => import("./routes/dashboard.index").then((m) => ({ default: m.Route.component })));
const DashboardModules = lazy(() => import("./routes/dashboard.modules").then((m) => ({ default: m.Route.component })));
const DashboardVisualizations = lazy(() => import("./routes/dashboard.visualizations").then((m) => ({ default: m.Route.component })));
const DashboardAlgorithms = lazy(() => import("./routes/dashboard.algorithms").then((m) => ({ default: m.Route.component })));
const DashboardPractice = lazy(() => import("./routes/dashboard.practice").then((m) => ({ default: m.Route.component })));
const DashboardAssignments = lazy(() => import("./routes/dashboard.assignments").then((m) => ({ default: m.Route.component })));
const DashboardProgress = lazy(() => import("./routes/dashboard.progress").then((m) => ({ default: m.Route.component })));
const DashboardAnalytics = lazy(() => import("./routes/dashboard.analytics").then((m) => ({ default: m.Route.component })));
const DashboardQuiz = lazy(() => import("./routes/dashboard.quiz").then((m) => ({ default: m.Route.component })));
const DashboardBookmarks = lazy(() => import("./routes/dashboard.bookmarks").then((m) => ({ default: m.Route.component })));
const DashboardResources = lazy(() => import("./routes/dashboard.resources").then((m) => ({ default: m.Route.component })));
const DashboardProfile = lazy(() => import("./routes/dashboard.profile").then((m) => ({ default: m.Route.component })));
const DashboardSettings = lazy(() => import("./routes/dashboard.settings").then((m) => ({ default: m.Route.component })));
const ModuleDetail = lazy(() => import("./routes/dashboard.modules.$slug").then((m) => ({ default: m.Route.component })));
const InterpolationPlacement = lazy(() => import("./routes/dashboard.modules.interpolation.placement").then((m) => ({ default: m.Route.component })));
const InterpolationCourse = lazy(() => import("./routes/dashboard.modules.interpolation.course.$courseId").then((m) => ({ default: m.Route.component })));
const InterpolationExercise = lazy(() => import("./routes/dashboard.modules.interpolation.course.$courseId.exercise").then((m) => ({ default: m.Route.component })));
const InterpolationFinalQuiz = lazy(() => import("./routes/dashboard.modules.interpolation.course.$courseId.quiz").then((m) => ({ default: m.Route.component })));

function ScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
        <p className="text-sm font-medium text-muted-foreground">Loading experience...</p>
      </div>
    </div>
  );
}

function lazyElement(Component: React.LazyExoticComponent<ComponentType<any>>) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Component />
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-navy focus:shadow-lg"
      >
        Skip to main content
      </a>
      <div id="main-content">
        <Routes>
          <Route path="/" element={lazyElement(Home)} />
          <Route path="/login" element={lazyElement(Login)} />
          <Route path="/register" element={lazyElement(Register)} />
          <Route path="/forgot-password" element={lazyElement(ForgotPassword)} />
          <Route path="/reset-password" element={lazyElement(ResetPassword)} />
          <Route path="/verify-email" element={lazyElement(VerifyEmail)} />
          <Route path="/admin" element={lazyElement(Admin)} />
          <Route path="/dashboard" element={lazyElement(DashboardLayout)}>
            <Route index element={lazyElement(DashboardHome)} />
            <Route path="modules" element={lazyElement(DashboardModules)} />
            <Route path="modules/interpolation/placement" element={lazyElement(InterpolationPlacement)} />
            <Route path="modules/interpolation/course/:courseId" element={lazyElement(InterpolationCourse)} />
            <Route path="modules/interpolation/course/:courseId/exercise" element={lazyElement(InterpolationExercise)} />
            <Route path="modules/interpolation/course/:courseId/quiz" element={lazyElement(InterpolationFinalQuiz)} />
            <Route path="visualizations" element={lazyElement(DashboardVisualizations)} />
            <Route path="algorithms" element={lazyElement(DashboardAlgorithms)} />
            <Route path="practice" element={lazyElement(DashboardPractice)} />
            <Route path="assignments" element={lazyElement(DashboardAssignments)} />
            <Route path="progress" element={lazyElement(DashboardProgress)} />
            <Route path="analytics" element={lazyElement(DashboardAnalytics)} />
            <Route path="quiz" element={lazyElement(DashboardQuiz)} />
            <Route path="bookmarks" element={lazyElement(DashboardBookmarks)} />
            <Route path="resources" element={lazyElement(DashboardResources)} />
            <Route path="profile" element={lazyElement(DashboardProfile)} />
            <Route path="settings" element={lazyElement(DashboardSettings)} />
          </Route>
          <Route path="/dashboard/modules/:slug" element={lazyElement(ModuleDetail)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
