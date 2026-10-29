import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getSession, TOKEN_KEY } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const refresh = useCallback(() => {
    setSession(getSession());
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem(TOKEN_KEY, token);
    setSession(getSession());
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      loggedIn: Boolean(session),
      admin: Boolean(session) && String(session.roles || "").includes("ROLE_ADMIN"),
      login,
      logout,
      refresh,
    }),
    [session, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
