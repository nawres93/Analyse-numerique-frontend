import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getStoredAuth, logout as apiLogout, type User } from "./auth-api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setIsHydrated(true);
  }, []);

  const value: AuthState = {
    user,
    token,
    isAuthenticated: !!token,
    isHydrated,
    setAuth: (t, u) => {

  localStorage.setItem("numlab.token", t);

  localStorage.setItem(
    "numlab.auth",
    JSON.stringify({
      token:t,
      user:u
    })
  );

  setToken(t);
  setUser(u);

},
    signOut: () => {
      apiLogout();
      setToken(null);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
