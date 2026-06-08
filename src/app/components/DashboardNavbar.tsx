import { useState, useRef, useEffect } from "react";
import { Bell, Settings, Plus, Hash, User, LogOut, ChevronDown } from "lucide-react";

interface DashboardNavbarProps {
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export function DashboardNavbar({ onCreateGroup, onJoinGroup, onOpenProfile, onLogout }: DashboardNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="font-semibold text-lg text-foreground">Viajemos</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCreateGroup}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full hover:shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear grupo
          </button>
          <button
            onClick={onJoinGroup}
            className="px-5 py-2.5 bg-white border border-border text-foreground rounded-full hover:bg-muted transition-all flex items-center gap-2"
          >
            <Hash className="w-4 h-4" />
            Unirse con código
          </button>

          <div className="w-px h-8 bg-border ml-2"></div>

          <button className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          <button className="w-10 h-10 rounded-full hover:bg-muted transition-colors flex items-center justify-center">
            <Settings className="w-5 h-5 text-foreground" />
          </button>

          <div className="relative ml-2" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border">
                  <div className="font-semibold text-foreground">Ana María Gómez</div>
                  <div className="text-sm text-muted-foreground">ana.gomez@email.com</div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3 text-left"
                  >
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-foreground">Mi perfil</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-left text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
