import { useEffect, useState } from "react";
import { ArrowLeft, User, Mail, Calendar, Users, LogOut, SlidersHorizontal } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
  onEditPreferences: () => void;
  username: string;
  email: string;
  avatarUrl: string | null;
}

const FEATURES: { key: string; label: string }[] = [
  { key: "beach", label: "🌴 Playa" },
  { key: "mountain", label: "⛰️ Montaña" },
  { key: "nature", label: "🌿 Naturaleza" },
  { key: "adventure", label: "🧗 Aventura" },
  { key: "relax", label: "🧘 Descanso" },
  { key: "nightlife", label: "🎉 Vida nocturna" },
  { key: "culture", label: "🏛️ Cultura" },
  { key: "gastronomy", label: "🍲 Gastronomía" },
  { key: "shopping", label: "🛍️ Compras" },
  { key: "instagrammable", label: "📸 Fotogénico" },
  { key: "warm_weather", label: "☀️ Clima cálido" },
  { key: "budget_friendly", label: "💸 Económico" },
  { key: "accessibility", label: "🚗 Fácil acceso" },
  { key: "friend_group_friendly", label: "👥 Con amigos" },
  { key: "university_trip_friendly", label: "🎓 Universitario" },
  { key: "couple_friendly", label: "💕 En pareja" },
  { key: "physically_demanding", label: "🏃 Actividad física" },
];

export function ProfilePage({
  onBack,
  onLogout,
  onEditPreferences,
  username,
  email,
  avatarUrl,
}: ProfilePageProps) {
  const { user } = useAuth();
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [groupCount, setGroupCount] = useState<number | null>(null);
  const [ratedCount, setRatedCount] = useState<number | null>(null);
  const [topPrefs, setTopPrefs] = useState<string[]>([]);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      const [profRes, membersRes, prefsRes] = await Promise.all([
        supabase.from("profiles").select("created_at").eq("id", user.id).maybeSingle(),
        supabase.from("group_members").select("group_id").eq("user_id", user.id),
        supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      if (!active) return;

      const createdAt = (profRes.data as { created_at?: string } | null)?.created_at;
      if (createdAt) {
        const d = new Date(createdAt);
        const txt = d.toLocaleDateString("es-CO", { month: "long", year: "numeric" });
        setMemberSince(txt.charAt(0).toUpperCase() + txt.slice(1));
      }

      setGroupCount((membersRes.data ?? []).length);

      const prefs = prefsRes.data as Record<string, number | null> | null;
      if (prefs) {
        const rated = FEATURES.filter((f) => typeof prefs[f.key] === "number");
        setRatedCount(rated.length);
        const top = [...rated]
          .sort((a, b) => (prefs[b.key] ?? 0) - (prefs[a.key] ?? 0))
          .slice(0, 6)
          .map((f) => f.label);
        setTopPrefs(top);
      } else {
        setRatedCount(0);
        setTopPrefs([]);
      }
      setPrefsLoaded(true);
    })();

    return () => {
      active = false;
    };
  }, [user]);

  const initial = (username || email || "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-primary via-accent to-secondary">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <div className="relative px-8 pb-8">
            <div className="-mt-16 mb-8">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-white">{initial}</span>
                )}
              </div>

              <div className="mt-4">
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  {username || "Usuario"}
                </h1>
                <p className="text-muted-foreground">Viajero en TripMatch ✈️</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Información personal
                </h2>

                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-2xl">
                    <div className="text-sm text-muted-foreground mb-1">Correo electrónico</div>
                    <div className="flex items-center gap-2 text-foreground break-all">
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      {email || "—"}
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-2xl">
                    <div className="text-sm text-muted-foreground mb-1">Miembro desde</div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      {memberSince ?? "…"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Estadísticas</h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                    <div className="text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
                      <Users className="w-6 h-6 text-blue-500" />
                      {groupCount ?? "…"}
                    </div>
                    <div className="text-sm text-muted-foreground">Grupos activos</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {ratedCount ?? "…"}
                      <span className="text-lg text-muted-foreground">/17</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Preferencias calificadas</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                <h2 className="text-xl font-bold text-foreground">Tus preferencias favoritas</h2>
                <button
                  onClick={onEditPreferences}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-full text-sm hover:shadow-md transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Editar preferencias
                </button>
              </div>

              {!prefsLoaded ? (
                <p className="text-muted-foreground">Cargando…</p>
              ) : topPrefs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topPrefs.map((pref, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full text-foreground border border-primary/20"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Aún no has calificado tus preferencias. Hazlo desde cualquiera de tus grupos.
                </p>
              )}
            </div>

            <div className="border-t border-border pt-6 mt-6">
              <button
                onClick={onLogout}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
              >
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}