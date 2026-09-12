import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SCHEMA = {
  type: "object",
  properties: {
    mensajes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          familia_id: { type: "string" },
          mensaje: { type: "string" },
        },
        required: ["familia_id", "mensaje"],
        additionalProperties: false,
      },
    },
  },
  required: ["mensajes"],
  additionalProperties: false,
};

const SYSTEM = `Eres el asistente de comunicación del Campamento Urbano Comunitario del Centro Bahá'í de Estudios de Madrid.
A partir de una idea general que un organizador quiere transmitir, redacta UN mensaje de WhatsApp distinto y personalizado para cada familia listada.

Reglas:
- Escribe cada mensaje en el idioma indicado para esa familia (español o inglés). No mezcles idiomas dentro de un mismo mensaje.
- Empieza con un saludo cálido usando el nombre de la familia y, si tiene hijos registrados, sus nombres.
- Usa las conversaciones recientes solo como contexto de tono (por ejemplo, si hay algo pendiente relevante) — no las cites literalmente ni inventes datos que no estén en el contexto proporcionado.
- Transmite fielmente la idea indicada, sin añadir información, fechas o detalles que no se te hayan dado.
- Tono cercano y breve — es un mensaje de WhatsApp, no una carta formal. Máximo 4-5 frases.
- Cierra con una despedida breve y cálida de parte del equipo del Campamento.
- Devuelve exactamente un mensaje por cada familia de la lista, usando su "id" tal cual en el campo familia_id.`;

function construirContexto(familias) {
  return familias.map(f => {
    const hijos = (f.hijos || []).map(h => h?.nombre).filter(Boolean).join(", ") || "sin hijos registrados";
    const notas = (f.notas || []).length
      ? f.notas.map(n => `- ${n}`).join("\n")
      : "(sin conversaciones previas registradas)";
    return `Familia "${f.nombre}" (id: ${f.id})\nIdioma: ${f.idioma === "en" ? "inglés" : "español"}\nGrado/parentesco: ${f.grado || "—"}\nHijos: ${hijos}\nConversaciones recientes:\n${notas}`;
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

  const { idea, familias } = req.body || {};
  if (!idea || typeof idea !== "string" || !Array.isArray(familias) || familias.length === 0) {
    res.status(400).json({ error: "Faltan datos: idea y familias" });
    return;
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: SCHEMA },
      },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Idea a comunicar:\n"""\n${idea}\n"""\n\nFamilias:\n\n${construirContexto(familias)}`,
        },
      ],
    });

    const textBlock = response.content.find(b => b.type === "text");
    if (!textBlock) {
      res.status(502).json({ error: "Respuesta inesperada de la IA" });
      return;
    }
    const parsed = JSON.parse(textBlock.text);
    res.status(200).json(parsed);
  } catch (err) {
    console.error("generar-comunicado error:", err);
    res.status(500).json({ error: err.message || "Error generando los mensajes" });
  }
}
