import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando…
      </div>
    );
  }

  if (!session) {
    // Guardamos de dónde venía para poder volver tras iniciar sesión.
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}