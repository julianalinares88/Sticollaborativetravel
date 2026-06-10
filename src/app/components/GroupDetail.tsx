import { useEffect, useState } from "react";
import { ArrowLeft, Copy, Check, UserPlus, Sparkles, Users, Crown, Loader2, SlidersHorizontal, Trash2 } from "lucide-react";
import { getGroupMembers, deleteGroup, leaveGroup, type GroupMember } from "../lib/groups";
import { getRecommendations, getSavedRecommendations, type RecommendResponse } from "../lib/recommendations";
import { RecommendationView } from "./RecommendationView";
import { useAuth } from "../hooks/useAuth";

interface GroupDetailProps {
  groupId: string;
  groupName: string;
  groupCode: string;
  groupEmoji: string;
  onBack: () => void;
  onStartPreferences: () => void;
}

export function GroupDetail({
  groupId,
  groupName,
  groupCode,
  groupEmoji,
  onBack,
  onStartPreferences,
}: GroupDetailProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommending, setRecommending] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);
  const [results, setResults] = useState<RecommendResponse | null>(null);
  const [savedRec, setSavedRec] = useState<RecommendResponse | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data } = await getGroupMembers(groupId);
      if (!active) return;
      setMembers(data);
      setLoading(false);
      const saved = await getSavedRecommendations(groupId);
      if (active && saved.data) setSavedRec(saved.data);
    }
    load();
    return () => {
      active = false;
    };
  }, [groupId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const respondedCount = members.filter((m) => m.hasResponded).length;
  const currentUserHasResponded =
    members.find((m) => m.id === user?.id)?.hasResponded ?? false;
  const allReady = members.length > 0 && respondedCount === members.length;

  const handleRecommend = async () => {
    if (recommending) return;
    setRecError(null);
    setRecommending(true);
    const { data, error } = await getRecommendations(groupId);
    setRecommending(false);
    if (error || !data) setRecError(error ?? "No se pudo generar la recomendación.");
    else {
      setResults(data);
      setSavedRec(data);
    }
  };

  const isOwner = members.find((m) => m.id === user?.id)?.isCreator ?? false;

  const handleRemove = async () => {
    if (removing) return;
    setRemoveError(null);
    setRemoving(true);
    const { error } = isOwner ? await deleteGroup(groupId) : await leaveGroup(groupId);
    setRemoving(false);
    if (error) setRemoveError(error);
    else onBack();
  };

  if (results) {
    return <RecommendationView result={results} onBack={() => setResults(null)} />;
  }

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
          <div className="relative h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="relative text-center">
              <div className="text-7xl mb-4">{groupEmoji}</div>
              <h1 className="text-4xl font-bold text-white mb-2">{groupName}</h1>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
              <div className="text-center space-y-4">
                <div className="text-sm text-muted-foreground">Código del grupo</div>
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text tracking-wider">
                  {groupCode}
                </div>
                <button
                  onClick={handleCopy}
                  className={`px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 mx-auto ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-white border border-border hover:bg-primary/5 text-foreground"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar código
                    </>
                  )}
                </button>
                <p className="text-sm text-muted-foreground pt-2">
                  Comparte este código para que tus amigos se unan al grupo
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Integrantes</h2>
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{members.length}</span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="w-7 h-7 animate-spin mb-2" />
                  Cargando integrantes…
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => {
                    const isMe = member.id === user?.id;
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                              {member.avatarUrl ? (
                                <img
                                  src={member.avatarUrl}
                                  alt={member.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xl font-bold text-primary">
                                  {member.username.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            {member.isCreator && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center border-2 border-white">
                                <Crown className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="font-semibold text-foreground flex items-center gap-2">
                              {member.username}
                              {isMe && (
                                <span className="text-xs text-muted-foreground">(Tú)</span>
                              )}
                              {member.isCreator && (
                                <span className="text-xs px-2 py-1 bg-gradient-to-r from-secondary/20 to-primary/20 text-primary rounded-full">
                                  Creador
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {member.hasResponded
                                ? "✅ Preferencias completadas"
                                : "⏳ Pendiente"}
                            </div>
                          </div>
                        </div>

                        {member.hasResponded && (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="p-6 border-2 border-dashed border-border rounded-2xl text-center text-muted-foreground">
                    <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      Comparte el código para que se unan más integrantes...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!loading && !currentUserHasResponded && (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">¡Es tu turno!</h3>
                    <p className="text-muted-foreground mb-4">
                      Completa el cuestionario de preferencias para ayudar a encontrar el
                      destino perfecto para el grupo.
                    </p>
                    <button
                      onClick={onStartPreferences}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Completar mis preferencias
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!loading && currentUserHasResponded && (
              <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-6 border border-accent/20">
                {allReady ? (
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-foreground">
                      ¡Todos respondieron! 🎉
                    </h3>
                    <p className="text-muted-foreground">
                      Ya pueden generar la recomendación del grupo.
                    </p>
                    {recError && (
                      <div className="rounded-2xl bg-destructive/10 text-destructive text-sm px-4 py-3">
                        {recError}
                      </div>
                    )}
                    <button
                      onClick={handleRecommend}
                      disabled={recommending}
                      className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {recommending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Calculando…
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Recomendar viaje
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    Ya respondiste tus preferencias. Esperando a que los demás integrantes
                    completen las suyas…
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-border/60 text-center">
                  <button
                    onClick={onStartPreferences}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Editar mis preferencias
                  </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm text-muted-foreground">Progreso</div>
                <div className="text-xl font-bold text-foreground">
                  {respondedCount}/{members.length}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="text-sm text-muted-foreground">Estado</div>
                <div className="text-xl font-bold text-foreground">
                  {members.length > 0 && respondedCount === members.length
                    ? "Listo"
                    : "En progreso"}
                </div>
              </div>

              {savedRec ? (
                <button
                  onClick={() => setResults(savedRec)}
                  className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-200 text-left hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm text-muted-foreground">Resultados</div>
                  <div className="text-xl font-bold text-primary">Ver resultados →</div>
                </button>
              ) : (
                <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm text-muted-foreground">Resultados</div>
                  <div className="text-xl font-bold text-foreground">Sin generar</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {!loading && (
          <div className="mt-6 bg-white rounded-3xl border border-border p-6">
            {!confirmRemove ? (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {isOwner ? "Eliminar grupo" : "Salir del grupo"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isOwner
                      ? "Elimina el grupo y sus resultados para todos los integrantes."
                      : "Dejarás de ver este grupo. Puedes volver a unirte con el código."}
                  </p>
                </div>
                <button
                  onClick={() => setConfirmRemove(true)}
                  className="px-5 py-2.5 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors inline-flex items-center gap-2 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                  {isOwner ? "Eliminar grupo" : "Salir del grupo"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="font-medium text-foreground">
                  {isOwner
                    ? "¿Seguro que quieres eliminar este grupo? Esta acción no se puede deshacer."
                    : "¿Seguro que quieres salir de este grupo?"}
                </p>
                {removeError && (
                  <div className="rounded-2xl bg-destructive/10 text-destructive text-sm px-4 py-3">
                    {removeError}
                  </div>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleRemove}
                    disabled={removing}
                    className="px-5 py-2.5 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-colors inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    {removing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Sí, {isOwner ? "eliminar" : "salir"}
                  </button>
                  <button
                    onClick={() => {
                      setConfirmRemove(false);
                      setRemoveError(null);
                    }}
                    disabled={removing}
                    className="px-5 py-2.5 rounded-2xl border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}