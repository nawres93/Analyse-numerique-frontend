import type { ComponentType, ReactNode } from "react";
import {
  Link as RouterLink,
  Outlet as RouterOutlet,
  useLocation,
  useNavigate as useRouterNavigate,
} from "react-router-dom";

type FileRouteConfig = {
  head?: () => unknown;
  component?: ComponentType<any>;
  notFoundComponent?: ComponentType<any>;
  errorComponent?: ComponentType<any>;
  shellComponent?: ComponentType<{ children: ReactNode }>;
};

function createRouteFactory() {
  return (config: FileRouteConfig) => ({
    ...config,
    useRouteContext: () => ({}),
    _addFileChildren: () => undefined,
    _addFileTypes: () => undefined,
    update: (next: Record<string, unknown>) => createRouteFactory()({ ...config, ...next }),
  });
}

export function createFileRoute(_path: string) {
  return createRouteFactory();
}

export function createRootRouteWithContext<_T>() {
  return createRouteFactory;
}

export const Link = RouterLink;
export const Outlet = RouterOutlet;

export function useNavigate() {
  const navigate = useRouterNavigate();
  return (opts: { to: string }) => navigate(opts.to);
}

export function useRouterState<T>(opts: { select: (state: { location: { pathname: string } }) => T }) {
  const location = useLocation();
  return opts.select({ location: { pathname: location.pathname } });
}

export function useRouter() {
  const navigate = useRouterNavigate();
  return {
    invalidate: () => undefined,
    navigate: (to: string) => navigate(to),
  };
}

export function HeadContent() {
  return null;
}

export function Scripts() {
  return null;
}
