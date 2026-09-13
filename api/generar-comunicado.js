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
A partir de una idea que un organizador quiere transmitir, redacta UN mensaje de WhatsApp distinto y personalizado para cada familia listada.

Cómo interpretar la idea:
- La idea puede ser un único texto para todas las familias, o puede contener fragmentos distintos según el curso/grado de los hijos (por ejemplo, un párrafo para "Grado 1", otro para "Grado 2", etc.). Si la idea distingue por curso, mira el curso de cada hijo de la familia (indicado entre paréntesis junto a su nombre en "Hijos") y usa el fragmento que corresponda a ese curso. Si una familia tiene hijos en más de un curso mencionado en la idea, combina el contenido relevante de cada fragmento en un solo mensaje coherente para esa familia, sin incluir literalmente los fragmentos que no le apliquen.
- Conserva los detalles concretos que el organizador haya escrito (nombres de personas, horarios, días, propuestas) tal cual — no los generalices, resumas ni omitas. Lo único que adaptas por familia es el saludo, el idioma, y la selección del fragmento correspondiente a su curso.
- No añadas información, fechas ni detalles que no estén en la idea proporcionada.

Estilo — esto es lo más importante:
- Imita el estilo y la voz con la que el organizador escribió la idea: mismo nivel de formalidad, mismas expresiones, mismo tipo de puntuación (por ejemplo, si escribe "Hola!" sin abrir exclamación, o frases con preguntas sueltas, mantenlo así). No corrijas su redacción, no la formalices ni la hagas sonar más "profesional" o genérica — debe sonar como si la propia persona lo hubiera escrito, familia por familia.
- No fuerces una despedida institucional ("un saludo del equipo del Campamento" o similar) si la idea original no termina así — cierra igual que cerraría el organizador.
- Escribe cada mensaje en el idioma indicado para esa familia (español o inglés). No mezcles idiomas dentro de un mismo mensaje.
- Empieza con un saludo cálido usando el nombre de la familia y, si tiene hijos registrados, sus nombres.
- Usa las conversaciones recientes solo como contexto de tono — no las cites literalmente ni inventes datos que no estén en el contexto proporcionado.
- Devuelve exactamente un mensaje por cada familia de la lista, usando su "id" tal cual en el campo familia_id.`;

function construirContexto(familias) {
  return familias.map(f => {
    const hijos = (f.hijos || [])
      .map(h => h?.nombre ? `${h.nombre}${h.curso ? ` (${h.curso})` : ""}` : null)
      .filter(Boolean).join(", ") || "sin hijos registrados";
    const notas = (f.notas || []).length
      ? f.notas.map(n => `- ${n}`).join("\n")
      : "(sin conversaciones previas registradas)";
    return `Familia "${f.nombre}" (id: ${f.id})\nIdioma: ${f.idioma === "en" ? "inglés" : "español"}\nParentesco: ${f.grado || "—"}\nHijos: ${hijos}\nConversaciones recientes:\n${notas}`;
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

  const esReintentable = (err) =>
    err instanceof Anthropic.RateLimitError ||
    err instanceof Anthropic.InternalServerError ||
    err instanceof Anthropic.APIConnectionError ||
    err?.status === 529;

  const llamarIA = async () => client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 8000,
    output_config: {
      effort: "high",
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

  try {
    let response;
    try {
      response = await llamarIA();
    } catch (err) {
      if (!esReintentable(err)) throw err;
      console.warn("generar-comunicado: fallo puntual, reintentando...", err.message);
      await new Promise(r => setTimeout(r, 1500));
      response = await llamarIA();
    }

    const textBlock = response.content.find(b => b.type === "text");
    if (!textBlock) {
      res.status(502).json({ error: "La IA devolvió una respuesta inesperada. Inténtalo de nuevo." });
      return;
    }
    const parsed = JSON.parse(textBlock.text);
    res.status(200).json(parsed);
  } catch (err) {
    console.error("generar-comunicado error:", err);
    res.status(502).json({ error: mensajeAmigable(err) });
  }
}

function mensajeAmigable(err) {
  if (err instanceof Anthropic.AuthenticationError) {
    return "La clave de la IA (ANTHROPIC_API_KEY) no es válida. Revísala en Vercel → Settings → Environment Variables.";
  }
  if (err instanceof Anthropic.PermissionDeniedError) {
    return "La clave de la IA no tiene permiso para usar este modelo. Comprueba tu cuenta en console.anthropic.com.";
  }
  if (err instanceof Anthropic.RateLimitError) {
    return "Se han hecho demasiadas peticiones seguidas a la IA. Espera un minuto y vuelve a intentarlo.";
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return "No se pudo conectar con el servicio de IA. Comprueba la conexión e inténtalo de nuevo.";
  }
  if (err instanceof Anthropic.InternalServerError || err?.status === 529 || err?.status >= 500) {
    return "El servicio de IA ha tenido un problema temporal (ya lo hemos reintentado sin éxito). Espera un momento e inténtalo de nuevo.";
  }
  if (err instanceof Anthropic.BadRequestError) {
    return "Algo en la petición no es válido — revisa que haya al menos una familia con teléfono seleccionada.";
  }
  if (err instanceof SyntaxError) {
    return "La IA devolvió una respuesta que no se pudo leer. Inténtalo de nuevo.";
  }
  return "No se pudieron generar los mensajes. Inténtalo de nuevo en un momento.";
}
