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

const GRADOS = ["Madre", "Padre", "Voluntario"];

const GRADO_COLOR = {
  "Madre": "bg-pink-100 text-pink-700",
  "Padre": "bg-blue-100 text-blue-700",
  "Voluntario": "bg-gray-100 text-gray-700",
  "Huevito": "bg-blue-100 text-blue-700",
  "Grado 1": "bg-green-100 text-green-700",
  "Grado 2": "bg-orange-100 text-orange-700",
  "Grado 3": "bg-red-100 text-red-700",
  "Prejuvenil": "bg-purple-100 text-purple-700",
};

function Badge({ text }) {
  const base = text.split(" / ")[0];
  const cls = GRADO_COLOR[base] || "bg-gray-100 text-gray-600";
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{text}</span>;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

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
  const [grado, setGrado] = useState(familia?.grado || "Huevito");
  const [servicio, setServicio] = useState(familia?.servicio || "");
  const [hijos, setHijos] = useState(
    (familia?.hijos || []).map(h =>
      typeof h === "string" ? { nombre: h, edad: "", curso: "Huevito" } : h
    )
  );
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
    const payload = { id, nombre: nombre.trim(), telefono: telefono.trim() || null, grado, servicio: servicio.trim(), hijos };
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

      <div>
        <label className="text-xs text-gray-500 mb-2 block">Grado de la familia</label>
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
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${seccion===Number(s)?"bg-violet-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1.5 italic">{secciones[seccion]}</p>
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

function DetalleScreen({ familia, visitas, currentUser, allProfiles, onAddVisita, onDeleteVisita, onClose }) {
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
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
        <button onClick={onClose} className="text-sm text-violet-500 hover:text-violet-700 font-medium mb-3 flex items-center gap-1">
          ← Volver
        </button>

        {/* Perfil */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg flex-shrink-0">
            {familia.nombre[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-lg">{familia.nombre}</span>
              <Badge text={familia.grado} />
            </div>
            {familia.telefono && (
              <a href={`tel:${familia.telefono}`} className="text-sm text-violet-500 hover:text-violet-700 mt-0.5 block">
                📞 {familia.telefono}
              </a>
            )}
          </div>
        </div>

        {familia.hijos?.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-gray-400 mb-1">Hijos</p>
            <div className="space-y-1.5">
              {familia.hijos.map((h, i) => {
                const nombre = typeof h === "string" ? h : h.nombre;
                const edad = typeof h === "string" ? "" : h.edad;
                const curso = typeof h === "string" ? "" : h.curso;
                return (
                  <div key={i} className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-700 font-medium">{nombre || "—"}</span>
                    {edad && <span className="text-xs text-gray-400">{edad} años</span>}
                    {curso && <Badge text={curso} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {familia.servicio && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-0.5">Colaboración</p>
            <p className="text-sm text-gray-700">{familia.servicio}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: "conversaciones", label: `💬 Conversaciones${conversaciones.length > 0 ? ` (${conversaciones.length})` : ""}` },
            { id: "visitas", label: `📖 Visitas${visitas.length > 0 ? ` (${visitas.length})` : ""}` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-white text-violet-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
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

function FamiliaCard({ familia, visitas, currentUser, allProfiles, onAddVisita, onDeleteVisita, onEdit }) {
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
    <FamiliaForm familia={familia} onSave={(f) => { onEdit(f); setShowEdit(false); }} onCancel={() => setShowEdit(false)} />
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
          {familia.telefono && <p className="text-xs text-gray-400 mt-0.5">📞 {familia.telefono}</p>}
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
          {/* Info básica */}
          <div className="px-4 pt-3 pb-2 flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Colaboración</p>
              <p className="text-sm text-gray-700">{familia.servicio || "—"}</p>
            </div>
            <button onClick={() => setShowEdit(true)}
              className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors">
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
  const [expanded, setExpanded] = useState(false);
  const esVisita = item.tipo === "visita";

  const preview = esVisita
    ? `U${item.unidad} · S${item.seccion} · ${UNIDADES[item.unidad]?.secciones[item.seccion]}`
    : item.nota;

  const fecha = esVisita
    ? item.fecha
    : new Date(item.created_at).toLocaleDateString("es-ES");

  const autor = item.profiles?.nombre;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${esVisita ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>
            {esVisita ? "📖 Visita" : "💬 Conversación"}
          </span>
          <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
        <p className="text-sm text-gray-700 line-clamp-2">{preview}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-gray-400">{fecha}</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs font-medium text-gray-600">{familia?.nombre}</span>
          {familia && <Badge text={familia.grado} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-2">
          {esVisita ? (
            <div className="space-y-1.5">
              <p className="text-xs text-violet-600 font-medium">{UNIDADES[item.unidad]?.nombre}</p>
              <p className="text-sm text-gray-700">Sección {item.seccion}: {UNIDADES[item.unidad]?.secciones[item.seccion]}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${item.completada ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {item.completada ? "Completada" : "En progreso"}
              </span>
              {item.comentario && (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">💬 {item.comentario}</p>
              )}
              <p className="text-xs text-gray-400">Fue: {autor}</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <p className="text-sm text-gray-700">{item.nota}</p>
              <p className="text-xs text-gray-400">Por: {autor}</p>
            </div>
          )}
          <button onClick={() => onVerPerfil(familia?.id)}
            className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors pt-1">
            Ver perfil completo →
          </button>
        </div>
      )}
    </div>
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
            <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 min-w-36 overflow-hidden">
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

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [tab, setTab] = useState("familias");
  const [busqueda, setBusqueda] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("Todos");
  const [showFiltro, setShowFiltro] = useState(false);
  const [showNuevaFamilia, setShowNuevaFamilia] = useState(false);
  const [detalleTarget, setDetalleTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) initUser(session.user);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) initUser(session.user);
      else { setUser(null); setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const initUser = async (u) => {
    setUser(u);
    const [{ data: prof }, { data: profs }, { data: fams }, { data: vis }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", u.id).single(),
      supabase.from("profiles").select("*"),
      supabase.from("familias").select("*").order("created_at", { ascending: true }),
      supabase.from("visitas").select("*, profiles(nombre)"),
    ]);
    setProfile(prof);
    setAllProfiles(profs || []);
    setFamilias(fams || []);
    setVisitas(vis || []);
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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-violet-400">Cargando...</p>
    </div>
  );

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
        />
      )}
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-violet-500 font-semibold uppercase tracking-widest">Campamento Urbano Comunitario</p>
            <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Salir</button>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Seguimiento</h1>
            <span className="text-sm text-gray-500">Hola, {profile?.nombre} 👋</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">6 – 31 julio · Centro Bahá'í de Estudios</p>
          <div className="flex gap-1 mt-4 bg-gray-100 rounded-xl p-1">
            {[{id:"familias",label:"Familias"},{id:"recientes",label:"Recientes"},{id:"participantes",label:"Participantes"}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab===t.id?"bg-white text-violet-700 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
          {tab==="familias" && (
            <>
              {showNuevaFamilia ? (
                <FamiliaForm onSave={handleAddFamilia} onCancel={()=>setShowNuevaFamilia(false)} />
              ) : (
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
                    <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 min-w-36 overflow-hidden">
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
                    onEdit={handleEditFamilia} />
                ))}
                {familiasFiltradas.length===0 && <p className="text-center text-gray-400 py-8">Sin resultados</p>}
              </div>
            </>
          )}
          {tab==="recientes" && (
            <RecientesView
              visitas={visitas}
              familias={familias}
              onVerPerfil={(id) => {
                const f = familias.find(x => x.id === id);
                if (f) setDetalleTarget(f);
              }}
            />
          )}
          {tab==="participantes" && <ParticipantesView familias={familias} />}
        </div>
      </div>
    </>
  );
}
