import { useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { askAdvisor } from "../lib/advisor";

interface Msg {
  role: "user" | "bot";
  text: string;
}

interface ChatAdvisorProps {
  destinations: string[];
}

const QUICK = [
  "¿Qué destaca de estos destinos?",
  "¿Qué ropa llevar?",
  "¿Qué debo empacar?",
  "¿Mejor época para ir?",
];

// Convierte **negrita** en <strong> dentro de una línea.
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

// Render mínimo de Markdown: párrafos, viñetas (*, -, •) y negritas.
function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: JSX.Element[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flush = () => {
    if (bullets.length) {
      const items = bullets;
      blocks.push(
        <ul key={`ul-${key++}`} className="list-disc pl-5 space-y-1">
          {items.map((b, i) => (
            <li key={i}>{renderInline(b)}</li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[*\-•]\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
    } else if (line.trim() === "") {
      flush();
    } else {
      flush();
      blocks.push(<p key={`p-${key++}`}>{renderInline(line)}</p>);
    }
  }
  flush();

  return <div className="space-y-2">{blocks}</div>;
}

export function ChatAdvisor({ destinations }: ChatAdvisorProps) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "¡Hola! Soy tu consejero de viaje 🧳 Pregúntame lo que quieras sobre los destinos recomendados.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    const { reply, error } = await askAdvisor(q, destinations);
    setLoading(false);
    setMessages((m) => [...m, { role: "bot", text: error ?? reply ?? "Sin respuesta." }]);
  };

  return (
    <div className="bg-gradient-to-b from-primary/5 via-accent/5 to-white rounded-3xl border-2 border-primary/20 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center gap-3 border-b border-primary/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-foreground leading-tight">Consejero de viaje</div>
          <div className="text-xs text-muted-foreground">Asistente IA · pregúntale lo que quieras</div>
        </div>
      </div>

      <div className="p-5 space-y-3 max-h-80 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-white whitespace-pre-wrap"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.role === "bot" ? <FormattedMessage text={m.text} /> : m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-muted text-muted-foreground text-sm inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Pensando…
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-3 flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={loading}
            className="px-3 py-1.5 text-xs rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-border flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send(input);
          }}
          placeholder="Escribe tu pregunta…"
          className="flex-1 px-4 py-2.5 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={() => send(input)}
          disabled={loading}
          className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center hover:shadow-md transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}