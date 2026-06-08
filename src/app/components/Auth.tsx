import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Mail, Lock, User, Upload, ArrowRight, ArrowLeft } from "lucide-react";

interface AuthProps {
  onAuthSuccess?: () => void;
  onBack?: () => void;
}

export function Auth({ onAuthSuccess, onBack }: AuthProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1778455378930-aee3210ae8ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxmcmllbmRzJTIwdHJhdmVsaW5nJTIwYmVhY2glMjBzdW5zZXQlMjBncm91cHxlbnwxfHx8fDE3Nzk5MTQ1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Friends traveling together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-semibold">Viajemos</span>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              Tu próxima aventura comienza aquí
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Únete a miles de viajeros que organizan experiencias inolvidables en grupo.
            </p>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold">12K+</div>
                <div className="text-sm text-white/80">Grupos activos</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div>
                <div className="text-3xl font-bold">45K+</div>
                <div className="text-sm text-white/80">Viajes organizados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-white relative">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        )}

        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {activeTab === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "login"
                ? "Ingresa tus datos para continuar"
                : "Comienza a organizar viajes increíbles"}
            </p>
          </div>

          <div className="flex gap-2 p-1 bg-muted rounded-2xl">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeTab === "login"
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeTab === "register"
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Registrarse
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onAuthSuccess) onAuthSuccess();
            }}
            className="space-y-5"
          >
            {activeTab === "register" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer block"
                    >
                      {avatarPreview ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all border-4 border-dashed border-primary/20 group-hover:border-primary/40">
                          <Upload className="w-6 h-6 text-primary mb-1" />
                          <span className="text-xs text-muted-foreground">Foto</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-foreground block">Nombre</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      className="w-full pl-12 pr-4 py-4 bg-muted border-0 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm text-foreground block">Correo electrónico</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-muted border-0 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground block">Contraseña</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-muted border-0 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {activeTab === "login" && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  />
                  Recordarme
                </label>
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary to-primary/90 text-white rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group mt-6"
            >
              {activeTab === "login" ? "Continuar" : "Crear cuenta"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-muted-foreground">o continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 border border-border rounded-2xl hover:bg-muted transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="py-3 border border-border rounded-2xl hover:bg-muted transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {activeTab === "register" && (
            <p className="text-center text-sm text-muted-foreground">
              Al crear una cuenta, aceptas nuestros{" "}
              <button className="text-primary hover:underline">Términos de servicio</button>
              {" "}y{" "}
              <button className="text-primary hover:underline">Política de privacidad</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
