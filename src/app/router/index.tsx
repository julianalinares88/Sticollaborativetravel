import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { TravelCategories } from "../components/TravelCategories";
import { Auth } from "../components/Auth";
import { Dashboard } from "../components/Dashboard";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

// Landing pública: mismos componentes de siempre, ahora navegando por router.
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Navbar onLogin={() => navigate("/auth")} />
      <Hero onGetStarted={() => navigate("/auth")} />
      <HowItWorks />
      <TravelCategories />
    </div>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  // Si ya hay sesión (incluye el regreso de Google OAuth), al dashboard.
  if (!loading && session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Auth
      onAuthSuccess={() => navigate("/dashboard")}
      onBack={() => navigate("/")}
    />
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  return (
    <Dashboard
      onLogout={async () => {
        await signOut();
        navigate("/");
      }}
    />
  );
}

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/auth", element: <AuthPage /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  // Las subrutas /dashboard/preferences, /groups y /results/:groupId se
  // agregan en sus respectivas partes (4, 6 y 8), cuando separemos esas
  // vistas del Dashboard actual.
  { path: "*", element: <Navigate to="/" replace /> },
]);