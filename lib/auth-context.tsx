"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { AuthUser } from "./types";

type AuthContextType = {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "farmadi_session";

// Credenciales de demostración
const DEMO_USERS: Record<string, AuthUser> = {
  admin: {
    usuarioId: 1,
    nombre: "Carlos",
    apellido: "Mendoza",
    correoElectronico: "admin@farmacia.com",
    nombreUsuario: "admin",
    roles: ["Administrador"],
    token: "demo-token-admin-123",
  },
  vendedor: {
    usuarioId: 2,
    nombre: "María",
    apellido: "López",
    correoElectronico: "mlopez@farmacia.com",
    nombreUsuario: "vendedor",
    roles: ["Vendedor"],
    token: "demo-token-vendedor-456",
  },
};

const DEMO_PASSWORDS: Record<string, string> = {
  admin: "admin123",
  vendedor: "vendedor123",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        setUser(parsed);
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
      setIsLoading(true);
      // Simula latencia de red
      await new Promise((r) => setTimeout(r, 600));
      const foundUser = DEMO_USERS[username.toLowerCase()];
      const correctPassword = DEMO_PASSWORDS[username.toLowerCase()];
      if (foundUser && correctPassword === password) {
        setUser(foundUser);
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
        } catch {
          // ignore storage errors
        }
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, message: "Credenciales incorrectas. Verifique su usuario y contraseña." };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.roles.includes("Administrador") ?? false;
}
