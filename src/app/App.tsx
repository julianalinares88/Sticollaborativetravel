import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { TravelCategories } from "./components/TravelCategories";
import { Auth } from "./components/Auth";

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "auth" | "dashboard">("dashboard");

  if (currentView === "auth") {
    return (
      <Auth
        onAuthSuccess={() => setCurrentView("dashboard")}
        onBack={() => setCurrentView("landing")}
      />
    );
  }

  if (currentView === "dashboard") {
    return <Dashboard onLogout={() => setCurrentView("landing")} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLogin={() => setCurrentView("auth")} />
      <Hero onGetStarted={() => setCurrentView("auth")} />
      <HowItWorks />
      <TravelCategories />
    </div>
  );
}