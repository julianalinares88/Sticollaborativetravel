import { supabase } from "./supabase";

export interface AlgorithmResult {
  name: string;
  algorithm_key: string;
  destination: string;
  department: string;
  description: string;
  compatibility: number;
  explanation: string;
}

export interface RecommendResponse {
  group_id: string;
  algorithms: AlgorithmResult[];
}

const ALGO_NAMES: Record<string, string> = {
  cosine_average: "Promedio grupal",
  min_misery: "Mínima miseria",
  fair_compromise: "Compromiso justo",
  weighted_majority: "Mayoría ponderada",
};
const ALGO_ORDER = ["cosine_average", "min_misery", "fair_compromise", "weighted_majority"];

// --- Recomendación EN VIVO (llama al backend de Colab vía ngrok) ---
export async function getRecommendations(
  groupId: string
): Promise<{ data: RecommendResponse | null; error: string | null }> {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (!apiUrl || apiUrl.includes("xxxx")) {
    return {
      data: null,
      error:
        "Falta configurar VITE_API_URL en .env.local con la URL actual del backend de Colab.",
    };
  }

  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, "")}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Evita la pantalla de advertencia de ngrok (devuelve el JSON directo).
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ group_id: groupId }),
    });

    if (!res.ok) {
      let detail = `Error ${res.status}`;
      try {
        const j = await res.json();
        detail = j.detail ?? detail;
      } catch {
        // respuesta no-JSON
      }
      return { data: null, error: detail };
    }

    const data = (await res.json()) as RecommendResponse;
    return { data, error: null };
  } catch {
    return {
      data: null,
      error:
        "No se pudo conectar con el backend. ¿Está corriendo el Colab y la URL en VITE_API_URL es la actual?",
    };
  }
}

// --- Última recomendación GUARDADA en Supabase (no necesita el Colab encendido) ---
export async function getSavedRecommendations(
  groupId: string
): Promise<{ data: RecommendResponse | null; savedAt: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from("recommendations")
    .select(
      "algorithm, score, explanation, created_at, destinations(name, department, description)"
    )
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) return { data: null, savedAt: null, error: error.message };
  if (!data || data.length === 0) return { data: null, savedAt: null, error: null };

  // Mapea las filas (vienen de más reciente a más antigua) y deduplica por algoritmo.
  const seen = new Set<string>();
  const algorithms: AlgorithmResult[] = [];
  for (const row of data as any[]) {
    if (seen.has(row.algorithm)) continue;
    seen.add(row.algorithm);
    const dest = Array.isArray(row.destinations) ? row.destinations[0] : row.destinations;
    algorithms.push({
      name: ALGO_NAMES[row.algorithm] ?? row.algorithm,
      algorithm_key: row.algorithm,
      destination: dest?.name ?? "",
      department: dest?.department ?? "",
      description: dest?.description ?? "",
      compatibility: Number(row.score),
      explanation: row.explanation ?? "",
    });
  }

  algorithms.sort(
    (a, b) => ALGO_ORDER.indexOf(a.algorithm_key) - ALGO_ORDER.indexOf(b.algorithm_key)
  );

  return {
    data: { group_id: groupId, algorithms },
    savedAt: (data[0] as any)?.created_at ?? null,
    error: null,
  };
}