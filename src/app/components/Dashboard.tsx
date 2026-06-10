import { useState, useEffect, useCallback } from "react";
import { DashboardNavbar } from "./DashboardNavbar";
import { GroupCard } from "./GroupCard";
import { CreateGroupModal } from "./CreateGroupModal";
import { JoinGroupModal } from "./JoinGroupModal";
import { PreferencesForm } from "./PreferencesForm";
import { GroupDetail } from "./GroupDetail";
import { ProfilePage } from "./ProfilePage";
import { Sparkles, Plus, Hash } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { getMyGroups, type GroupSummary } from "../lib/groups";

interface DashboardProps {
  onLogout: () => void;
}

const COVERS = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&h=600&fit=crop",
];

const EMOJIS = ["✈️", "🏖️", "🏔️", "🌴", "🗺️", "🎒", "🏝️", "🌅", "🧳", "🚐"];

// Índice determinista a partir del id del grupo (mismo grupo -> misma imagen/emoji siempre).
function hashIndex(seed: string, len: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % len;
}

type Status = "pending" | "waiting" | "ready";

interface GroupCardItem {
  id: string;
  name: string;
  code: string;
  emoji: string;
  coverImage: string;
  totalMembers: number;
  respondedMembers: number;
  status: Status;
  hasResults: boolean;
}

function deriveStatus(g: GroupSummary, currentUserHasPrefs: boolean): Status {
  if (!currentUserHasPrefs) return "pending";
  if (g.member_count > 0 && g.ready_count === g.member_count) return "ready";
  return "waiting";
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { user } = useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "group-detail" | "profile">(
    "dashboard"
  );
  const [currentGroup, setCurrentGroup] = useState<{
    id: string;
    name: string;
    code: string;
    emoji: string;
  } | null>(null);

  const [cards, setCards] = useState<GroupCardItem[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [profile, setProfile] = useState<{ username: string; avatarUrl: string | null }>({
    username: "",
    avatarUrl: null,
  });

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoadingGroups(true);
    const [groupsRes, profRes] = await Promise.all([
      getMyGroups(),
      supabase.from("profiles").select("username, avatar_url").eq("id", user.id).maybeSingle(),
    ]);
    const prof = profRes.data as { username?: string; avatar_url?: string | null } | null;
    setProfile({
      username: prof?.username ?? "",
      avatarUrl:
        prof?.avatar_url ??
        (user.user_metadata?.avatar_url as string | undefined) ??
        null,
    });
    setCards(
      groupsRes.data.map((g) => ({
        id: g.id,
        name: g.name,
        code: g.invite_code,
        emoji: EMOJIS[hashIndex(g.id, EMOJIS.length)],
        coverImage: COVERS[hashIndex(g.id + g.name, COVERS.length)],
        totalMembers: g.member_count,
        respondedMembers: g.ready_count,
        status: deriveStatus(g, groupsRes.currentUserHasPrefs),
        hasResults: g.has_results,
      }))
    );
    setLoadingGroups(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pendingGroups = cards.filter((c) => c.status === "pending");
  const readyGroups = cards.filter((c) => c.status === "ready");
  const waitingGroups = cards.filter((c) => c.status === "waiting");

  const openGroup = (item: GroupCardItem) => {
    setCurrentGroup({ id: item.id, name: item.name, code: item.code, emoji: item.emoji });
    setCurrentView("group-detail");
  };

  const handleGroupCreated = (
    groupId: string,
    groupName: string,
    groupCode: string,
    groupEmoji: string
  ) => {
    setCurrentGroup({ id: groupId, name: groupName, code: groupCode, emoji: groupEmoji });
    setIsCreateModalOpen(false);
    setCurrentView("group-detail");
  };

  const handleGroupJoined = (group: { id: string; name: string; invite_code: string }) => {
    setCurrentGroup({ id: group.id, name: group.name, code: group.invite_code, emoji: "✈️" });
    setIsJoinModalOpen(false);
    setCurrentView("group-detail");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setCurrentGroup(null);
    loadData();
  };

  const handleLogout = () => onLogout();

  if (showPreferences) {
    return (
      <PreferencesForm
        onClose={() => {
          setShowPreferences(false);
          loadData();
        }}
      />
    );
  }

  if (currentView === "profile") {
    return (
      <ProfilePage
        onBack={handleBackToDashboard}
        onLogout={handleLogout}
        onEditPreferences={() => setShowPreferences(true)}
        username={profile.username}
        email={user?.email ?? ""}
        avatarUrl={profile.avatarUrl}
      />
    );
  }

  if (currentView === "group-detail" && currentGroup) {
    return (
      <GroupDetail
        groupId={currentGroup.id}
        groupName={currentGroup.name}
        groupCode={currentGroup.code}
        groupEmoji={currentGroup.emoji}
        onBack={handleBackToDashboard}
        onStartPreferences={() => setShowPreferences(true)}
      />
    );
  }

  const renderCard = (item: GroupCardItem) => (
    <GroupCard
      key={item.id}
      emoji={item.emoji}
      name={item.name}
      coverImage={item.coverImage}
      totalMembers={item.totalMembers}
      respondedMembers={item.respondedMembers}
      status={item.status}
      hasResults={item.hasResults}
      onOpen={() => openGroup(item)}
      onCompletePreferences={() => setShowPreferences(true)}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-cyan-50/20">
      <DashboardNavbar
        username={profile.username}
        email={user?.email ?? ""}
        avatarUrl={profile.avatarUrl}
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
        onJoined={handleGroupJoined}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-16">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">Tus grupos</h1>
              <p className="text-lg text-muted-foreground">
                Organiza viajes increíbles con tus amigos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8 flex-wrap">
            <div className="px-5 py-3 bg-white rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-foreground">{cards.length}</div>
                <div className="text-sm text-muted-foreground">grupos activos</div>
              </div>
            </div>
            <div className="px-5 py-3 bg-white rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-accent">{readyGroups.length}</div>
                <div className="text-sm text-muted-foreground">listos</div>
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

        {loadingGroups ? (
          <div className="py-20 text-center text-muted-foreground">Cargando tus grupos…</div>
        ) : cards.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border p-12 text-center">
            <div className="text-5xl mb-4">🧳</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Aún no tienes grupos</h2>
            <p className="text-muted-foreground mb-6">
              Crea un grupo nuevo o únete con un código para empezar.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Crear grupo
              </button>
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="px-5 py-3 bg-white border border-border text-foreground rounded-2xl hover:bg-muted transition-all flex items-center gap-2"
              >
                <Hash className="w-4 h-4" /> Unirse con código
              </button>
            </div>
          </div>
        ) : (
          <>
            {pendingGroups.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                  <h2 className="text-2xl font-bold text-foreground">Acción requerida</h2>
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{pendingGroups.length}</span>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingGroups.map(renderCard)}
                </div>
              </div>
            )}

            {readyGroups.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-accent to-green-400 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-foreground">Listos para recomendar</h2>
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {readyGroups.map(renderCard)}
                </div>
              </div>
            )}

            {waitingGroups.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-muted rounded-full"></div>
                  <h2 className="text-2xl font-bold text-foreground">En progreso</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {waitingGroups.map(renderCard)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}