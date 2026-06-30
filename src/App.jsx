import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uufznuiclxuevcpznwll.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZnpudWljbHh1ZXZjcHpud2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDA4NjIsImV4cCI6MjA5ODI3Njg2Mn0.cqi5XePwSu7q192PZ2L15hOoRqmMvbQOpO3uZ8qwHvU"
);

const UNIDADES = {
  1: {
    nombre: "Comprensión de los Escritos bahá'ís",
    secciones: {
      1: "Leer y reflexionar sobre los Escritos sagrados cada día",
      2: "Ejercicios sobre conducta loable y veracidad",
      3: "La veracidad como base de todas las virtudes",
      4: "Honradez, lealtad y claridad de corazón",
      5: "La lengua amable y la unidad",
      6: "Conflicto, disputa y amorosa bondad",
      7: "La murmuración apaga la luz del corazón",
      8: "Efectos de la murmuración en la comunidad",
      9: "El hábito de leer los Escritos sagrados cada día",
    },
  },
  2: {
    nombre: "La oración",
    secciones: {
      1: "El doble propósito: crecer espiritualmente y servir",
      2: "La nobleza del alma y la oración como alimento espiritual",
      3: "Por qué oramos: amor a Dios",
      4: "La oración como fuego, luz y fuente de vida",
      5: "La oración como conversación con Dios",
      6: "Entonar los versículos de Dios",
      7: "Oraciones de Bahá'u'lláh para memorizar",
      8: "Orar y alinear la voluntad con Dios",
      9: "Las tres oraciones obligatorias",
      10: "Reuniones devocionales y adoración comunitaria",
      11: "Ser anfitrión de una reunión devocional",
    },
  },
  3: {
    nombre: "La vida y la muerte",
    secciones: {
      1: "El alma no es una entidad física; es inmortal",
      2: "El alma comienza con la formación del embrión",
      3: "La conexión entre el alma y el cuerpo: luz y espejo",
      4: "El alma progresa eternamente después de la muerte",
      5: "El alma actúa con y sin instrumentos corporales",
      6: "El alma es independiente de la enfermedad del cuerpo",
      7: "El alma continúa progresando hacia la presencia de Dios",
      8: "La muerte como mensajera de alegría",
      9: "Este mundo prepara el alma para el siguiente",
      10: "Recibir la porción de gracia que Dios nos destina",
      11: "El alma es un signo de Dios",
      12: "El alma como pájaro que se remonta al cielo",
      13: "El alma puede reflejar todos los atributos de Dios",
      14: "Los poderes del alma están latentes; necesitan educación",
      15: "Las Manifestaciones de Dios como guías del alma",
      16: "El ser humano como talismán; la educación espiritual",
      17: "El alma fiel alcanzará una estación gloriosa",
      18: "El alma purificada y sus compañeros en el otro mundo",
      19: "Orar por el progreso de las almas de los difuntos",
      20: "Al partir, caen los velos y se revelan las realidades",
      21: "Las almas se reconocen y comulgan en el otro mundo",
      22: "No apenarse; días de alegría celestial nos esperan",
      23: "Reflexión final: cualidades espirituales y servicio",
    },
  },
};

const GRADOS = ["Madre", "Padre", "Abuela", "Abuelo", "Voluntario"];

const ROLES_VOLUNTARIO = ["Logística", "Maestro", "Animador", "Tesorería", "Camisetas", "Meriendas/Excursiones", "Otros"];

const GRADO_COLOR = {
  "Madre": "bg-pink-100 text-pink-700",
  "Padre": "bg-blue-100 text-blue-700",
  "Abuela": "bg-rose-100 text-rose-700",
  "Abuelo": "bg-cyan-100 text-cyan-700",
  "Voluntario": "bg-gray-100 text-gray-700",
  "Huevito": "bg-blue-100 text-blue-700",
  "Grado 1": "bg-green-100 text-green-700",
  "Grado 2": "bg-orange-100 text-orange-700",
  "Grado 3": "bg-red-100 text-red-700",
  "Prejuvenil": "bg-purple-100 text-purple-700",
};

function ContactoTelefono({ telefono }) {
  if (!telefono) return null;
  const limpio = telefono.replace(/\D/g, "");
  return (
    <div className="flex gap-2">
      <a href={`https://wa.me/${limpio.startsWith("34") ? limpio : "34" + limpio}`} target="_blank" rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-all">
        💬 WhatsApp
      </a>
      <a href={`tel:${telefono}`}
        className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">
        📞 Llamar
      </a>
    </div>
  );
}

function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4">
        <div>
          <p className="font-semibold text-gray-800 mb-1">{title}</p>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onConfirm}
            className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all">
            {confirmLabel}
          </button>
          <button onClick={onCancel}
            className="px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-all">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ text }) {
  const base = text.split(" / ")[0];
  const cls = GRADO_COLOR[base] || "bg-gray-100 text-gray-600";
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{text}</span>;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

function ResetPasswordScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError("No se ha podido actualizar. Inténtalo de nuevo.");
    else { setSuccess("¡Contraseña actualizada! Ya puedes entrar."); setTimeout(onDone, 2000); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔑</div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva contraseña</h1>
          <p className="text-sm text-gray-500 mt-1">Elige una contraseña nueva para tu cuenta</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nueva contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Confirmar contraseña</label>
            <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repite la contraseña"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          {success && <p className="text-emerald-600 text-sm bg-emerald-50 rounded-xl px-3 py-2">{success}</p>}
          <button onClick={handleReset} disabled={loading}
            className="w-full bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 transition-all">
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    if (!email.trim()) { setError("Escribe tu correo electrónico"); return; }
    if (!password.trim()) { setError("Escribe tu contraseña"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Correo o contraseña incorrectos. ¿Has creado una cuenta?");
    else onAuth(data.user);
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!nombre.trim()) { setError("Escribe tu nombre"); return; }
    if (nombre.includes("@")) { setError("El nombre no puede ser un correo. Escribe solo tu nombre, por ejemplo: Sara"); return; }
    if (!email.trim()) { setError("Escribe tu correo electrónico"); return; }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nombre } } });
    if (error) {
      if (error.message.includes("already registered")) setError("Este correo ya tiene una cuenta. Prueba a entrar directamente.");
      else setError("Algo ha salido mal. Inténtalo de nuevo.");
    } else { setSuccess("¡Cuenta creada! Ya puedes entrar."); setMode("login"); }
    setLoading(false);
  };

  const handleRecover = async () => {
    if (!email.trim()) { setError("Escribe tu correo para recuperar la contraseña"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) setError("No hemos podido enviar el correo. Comprueba la dirección.");
    else setSuccess("Te hemos enviado un correo para restablecer tu contraseña.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✨</div>
          <p className="text-xs text-violet-500 font-semibold uppercase tracking-widest">Campamento Urbano Comunitario</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Centro Bahá'í de Estudios</h1>
          <p className="text-sm text-gray-500 mt-1">Madrid · 6 al 31 de julio</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {mode !== "recover" && (
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {["login","register"].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode===m?"bg-white text-violet-700 shadow-sm":"text-gray-500"}`}>
                  {m==="login"?"Entrar":"Crear cuenta"}
                </button>
              ))}
            </div>
          )}
          {mode === "recover" && (
            <div>
              <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className="text-sm text-violet-500 hover:text-violet-700 mb-2">← Volver</button>
              <p className="font-semibold text-gray-800 mb-1">Recuperar contraseña</p>
              <p className="text-sm text-gray-500">Te enviaremos un enlace a tu correo.</p>
            </div>
          )}
          {mode==="register" && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tu nombre</label>
              <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Sara"
                autoComplete="off" autoCorrect="off" spellCheck="false"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Correo electrónico</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
          {mode !== "recover" && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Contraseña</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
            </div>
          )}
          {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          {success && <p className="text-emerald-600 text-sm bg-emerald-50 rounded-xl px-3 py-2">{success}</p>}
          <button onClick={mode==="login"?handleLogin:mode==="register"?handleRegister:handleRecover} disabled={loading}
            className="w-full bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 transition-all">
            {loading?"Un momento...":mode==="login"?"Entrar":mode==="register"?"Crear cuenta":"Enviar enlace"}
          </button>
          {mode==="login" && (
            <button onClick={() => { setMode("recover"); setError(""); setSuccess(""); }}
              className="w-full text-center text-sm text-gray-400 hover:text-violet-500 transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── FAMILIA FORM ──────────────────────────────────────────────────────────────

function FamiliaForm({ familia, onSave, onCancel }) {
  const [nombre, setNombre] = useState(familia?.nombre || "");
  const [telefono, setTelefono] = useState(familia?.telefono || "");
  const [grado, setGrado] = useState(familia?.grado || "Madre");
  const [servicio, setServicio] = useState(familia?.servicio || "");
  const [hijos, setHijos] = useState(
    (familia?.hijos || []).map(h =>
      typeof h === "string" ? { nombre: h, edad: "", curso: "Huevito" } : h
    )
  );
  const [showContacto2, setShowContacto2] = useState(!!(familia?.contacto2_nombre));
  const [contacto2Nombre, setContacto2Nombre] = useState(familia?.contacto2_nombre || "");
  const [contacto2Parentesco, setContacto2Parentesco] = useState(familia?.contacto2_parentesco || "Madre");
  const [contacto2Telefono, setContacto2Telefono] = useState(familia?.contacto2_telefono || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const CURSOS = ["Huevito", "Grado 1", "Grado 2", "Grado 3", "Prejuvenil"];

  const addHijo = () => setHijos(prev => [...prev, { nombre: "", edad: "", curso: "Huevito" }]);
  const removeHijo = (i) => setHijos(prev => prev.filter((_, idx) => idx !== i));
  const updateHijo = (i, field, value) => setHijos(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: value } : h));

  const handleSave = async () => {
    if (!nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setSaving(true);
    const id = familia?.id || nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    const payload = {
      id, nombre: nombre.trim(), telefono: telefono.trim() || null, grado, servicio: servicio.trim(), hijos,
      contacto2_nombre: showContacto2 ? contacto2Nombre.trim() || null : null,
      contacto2_parentesco: showContacto2 ? contacto2Parentesco : null,
      contacto2_telefono: showContacto2 ? contacto2Telefono.trim() || null : null,
    };
    const { data, error } = familia
      ? await supabase.from("familias").update(payload).eq("id", familia.id).select().single()
      : await supabase.from("familias").insert(payload).select().single();
    if (error) setError("No se ha podido guardar. Inténtalo de nuevo.");
    else onSave(data);
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
      <p className="font-semibold text-gray-800">{familia ? "Editar familia" : "Nueva familia"}</p>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Nombre del padre/madre *</label>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: María"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
        <input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="Ej: 612 345 678" type="tel"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      {showContacto2 ? (
        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500">Segundo contacto</p>
            <button onClick={() => setShowContacto2(false)} className="text-gray-300 hover:text-red-400 text-xs">✕ Quitar</button>
          </div>
          <input value={contacto2Nombre} onChange={e=>setContacto2Nombre(e.target.value)} placeholder="Nombre"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
          <div className="flex flex-wrap gap-1.5">
            {GRADOS.map(g => (
              <button key={g} onClick={() => setContacto2Parentesco(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${contacto2Parentesco === g ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
                {g}
              </button>
            ))}
          </div>
          <input value={contacto2Telefono} onChange={e=>setContacto2Telefono(e.target.value)} placeholder="Teléfono" type="tel"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
        </div>
      ) : (
        <button onClick={() => setShowContacto2(true)}
          className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors">
          + Añadir segundo contacto
        </button>
      )}

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Parentesco (contacto principal)</label>
        <div className="flex flex-wrap gap-1.5">
          {GRADOS.map(g => (
            <button key={g} onClick={()=>setGrado(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${grado===g?"bg-violet-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-500">Hijos</label>
          <button onClick={addHijo} className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors">+ Añadir hijo</button>
        </div>
        <div className="space-y-3">
          {hijos.map((h, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-gray-500">Hijo {i + 1}</p>
                <button onClick={() => removeHijo(i)} className="text-gray-300 hover:text-red-400 transition-colors text-xs">✕ Eliminar</button>
              </div>
              <input value={h.nombre} onChange={e => updateHijo(i, "nombre", e.target.value)}
                placeholder="Nombre"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
              <input value={h.edad} onChange={e => updateHijo(i, "edad", e.target.value)}
                placeholder="Edad"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
              <div className="flex flex-wrap gap-1.5">
                {CURSOS.map(c => (
                  <button key={c} onClick={() => updateHijo(i, "curso", c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${h.curso === c ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {hijos.length === 0 && (
            <button onClick={addHijo}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm hover:border-violet-300 hover:text-violet-500 transition-all">
              + Añadir hijo
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Colaboración</label>
        <input value={servicio} onChange={e=>setServicio(e.target.value)} placeholder="Ej: Limpieza una vez a la semana"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 transition-all">
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-all">Cancelar</button>
      </div>
    </div>
  );
}

// ── VISITA FORM ───────────────────────────────────────────────────────────────

function VisitaForm({ familiaId, currentUser, allProfiles, onSave, onCancel }) {
  const [unidad, setUnidad] = useState(1);
  const [seccion, setSeccion] = useState(1);
  const [visitadorId, setVisitadorId] = useState(currentUser.id);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10));
  const [completada, setCompletada] = useState(false);
  const [comentario, setComentario] = useState("");
  const [saving, setSaving] = useState(false);

  const secciones = UNIDADES[unidad].secciones;

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await supabase.from("visitas").insert({
      familia_id: familiaId, fecha, unidad, seccion,
      visitador_id: visitadorId, completada,
      comentario: comentario || null,
    }).select("*, profiles(nombre)").single();
    if (!error) onSave(data);
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
      <p className="font-semibold text-gray-800">Nueva visita</p>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Fecha</label>
        <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-2 block">¿Quién fue?</label>
        <select value={visitadorId} onChange={e=>setVisitadorId(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-300">
          {allProfiles.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}{p.id===currentUser.id?" (yo)":""}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Unidad</label>
        <div className="flex gap-2">
          {[1,2,3].map(u => (
            <button key={u} onClick={()=>{setUnidad(u);setSeccion(1);}}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${unidad===u?"bg-violet-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{u}</button>
          ))}
        </div>
        <p className="text-xs text-violet-600 mt-1.5 font-medium">{UNIDADES[unidad].nombre}</p>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Sección</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(secciones).map(s => (
            <button key={s} onClick={()=>setSeccion(Number(s))}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${seccion===Number(s)?"bg-violet-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2 italic leading-snug">{secciones[seccion]}</p>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Estado</label>
        <button onClick={()=>setCompletada(!completada)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${completada?"bg-emerald-500 text-white":"bg-gray-100 text-gray-500"}`}>
          {completada?"✓ Completada":"En progreso"}
        </button>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Comentario (opcional)</label>
        <textarea value={comentario} onChange={e=>setComentario(e.target.value)} rows={2} placeholder="Observaciones..."
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 transition-all">
          {saving?"Guardando...":"Guardar visita"}
        </button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-all">Cancelar</button>
      </div>
    </div>
  );
}

function VisitaCard({ visita, onDelete }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{visita.fecha}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${visita.completada?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>
            {visita.completada?"Completada":"En progreso"}
          </span>
          <button onClick={onDelete} className="text-gray-300 hover:text-red-400 transition-colors">✕</button>
        </div>
      </div>
      <p className="text-xs text-violet-600 font-medium">U{visita.unidad} · S{visita.seccion} · {UNIDADES[visita.unidad]?.nombre}</p>
      <p className="text-xs text-gray-500 italic">{UNIDADES[visita.unidad]?.secciones[visita.seccion]}</p>
      <p className="text-xs text-gray-600"><span className="font-medium">Fue:</span> {visita.profiles?.nombre}</p>
      {visita.comentario && <p className="text-xs text-gray-500 bg-white rounded-lg px-2 py-1.5 border border-gray-100">💬 {visita.comentario}</p>}
    </div>
  );
}

function ConversacionesSection({ familiaId, currentUser }) {
  const [conversaciones, setConversaciones] = useState([]);
  const [nota, setNota] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      supabase.from("conversaciones").select("*, profiles(nombre)").eq("familia_id", familiaId)
        .order("created_at", { ascending: false })
        .then(({ data }) => { setConversaciones(data || []); setLoaded(true); });
    }
  }, [familiaId, loaded]);

  const handleSave = async () => {
    if (!nota.trim()) return;
    setSaving(true);
    const { data } = await supabase.from("conversaciones").insert({
      familia_id: familiaId, nota: nota.trim(), autor_id: currentUser.id,
    }).select("*, profiles(nombre)").single();
    if (data) setConversaciones(prev => [data, ...prev]);
    setNota("");
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("conversaciones").delete().eq("id", id);
    setConversaciones(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Conversaciones</p>
      <div className="flex gap-2">
        <textarea value={nota} onChange={e=>setNota(e.target.value)} rows={2}
          placeholder="Anota algo sobre esta familia..."
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
        <button onClick={handleSave} disabled={saving || !nota.trim()}
          className="px-3 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 transition-all self-end">
          {saving?"...":"Guardar"}
        </button>
      </div>
      {conversaciones.map(c => (
        <div key={c.id} className="bg-amber-50 rounded-xl p-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-gray-700 flex-1">{c.nota}</p>
            <button onClick={()=>handleDelete(c.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">✕</button>
          </div>
          <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("es-ES")} · {c.profiles?.nombre}</p>
        </div>
      ))}
    </div>
  );
}

function DetalleScreen({ familia, visitas, currentUser, allProfiles, onAddVisita, onDeleteVisita, onClose, isAdmin }) {
  const [tab, setTab] = useState("conversaciones");
  const [conversaciones, setConversaciones] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      supabase.from("conversaciones").select("*, profiles(nombre)").eq("familia_id", familia.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => { setConversaciones(data || []); setLoaded(true); });
    }
  }, [familia.id, loaded]);

  const handleDeleteConv = async (id) => {
    await supabase.from("conversaciones").delete().eq("id", id);
    setConversaciones(prev => prev.filter(c => c.id !== id));
  };

  const sorted = [...visitas].sort((a,b) => b.fecha.localeCompare(a.fecha));

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 flex-shrink-0">
        <button onClick={onClose} className="text-sm text-violet-500 font-medium mb-2 flex items-center gap-1">
          ← Volver
        </button>

        {/* Perfil compacto */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">
            {familia.nombre[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900">{familia.nombre}</span>
              <Badge text={familia.grado} />
            </div>
            {familia.telefono && (
              <a href={`https://wa.me/${familia.telefono.replace(/\D/g, "").startsWith("34") ? familia.telefono.replace(/\D/g, "") : "34" + familia.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 mt-0.5 block">
                💬 {familia.telefono}
              </a>
            )}
          </div>
        </div>

        {familia.telefono && (
          <div className="mb-2">
            <ContactoTelefono telefono={familia.telefono} isAdmin={isAdmin} />
          </div>
        )}

        {familia.contacto2_nombre && (
          <div className="mb-2 bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Segundo contacto</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">{familia.contacto2_nombre}</span>
              <Badge text={familia.contacto2_parentesco} />
            </div>
            {familia.contacto2_telefono && <ContactoTelefono telefono={familia.contacto2_telefono} isAdmin={isAdmin} />}
          </div>
        )}

        {familia.hijos?.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
            {familia.hijos.map((h, i) => {
              const nombre = typeof h === "string" ? h : h.nombre;
              const edad = typeof h === "string" ? "" : h.edad;
              const curso = typeof h === "string" ? "" : h.curso;
              return (
                <span key={i} className="text-xs text-gray-600">
                  {nombre || "—"}{edad ? `, ${edad}a` : ""}{curso ? ` · ` : ""}{curso && <Badge text={curso} />}
                </span>
              );
            })}
          </div>
        )}

        {familia.servicio && (
          <p className="text-xs text-gray-500 mb-2">{familia.servicio}</p>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: "conversaciones", label: `💬 Conv.${conversaciones.length > 0 ? ` (${conversaciones.length})` : ""}` },
            { id: "visitas", label: `📖 Visitas${visitas.length > 0 ? ` (${visitas.length})` : ""}` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-white text-violet-700 shadow-sm" : "text-gray-500"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {tab === "conversaciones" && (
          conversaciones.length === 0
            ? <p className="text-center text-gray-400 py-12">Aún no hay conversaciones</p>
            : conversaciones.map(c => (
              <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
                <p className="text-sm text-gray-700">{c.nota}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString("es-ES")} · {c.profiles?.nombre}</p>
                  <button onClick={() => handleDeleteConv(c.id)} className="text-gray-300 hover:text-red-400 transition-colors text-xs">✕</button>
                </div>
              </div>
            ))
        )}
        {tab === "visitas" && (
          sorted.length === 0
            ? <p className="text-center text-gray-400 py-12">Aún no hay visitas</p>
            : sorted.map(v => (
              <div key={v.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">{v.fecha}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.completada ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {v.completada ? "Completada" : "En progreso"}
                    </span>
                    <button onClick={() => onDeleteVisita(v.id)} className="text-gray-300 hover:text-red-400 transition-colors">✕</button>
                  </div>
                </div>
                <p className="text-xs text-violet-600 font-medium">{UNIDADES[v.unidad]?.nombre}</p>
                <p className="text-sm text-gray-700">Sección {v.seccion}: {UNIDADES[v.unidad]?.secciones[v.seccion]}</p>
                <p className="text-xs text-gray-500">Fue: {v.profiles?.nombre}</p>
                {v.comentario && <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">💬 {v.comentario}</p>}
              </div>
            ))
        )}
      </div>
    </div>
  );
}

function FamiliaCard({ familia, visitas, currentUser, allProfiles, onAddVisita, onDeleteVisita, onEdit, isAdmin }) {
  const [expanded, setExpanded] = useState(false);
  const [accion, setAccion] = useState(null); // "comentario" | "visita" | null
  const [showDetalle, setShowDetalle] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [nota, setNota] = useState("");
  const [savingNota, setSavingNota] = useState(false);
  const [totalConv, setTotalConv] = useState(null);

  const hayActividad = visitas.length > 0 || totalConv > 0;

  useEffect(() => {
    if (expanded && totalConv === null) {
      supabase.from("conversaciones").select("id", { count: "exact", head: true }).eq("familia_id", familia.id)
        .then(({ count }) => setTotalConv(count || 0));
    }
  }, [expanded, familia.id, totalConv]);

  const handleSaveNota = async () => {
    if (!nota.trim()) return;
    setSavingNota(true);
    await supabase.from("conversaciones").insert({
      familia_id: familia.id, nota: nota.trim(), autor_id: currentUser.id,
    });
    setNota("");
    setSavingNota(false);
    setAccion(null);
    setTotalConv(prev => (prev || 0) + 1);
  };

  if (showEdit) return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
        <button onClick={() => setShowEdit(false)} className="text-sm text-violet-500 font-medium mb-2">← Volver</button>
        <h2 className="text-lg font-bold text-gray-900">Editar familia</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <FamiliaForm familia={familia} onSave={(f) => { onEdit(f); setShowEdit(false); }} onCancel={() => setShowEdit(false)} />
      </div>
    </div>
  );

  if (showDetalle) return (
    <DetalleScreen
      familia={familia}
      visitas={visitas}
      currentUser={currentUser}
      allProfiles={allProfiles}
      onAddVisita={onAddVisita}
      onDeleteVisita={onDeleteVisita}
      onClose={() => setShowDetalle(false)}
      isAdmin={isAdmin}
    />
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">
          {familia.nombre[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-800">{familia.nombre}</span>
            <Badge text={familia.grado} />
          </div>
          {familia.hijos?.length > 0 && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {familia.hijos.map(h => typeof h === "string" ? h : `${h.nombre || "—"} · ${h.edad ? h.edad + "a" : "—"} · ${h.curso || ""}`).join(" | ")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {visitas.length > 0 && (
            <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">
              {visitas.length} visita{visitas.length !== 1 ? "s" : ""}
            </span>
          )}
          <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-50">
          <div className="px-4 pt-3 pb-2">
            <p className="text-xs text-gray-400 mb-0.5">Colaboración</p>
            <p className="text-sm text-gray-700">{familia.servicio || "—"}</p>
          </div>

          {familia.telefono && (
            <div className="px-4 pb-3">
              <ContactoTelefono telefono={familia.telefono} isAdmin={isAdmin} />
            </div>
          )}

          {familia.contacto2_nombre && (
            <div className="px-4 pb-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">{familia.contacto2_nombre}</span>
                  <Badge text={familia.contacto2_parentesco} />
                </div>
                {familia.contacto2_telefono && <ContactoTelefono telefono={familia.contacto2_telefono} isAdmin={isAdmin} />}
              </div>
            </div>
          )}

          <div className="px-4 pb-3">
            <button onClick={() => setShowEdit(true)}
              className="w-full py-2.5 rounded-xl text-sm text-violet-500 font-medium bg-violet-50 hover:bg-violet-100 transition-colors">
              Editar
            </button>
          </div>

          {/* Opciones del dropdown */}
          <div className="px-4 pb-4 space-y-2 mt-1">
            {/* Escribir comentario */}
            {accion === "comentario" ? (
              <div className="space-y-2">
                <textarea value={nota} onChange={e => setNota(e.target.value)} rows={3}
                  placeholder="Escribe tu comentario..."
                  autoFocus
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
                <div className="flex gap-2">
                  <button onClick={handleSaveNota} disabled={savingNota || !nota.trim()}
                    className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 transition-all">
                    {savingNota ? "Guardando..." : "Guardar comentario"}
                  </button>
                  <button onClick={() => setAccion(null)}
                    className="px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-all">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : accion === "visita" ? (
              <VisitaForm familiaId={familia.id} currentUser={currentUser} allProfiles={allProfiles}
                onSave={(v) => { onAddVisita(v); setAccion(null); }}
                onCancel={() => setAccion(null)} />
            ) : (
              <div className="space-y-2">
                <button onClick={() => setAccion("comentario")}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-all text-left px-4 flex items-center gap-2">
                  💬 Escribir comentario
                </button>
                <button onClick={() => setAccion("visita")}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-gray-700 transition-all text-left px-4 flex items-center gap-2">
                  📖 Registrar visita
                </button>
                <button
                  onClick={() => hayActividad && setShowDetalle(true)}
                  disabled={!hayActividad}
                  className={`w-full py-3 rounded-xl text-sm font-medium transition-all text-left px-4 flex items-center justify-between ${hayActividad ? "bg-violet-50 hover:bg-violet-100 text-violet-700" : "bg-gray-50 text-gray-300 cursor-not-allowed"}`}>
                  <span>📋 Ver conversaciones y visitas</span>
                  {hayActividad && <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">
                    {visitas.length + (totalConv || 0)}
                  </span>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeedItem({ item, familia, onVerPerfil }) {
  const esVisita = item.tipo === "visita";

  const preview = esVisita
    ? `U${item.unidad} · S${item.seccion} · ${UNIDADES[item.unidad]?.secciones[item.seccion]}`
    : item.nota;

  const fecha = esVisita
    ? item.fecha
    : new Date(item.created_at).toLocaleDateString("es-ES");

  const autor = item.profiles?.nombre;

  return (
    <button
      onClick={() => onVerPerfil(familia?.id)}
      className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3.5 active:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${esVisita ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>
          {esVisita ? "📖 Visita" : "💬 Conversación"}
        </span>
        {familia && <Badge text={familia.grado} />}
      </div>
      <p className="text-sm text-gray-700 line-clamp-2 mb-1.5">{preview}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">{fecha}</span>
        <span className="text-gray-200">·</span>
        <span className="text-xs font-medium text-gray-600">{familia?.nombre}</span>
        <span className="text-gray-200">·</span>
        <span className="text-xs text-gray-400">{autor}</span>
      </div>
    </button>
  );
}

function RecientesView({ visitas, familias, onVerPerfil }) {
  const [conversaciones, setConversaciones] = useState([]);
  const [loadedConv, setLoadedConv] = useState(false);

  useEffect(() => {
    if (!loadedConv) {
      supabase.from("conversaciones").select("*, profiles(nombre)")
        .order("created_at", { ascending: false })
        .then(({ data }) => { setConversaciones(data || []); setLoadedConv(true); });
    }
  }, [loadedConv]);

  const feed = [
    ...visitas.map(v => ({ ...v, tipo: "visita", _sort: v.created_at || v.fecha })),
    ...conversaciones.map(c => ({ ...c, tipo: "conversacion", _sort: c.created_at })),
  ].sort((a, b) => b._sort.localeCompare(a._sort));

  return (
    <div className="space-y-3">
      {feed.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aún no hay actividad registrada</div>
      ) : (
        feed.map(item => (
          <FeedItem
            key={item.id}
            item={item}
            familia={familias.find(f => f.id === item.familia_id)}
            onVerPerfil={onVerPerfil}
          />
        ))
      )}
    </div>
  );
}

function ParticipantesView({ familias }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [showFiltro, setShowFiltro] = useState(false);
  const CURSOS = ["Todos", "Huevito", "Grado 1", "Grado 2", "Grado 3", "Prejuvenil"];

  const participantes = familias.flatMap(f =>
    (f.hijos || []).map(h => ({
      ...(typeof h === "string" ? { nombre: h, edad: "", curso: "" } : h),
      madre: f.nombre,
      familiaId: f.id,
    }))
  ).filter(p => {
    const q = busqueda.toLowerCase();
    const matchQ = !q || p.nombre?.toLowerCase().includes(q) || p.madre?.toLowerCase().includes(q);
    const matchF = filtro === "Todos" || p.curso === filtro;
    return matchQ && matchF;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input type="text" placeholder="Buscar participante..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
        <div className="relative">
          <button onClick={() => setShowFiltro(!showFiltro)}
            className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${filtro !== "Todos" ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
            🔽 {filtro === "Todos" ? "Filtrar" : filtro}
          </button>
          {showFiltro && (
            <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 w-40 overflow-hidden">
              {CURSOS.map(c => (
                <button key={c} onClick={() => { setFiltro(c); setShowFiltro(false); }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${filtro === c ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {participantes.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Sin participantes</p>
      ) : (
        <div className="space-y-2.5">
          {participantes.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">
                {(p.nombre || "?")[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800">{p.nombre || "—"}</span>
                  {p.curso && <Badge text={p.curso} />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {p.edad && <span className="text-xs text-gray-400">{p.edad} años</span>}
                  <span className="text-xs text-gray-400">· {p.madre}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminView({ currentUserId }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: true })
      .then(({ data }) => { setUsuarios(data || []); setLoading(false); });
  }, []);

  const toggleAdmin = async (u) => {
    const nuevoValor = !u.is_admin;
    await supabase.from("profiles").update({ is_admin: nuevoValor }).eq("id", u.id);
    setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, is_admin: nuevoValor } : x));
  };

  if (loading) return <p className="text-center text-gray-400 py-12">Cargando...</p>;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 rounded-2xl px-4 py-3 border border-amber-100">
        <p className="text-sm text-amber-700 font-medium">Sección de administración</p>
        <p className="text-xs text-amber-600 mt-0.5">Solo visible para administradores. Puedes ver los usuarios registrados y gestionar permisos.</p>
      </div>

      <div className="space-y-2.5">
        {usuarios.map(u => (
          <div key={u.id} className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">
              {(u.nombre || "?")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{u.nombre}</p>
              <p className="text-xs text-gray-400 truncate">{u.email || "—"}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {u.is_admin && (
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
              )}
              {u.id !== currentUserId && (
                <button
                  onClick={() => toggleAdmin(u)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${u.is_admin ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-600"}`}>
                  {u.is_admin ? "Quitar admin" : "Hacer admin"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SolicitudForm({ solicitud, onSave, onCancel }) {
  const [nombre, setNombre] = useState(solicitud?.nombre || "");
  const [telefono, setTelefono] = useState(solicitud?.telefono || "");
  const [hijos, setHijos] = useState(solicitud?.hijos || []);
  const [comentario, setComentario] = useState(solicitud?.comentario || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addHijo = () => setHijos(prev => [...prev, { nombre: "", edad: "" }]);
  const removeHijo = (i) => setHijos(prev => prev.filter((_, idx) => idx !== i));
  const updateHijo = (i, field, value) => setHijos(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: value } : h));

  const handleSave = async () => {
    if (!nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setSaving(true);
    const payload = { nombre: nombre.trim(), telefono: telefono.trim() || null, hijos, comentario: comentario.trim() || null };
    const { data, error } = solicitud
      ? await supabase.from("solicitudes").update(payload).eq("id", solicitud.id).select().single()
      : await supabase.from("solicitudes").insert(payload).select().single();
    if (error) setError("No se ha podido guardar. Inténtalo de nuevo.");
    else onSave(data);
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
      <p className="font-semibold text-gray-800">Nueva solicitud</p>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Nombre *</label>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: María"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
        <input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="Ej: 612 345 678" type="tel"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-500">Hijos</label>
          <button onClick={addHijo} className="text-xs text-violet-500 font-medium">+ Añadir hijo</button>
        </div>
        <div className="space-y-2">
          {hijos.map((h, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">Hijo {i + 1}</p>
                <button onClick={() => removeHijo(i)} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
              </div>
              <input value={h.nombre} onChange={e => updateHijo(i, "nombre", e.target.value)}
                placeholder="Nombre"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white" />
              <input value={h.edad} onChange={e => updateHijo(i, "edad", e.target.value)}
                placeholder="Edad"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white" />
            </div>
          ))}
          {hijos.length === 0 && (
            <button onClick={addHijo}
              className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
              + Añadir hijo
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Comentario</label>
        <textarea value={comentario} onChange={e=>setComentario(e.target.value)} rows={3}
          placeholder="Detalles sobre esta solicitud..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40">
          {saving ? "Guardando..." : "Guardar solicitud"}
        </button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500">Cancelar</button>
      </div>
    </div>
  );
}

function SolicitudCard({ solicitud, onMarcarVisto, onReactivar, onConvertir, isAdmin, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  if (showEdit) return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
        <button onClick={() => setShowEdit(false)} className="text-sm text-violet-500 font-medium mb-2">← Volver</button>
        <h2 className="text-lg font-bold text-gray-900">Editar solicitud</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <SolicitudForm solicitud={solicitud} onSave={(s) => { onEdit(s); setShowEdit(false); }} onCancel={() => setShowEdit(false)} />
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${solicitud.visto ? "border-gray-100 opacity-60" : "border-gray-100"}`}>
      {showConfirm && (
        <ConfirmModal
          title="¿Confirmar familia?"
          message={`${solicitud.nombre} pasará a la sección de Confirmados con sus datos actuales.`}
          confirmLabel="Sí, confirmar"
          onConfirm={() => { onConvertir(solicitud); setShowConfirm(false); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold flex-shrink-0">
          {solicitud.nombre[0]}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-800">{solicitud.nombre}</span>
          {solicitud.hijos?.length > 0 && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {solicitud.hijos.map(h => `${h.nombre || "—"}${h.edad ? ` (${h.edad}a)` : ""}`).join(" · ")}
            </p>
          )}
        </div>
        {solicitud.visto && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Visto</span>}
        <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-2">
          {solicitud.telefono && <ContactoTelefono telefono={solicitud.telefono} isAdmin={isAdmin} />}
          {solicitud.comentario && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2">{solicitud.comentario}</p>
          )}
          <p className="text-xs text-gray-400">{new Date(solicitud.created_at).toLocaleDateString("es-ES")}</p>
          <button onClick={() => setShowEdit(true)}
            className="w-full py-2.5 rounded-xl text-sm text-violet-500 font-medium bg-violet-50 hover:bg-violet-100 transition-colors">
            Editar
          </button>
          {isAdmin && (
            <div className="flex gap-2 pt-1">
              {solicitud.visto ? (
                <button onClick={() => onReactivar(solicitud.id)}
                  className="flex-1 bg-violet-50 text-violet-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-100 transition-all">
                  ↻ Activar solicitud
                </button>
              ) : (
                <>
                  <button onClick={() => setShowConfirm(true)}
                    className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-all">
                    ✓ Confirmar familia
                  </button>
                  <button onClick={() => onMarcarVisto(solicitud.id)}
                    className="px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-all whitespace-nowrap">
                    Para otro momento
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SolicitudesView({ solicitudes, isAdmin, onAdd, onEdit, onMarcarVisto, onReactivar, onConvertir }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      {isAdmin && (showForm ? (
        <SolicitudForm onSave={(s) => { onAdd(s); setShowForm(false); }} onCancel={() => setShowForm(false)} />
      ) : (
        <button onClick={() => setShowForm(true)}
          className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700 transition-all">
          + Añadir solicitud
        </button>
      ))}

      {solicitudes.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Sin solicitudes pendientes</p>
      ) : (
        <div className="space-y-2.5">
          {solicitudes.map(s => (
            <SolicitudCard key={s.id} solicitud={s} isAdmin={isAdmin} onMarcarVisto={onMarcarVisto} onReactivar={onReactivar} onConvertir={onConvertir} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── TALLERES ──────────────────────────────────────────────────────────────────

function TallerForm({ taller, onSave, onCancel }) {
  const [quien, setQuien] = useState(taller?.quien || "");
  const [descripcion, setDescripcion] = useState(taller?.descripcion || "");
  const [necesita, setNecesita] = useState(taller?.necesita || "");
  const [fecha, setFecha] = useState(taller?.fecha || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!quien.trim()) { setError("Indica quién sostiene el taller"); return; }
    if (!descripcion.trim()) { setError("Indica de qué va el taller"); return; }
    setSaving(true);
    const payload = { quien: quien.trim(), descripcion: descripcion.trim(), necesita: necesita.trim() || null, fecha: fecha || null };
    const { data, error } = taller
      ? await supabase.from("talleres").update(payload).eq("id", taller.id).select().single()
      : await supabase.from("talleres").insert(payload).select().single();
    if (error) setError("No se ha podido guardar. Inténtalo de nuevo.");
    else onSave(data);
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
      <p className="font-semibold text-gray-800">{taller ? "Editar taller" : "Nuevo taller"}</p>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">¿Quién lo sostiene? *</label>
        <input value={quien} onChange={e=>setQuien(e.target.value)} placeholder="Ej: Miriam"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">¿De qué va el taller? *</label>
        <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} rows={3}
          placeholder="Describe el taller..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Fecha de ejecución</label>
        <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">¿Qué necesita?</label>
        <textarea value={necesita} onChange={e=>setNecesita(e.target.value)} rows={2}
          placeholder="Materiales, recursos, espacio..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40">
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500">Cancelar</button>
      </div>
    </div>
  );
}

function TalleresView({ talleres, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  if (showForm) return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
        <button onClick={() => setShowForm(false)} className="text-sm text-violet-500 font-medium mb-2">← Volver</button>
        <h2 className="text-lg font-bold text-gray-900">Nuevo taller</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <TallerForm onSave={(t) => { onAdd(t); setShowForm(false); }} onCancel={() => setShowForm(false)} />
      </div>
    </div>
  );

  if (editTarget) return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
        <button onClick={() => setEditTarget(null)} className="text-sm text-violet-500 font-medium mb-2">← Volver</button>
        <h2 className="text-lg font-bold text-gray-900">Editar taller</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <TallerForm taller={editTarget} onSave={(t) => { onEdit(t); setEditTarget(null); }} onCancel={() => setEditTarget(null)} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">🎨</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">Hacen falta {Math.max(0, 16 - talleres.length)} talleres</p>
          <p className="text-xs text-amber-600">{talleres.length} de 16 registrados</p>
        </div>
      </div>

      <button onClick={() => setShowForm(true)}
        className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700 transition-all">
        + Añadir taller
      </button>
      {talleres.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Sin talleres registrados</p>
      ) : (
        <div className="space-y-2.5">
          {talleres.map(t => (
            <div key={t.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-800">{t.quien}</p>
                    {t.fecha && <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{new Date(t.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{t.descripcion}</p>
                  {t.necesita && (
                    <div className="mt-2 bg-amber-50 rounded-xl px-3 py-2">
                      <p className="text-xs text-amber-600 font-medium mb-0.5">Necesita</p>
                      <p className="text-sm text-gray-700">{t.necesita}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setEditTarget(t)} className="text-xs text-violet-500 font-medium">Editar</button>
                  <button onClick={() => onDelete(t.id)} className="text-xs text-red-400 font-medium">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── VOLUNTARIOS ───────────────────────────────────────────────────────────────

function VoluntarioForm({ voluntario, onSave, onCancel }) {
  const [nombre, setNombre] = useState(voluntario?.nombre || "");
  const [telefono, setTelefono] = useState(voluntario?.telefono || "");
  const [roles, setRoles] = useState(voluntario?.roles || []);
  const [notas, setNotas] = useState(voluntario?.notas || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleRol = (r) => setRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const handleSave = async () => {
    if (!nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setSaving(true);
    const payload = { nombre: nombre.trim(), telefono: telefono.trim() || null, roles, notas: notas.trim() || null };
    const { data, error } = voluntario
      ? await supabase.from("voluntarios").update(payload).eq("id", voluntario.id).select().single()
      : await supabase.from("voluntarios").insert(payload).select().single();
    if (error) setError("No se ha podido guardar. Inténtalo de nuevo.");
    else onSave(data);
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
      <p className="font-semibold text-gray-800">{voluntario ? "Editar voluntario" : "Nuevo voluntario"}</p>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Nombre *</label>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Ismael"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
        <input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="Ej: 612 345 678" type="tel"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Roles</label>
        <div className="flex flex-wrap gap-1.5">
          {ROLES_VOLUNTARIO.map(r => (
            <button key={r} onClick={() => toggleRol(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${roles.includes(r) ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Notas</label>
        <textarea value={notas} onChange={e=>setNotas(e.target.value)} rows={2}
          placeholder="Disponibilidad, observaciones..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40">
          {saving ? "Guardando..." : "Guardar"}
        </button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500">Cancelar</button>
      </div>
    </div>
  );
}

function VoluntarioCard({ voluntario, isAdmin, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">
          {voluntario.nombre[0]}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-800">{voluntario.nombre}</span>
          {voluntario.roles?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {voluntario.roles.map(r => (
                <span key={r} className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{r}</span>
              ))}
            </div>
          )}
        </div>
        <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-2">
          {voluntario.notas && <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">{voluntario.notas}</p>}
          {voluntario.telefono ? (
            <div className="flex gap-2">
              <div className="flex-1">
                <ContactoTelefono telefono={voluntario.telefono} isAdmin={isAdmin} />
              </div>
              <button onClick={() => onEdit(voluntario)}
                className="px-3 py-2.5 rounded-xl text-sm text-violet-500 font-medium bg-violet-50 hover:bg-violet-100 transition-colors">
                Editar
              </button>
            </div>
          ) : (
            <button onClick={() => onEdit(voluntario)}
              className="w-full py-2.5 rounded-xl text-sm text-violet-500 font-medium bg-violet-50 hover:bg-violet-100 transition-colors">
              Editar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function VoluntariosView({ voluntarios, isAdmin, onAdd, onEdit }) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  if (showForm) return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
        <button onClick={() => setShowForm(false)} className="text-sm text-violet-500 font-medium mb-2">← Volver</button>
        <h2 className="text-lg font-bold text-gray-900">Nuevo voluntario</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <VoluntarioForm onSave={(v) => { onAdd(v); setShowForm(false); }} onCancel={() => setShowForm(false)} />
      </div>
    </div>
  );

  if (editTarget) return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
        <button onClick={() => setEditTarget(null)} className="text-sm text-violet-500 font-medium mb-2">← Volver</button>
        <h2 className="text-lg font-bold text-gray-900">Editar voluntario</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <VoluntarioForm voluntario={editTarget} onSave={(v) => { onEdit(v); setEditTarget(null); }} onCancel={() => setEditTarget(null)} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <button onClick={() => setShowForm(true)}
        className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700 transition-all">
        + Añadir voluntario
      </button>
      {voluntarios.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Sin voluntarios registrados</p>
      ) : (
        <div className="space-y-2.5">
          {voluntarios.map(v => (
            <VoluntarioCard key={v.id} voluntario={v} isAdmin={isAdmin} onEdit={setEditTarget} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [menu, setMenu] = useState("solicitudes"); // solicitudes | confirmados | admin
  const [tab, setTab] = useState("familias"); // sub-tab within confirmados
  const [busqueda, setBusqueda] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("Todos");
  const [showFiltro, setShowFiltro] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showNuevaFamilia, setShowNuevaFamilia] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [detalleTarget, setDetalleTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) initUser(session.user);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (_e === "PASSWORD_RECOVERY") { setShowResetPassword(true); return; }
      if (session?.user) initUser(session.user);
      else { setUser(null); setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const initUser = async (u) => {
    setUser(u);
    const [{ data: prof }, { data: profs }, { data: fams }, { data: vis }, { data: sols }, { data: vols }, { data: talls }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", u.id).single(),
      supabase.from("profiles").select("*"),
      supabase.from("familias").select("*").order("created_at", { ascending: true }),
      supabase.from("visitas").select("*, profiles(nombre)"),
      supabase.from("solicitudes").select("*").order("created_at", { ascending: false }),
      supabase.from("voluntarios").select("*").order("created_at", { ascending: true }),
      supabase.from("talleres").select("*").order("created_at", { ascending: false }),
    ]);
    setProfile(prof);
    setAllProfiles(profs || []);
    setFamilias(fams || []);
    setVisitas(vis || []);
    setSolicitudes(sols || []);
    setVoluntarios(vols || []);
    setTalleres(talls || []);
    setLoading(false);
  };

  const handleAddVisita = (v) => setVisitas(prev => [...prev, v]);
  const handleDeleteVisita = async (id) => {
    await supabase.from("visitas").delete().eq("id", id);
    setVisitas(prev => prev.filter(v => v.id !== id));
  };
  const handleAddFamilia = (f) => {
    setFamilias(prev => [f, ...prev]);
    setShowNuevaFamilia(false);
  };
  const handleEditFamilia = (f) => {
    setFamilias(prev => prev.map(x => x.id === f.id ? f : x));
  };
  const handleLogout = async () => { await supabase.auth.signOut(); };

  const handleAddVoluntario = (v) => setVoluntarios(prev => [...prev, v]);
  const handleEditVoluntario = (v) => setVoluntarios(prev => prev.map(x => x.id === v.id ? v : x));
  const handleAddTaller = (t) => setTalleres(prev => [t, ...prev]);
  const handleEditTaller = (t) => setTalleres(prev => prev.map(x => x.id === t.id ? t : x));
  const handleDeleteTaller = async (id) => {
    await supabase.from("talleres").delete().eq("id", id);
    setTalleres(prev => prev.filter(t => t.id !== id));
  };

  const handleAddSolicitud = (s) => setSolicitudes(prev => [s, ...prev]);
  const handleEditSolicitud = (s) => setSolicitudes(prev => prev.map(x => x.id === s.id ? s : x));
  const handleMarcarVisto = async (id) => {
    await supabase.from("solicitudes").update({ visto: true }).eq("id", id);
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, visto: true } : s));
  };
  const handleReactivar = async (id) => {
    await supabase.from("solicitudes").update({ visto: false }).eq("id", id);
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, visto: false } : s));
  };
  const handleConvertirSolicitud = async (s) => {
    const id = s.nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    const { data, error } = await supabase.from("familias").insert({
      id, nombre: s.nombre, telefono: s.telefono, hijos: s.hijos, grado: "Madre", servicio: "",
    }).select().single();
    if (data) {
      setFamilias(prev => [data, ...prev]);
      await supabase.from("solicitudes").update({ visto: true }).eq("id", s.id);
      setSolicitudes(prev => prev.map(x => x.id === s.id ? { ...x, visto: true } : x));
      setMenu("confirmados");
      setTab("familias");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-violet-400">Cargando...</p>
    </div>
  );

  if (showResetPassword) return <ResetPasswordScreen onDone={() => setShowResetPassword(false)} />;

  if (!user) return <AuthScreen onAuth={(u) => initUser(u)} />;

  const roles = ["Todos", "Madre", "Padre", "Voluntario"];
  const familiasFiltradas = familias.filter(f => {
    const q = busqueda.toLowerCase();
    const matchQ = !q || f.nombre.toLowerCase().includes(q) || f.hijos?.some(h => {
      const nombre = typeof h === "string" ? h : h.nombre;
      return nombre?.toLowerCase().includes(q);
    });
    const matchR = filtroGrado === "Todos" || f.grado === filtroGrado;
    return matchQ && matchR;
  });

  const isAdmin = profile?.is_admin;

  const NAV_ITEMS = [
    { id: "solicitudes", label: "Solicitudes", icon: "📝", badge: solicitudes.filter(s => !s.visto).length },
    { id: "confirmados", label: "Familias", icon: "👨‍👩‍👧" },
    { id: "voluntarios", label: "Voluntarios", icon: "🙌" },
    { id: "talleres", label: "Talleres", icon: "🎨" },
  ];

  return (
    <>
      {detalleTarget && (
        <DetalleScreen
          familia={detalleTarget}
          visitas={visitas.filter(v => v.familia_id === detalleTarget.id)}
          currentUser={user}
          allProfiles={allProfiles}
          onAddVisita={handleAddVisita}
          onDeleteVisita={handleDeleteVisita}
          onClose={() => setDetalleTarget(null)}
          isAdmin={isAdmin}
        />
      )}

      {showMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setShowMenu(false)}>
          <div className="absolute top-0 right-0 w-64 bg-white shadow-xl h-full flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 pt-8 pb-5 border-b border-gray-100">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg mb-3">
                {profile?.nombre?.[0] || "?"}
              </div>
              <p className="font-bold text-gray-900 text-lg">Hola, {profile?.nombre} 👋</p>
              <p className="text-xs text-gray-400 mt-0.5">{profile?.email || ""}</p>
            </div>
            <div className="flex-1 px-3 py-4 space-y-1">
              {isAdmin && (
                <button onClick={() => { setMenu("admin"); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors flex items-center gap-3">
                  <span>⚙️</span> Administración
                </button>
              )}
            </div>
            <div className="px-3 pb-6">
              <button onClick={handleLogout}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left flex items-center gap-3">
                <span>🚪</span> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {menu === "admin" && isAdmin && (
        <div className="fixed inset-0 bg-gray-50 z-40 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
            <button onClick={() => setMenu("confirmados")} className="text-sm text-violet-500 font-medium mb-2">← Volver</button>
            <h2 className="text-lg font-bold text-gray-900">Administración</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <AdminView currentUserId={user.id} />
          </div>
        </div>
      )}
      {menu === "confirmados" && showNuevaFamilia && (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
            <button onClick={()=>setShowNuevaFamilia(false)} className="text-sm text-violet-500 font-medium mb-2">← Volver</button>
            <h2 className="text-lg font-bold text-gray-900">Nueva familia</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <FamiliaForm onSave={handleAddFamilia} onCancel={()=>setShowNuevaFamilia(false)} />
          </div>
        </div>
      )}
      <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-violet-500 font-semibold uppercase tracking-widest">Campamento Urbano Comunitario</p>
            <button onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-sm hover:bg-violet-200 transition-colors flex-shrink-0">
              {profile?.nombre?.[0]?.toUpperCase() || "?"}
            </button>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {menu === "solicitudes" ? "Solicitudes" : menu === "voluntarios" ? "Voluntarios" : menu === "talleres" ? "Talleres" : "Familias"}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">6 – 31 julio · Centro Bahá'í de Estudios</p>

          {menu === "confirmados" && (
            <div className="flex gap-1 mt-4 bg-gray-100 rounded-xl p-1">
              {[
                {id:"familias",label:"Familias"},
                {id:"recientes",label:"Conversaciones"},
                {id:"participantes",label:"Participantes"},
              ].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab===t.id?"bg-white text-violet-700 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-4 w-full max-w-lg mx-auto space-y-4">
          {menu === "solicitudes" && (
            <SolicitudesView
              solicitudes={solicitudes}
              isAdmin={isAdmin}
              onAdd={handleAddSolicitud}
              onEdit={handleEditSolicitud}
              onMarcarVisto={handleMarcarVisto}
              onReactivar={handleReactivar}
              onConvertir={handleConvertirSolicitud}
            />
          )}

          {menu === "confirmados" && tab==="familias" && (
            <>
              {!showNuevaFamilia && (
                <button onClick={()=>setShowNuevaFamilia(true)}
                  className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700 transition-all">
                  + Nueva familia
                </button>
              )}

              <div className="flex gap-2">
                <input type="text" placeholder="Buscar familia o hijo..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                <div className="relative">
                  <button onClick={()=>setShowFiltro(!showFiltro)}
                    className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${filtroGrado!=="Todos"?"bg-violet-600 text-white border-violet-600":"bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                    🔽 {filtroGrado==="Todos"?"Filtrar":filtroGrado}
                  </button>
                  {showFiltro && (
                    <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 w-40 overflow-hidden">
                      {roles.map(g=>(
                        <button key={g} onClick={()=>{ setFiltroGrado(g); setShowFiltro(false); }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${filtroGrado===g?"bg-violet-50 text-violet-700 font-semibold":"text-gray-600 hover:bg-gray-50"}`}>
                          {g}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                {familiasFiltradas.map(f=>(
                  <FamiliaCard key={f.id} familia={f}
                    visitas={visitas.filter(v=>v.familia_id===f.id)}
                    currentUser={user} allProfiles={allProfiles}
                    onAddVisita={handleAddVisita}
                    onDeleteVisita={handleDeleteVisita}
                    onEdit={handleEditFamilia}
                    isAdmin={isAdmin} />
                ))}
                {familiasFiltradas.length===0 && <p className="text-center text-gray-400 py-8">Sin resultados</p>}
              </div>
            </>
          )}
          {menu === "confirmados" && tab==="recientes" && (
            <RecientesView
              visitas={visitas}
              familias={familias}
              onVerPerfil={(id) => {
                const f = familias.find(x => x.id === id);
                if (f) setDetalleTarget(f);
              }}
            />
          )}
          {menu === "confirmados" && tab==="participantes" && <ParticipantesView familias={familias} />}

          {menu === "voluntarios" && (
            <VoluntariosView
              voluntarios={voluntarios}
              isAdmin={isAdmin}
              onAdd={handleAddVoluntario}
              onEdit={handleEditVoluntario}
            />
          )}

          {menu === "talleres" && (
            <TalleresView
              talleres={talleres}
              onAdd={handleAddTaller}
              onEdit={handleEditTaller}
              onDelete={handleDeleteTaller}
            />
          )}
        </div>

        {/* Bottom navigation */}
        <div className="bg-white border-t border-gray-100 flex-shrink-0 safe-bottom z-10">
          <div className="flex max-w-lg mx-auto">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setMenu(item.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 relative transition-colors ${menu === item.id ? "text-violet-600" : "text-gray-400"}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge > 0 && (
                  <span className="absolute top-1 right-1/4 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
