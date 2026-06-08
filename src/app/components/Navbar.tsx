interface NavbarProps {
  onLogin: () => void;
}

export function Navbar({ onLogin }: NavbarProps) {
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
            onClick={onLogin}
            className="px-5 py-2.5 text-foreground hover:text-primary transition-colors rounded-full"
          >
            Iniciar sesión
          </button>
          <button
            onClick={onLogin}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all shadow-sm hover:shadow-md"
          >
            Registrarse
          </button>
        </div>
      </div>
    </nav>
  );
}
