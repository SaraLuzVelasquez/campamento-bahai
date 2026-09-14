import Anthropic from "@anthropic-ai/sdk";
import { esReintentable, mensajeAmigable } from "./_lib/anthropic-errores.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Eres el asistente de los organizadores del Campamento Urbano Comunitario del Centro Bahá'í de Estudios de Madrid.
Responden preguntas sobre las familias, hijos, voluntarios, talleres, ofrecimientos y conversaciones registradas en la app, usando SOLO los datos que se te proporcionan a continuación.

Reglas:
- Basa toda respuesta estrictamente en los datos dados — no inventes nombres, cifras ni hechos que no estén ahí.
- Si la pregunta no se puede responder con los datos disponibles, dilo claramente en vez de adivinar.
- Sé concreto: si te preguntan un número o un listado, da el número o listado exacto (nombres incluidos), no una descripción vaga.
- Responde en español, en texto plano y breve — sin markdown de tablas ni encabezados con #. Usa listas con guiones solo si aportan claridad.
- Cuando cites una conversación, resume su contenido; no hace falta citar literalmente.`;

function construirContexto({ familias, voluntarios, talleres, ofrecimientos }) {
  const bloqueFamilias = (familias || []).map(f => {
    const hijos = (f.hijos || []).map(h => `${h.nombre || "—"}${h.curso ? ` (${h.curso})` : ""}${h.edad ? `, ${h.edad} años` : ""}${h.alergias ? ` — alergias: ${h.alergias}` : ""}`).join("; ") || "sin hijos registrados";
    const notas = (f.notas || []).length ? f.notas.map(n => `  - ${n}`).join("\n") : "  (sin conversaciones registradas)";
    return `Familia "${f.nombre}" — parentesco: ${f.grado || "—"}, idioma: ${f.idioma === "en" ? "inglés" : "español"}${f.libro ? `, Libro de Ruhi: ${f.libro}` : ""}${f.servicio ? `, colaboración: ${f.servicio}` : ""}\nHijos: ${hijos}\nConversaciones recientes:\n${notas}`;
  }).join("\n\n");

  const bloqueVoluntarios = (voluntarios || []).length
    ? voluntarios.map(v => `- ${v.nombre}${v.roles?.length ? ` (${v.roles.join(", ")})` : ""}${v.notas ? ` — ${v.notas}` : ""}`).join("\n")
    : "(sin voluntarios registrados)";

  const bloqueTalleres = (talleres || []).length
    ? talleres.map(t => `- ${t.descripcion} — sostenido por ${t.quien}${t.fecha ? `, fecha: ${t.fecha}` : " (fecha por confirmar)"}${t.necesita ? `, necesita: ${t.necesita}` : ""}`).join("\n")
    : "(sin talleres registrados)";

  const bloqueOfrecimientos = (ofrecimientos || []).length
    ? ofrecimientos.map(o => `- ${o.que} — ${o.fecha}${o.familiaNombre ? ` (${o.familiaNombre})` : ""}`).join("\n")
    : "(sin ofrecimientos registrados)";

  return `FAMILIAS (${(familias || []).length}):\n${bloqueFamilias}\n\nVOLUNTARIOS:\n${bloqueVoluntarios}\n\nTALLERES:\n${bloqueTalleres}\n\nOFRECIMIENTOS:\n${bloqueOfrecimientos}`;
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

  const { pregunta, historial, familias, voluntarios, talleres, ofrecimientos } = req.body || {};
  if (!pregunta || typeof pregunta !== "string") {
    res.status(400).json({ error: "Falta la pregunta" });
    return;
  }

  const historialValido = Array.isArray(historial)
    ? historial.filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-16)
    : [];

  const contexto = construirContexto({ familias, voluntarios, talleres, ofrecimientos });

  const llamarIA = async () => client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1500,
    output_config: { effort: "medium" },
    system: `${SYSTEM}\n\nDATOS DEL CAMPAMENTO:\n\n${contexto}`,
    messages: [...historialValido, { role: "user", content: pregunta }],
  });

  try {
    let response;
    try {
      response = await llamarIA();
    } catch (err) {
      if (!esReintentable(err)) throw err;
      console.warn("preguntar: fallo puntual, reintentando...", err.message);
      await new Promise(r => setTimeout(r, 1500));
      response = await llamarIA();
    }

    const textBlock = response.content.find(b => b.type === "text");
    if (!textBlock) {
      res.status(502).json({ error: "La IA devolvió una respuesta inesperada. Inténtalo de nuevo." });
      return;
    }
    res.status(200).json({ respuesta: textBlock.text });
  } catch (err) {
    console.error("preguntar error:", err);
    res.status(502).json({ error: mensajeAmigable(err) });
  }
}
