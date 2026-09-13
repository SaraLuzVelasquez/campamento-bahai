import Anthropic from "@anthropic-ai/sdk";

export function esReintentable(err) {
  return err instanceof Anthropic.RateLimitError ||
    err instanceof Anthropic.InternalServerError ||
    err instanceof Anthropic.APIConnectionError ||
    err?.status === 529;
}

export function mensajeAmigable(err, { badRequestHint } = {}) {
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
    return badRequestHint || "Algo en la petición no es válido.";
  }
  if (err instanceof SyntaxError) {
    return "La IA devolvió una respuesta que no se pudo leer. Inténtalo de nuevo.";
  }
  return "No se pudo completar la petición a la IA. Inténtalo de nuevo en un momento.";
}
