import { useState } from "react";
import { ArrowLeft, User, Mail, Calendar, MapPin, LogOut, Camera, Edit } from "lucide-react";

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfilePage({ onBack, onLogout }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);

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
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20 mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-primary" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">Ana María Gómez</h1>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-9 h-9 bg-muted rounded-full hover:bg-primary/10 transition-colors flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 text-primary" />
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground">Exploradora del mundo 🌍</p>
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
                    <div className="flex items-center gap-2 text-foreground">
                      <Mail className="w-4 h-4 text-primary" />
                      ana.gomez@email.com
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-2xl">
                    <div className="text-sm text-muted-foreground mb-1">Miembro desde</div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      Mayo 2026
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-2xl">
                    <div className="text-sm text-muted-foreground mb-1">Ubicación</div>
                    <div className="flex items-center gap-2 text-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      Bogotá, Colombia
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Estadísticas</h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                    <div className="text-3xl font-bold text-foreground mb-1">6</div>
                    <div className="text-sm text-muted-foreground">Grupos activos</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                    <div className="text-3xl font-bold text-foreground mb-1">12</div>
                    <div className="text-sm text-muted-foreground">Viajes completados</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-200">
                    <div className="text-3xl font-bold text-foreground mb-1">8</div>
                    <div className="text-sm text-muted-foreground">Destinos visitados</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                    <div className="text-3xl font-bold text-foreground mb-1">24</div>
                    <div className="text-sm text-muted-foreground">Amigos viajeros</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Preferencias de viaje</h2>

              <div className="flex flex-wrap gap-2">
                {["🌴 Playa", "⛰️ Montaña", "🍲 Gastronomía", "📸 Fotografía", "🎉 Vida nocturna", "🌿 Naturaleza"].map((pref, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full text-foreground border border-primary/20"
                  >
                    {pref}
                  </span>
                ))}
              </div>
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
