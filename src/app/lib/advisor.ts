// Cliente del "Consejero de viaje": llama al webhook de n8n (que internamente usa Gemini).
export async function askAdvisor(
  message: string,
  destinations: string[]
): Promise<{ reply: string | null; error: string | null }> {
  const url = import.meta.env.VITE_N8N_URL as string | undefined;
  if (!url || url.includes("xxxx")) {
    return {
      reply: null,
      error: "Falta configurar VITE_N8N_URL en .env.local con la URL del webhook de n8n.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Por si el túnel es ngrok, evita su pantalla de advertencia.
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ message, destinations }),
    });

    if (!res.ok) {
      return { reply: null, error: `El consejero respondió con error ${res.status}.` };
    }

    const data = await res.json();
    return { reply: data.reply ?? data.text ?? "Sin respuesta.", error: null };
  } catch {
    return {
      reply: null,
      error: "No se pudo conectar con el consejero. ¿Está n8n encendido y la URL es la actual?",
    };
  }
}