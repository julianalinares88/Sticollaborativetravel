import { useState } from "react";
import { ArrowLeft, Copy, Check, UserPlus, Sparkles, Users, Crown } from "lucide-react";

interface Member {
  name: string;
  avatar: string;
  isCreator: boolean;
  hasResponded: boolean;
}

interface GroupDetailProps {
  groupName: string;
  groupCode: string;
  groupEmoji: string;
  onBack: () => void;
  onStartPreferences: () => void;
}

export function GroupDetail({
  groupName,
  groupCode,
  groupEmoji,
  onBack,
  onStartPreferences,
}: GroupDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const members: Member[] = [
    {
      name: "Tú",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      isCreator: true,
      hasResponded: false,
    },
  ];

  const currentUserHasResponded = members.find((m) => m.name === "Tú")?.hasResponded || false;

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

                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl hover:bg-muted transition-colors">
                  <UserPlus className="w-4 h-4" />
                  Invitar
                </button>
              </div>

              <div className="space-y-3">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {member.isCreator && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center border-2 border-white">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {member.name}
                          {member.isCreator && (
                            <span className="text-xs px-2 py-1 bg-gradient-to-r from-secondary/20 to-primary/20 text-primary rounded-full">
                              Creador
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {member.hasResponded ? "✅ Cuestionario completado" : "⏳ Pendiente"}
                        </div>
                      </div>
                    </div>

                    {member.hasResponded && (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>
                ))}

                <div className="p-6 border-2 border-dashed border-border rounded-2xl text-center text-muted-foreground">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Esperando que se unan más integrantes...</p>
                </div>
              </div>
            </div>

            {!currentUserHasResponded && (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      ¡Es tu turno!
                    </h3>
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

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm text-muted-foreground">Progreso</div>
                <div className="text-xl font-bold text-foreground">
                  {members.filter((m) => m.hasResponded).length}/{members.length}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <div className="text-2xl mb-2">⏱️</div>
                <div className="text-sm text-muted-foreground">Estado</div>
                <div className="text-xl font-bold text-foreground">En progreso</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-sm text-muted-foreground">Resultados</div>
                <div className="text-xl font-bold text-foreground">Próximamente</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
