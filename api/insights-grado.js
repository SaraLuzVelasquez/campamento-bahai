import Anthropic from "@anthropic-ai/sdk";
import { esReintentable, mensajeAmigable } from "./_lib/anthropic-errores.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Eres un asistente que ayuda a los organizadores del Campamento Urbano Comunitario del Centro Bahá'í de Estudios de Madrid a entender cómo va un grupo de estudio (grado).
A partir de las conversaciones registradas con las familias de ese grado, identifica:
- Temas o preocupaciones que se repiten entre varias familias.
- Peticiones, dudas o pendientes que aún no se han resuelto.
- Cualquier otra cosa relevante que el equipo debería saber o hacer respecto a ese grado.

Reglas:
- Basa todo estrictamente en las conversaciones dadas — no inventes ni generalices sin base. Si una familia no tiene conversaciones registradas, no la menciones en los patrones (pero puedes señalar al final cuántas familias no tienen conversaciones aún, si es relevante).
- Si hay muy pocas o ninguna conversación registrada en total, dilo claramente en vez de forzar un análisis.
- Cita a la familia por su nombre cuando sea relevante para un punto concreto.
- Responde en español, en texto plano (sin markdown de tablas ni encabezados con #), con títulos cortos en mayúscula seguidos de líneas con guiones. Sé conciso y concreto.`;

function construirContexto(familias) {
  return familias.map(f => {
    const notas = (f.notas || []).length
      ? f.notas.map(n => `- ${n}`).join("\n")
      : "(sin conversaciones registradas)";
    return `Familia "${f.nombre}"\nConversaciones:\n${notas}`;
  }).join("\n\n---\n\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: "Falta configurar ANTHROPIC_API_KEY en las variables de entorno de Vercel" });
    return;
  }

  const { grado, familias } = req.body || {};
  if (!grado || typeof grado !== "string" || !Array.isArray(familias) || familias.length === 0) {
    res.status(400).json({ error: "Faltan datos: grado y familias" });
    return;
  }

  const llamarIA = async () => client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2000,
    output_config: { effort: "medium" },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Grado: ${grado}\n\nFamilias del grado y sus conversaciones registradas:\n\n${construirContexto(familias)}`,
      },
    ],
  });

  try {
    let response;
    try {
      response = await llamarIA();
    } catch (err) {
      if (!esReintentable(err)) throw err;
      console.warn("insights-grado: fallo puntual, reintentando...", err.message);
      await new Promise(r => setTimeout(r, 1500));
      response = await llamarIA();
    }

    const textBlock = response.content.find(b => b.type === "text");
    if (!textBlock) {
      res.status(502).json({ error: "La IA devolvió una respuesta inesperada. Inténtalo de nuevo." });
      return;
    }
    res.status(200).json({ insights: textBlock.text });
  } catch (err) {
    console.error("insights-grado error:", err);
    res.status(502).json({ error: mensajeAmigable(err) });
  }
}
