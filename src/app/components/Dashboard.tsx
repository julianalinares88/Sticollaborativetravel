import { useState } from "react";
import { DashboardNavbar } from "./DashboardNavbar";
import { GroupCard } from "./GroupCard";
import { CreateGroupModal } from "./CreateGroupModal";
import { JoinGroupModal } from "./JoinGroupModal";
import { PreferencesForm } from "./PreferencesForm";
import { GroupDetail } from "./GroupDetail";
import { ProfilePage } from "./ProfilePage";
import { Plus, Sparkles } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

const groups = [
  {
    emoji: "🌴",
    name: "Viaje Cartagena 2026",
    coverImage: "https://images.unsplash.com/photo-1583377585350-58a76bfbdb27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwdHJhdmVsaW5nJTIwYmVhY2glMjBzdW5zZXQlMjBncm91cHxlbnwxfHx8fDE3Nzk5MTQ1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    totalMembers: 6,
    respondedMembers: 4,
    status: "pending" as const,
  },
  {
    emoji: "⛰️",
    name: "Parche Eje Cafetero",
    coverImage: "https://images.unsplash.com/photo-1704610077766-7a5e0535638c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGFkdmVudHVyZSUyMGhpa2luZyUyMGZyaWVuZHN8ZW58MXx8fHwxNzc5OTE0NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    totalMembers: 8,
    respondedMembers: 8,
    status: "ready" as const,
  },
  {
    emoji: "☀️",
    name: "Vacaciones mitad de año",
    coverImage: "https://images.unsplash.com/photo-1562960032-108a6c6c4896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmcmllbmRzJTIwdHJhdmVsaW5nJTIwYmVhY2glMjBzdW5zZXQlMjBncm91cHxlbnwxfHx8fDE3Nzk5MTQ1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    totalMembers: 5,
    respondedMembers: 2,
    status: "waiting" as const,
  },
  {
    emoji: "🏔️",
    name: "Aventura Patagonia",
    coverImage: "https://images.unsplash.com/photo-1582866143347-8f3efbeb44c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxtb3VudGFpbiUyMGFkdmVudHVyZSUyMGhpa2luZyUyMGZyaWVuZHN8ZW58MXx8fHwxNzc5OTE0NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    totalMembers: 4,
    respondedMembers: 4,
    status: "ready" as const,
  },
  {
    emoji: "🎉",
    name: "Weekend en Medellín",
    coverImage: "https://images.unsplash.com/photo-1545128485-c400e7702796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGxpZmUlMjBwYXJ0eSUyMGZyaWVuZHMlMjBkYW5jaW5nfGVufDF8fHx8MTc3OTkxNDUyN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    totalMembers: 7,
    respondedMembers: 5,
    status: "waiting" as const,
  },
  {
    emoji: "🌊",
    name: "Surf trip Pacífico",
    coverImage: "https://images.unsplash.com/photo-1625594402983-fdbb5ae2e2d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmcmllbmRzJTIwdHJhdmVsaW5nJTIwYmVhY2glMjBzdW5zZXQlMjBncm91cHxlbnwxfHx8fDE3Nzk5MTQ1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    totalMembers: 6,
    respondedMembers: 3,
    status: "waiting" as const,
  },
];

export function Dashboard({ onLogout }: DashboardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "group-detail" | "profile">("dashboard");
  const [currentGroup, setCurrentGroup] = useState<{
    name: string;
    code: string;
    emoji: string;
  } | null>(null);

  const pendingGroups = groups.filter((g) => g.status === "pending");
  const readyGroups = groups.filter((g) => g.status === "ready");
  const waitingGroups = groups.filter((g) => g.status === "waiting");

  const handleGroupCreated = (groupName: string, groupCode: string, groupEmoji: string) => {
    setCurrentGroup({ name: groupName, code: groupCode, emoji: groupEmoji });
    setIsCreateModalOpen(false);
    setCurrentView("group-detail");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setCurrentGroup(null);
  };

  const handleLogout = () => {
    onLogout();
  };

  if (showPreferences) {
    return <PreferencesForm onClose={() => setShowPreferences(false)} />;
  }

  if (currentView === "profile") {
    return (
      <ProfilePage
        onBack={handleBackToDashboard}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === "group-detail" && currentGroup) {
    return (
      <GroupDetail
        groupName={currentGroup.name}
        groupCode={currentGroup.code}
        groupEmoji={currentGroup.emoji}
        onBack={handleBackToDashboard}
        onStartPreferences={() => setShowPreferences(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-cyan-50/20">
      <DashboardNavbar
        onCreateGroup={() => setIsCreateModalOpen(true)}
        onJoinGroup={() => setIsJoinModalOpen(true)}
        onOpenProfile={() => setCurrentView("profile")}
        onLogout={handleLogout}
      />

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onGroupCreated={handleGroupCreated}
      />

      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-16">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">
                Tus grupos
              </h1>
              <p className="text-lg text-muted-foreground">
                Organiza viajes increíbles con tus amigos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <div className="px-5 py-3 bg-white rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-foreground">{groups.length}</div>
                <div className="text-sm text-muted-foreground">grupos activos</div>
              </div>
            </div>
            <div className="px-5 py-3 bg-white rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-accent">{readyGroups.length}</div>
                <div className="text-sm text-muted-foreground">con resultados</div>
              </div>
            </div>
            <div className="px-5 py-3 bg-white rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-primary">{pendingGroups.length}</div>
                <div className="text-sm text-muted-foreground">pendientes</div>
              </div>
            </div>
          </div>
        </div>

        {pendingGroups.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              <h2 className="text-2xl font-bold text-foreground">
                Acción requerida
              </h2>
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{pendingGroups.length}</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingGroups.map((group, index) => (
                <GroupCard
                  key={index}
                  {...group}
                  onCompletePreferences={() => setShowPreferences(true)}
                />
              ))}
            </div>
          </div>
        )}

        {readyGroups.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-accent to-green-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-foreground">
                Resultados listos
              </h2>
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyGroups.map((group, index) => (
                <GroupCard key={index} {...group} />
              ))}
            </div>
          </div>
        )}

        {waitingGroups.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-muted rounded-full"></div>
              <h2 className="text-2xl font-bold text-foreground">
                En progreso
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {waitingGroups.map((group, index) => (
                <GroupCard key={index} {...group} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-12 border border-primary/20 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              ¿Listo para tu próxima aventura?
            </h3>
            <p className="text-lg text-muted-foreground">
              Crea un nuevo grupo y empieza a planear un viaje inolvidable con tus amigos
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear nuevo grupo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
