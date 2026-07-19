import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uufznuiclxuevcpznwll.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZnpudWljbHh1ZXZjcHpud2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDA4NjIsImV4cCI6MjA5ODI3Njg2Mn0.cqi5XePwSu7q192PZ2L15hOoRqmMvbQOpO3uZ8qwHvU"
);

// ── CONSTANTS ─────────────────────────────────────────────────────────────────

const GRADOS = ["Madre", "Padre", "Abuela", "Abuelo", "Voluntario"];
const GRADO_COLOR = {
  "Madre": "bg-pink-100 text-pink-700",
  "Padre": "bg-blue-100 text-blue-700",
  "Abuela": "bg-rose-100 text-rose-700",
  "Abuelo": "bg-cyan-100 text-cyan-700",
  "Voluntario": "bg-gray-100 text-gray-700",
  "Huevito": "bg-yellow-100 text-yellow-700",
  "Grado 1": "bg-green-100 text-green-700",
  "Grado 2": "bg-orange-100 text-orange-700",
  "Grado 3": "bg-red-100 text-red-700",
  "Prejuvenil": "bg-purple-100 text-purple-700",
};
const CURSOS = ["Huevito", "Grado 1", "Grado 2", "Grado 3", "Prejuvenil"];
const ROLES_VOLUNTARIO = ["Logística", "Maestro", "Animador", "Tesorería", "Camisetas", "Meriendas/Excursiones", "Otros"];
const UNIDADES = {
  1: { nombre: "Comprensión de los Escritos bahá'ís", secciones: { 1:"Leer y reflexionar cada día", 2:"Veracidad", 3:"La veracidad como base", 4:"Honradez y lealtad", 5:"La lengua amable", 6:"Amorosa bondad", 7:"La murmuración apaga la luz", 8:"Efectos en la comunidad", 9:"El hábito de leer" } },
  2: { nombre: "La oración", secciones: { 1:"Doble propósito", 2:"Nobleza del alma", 3:"Por qué oramos", 4:"La oración como fuego y luz", 5:"Conversación con Dios", 6:"Entonar los versículos", 7:"Oraciones para memorizar", 8:"Alinear la voluntad", 9:"Tres oraciones obligatorias", 10:"Reuniones devocionales", 11:"Ser anfitrión" } },
  3: { nombre: "La vida y la muerte", secciones: { 1:"El alma es inmortal", 2:"El alma comienza con el embrión", 3:"Alma y cuerpo", 4:"El alma progresa eternamente", 5:"El alma sin instrumentos", 6:"El alma e independiente", 7:"Progresa hacia Dios", 8:"La muerte como mensajera", 9:"Este mundo prepara al alma", 10:"Recibir la gracia", 11:"El alma es signo de Dios", 12:"El alma como pájaro", 13:"Refleja los atributos de Dios", 14:"Los poderes del alma", 15:"Las Manifestaciones", 16:"El ser humano como talismán", 17:"Estación gloriosa", 18:"El alma purificada", 19:"Orar por los difuntos", 20:"Caen los velos", 21:"Las almas se reconocen", 22:"No apenarse", 23:"Reflexión final" } },
};

// ── UTILS ─────────────────────────────────────────────────────────────────────

function Badge({ text }) {
  const cls = GRADO_COLOR[text?.split(" / ")[0]] || "bg-gray-100 text-gray-600";
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{text}</span>;
}

function FullScreen({ title, onBack, children }) {
  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
        <button onClick={onBack} className="text-sm text-violet-500 font-medium mb-2">← Volver</button>
        {title && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {children}
      </div>
    </div>
  );
}


function ContactoButtons({ telefono, isAdmin, onEdit }) {
  const limpio = telefono?.replace(/\D/g, "") || "";
  const wa = `https://wa.me/${limpio.startsWith("34") ? limpio : "34" + limpio}`;
  if (telefono && isAdmin) {
    return (
      <div className="flex gap-2">
        <a href={wa} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-all">💬 WA</a>
        <a href={`tel:${telefono}`} className="flex-1 flex items-center justify-center bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">📞 Llamar</a>
        {onEdit && <button onClick={onEdit} className="flex-1 flex items-center justify-center bg-violet-50 text-violet-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-100 transition-all">Editar</button>}
      </div>
    );
  }
  return onEdit ? (
    <button onClick={onEdit} className="w-full py-2.5 rounded-xl text-sm text-violet-500 font-medium bg-violet-50 hover:bg-violet-100 transition-colors">Editar</button>
  ) : null;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

function ResetPasswordScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    if (password.length < 6) { setError("Mínimo 6 caracteres"); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError("No se ha podido actualizar.");
    else { setSuccess("¡Contraseña actualizada!"); setTimeout(onDone, 2000); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="text-center mb-2"><span className="text-4xl">🔑</span><h1 className="text-xl font-bold text-gray-900 mt-2">Nueva contraseña</h1></div>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nueva contraseña" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
        <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirmar contraseña" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
        {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
        {success && <p className="text-emerald-600 text-sm bg-emerald-50 rounded-xl px-3 py-2">{success}</p>}
        <button onClick={handleReset} disabled={loading} className="w-full bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40">{loading ? "Guardando..." : "Guardar contraseña"}</button>
      </div>
    </div>
  );
}

function PendienteAprobacion({ email, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="text-6xl">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900">Cuenta pendiente</h1>
        <p className="text-sm text-gray-500">Tu solicitud está siendo revisada. Recibirás un correo en <span className="font-medium text-gray-700">{email}</span> cuando se apruebe.</p>
        <div className="bg-violet-50 rounded-2xl p-4"><p className="text-sm text-violet-700">💛 Gracias por querer participar en el Campamento Urbano Comunitario</p></div>
        <button onClick={onLogout} className="text-sm text-gray-400 hover:text-gray-600">Cerrar sesión</button>
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
    if (!email.trim() || !password.trim()) { setError("Rellena todos los campos"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Correo o contraseña incorrectos");
    else onAuth(data.user);
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!nombre.trim()) { setError("Escribe tu nombre"); return; }
    if (!email.trim() || password.length < 6) { setError("Correo válido y contraseña de al menos 6 caracteres"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { nombre, rol: "organizador" } } });
    if (error) setError(error.message.includes("already registered") ? "Este correo ya tiene cuenta" : "Error al crear cuenta");
    else { setSuccess("¡Cuenta creada! Espera la aprobación del admin."); setMode("login"); }
    setLoading(false);
  };

  const handleRecover = async () => {
    if (!email.trim()) { setError("Escribe tu correo"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) setError("No se pudo enviar el correo");
    else setSuccess("Correo enviado. Revisa tu bandeja.");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center px-4 py-8 min-h-screen bg-gray-50">
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
              <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-sm text-violet-500 mb-2">← Volver</button>
              <p className="font-semibold text-gray-800">Recuperar contraseña</p>
            </div>
          )}
          {mode === "register" && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tu nombre</label>
              <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Sara"
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
            className="w-full bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-40">
            {loading?"Un momento...":mode==="login"?"Entrar":mode==="register"?"Crear cuenta":"Enviar enlace"}
          </button>
          {mode==="login" && (
            <button onClick={() => { setMode("recover"); setError(""); setSuccess(""); }}
              className="w-full text-center text-sm text-gray-400 hover:text-violet-500">¿Olvidaste tu contraseña?</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── FAMILIAS ──────────────────────────────────────────────────────────────────

function FamiliaForm({ familia, onSave, onCancel, onDelete }) {
  const [nombre, setNombre] = useState(familia?.nombre || "");
  const [telefono, setTelefono] = useState(familia?.telefono || "");
  const [grado, setGrado] = useState(familia?.grado || "Madre");
  const [servicio, setServicio] = useState(familia?.servicio || "");
  const [hijos, setHijos] = useState((familia?.hijos || []).map(h => typeof h === "string" ? { nombre: h, edad: "", curso: "Huevito", alergias: "" } : { alergias: "", ...h }));
  const [c2nombre, setC2nombre] = useState(familia?.contacto2_nombre || "");
  const [c2parentesco, setC2parentesco] = useState(familia?.contacto2_parentesco || "Madre");
  const [c2telefono, setC2telefono] = useState(familia?.contacto2_telefono || "");
  const [showC2, setShowC2] = useState(!!familia?.contacto2_nombre);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setSaving(true);
    const id = familia?.id || nombre.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
    const payload = {
      id, nombre: nombre.trim(), telefono: telefono.trim() || null, grado, servicio: servicio.trim(), hijos,
      contacto2_nombre: showC2 ? c2nombre.trim() || null : null,
      contacto2_parentesco: showC2 ? c2parentesco : null,
      contacto2_telefono: showC2 ? c2telefono.trim() || null : null,
    };
    const { data, error } = familia
      ? await supabase.from("familias").update(payload).eq("id", familia.id).select().single()
      : await supabase.from("familias").insert(payload).select().single();
    if (error) setError("No se ha podido guardar.");
    else onSave(data);
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div><label className="text-xs text-gray-500 mb-1 block">Nombre *</label>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: María"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      <div><label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
        <input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="Ej: 612 345 678" type="tel"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      <div><label className="text-xs text-gray-500 mb-2 block">Parentesco</label>
        <div className="flex flex-wrap gap-1.5">{GRADOS.map(g => (
          <button key={g} onClick={()=>setGrado(g)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${grado===g?"bg-violet-600 text-white":"bg-gray-100 text-gray-600"}`}>{g}</button>
        ))}</div></div>

      {showC2 ? (
        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between"><p className="text-xs font-medium text-gray-500">Segundo contacto</p>
            <button onClick={() => setShowC2(false)} className="text-xs text-red-400">✕ Quitar</button></div>
          <input value={c2nombre} onChange={e=>setC2nombre(e.target.value)} placeholder="Nombre"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
          <div className="flex flex-wrap gap-1.5">{GRADOS.map(g => (
            <button key={g} onClick={() => setC2parentesco(g)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${c2parentesco===g?"bg-violet-600 text-white":"bg-white text-gray-600 border border-gray-200"}`}>{g}</button>
          ))}</div>
          <input value={c2telefono} onChange={e=>setC2telefono(e.target.value)} placeholder="Teléfono" type="tel"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
        </div>
      ) : (
        <button onClick={() => setShowC2(true)} className="text-xs text-violet-500 font-medium">+ Añadir segundo contacto</button>
      )}

      <div>
        <div className="flex items-center justify-between mb-2"><label className="text-xs text-gray-500">Hijos</label>
          <button onClick={() => setHijos(prev => [...prev, { nombre: "", edad: "", curso: "Huevito" }])} className="text-xs text-violet-500 font-medium">+ Añadir hijo</button></div>
        <div className="space-y-3">{hijos.map((h, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between"><p className="text-xs font-medium text-gray-500">Hijo {i+1}</p>
              <button onClick={() => setHijos(prev => prev.filter((_,idx) => idx!==i))} className="text-xs text-red-400">✕</button></div>
            <input value={h.nombre} onChange={e => setHijos(prev => prev.map((x,idx) => idx===i?{...x,nombre:e.target.value}:x))} placeholder="Nombre"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
            <input value={h.edad} onChange={e => setHijos(prev => prev.map((x,idx) => idx===i?{...x,edad:e.target.value}:x))} placeholder="Edad"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
            <input value={h.alergias||""} onChange={e => setHijos(prev => prev.map((x,idx) => idx===i?{...x,alergias:e.target.value}:x))} placeholder="Alergias (opcional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
            <div className="flex flex-wrap gap-1.5">{CURSOS.map(c => (
              <button key={c} onClick={() => setHijos(prev => prev.map((x,idx) => idx===i?{...x,curso:c}:x))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${h.curso===c?"bg-violet-600 text-white":"bg-white text-gray-600 border border-gray-200"}`}>{c}</button>
            ))}</div>
          </div>
        ))}</div>
      </div>

      <div><label className="text-xs text-gray-500 mb-1 block">Colaboración</label>
        <input value={servicio} onChange={e=>setServicio(e.target.value)} placeholder="Ej: Limpieza una vez a la semana"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>

      {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40">{saving?"Guardando...":"Guardar"}</button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500">Cancelar</button>
      </div>
      {familia && onDelete && (
        <button onClick={() => onDelete(familia.id)} className="w-full py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 font-medium">Eliminar familia</button>
      )}
    </div>
  );
}


function HijoCard({ hijo, onSave }) {
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState(hijo.nombre || "");
  const [edad, setEdad] = useState(hijo.edad || "");
  const [curso, setCurso] = useState(hijo.curso || "Huevito");
  if (editing) return (
    <div className="bg-violet-50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Editando</p>
        <button onClick={() => setEditing(false)} className="text-[13px] text-gray-500">Cancelar</button>
      </div>
      <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nombre"
        className="w-full border border-violet-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
      <input value={edad} onChange={e=>setEdad(e.target.value)} placeholder="Edad"
        className="w-full border border-violet-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
      <div className="flex flex-wrap gap-1.5">
        {CURSOS.map(c => (
          <button key={c} onClick={() => setCurso(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${curso===c?"bg-violet-600 text-white":"bg-white text-gray-600 border border-violet-200"}`}>{c}</button>
        ))}
      </div>
      <button onClick={() => { onSave({ nombre, edad, curso }); setEditing(false); }}
        className="w-full bg-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold">Guardar</button>
    </div>
  );
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0 text-sm">{(hijo.nombre || "?")[0]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-800">{hijo.nombre || "—"}</span><Badge text={hijo.curso} /></div>
        {hijo.edad && <p className="text-[13px] text-gray-500 mt-0.5">{hijo.edad} años</p>}
      </div>
      <button onClick={() => setEditing(true)} className="text-xs text-violet-500 font-medium hover:text-violet-700 flex-shrink-0">Editar</button>
    </div>
  );
}

function ConversacionesFamilia({ familiaId, currentUser, allProfiles, nota, setNota, onSend, saving }) {
  const [conversaciones, setConversaciones] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("conversaciones").select("*, profiles(nombre)")
      .eq("familia_id", familiaId).order("created_at", { ascending: true })
      .then(({ data }) => { setConversaciones(data || []); setLoaded(true); });
  }, [familiaId]);

  // Expose addConversacion method via ref pattern
  ConversacionesFamilia._addConv = (c) => setConversaciones(prev => [...prev, c]);

  const handleDelete = async (id) => {
    await supabase.from("conversaciones").delete().eq("id", id);
    setConversaciones(prev => prev.filter(c => c.id !== id));
  };

  if (!loaded) return <p className="text-[13px] text-gray-500 text-center py-8">Cargando...</p>;

  return (
    <div className="space-y-1 pb-2">
      {conversaciones.length === 0 && (
        <p className="text-[13px] text-gray-500 text-center py-8">Sin conversaciones aún 💬</p>
      )}
      {conversaciones.map(c => {
        const esMio = c.autor_id === currentUser.id;
        const nombre = c.profiles?.nombre || "—";
        const fecha = new Date(c.created_at);
        const esHoy = fecha.toDateString() === new Date().toDateString();
        const hora = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
        const fechaStr = esHoy ? hora : `${fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} ${hora}`;
        return (
          <div key={c.id} className={`flex ${esMio ? "justify-end" : "justify-start"} group mb-1`}>
            {!esMio && (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs flex-shrink-0 mr-1.5 mt-0.5 self-end">{nombre[0]}</div>
            )}
            <div className={`max-w-[78%] ${esMio ? "items-end" : "items-start"} flex flex-col`}>
              {!esMio && <p className="text-[13px] text-gray-400 font-medium mb-0.5 ml-1">{nombre}</p>}
              <div className={`relative px-3 py-2 rounded-2xl ${esMio
                ? "bg-violet-600 text-white rounded-br-sm"
                : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"}`}>
                <p className="text-sm leading-relaxed">{c.nota}</p>
                <p className={`text-[13px] mt-0.5 text-right ${esMio ? "text-violet-300" : "text-gray-400"}`}>{fechaStr}</p>
                <button onClick={() => handleDelete(c.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-100 text-red-400 rounded-full text-[9px] opacity-0 group-hover:opacity-100 flex items-center justify-center">✕</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


function PerfilFamiliaScreen({ familia: familiaInicial, allProfiles, currentUser, isAdmin, onClose, onEdit, onDelete }) {
  const [familia, setFamilia] = useState(familiaInicial);
  const [showEdit, setShowEdit] = useState(false);
  const [nota, setNota] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveHijo = async (idx, hijoData) => {
    const nuevosHijos = (familia.hijos || []).map((h, i) => i === idx ? hijoData : h);
    const { data } = await supabase.from("familias").update({ hijos: nuevosHijos }).eq("id", familia.id).select().single();
    if (data) { setFamilia(data); onEdit(data); }
  };

  const handleSend = async () => {
    if (!nota.trim()) return;
    setSaving(true);
    const { data } = await supabase.from("conversaciones").insert({
      familia_id: familia.id, nota: nota.trim(), autor_id: currentUser.id,
    }).select("*, profiles(nombre)").single();
    if (data && ConversacionesFamilia._addConv) ConversacionesFamilia._addConv(data);
    setNota(""); setSaving(false);
  };

  const hijos = (familia.hijos || []).map(h => typeof h === "string" ? { nombre: h, edad: "", curso: "Huevito", alergias: "" } : { alergias: "", ...h });

  if (showEdit) return (
    <FullScreen title="Editar familia" onBack={() => setShowEdit(false)}>
      <FamiliaForm familia={familia} onSave={(f) => { setFamilia(f); onEdit(f); setShowEdit(false); }}
        onCancel={() => setShowEdit(false)} onDelete={(id) => { onDelete(id); onClose(); }} />
    </FullScreen>
  );

  return (
    <div className="fixed inset-0 bg-gray-50 z-[60] flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onClose} className="text-sm text-violet-500 font-medium">← Volver</button>
          <button onClick={() => setShowEdit(true)} className="text-sm text-violet-500 font-medium">Editar</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg flex-shrink-0">{familia.nombre[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap"><span className="font-bold text-gray-900 text-lg">{familia.nombre}</span><Badge text={familia.grado} /></div>
            {familia.servicio && <p className="text-xs text-gray-500 mt-0.5">{familia.servicio}</p>}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide">Contacto</p>
          {familia.telefono && isAdmin ? (
            <div className="flex gap-2">
              <a href={`https://wa.me/${familia.telefono.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-semibold">💬 WhatsApp</a>
              <a href={`tel:${familia.telefono}`}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">📞 Llamar</a>
            </div>
          ) : familia.telefono ? (
            <p className="text-sm text-gray-600">{familia.telefono}</p>
          ) : (
            <p className="text-sm text-gray-400">Sin teléfono</p>
          )}
        </div>

        {familia.contacto2_nombre && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Segundo contacto</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold flex-shrink-0">{familia.contacto2_nombre[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-800">{familia.contacto2_nombre}</span><Badge text={familia.contacto2_parentesco} /></div>
                {familia.contacto2_telefono && isAdmin && (
                  <div className="flex gap-2 mt-3">
                    <a href={`https://wa.me/${familia.contacto2_telefono.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-semibold">💬 WhatsApp</a>
                    <a href={`tel:${familia.contacto2_telefono}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">📞 Llamar</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {hijos.length > 0 && (
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide">Hijos</p>
            {hijos.map((h, i) => <HijoCard key={i} hijo={h} onSave={(data) => handleSaveHijo(i, data)} />)}
          </div>
        )}

        <div>
          <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Conversaciones</p>
          <ConversacionesFamilia familiaId={familia.id} currentUser={currentUser} allProfiles={allProfiles} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-100 px-3 py-3 flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0 mb-0.5">
            {(currentUser?.email?.[0] || "?").toUpperCase()}
          </div>
          <textarea value={nota} onChange={e => setNota(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); handleSend(); }}}
            rows={1} placeholder="Escribe un mensaje..."
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
          <button onClick={handleSend} disabled={saving || !nota.trim()}
            className="w-9 h-9 bg-violet-600 text-white rounded-full flex items-center justify-center disabled:opacity-40 flex-shrink-0 mb-0.5">
            <span className="text-sm">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}


function FamiliaCard({ familia, visitas, currentUser, allProfiles, onAddVisita, onDeleteVisita, onEdit, onDelete, isAdmin, onAddOfrecimiento, onVerDetalle }) {
  const [expanded, setExpanded] = useState(false);
  const [accion, setAccion] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [totalConv, setTotalConv] = useState(null);

  useEffect(() => {
    if (expanded && totalConv === null) {
      supabase.from("conversaciones").select("id", { count: "exact", head: true }).eq("familia_id", familia.id)
        .then(({ count }) => setTotalConv(count || 0));
    }
  }, [expanded, familia.id, totalConv]);

  if (showEdit) return (
    <FullScreen title="Editar familia" onBack={() => setShowEdit(false)}>
      <FamiliaForm familia={familia} onSave={(f) => { onEdit(f); setShowEdit(false); }} onCancel={() => setShowEdit(false)} onDelete={(id) => { onDelete(id); setShowEdit(false); }} />
    </FullScreen>
  );

  if (accion === "ofrecimiento") return (
    <FullScreen title="Nuevo ofrecimiento" onBack={() => setAccion(null)}>
      <OfrecimientoForm familiaId={familia.id} familias={[]} onSave={(o) => { onAddOfrecimiento(o); setAccion(null); }} onCancel={() => setAccion(null)} />
    </FullScreen>
  );

  return (
    <button onClick={() => onVerDetalle(familia)}
      className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 flex items-center gap-3 hover:border-violet-200 transition-all active:bg-gray-50 text-left">
      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">{familia.nombre[0]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5"><span className="font-semibold text-gray-800">{familia.nombre}</span><Badge text={familia.grado} /></div>
        {familia.hijos?.length > 0 && <p className="text-xs text-gray-500 truncate">{familia.hijos.map(h=>typeof h==="string"?h:`${h.nombre||"—"}${h.edad?`, ${h.edad}a`:""}`).join(" · ")}</p>}
        {familia.servicio && <p className="text-[13px] text-gray-500 truncate mt-0.5">{familia.servicio}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {visitas.length > 0 && <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">{visitas.length}v</span>}
        <span className="text-gray-500 text-sm">›</span>
      </div>
    </button>
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

  const handleSave = async () => {
    if (!nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setSaving(true);
    const payload = { nombre: nombre.trim(), telefono: telefono.trim() || null, roles, notas: notas.trim() || null };
    const { data, error } = voluntario
      ? await supabase.from("voluntarios").update(payload).eq("id", voluntario.id).select().single()
      : await supabase.from("voluntarios").insert(payload).select().single();
    if (error) setError("No se ha podido guardar.");
    else onSave(data);
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div><label className="text-xs text-gray-500 mb-1 block">Nombre *</label>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: Ismael"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      <div><label className="text-xs text-gray-500 mb-1 block">Teléfono</label>
        <input value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="Ej: 612 345 678" type="tel"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      <div><label className="text-xs text-gray-500 mb-2 block">Roles</label>
        <div className="flex flex-wrap gap-1.5">{ROLES_VOLUNTARIO.map(r => (
          <button key={r} onClick={() => setRoles(prev => prev.includes(r) ? prev.filter(x=>x!==r) : [...prev, r])}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${roles.includes(r)?"bg-violet-600 text-white":"bg-gray-100 text-gray-600"}`}>{r}</button>
        ))}</div></div>
      <div><label className="text-xs text-gray-500 mb-1 block">Notas</label>
        <textarea value={notas} onChange={e=>setNotas(e.target.value)} rows={2} placeholder="Disponibilidad, observaciones..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40">{saving?"Guardando...":"Guardar"}</button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500">Cancelar</button>
      </div>
    </div>
  );
}

function VoluntarioCard({ voluntario: v, isAdmin, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">{v.nombre[0]}</div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-800">{v.nombre}</span>
          {v.roles?.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{v.roles.map(r => <span key={r} className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{r}</span>)}</div>}
        </div>
        <span className="text-gray-400 text-xs">{expanded?"▲":"▼"}</span>
      </button>
      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-2">
          {v.notas && <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">{v.notas}</p>}
          <ContactoButtons telefono={v.telefono} isAdmin={isAdmin} onEdit={onEdit} />
        </div>
      )}
    </div>
  );
}

function VoluntariosView({ voluntarios, isAdmin, onAdd, onEdit }) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  return (
    <div className="space-y-4">
      {showForm && (
        <Popup title="Nuevo voluntario" onClose={() => setShowForm(false)}>
          <VoluntarioForm onSave={(v) => { onAdd(v); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </Popup>
      )}
      {editTarget && (
        <Popup title="Editar voluntario" onClose={() => setEditTarget(null)}>
          <VoluntarioForm voluntario={editTarget} onSave={(v) => { onEdit(v); setEditTarget(null); }} onCancel={() => setEditTarget(null)} />
        </Popup>
      )}
      <button onClick={() => setShowForm(true)} className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700">+ Añadir voluntario</button>
      {voluntarios.length === 0 ? <p className="text-center text-gray-400 py-12">Sin voluntarios</p> : (
        <div className="space-y-2.5">{voluntarios.map(v => (
          <VoluntarioCard key={v.id} voluntario={v} isAdmin={isAdmin} onEdit={() => setEditTarget(v)} />
        ))}</div>
      )}
    </div>
  );
}

// ── SERVICIOS ─────────────────────────────────────────────────────────────────

function OfrecimientoForm({ familiaId, familias, ofrecimiento, onSave, onCancel }) {
  const [que, setQue] = useState(ofrecimiento?.que || "");
  const [fecha, setFecha] = useState(ofrecimiento?.fecha || "");
  const [familiaIdLocal, setFamiliaIdLocal] = useState(familiaId || ofrecimiento?.familia_id || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!que.trim()) { setError("Indica qué se ofrece"); return; }
    if (!fecha) { setError("Indica la fecha"); return; }
    setSaving(true);
    const payload = { familia_id: familiaIdLocal || null, que: que.trim(), fecha };
    const { data, error } = ofrecimiento
      ? await supabase.from("ofrecimientos").update(payload).eq("id", ofrecimiento.id).select().single()
      : await supabase.from("ofrecimientos").insert(payload).select().single();
    if (error) setError("No se ha podido guardar.");
    else onSave(data);
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {!familiaId && familias?.length > 0 && (
        <div><label className="text-xs text-gray-500 mb-1 block">Familia (opcional)</label>
          <select value={familiaIdLocal} onChange={e=>setFamiliaIdLocal(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
            <option value="">Sin familia asociada</option>
            {familias.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
          </select></div>
      )}
      <div><label className="text-xs text-gray-500 mb-1 block">¿Qué ofreces? *</label>
        <textarea value={que} onChange={e=>setQue(e.target.value)} rows={3} placeholder="Ej: Organizar merienda..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      <div><label className="text-xs text-gray-500 mb-1 block">Fecha *</label>
        <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40">{saving?"Guardando...":"Guardar"}</button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500">Cancelar</button>
      </div>
    </div>
  );
}

function OfrecimientosView({ ofrecimientos, familias, onAdd, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="space-y-4">
      {showForm && (
        <Popup title="Nuevo ofrecimiento" onClose={() => setShowForm(false)}>
          <OfrecimientoForm familias={familias} onSave={(o) => { onAdd(o); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </Popup>
      )}
      <button onClick={() => setShowForm(true)} className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700">+ Añadir ofrecimiento</button>
      {ofrecimientos.length === 0 ? <p className="text-center text-gray-400 py-12">Sin ofrecimientos</p> : (
        <div className="space-y-2.5">{[...ofrecimientos].sort((a,b)=>a.fecha.localeCompare(b.fecha)).map(o => {
          const familia = familias?.find(f=>f.id===o.familia_id);
          return (
            <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">{new Date(o.fecha+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>
                    {familia && <Badge text={familia.grado} />}
                  </div>
                  {familia && <p className="font-semibold text-gray-800">{familia.nombre}</p>}
                  <p className="text-sm text-gray-600 mt-0.5">{o.que}</p>
                </div>
                {onDelete && <button onClick={() => onDelete(o.id)} className="text-gray-500 hover:text-red-400">✕</button>}
              </div>
            </div>
          );
        })}</div>
      )}
    </div>
  );
}

function TallerForm({ taller, onSave, onCancel, onDelete }) {
  const [quien, setQuien] = useState(taller?.quien || "");
  const [descripcion, setDescripcion] = useState(taller?.descripcion || "");
  const [fecha, setFecha] = useState(taller?.fecha || "");
  const [necesita, setNecesita] = useState(taller?.necesita || "");
  const [porConfirmar, setPorConfirmar] = useState(!taller?.fecha);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!quien.trim()) { setError("Indica quién sostiene el taller"); return; }
    if (!descripcion.trim()) { setError("Indica de qué va el taller"); return; }
    setSaving(true);
    const payload = { quien: quien.trim(), descripcion: descripcion.trim(), fecha: porConfirmar ? null : (fecha || null), necesita: necesita.trim() || null };
    const { data, error } = taller
      ? await supabase.from("talleres").update(payload).eq("id", taller.id).select().single()
      : await supabase.from("talleres").insert(payload).select().single();
    if (error) setError("No se ha podido guardar.");
    else onSave(data);
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div><label className="text-xs text-gray-500 mb-1 block">¿Quién lo sostiene? *</label>
        <input value={quien} onChange={e=>setQuien(e.target.value)} placeholder="Ej: Miriam"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      <div><label className="text-xs text-gray-500 mb-1 block">¿De qué va? *</label>
        <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} rows={3} placeholder="Describe el taller..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-500">Fecha</label>
          <button onClick={() => setPorConfirmar(!porConfirmar)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${porConfirmar ? "bg-gray-100 text-gray-500" : "bg-violet-100 text-violet-700"}`}>
            <span className={`w-3 h-3 rounded-full transition-all ${porConfirmar ? "bg-gray-400" : "bg-violet-600"}`}></span>
            {porConfirmar ? "Por confirmar" : "Fecha concreta"}
          </button>
        </div>
        {!porConfirmar && <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />}
      </div>
      <div><label className="text-xs text-gray-500 mb-1 block">¿Qué necesita?</label>
        <textarea value={necesita} onChange={e=>setNecesita(e.target.value)} rows={2} placeholder="Materiales, recursos, espacio..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40">{saving?"Guardando...":"Guardar"}</button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500">Cancelar</button>
      </div>
      {taller && onDelete && <button onClick={() => onDelete(taller.id)} className="w-full py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 font-medium">Eliminar taller</button>}
    </div>
  );
}

function TallerCard({ taller: t, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-start">
        <button onClick={() => setExpanded(!expanded)} className="flex-1 text-left px-4 py-4">
          <p className="font-bold text-gray-900 mb-1">{t.descripcion}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {t.fecha ? <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">📅 {new Date(t.fecha+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>
              : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">📅 Por confirmar</span>}
            <span className="text-xs text-gray-500">· {t.quien}</span>
          </div>
        </button>
        <button onClick={onEdit} className="p-4 text-gray-400 hover:text-violet-600 transition-colors flex-shrink-0">✏️</button>
      </div>
      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3">
          {t.necesita ? <div className="bg-amber-50 rounded-xl px-3 py-2.5"><p className="text-xs text-amber-600 font-medium mb-0.5">Necesita</p><p className="text-sm text-gray-700">{t.necesita}</p></div>
            : <p className="text-sm text-gray-400 italic">Sin necesidades indicadas</p>}
        </div>
      )}
    </div>
  );
}

function Popup({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[70] flex items-end justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-sm">✕</button>
        </div>
        <div className="px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

function TalleresView({ talleres, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  return (
    <div className="space-y-4">
      {showForm && (
        <Popup title="Nuevo taller" onClose={() => setShowForm(false)}>
          <TallerForm onSave={(t) => { onAdd(t); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </Popup>
      )}
      {editTarget && (
        <Popup title="Editar taller" onClose={() => setEditTarget(null)}>
          <TallerForm taller={editTarget} onSave={(t) => { onEdit(t); setEditTarget(null); }} onCancel={() => setEditTarget(null)} onDelete={(id) => { onDelete(id); setEditTarget(null); }} />
        </Popup>
      )}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">🎨</span>
        <div><p className="text-sm font-semibold text-amber-800">Hacen falta {Math.max(0, 16 - talleres.length)} talleres</p><p className="text-[13px] text-amber-600">{talleres.length} de 16 registrados</p></div>
      </div>
      <button onClick={() => setShowForm(true)} className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700">+ Añadir taller</button>
      {talleres.length === 0 ? <p className="text-center text-gray-400 py-12">Sin talleres</p> : (
        <div className="space-y-3">{talleres.map(t => (
          <TallerCard key={t.id} taller={t} onEdit={() => setEditTarget(t)} />
        ))}</div>
      )}
    </div>
  );
}

// ── SEMANAS DEL CAMPAMENTO ────────────────────────────────────────────────────
const SEMANAS = [
  { label: "Semana 1", dias: ["2026-07-06","2026-07-07","2026-07-08","2026-07-09","2026-07-10"] },
  { label: "Semana 2", dias: ["2026-07-13","2026-07-14","2026-07-15","2026-07-16","2026-07-17"] },
  { label: "Semana 3", dias: ["2026-07-20","2026-07-21","2026-07-22","2026-07-23","2026-07-24"] },
  { label: "Semana 4", dias: ["2026-07-27","2026-07-28","2026-07-29","2026-07-30","2026-07-31"] },
];
const DIAS_LABELS = ["Lunes","Martes","Miércoles","Jueves","Viernes"];

// Color system for slots
const SLOT_COLOR = (titulo) => {
  const t = (titulo||"").toLowerCase();
  if (t.includes("oración") || t.includes("oracion")) return "bg-violet-400";
  if (t.includes("sesión") || t.includes("sesion")) return "bg-blue-400";
  if (t.includes("merienda") || t.includes("refrigerio") || t.includes("descanso")) return "bg-amber-400";
  if (t.includes("taller")) return "bg-orange-400";
  if (t.includes("reflexión") || t.includes("reflexion")) return "bg-pink-400";
  if (t.includes("llegada")) return "bg-gray-300";
  if (t.includes("vuelta") || t.includes("ida")) return "bg-gray-400";
  if (t.includes("parque") || t.includes("juego") || t.includes("drama")) return "bg-emerald-400";
  return "bg-violet-300";
};

const HORARIO_FIJO_DEFAULT = [
  { hora: "8:30",  fin: "9:00",  titulo: "Llegada de los niños" },
  { hora: "9:00",  fin: "9:30",  titulo: "Oraciones" },
  { hora: "9:30",  fin: "10:30", titulo: "Sesión parte 1" },
  { hora: "10:30", fin: "10:45", titulo: "Merienda" },
  { hora: "10:45", fin: "11:30", titulo: "Sesión parte 2" },
  { hora: "11:30", fin: "12:00", titulo: "Parque · Juegos · Drama" },
  { hora: "12:00", fin: "13:30", titulo: "Taller" },
  { hora: "13:30", fin: "14:00", titulo: "Reflexión conjunta" },
  { hora: "14:15", fin: "15:00", titulo: "Reflexión de maestros" },
];

const HORARIO_EXCURSION_DEFAULT = [
  { hora: "9:00",  fin: "9:30",  titulo: "Oraciones",                   tag: "Oración",    line: "bg-violet-400" },
  { hora: "9:45",  fin: "10:30", titulo: "Ida a Canal",                 tag: "Traslado",   line: "bg-gray-400" },
  { hora: "10:30", fin: "11:00", titulo: "Agua · Correr · Existir",     tag: "Actividad",  line: "bg-blue-400" },
  { hora: "11:00", fin: "12:00", titulo: "Actividad 4",                 tag: "Actividad",  line: "bg-emerald-400" },
  { hora: "12:00", fin: "12:30", titulo: "Descanso · Refrigerio",       tag: "Descanso",   line: "bg-amber-400" },
  { hora: "12:30", fin: "13:00", titulo: "Chorros (Miriam)",            tag: "Actividad",  line: "bg-cyan-400" },
  { hora: "13:00", fin: "13:30", titulo: "Reflexión · Cambio de ropa",  tag: "Reflexión",  line: "bg-pink-400" },
  { hora: "13:30", fin: "14:00", titulo: "Vuelta al local",             tag: "Vuelta",     line: "bg-gray-400" },
];

const GRADO_TAGS = ["Huevito","G1","G2","G3","Prej."];
const GRADO_COLORS = ["bg-yellow-100 text-yellow-700","bg-green-100 text-green-700","bg-orange-100 text-orange-700","bg-red-100 text-red-700","bg-purple-100 text-purple-700"];

function CalendarioView({ ofrecimientos, talleres, familias, excursiones, onAddOfrecimiento, onAddTaller, onAddExcursion }) {
  const hoy = new Date();
  const todayStr = hoy.toISOString().slice(0,10);

  const semanaInicial = (() => {
    const idx = SEMANAS.findIndex(s => {
      const fin = new Date(s.dias[4]); fin.setHours(23,59,59);
      return hoy >= new Date(s.dias[0]) && hoy <= fin;
    });
    if (idx >= 0) return idx;
    // Weekend between weeks: show the upcoming week
    for (let i = 0; i < SEMANAS.length; i++) {
      if (hoy < new Date(SEMANAS[i].dias[0])) return i;
    }
    return SEMANAS.length - 1;
  })();
  const diaInicial = (() => {
    const d = hoy.getDay(); // 0=dom, 1=lun... 5=vie, 6=sab
    if (d >= 1 && d <= 5) return d - 1;
    return 0; // weekend → Monday
  })();
  const [semanaIdx, setSemanaIdx] = useState(semanaInicial);
  const [diaIdx, setDiaIdx] = useState(diaInicial);
  const [showAdd, setShowAdd] = useState(false);
  const [addTipo, setAddTipo] = useState(null);

  const semana = SEMANAS[semanaIdx];
  const fechaDia = semana.dias[diaIdx];
  const esMiercoles = diaIdx === 2;
  const excursionDia = excursiones?.find(e => e.fecha === fechaDia);
  const horarioDia = excursionDia?.horario || (esMiercoles ? HORARIO_EXCURSION_DEFAULT : HORARIO_FIJO_DEFAULT);
  const horario = horarioDia;
  const [editSlot, setEditSlot] = useState(null);

  const alergias = familias?.flatMap(f =>
    (f.hijos||[]).map(h => typeof h==="string" ? null : h)
      .filter(h => h && h.alergias && h.alergias.trim())
      .map(h => `${h.nombre}: ${h.alergias}`)
  ).filter(Boolean) || [];

  const getTitulo = (slot) => slot.titulo || "";
  const getSubtitulo = (slot) => slot.duracion || "";

  return (
    <div className="space-y-0">
      {/* Semanas — tabs con barrrita */}
      <div className="bg-white rounded-t-2xl border border-b-0 border-gray-100 shadow-sm">
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {SEMANAS.map((s, i) => (
            <button key={i} onClick={() => { setSemanaIdx(i); setDiaIdx(0); }}
              className={`flex-shrink-0 px-5 py-3 text-sm font-semibold transition-all relative whitespace-nowrap
                ${semanaIdx===i ? "text-violet-600" : "text-gray-400 hover:text-gray-600"}`}>
              {s.label}
              {semanaIdx===i && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full"></div>}
            </button>
          ))}
        </div>

        {/* Días — botones */}
        <div className="flex gap-1.5 px-3 py-3">
          {DIAS_LABELS.map((d, i) => {
            const fecha = semana.dias[i];
            const esHoy = fecha === todayStr;
            const tieneEvento = talleres?.some(t => t.fecha === fecha) || excursiones?.some(e => e.fecha === fecha);
            const sel = diaIdx === i;
            return (
              <button key={i} onClick={() => setDiaIdx(i)}
                className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all text-center
                  ${sel ? "bg-violet-600 shadow-sm" : "bg-gray-50 hover:bg-gray-100"}`}>
                <span className={`text-[13px] font-semibold ${sel?"text-violet-200":"text-gray-400"}`}>{d.slice(0,3)}</span>
                <span className={`text-sm font-bold ${sel?"text-white":esHoy?"text-violet-600":"text-gray-700"}`}>
                  {new Date(fecha+"T12:00:00").getDate()}
                </span>
                {tieneEvento && <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${sel?"bg-white/60":i===2?"bg-emerald-400":"bg-orange-400"}`}></div>}
              </button>
            );
          })}
        </div>

        {/* Header con + */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            {new Date(fechaDia+"T12:00:00").toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"})}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setEditSlot("dia")}
              className="w-8 h-8 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center hover:border-violet-400 hover:text-violet-600 transition-colors text-sm">✏️</button>
            <button onClick={() => { setShowAdd(true); setAddTipo(null); }}
              className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-violet-700 transition-colors">+</button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-gray-100 shadow-sm px-4 pb-4 pt-2">
        {horario.map((slot, i) => {
          const lineColor = slot.line || SLOT_COLOR(slot.titulo);
          const tagLabel = slot.tag || slot.titulo?.split("·")[0]?.trim()?.split(" ")[0] || "Slot";
          return (
          <div key={i} className="flex gap-3 relative">
            {i < horario.length - 1 && (
              <div className="absolute left-[43px] top-8 bottom-0 w-px bg-gray-100 z-0"></div>
            )}
            {/* Hora */}
            <div className="w-10 flex-shrink-0 pt-3 text-right z-10">
              <span className="text-[11px] font-medium text-gray-400">{slot.hora}</span>
            </div>
            {/* Dot */}
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-3.5 z-10 border-2 border-white shadow-sm ${lineColor}`}></div>
            {/* Card */}
            <div className="flex-1 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex">
              <div className={`w-1 flex-shrink-0 ${lineColor}`}></div>
              <div className="flex-1 px-3 py-2.5">
                <div className="flex items-center gap-1 flex-wrap mb-1">
                  <span className="text-[13px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tagLabel}</span>
                  {slot.grado && GRADO_TAGS.map((g,j) => (
                    <span key={j} className={`text-[13px] font-semibold px-2 py-0.5 rounded-full ${GRADO_COLORS[j]}`}>{g}</span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{getTitulo(slot)}</p>
                {getSubtitulo(slot) && <p className="text-[13px] text-gray-500 mt-0.5">{getSubtitulo(slot)}</p>}
              {tagLabel === "Merienda" && alergias.length > 0 && (
                <div className="mt-1.5 bg-red-50 rounded-lg px-2 py-1.5">
                  <p className="text-[13px] font-semibold text-red-600 mb-0.5">⚠️ Alergias</p>
                  {alergias.map((a,i) => <p key={i} className="text-[13px] text-red-500">{a}</p>)}
                </div>
              )}
                {slot.fin && <p className="text-[13px] text-gray-500 mt-0.5">{slot.hora} – {slot.fin}</p>}
              </div>

            </div>
          </div>
        );
        })}
      </div>

      {/* Popup editar horario del día */}
      {editSlot === "dia" && (
        <Popup title="Editar horario del día" onClose={() => setEditSlot(null)}>
          <HorarioDiaForm
            fecha={fechaDia}
            excursion={excursionDia}
            defaultHorario={esMiercoles ? HORARIO_EXCURSION_DEFAULT : HORARIO_FIJO_DEFAULT}
            onSave={(e) => { if(onAddExcursion) onAddExcursion(e); setEditSlot(null); }}
            onCancel={() => setEditSlot(null)}
          />
        </Popup>
      )}

      {/* Pop-up añadir */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-end justify-center" onClick={() => { setShowAdd(false); setAddTipo(null); }}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {addTipo ? (addTipo==="ofrecimiento"?"Nuevo ofrecimiento":addTipo==="taller"?"Nuevo taller":"Nueva excursión") : "¿Qué quieres añadir?"}
              </h3>
              <button onClick={() => { if(addTipo) setAddTipo(null); else setShowAdd(false); }}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-sm">
                {addTipo ? "←" : "✕"}
              </button>
            </div>
            <div className="px-4 py-4">
              {!addTipo ? (
                <div className="space-y-3">
                  {[
                    { id:"ofrecimiento", icon:"🎁", label:"Ofrecimiento", desc:"Una familia ofrece algo al campamento", color:"border-violet-100" },
                    { id:"taller", icon:"🎨", label:"Taller", desc:"Actividad especial para los niños", color:"border-amber-100" },
                    { id:"excursion", icon:"🚌", label:"Excursión", desc:"Salida fuera del centro", color:"border-emerald-100" },
                  ].map(op => (
                    <button key={op.id} onClick={() => setAddTipo(op.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border bg-white text-left hover:bg-gray-50 transition-all ${op.color}`}>
                      <span className="text-3xl">{op.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{op.label}</p>
                        <p className="text-[13px] text-gray-500 mt-0.5">{op.desc}</p>
                      </div>
                      <span className="text-gray-500">›</span>
                    </button>
                  ))}
                </div>
              ) : addTipo === "ofrecimiento" ? (
                <OfrecimientoForm familias={familias}
                  ofrecimiento={{ fecha: fechaDia }}
                  onSave={(o) => { if(onAddOfrecimiento) onAddOfrecimiento(o); setShowAdd(false); setAddTipo(null); }}
                  onCancel={() => setAddTipo(null)} />
              ) : addTipo === "taller" ? (
                <TallerForm
                  taller={{ fecha: fechaDia }}
                  onSave={(t) => { if(onAddTaller) onAddTaller(t); setShowAdd(false); setAddTipo(null); }}
                  onCancel={() => setAddTipo(null)} />
              ) : (
                <ExcursionForm
                  fecha={fechaDia}
                  onSave={(e) => { if(onAddExcursion) onAddExcursion(e); setShowAdd(false); setAddTipo(null); }}
                  onCancel={() => setAddTipo(null)} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HorarioDiaForm({ fecha, excursion, defaultHorario, onSave, onCancel }) {
  const [horario, setHorario] = useState(excursion?.horario || defaultHorario);
  const [saving, setSaving] = useState(false);

  const updateSlot = (idx, field, val) =>
    setHorario(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  const addSlot = () => setHorario(prev => [...prev, { hora: "", fin: "", titulo: "" }]);
  const removeSlot = (idx) => setHorario(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    const payload = { horario };
    if (excursion?.id) {
      const { data } = await supabase.from("excursiones").update(payload).eq("id", excursion.id).select().single();
      if (data) onSave(data);
    } else {
      // Find or create excursion for this date
      const { data: existing } = await supabase.from("excursiones").select("id").eq("fecha", fecha).maybeSingle();
      if (existing?.id) {
        const { data } = await supabase.from("excursiones").update(payload).eq("id", existing.id).select().single();
        if (data) onSave(data);
      } else {
        const { data } = await supabase.from("excursiones").insert({ fecha, titulo: "Día", ...payload }).select().single();
        if (data) onSave(data);
      }
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[13px] text-gray-500 font-semibold uppercase tracking-wide">Horario</label>
          <button onClick={addSlot} className="text-[13px] text-violet-600 font-medium">+ Añadir</button>
        </div>
        <div className="space-y-2">
          {horario.map((slot, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3">
              <div className="flex gap-2 items-center">
                <input value={slot.hora} onChange={e=>updateSlot(i,"hora",e.target.value)} placeholder="9:00"
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white text-center" />
                <span className="text-gray-400 text-sm">–</span>
                <input value={slot.fin} onChange={e=>updateSlot(i,"fin",e.target.value)} placeholder="9:30"
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white text-center" />
                <input value={slot.titulo} onChange={e=>updateSlot(i,"titulo",e.target.value)} placeholder="Actividad"
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                <button onClick={() => removeSlot(i)} className="text-gray-400 hover:text-red-400 text-sm flex-shrink-0">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
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


function ExcursionForm({ fecha, excursion, onSave, onCancel }) {
  const DEFAULT_HORARIO = [
    { hora: "9:00",  fin: "9:30",  titulo: "Oraciones" },
    { hora: "9:45",  fin: "10:30", titulo: "Ida a Canal" },
    { hora: "10:30", fin: "11:00", titulo: "Agua · Correr · Existir" },
    { hora: "11:00", fin: "12:00", titulo: "Actividad 4" },
    { hora: "12:00", fin: "12:30", titulo: "Descanso · Refrigerio" },
    { hora: "12:30", fin: "13:00", titulo: "Chorros (Miriam)" },
    { hora: "13:00", fin: "13:30", titulo: "Reflexión · Cambio de ropa" },
    { hora: "13:30", fin: "14:00", titulo: "Vuelta al local" },
  ];
  const [titulo, setTitulo] = useState(excursion?.titulo || "Excursión");
  const [descripcion, setDescripcion] = useState(excursion?.descripcion || "");
  const [horario, setHorario] = useState(excursion?.horario || DEFAULT_HORARIO);
  const [saving, setSaving] = useState(false);

  const updateSlot = (idx, field, val) =>
    setHorario(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));

  const addSlot = () => setHorario(prev => [...prev, { hora: "", fin: "", titulo: "" }]);
  const removeSlot = (idx) => setHorario(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    const payload = { titulo: titulo.trim(), descripcion: descripcion.trim() || null, horario };
    if (excursion?.id) {
      // Update existing
      const { data } = await supabase.from("excursiones").update(payload).eq("id", excursion.id).select().single();
      if (data) onSave(data);
    } else {
      // Check if one exists for this date, update it instead of creating new
      const { data: existing } = await supabase.from("excursiones").select("id").eq("fecha", fecha).single();
      if (existing?.id) {
        const { data } = await supabase.from("excursiones").update(payload).eq("id", existing.id).select().single();
        if (data) onSave(data);
      } else {
        const { data } = await supabase.from("excursiones").insert({ fecha, ...payload }).select().single();
        if (data) onSave(data);
      }
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Título</label>
        <input value={titulo} onChange={e=>setTitulo(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Descripción (opcional)</label>
        <textarea value={descripcion} onChange={e=>setDescripcion(e.target.value)} rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Horario</label>
          <button onClick={addSlot} className="text-xs text-violet-600 font-medium">+ Añadir slot</button>
        </div>
        <div className="space-y-2">
          {horario.map((slot, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
              <div className="flex gap-2">
                <input value={slot.hora} onChange={e=>updateSlot(i,"hora",e.target.value)} placeholder="9:00"
                  className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                <span className="text-gray-400 self-center text-sm">–</span>
                <input value={slot.fin} onChange={e=>updateSlot(i,"fin",e.target.value)} placeholder="9:30"
                  className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                <input value={slot.titulo} onChange={e=>updateSlot(i,"titulo",e.target.value)} placeholder="Actividad"
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                <button onClick={() => removeSlot(i)} className="text-gray-400 hover:text-red-400 text-sm px-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
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


function ExcursionCard({ excursion: excursionInicial }) {
  const [excursion, setExcursion] = useState(excursionInicial);
  const [expanded, setExpanded] = useState(false);
  const [apuntados, setApuntados] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTitulo, setEditTitulo] = useState(excursion.titulo);
  const [editDesc, setEditDesc] = useState(excursion.descripcion || "");
  const [editSaving, setEditSaving] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("monitor");
  const [detalle, setDetalle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveEdit = async () => {
    setEditSaving(true);
    const { data } = await supabase.from("excursiones")
      .update({ titulo: editTitulo.trim(), descripcion: editDesc.trim() || null })
      .eq("id", excursion.id).select().single();
    if (data) setExcursion(data);
    setShowEdit(false); setEditSaving(false);
  };

  const cargar = async () => {
    const { data } = await supabase.from("excursion_apuntados").select("*").eq("excursion_id", excursion.id).order("created_at");
    setApuntados(data || []);
    setLoaded(true);
  };

  const handleExpand = () => {
    setExpanded(!expanded);
    if (!loaded) cargar();
  };

  const handleApuntar = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    const { data } = await supabase.from("excursion_apuntados").insert({
      excursion_id: excursion.id, nombre: nombre.trim(), tipo, detalle: detalle.trim() || null,
    }).select().single();
    if (data) setApuntados(prev => [...prev, data]);
    setNombre(""); setDetalle(""); setShowForm(false);
    setSaving(false);
  };

  const handleEliminar = async (id) => {
    await supabase.from("excursion_apuntados").delete().eq("id", id);
    setApuntados(prev => prev.filter(a => a.id !== id));
  };

  const fecha = new Date(excursion.fecha + "T12:00:00");
  const monitores = apuntados.filter(a => a.tipo === "monitor");
  const actividades = apuntados.filter(a => a.tipo === "actividad");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center">
        <button onClick={handleExpand} className="flex-1 text-left px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0 text-sm">
            {fecha.getDate()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900">{excursion.titulo}</p>
            <p className="text-xs text-gray-500">
              {fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          {loaded && apuntados.length > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{apuntados.length}</span>
          )}
        </button>
        <button onClick={() => setShowEdit(!showEdit)} className="p-4 text-gray-400 hover:text-violet-600 transition-colors flex-shrink-0">✏️</button>
      </div>

      {showEdit && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
          <input value={editTitulo} onChange={e=>setEditTitulo(e.target.value)} placeholder="Título"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          <textarea value={editDesc} onChange={e=>setEditDesc(e.target.value)} rows={2} placeholder="Descripción (opcional)"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
          <div className="flex gap-2">
            <button onClick={handleSaveEdit} disabled={editSaving||!editTitulo.trim()}
              className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40">{editSaving?"Guardando...":"Guardar"}</button>
            <button onClick={() => setShowEdit(false)} className="px-4 py-2.5 rounded-xl text-sm text-gray-500">Cancelar</button>
          </div>
        </div>
      )}

      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
          {excursion.descripcion && <p className="text-sm text-gray-500">{excursion.descripcion}</p>}

          {monitores.length > 0 && (
            <div>
              <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Monitores</p>
              <div className="space-y-1.5">{monitores.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-blue-50 rounded-xl px-3 py-2">
                  <span className="text-sm font-medium text-gray-800">{a.nombre}</span>
                  <button onClick={() => handleEliminar(a.id)} className="text-gray-500 hover:text-red-400 text-xs">✕</button>
                </div>
              ))}</div>
            </div>
          )}

          {actividades.length > 0 && (
            <div>
              <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Actividades</p>
              <div className="space-y-1.5">{actividades.map(a => (
                <div key={a.id} className="bg-amber-50 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">{a.nombre}</span>
                    <button onClick={() => handleEliminar(a.id)} className="text-gray-500 hover:text-red-400 text-xs">✕</button>
                  </div>
                  {a.detalle && <p className="text-xs text-gray-500 mt-0.5">{a.detalle}</p>}
                </div>
              ))}</div>
            </div>
          )}

          {showForm ? (
            <div className="bg-gray-50 rounded-xl p-3 space-y-2.5">
              <div className="flex gap-1 bg-white rounded-lg p-0.5 border border-gray-200">
                <button onClick={() => setTipo("monitor")} className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${tipo==="monitor"?"bg-violet-600 text-white":"text-gray-500"}`}>Monitor</button>
                <button onClick={() => setTipo("actividad")} className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${tipo==="actividad"?"bg-violet-600 text-white":"text-gray-500"}`}>Actividad</button>
              </div>
              <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
              {tipo === "actividad" && (
                <textarea value={detalle} onChange={e=>setDetalle(e.target.value)} rows={2} placeholder="Describe la actividad..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none bg-white focus:outline-none focus:ring-2 focus:ring-violet-300" />
              )}
              <div className="flex gap-2">
                <button onClick={handleApuntar} disabled={saving || !nombre.trim()}
                  className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40">
                  {saving ? "..." : "Apuntarme"}
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl text-sm text-gray-500">Cancelar</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowForm(true)}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold transition-colors">
              + Apuntarme
            </button>
          )}
        </div>
      )}
    </div>
  );
}


function ServiciosView({ talleres, ofrecimientos, familias, onAddTaller, onEditTaller, onDeleteTaller, onAddOfrecimiento, onDeleteOfrecimiento }) {
  const [tab, setTab] = useState("ofrecimientos");
  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {[{id:"ofrecimientos",label:"Ofrecimientos"},{id:"talleres",label:"Talleres"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab===t.id?"bg-white text-violet-700 shadow-sm":"text-gray-500"}`}>{t.label}</button>
        ))}
      </div>
      {tab==="ofrecimientos" && <OfrecimientosView ofrecimientos={ofrecimientos} familias={familias} onAdd={onAddOfrecimiento} onDelete={onDeleteOfrecimiento} />}
      {tab==="talleres" && <TalleresView talleres={talleres||[]} onAdd={onAddTaller} onEdit={onEditTaller} onDelete={onDeleteTaller} />}
    </div>
  );
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────

function AdminView({ currentUserId }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: true })
      .then(({ data }) => { setUsuarios(data || []); setLoading(false); });
  }, []);

  const handleAprobar = async (u) => {
    await supabase.from("profiles").update({ aprobado: true, aprobado_at: new Date().toISOString() }).eq("id", u.id);
    setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, aprobado: true } : x));
  };

  const handleEliminar = async (u) => {
    await supabase.from("profiles").delete().eq("id", u.id);
    setUsuarios(prev => prev.filter(x => x.id !== u.id));
  };

  const toggleAdmin = async (u) => {
    const val = !u.is_admin;
    await supabase.from("profiles").update({ is_admin: val }).eq("id", u.id);
    setUsuarios(prev => prev.map(x => x.id === u.id ? { ...x, is_admin: val } : x));
  };

  if (loading) return <p className="text-center text-gray-400 py-12">Cargando...</p>;

  const pendientes = usuarios.filter(u => !u.aprobado && !u.is_admin);
  const activos = usuarios.filter(u => u.aprobado || u.is_admin);

  return (
    <div className="space-y-5">
      {pendientes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2"><p className="text-sm font-bold text-gray-800">Pendientes</p><span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{pendientes.length}</span></div>
          {pendientes.map(u => (
            <div key={u.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold flex-shrink-0">{(u.nombre||"?")[0].toUpperCase()}</div>
                <div className="flex-1 min-w-0"><p className="font-semibold text-gray-800">{u.nombre}</p><p className="text-xs text-gray-500 truncate">{u.email}</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAprobar(u)} className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-600">✓ Aprobar</button>
                <button onClick={() => handleEliminar(u)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">Rechazar</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2.5">
        <p className="text-sm font-bold text-gray-800">Usuarios activos</p>
        {activos.map(u => (
          <div key={u.id} className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">{(u.nombre||"?")[0].toUpperCase()}</div>
            <div className="flex-1 min-w-0"><p className="font-semibold text-gray-800">{u.nombre}</p><p className="text-[13px] text-gray-500 truncate">{u.email}</p></div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {u.is_admin && <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">Admin</span>}
              {u.id !== currentUserId && (
                <>
                  <button onClick={() => toggleAdmin(u)} className={`text-xs px-2 py-1.5 rounded-full font-medium transition-all ${u.is_admin?"bg-red-50 text-red-500":"bg-gray-100 text-gray-600"}`}>{u.is_admin?"−Admin":"+Admin"}</button>
                  <button onClick={() => handleEliminar(u)} className="text-xs px-2 py-1.5 rounded-full text-red-400 hover:bg-red-50">✕</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NuevoRegistroScreen({ familias, allProfiles, currentUser, onSave, onCancel, tipoFijo }) {
  const [tipo, setTipo] = useState(tipoFijo || "conversacion");
  const [familiaId, setFamiliaId] = useState("");
  const [nota, setNota] = useState("");
  const [unidad, setUnidad] = useState(1);
  const [seccion, setSeccion] = useState(1);
  const [visitadorId, setVisitadorId] = useState(currentUser.id);
  const [completada, setCompletada] = useState(false);
  const [comentario, setComentario] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const handleSave = async () => {
    if (!familiaId) { setError("Selecciona una familia"); return; }
    setSaving(true);
    if (tipo === "conversacion") {
      if (!nota.trim()) { setError("Escribe algo"); setSaving(false); return; }
      const { data } = await supabase.from("conversaciones").insert({
        familia_id: familiaId, nota: nota.trim(), autor_id: currentUser.id,
      }).select("*, profiles(nombre)").single();
      if (data) onSave({ ...data, tipo: "conversacion", _sort: data.created_at });
    } else {
      const { data } = await supabase.from("visitas").insert({
        familia_id: familiaId, fecha: new Date().toISOString().slice(0,10),
        unidad, seccion, visitador_id: visitadorId, completada, comentario: comentario || null,
      }).select("*, profiles(nombre)").single();
      if (data) onSave({ ...data, tipo: "visita", _sort: data.created_at || data.fecha });
    }
    setSaving(false);
  };
  return (
    <FullScreen title="Nuevo registro" onBack={onCancel}>
      <div className="space-y-5">
        <div className="flex gap-2">
          <button onClick={() => setTipo("conversacion")}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tipo==="conversacion"?"bg-violet-600 text-white":"bg-white text-gray-600 border border-gray-200"}`}>
            💬 Conversación
          </button>
          <button onClick={() => setTipo("visita")}
            className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tipo==="visita"?"bg-violet-600 text-white":"bg-white text-gray-600 border border-gray-200"}`}>
            📖 Visita
          </button>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-medium">Familia</label>
          <select value={familiaId} onChange={e=>setFamiliaId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white">
            <option value="">Selecciona una familia</option>
            {[...familias].sort((a,b)=>a.nombre.localeCompare(b.nombre,"es")).map(f =>
              <option key={f.id} value={f.id}>{f.nombre}</option>
            )}
          </select>
        </div>
        {tipo === "conversacion" ? (
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block font-medium">¿De qué se habló?</label>
            <textarea value={nota} onChange={e=>setNota(e.target.value)} rows={4} autoFocus
              placeholder="Describe la conversación..."
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
        ) : (
          <>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">¿Quién fue?</label>
              <select value={visitadorId} onChange={e=>setVisitadorId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white">
                {allProfiles.map(p => <option key={p.id} value={p.id}>{p.nombre}{p.id===currentUser.id?" (yo)":""}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Unidad</label>
              <div className="flex gap-2">{[1,2,3].map(u => (
                <button key={u} onClick={()=>{setUnidad(u);setSeccion(1);}}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${unidad===u?"bg-violet-600 text-white":"bg-white text-gray-600 border border-gray-200"}`}>{u}</button>
              ))}</div>
              <p className="text-xs text-violet-600 mt-1.5 font-medium">{UNIDADES[unidad].nombre}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Sección</label>
              <div className="flex flex-wrap gap-1.5">{Object.keys(UNIDADES[unidad].secciones).map(s => (
                <button key={s} onClick={()=>setSeccion(Number(s))}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${seccion===Number(s)?"bg-violet-600 text-white":"bg-white text-gray-600 border border-gray-200"}`}>{s}</button>
              ))}</div>
              <p className="text-xs text-gray-500 mt-1.5 italic">{UNIDADES[unidad].secciones[seccion]}</p>
            </div>
            <button onClick={()=>setCompletada(!completada)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${completada?"bg-emerald-500 text-white":"bg-white border border-gray-200 text-gray-500"}`}>
              {completada?"✓ Completada":"En progreso"}
            </button>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Comentario (opcional)</label>
              <textarea value={comentario} onChange={e=>setComentario(e.target.value)} rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
            </div>
          </>
        )}
        {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-violet-600 text-white py-3.5 rounded-2xl text-sm font-semibold disabled:opacity-40 hover:bg-violet-700 transition-all">
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </FullScreen>
  );
}

function ActividadView({ familias, allProfiles, currentUser, visitas, onAddVisita, onVerFamilia }) {
  const [showNuevo, setShowNuevo] = useState(false);

  const sorted = [...visitas].sort((a,b) => (b.created_at||b.fecha||"").localeCompare(a.created_at||a.fecha||""));

  const handleSave = (item) => {
    onAddVisita(item);
    setShowNuevo(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("visitas").delete().eq("id", id);
  };

  if (showNuevo) return (
    <FullScreen title="Nueva visita" onBack={() => setShowNuevo(false)}>
      <NuevoRegistroScreen familias={familias} allProfiles={allProfiles} currentUser={currentUser}
        tipoFijo="visita" onSave={handleSave} onCancel={() => setShowNuevo(false)} />
    </FullScreen>
  );

  return (
    <div className="space-y-3">
      <button onClick={() => setShowNuevo(true)}
        className="w-full py-3.5 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
        📖 Nueva visita
      </button>
      {sorted.length === 0 ? (
        <div className="text-center py-16"><p className="text-4xl mb-3">📖</p><p className="text-gray-400 text-sm">Sin visitas aún</p></div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((v) => {
            const familia = familias.find(f => f.id === v.familia_id);
            const fecha = new Date(v.created_at || v.fecha);
            const esHoy = fecha.toDateString() === new Date().toDateString();
            const fechaStr = isNaN(fecha) ? v.fecha : esHoy
              ? fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
              : fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
            return (
              <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <button onClick={() => familia && onVerFamilia(familia)}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0 mt-0.5">
                    {(familia?.nombre || "?")[0]}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <button onClick={() => familia && onVerFamilia(familia)}
                        className="text-sm font-semibold text-gray-800 hover:text-violet-600 transition-colors">
                        {familia?.nombre || "—"}
                      </button>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">📖 Visita</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium">U{v.unidad} · S{v.seccion}</p>
                    <p className="text-xs text-gray-500 truncate">{UNIDADES[v.unidad]?.secciones[v.seccion]}</p>
                    {v.comentario && <p className="text-[13px] text-gray-500 mt-0.5 truncate">{v.comentario}</p>}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[13px] text-gray-500">{fechaStr}</span>
                      {v.profiles?.nombre && <><span className="text-gray-200">·</span><span className="text-[13px] text-gray-500">{v.profiles.nombre}</span></>}
                      <span className="text-gray-200">·</span>
                      <span className={`text-xs font-medium ${v.completada?"text-emerald-600":"text-amber-600"}`}>
                        {v.completada?"✓ Completada":"En progreso"}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(v.id)} className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0 mt-1 text-xs">✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function PublicApp({ talleres, ofrecimientos, familias, excursiones, onAddTaller, onAddOfrecimiento, onDeleteOfrecimiento, offline, onLogin, voluntarios, visitas, allProfiles }) {
  const [menu, setMenu] = useState("home");
  const [tab, setTab] = useState("familias");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [showFiltro, setShowFiltro] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [familiaPerfilTarget, setFamiliaPerfilTarget] = useState(null);

  const roles = ["Todos", "Madre", "Padre", "Abuela", "Abuelo", "Voluntario"];
  const familiasFiltradas = familias.filter(f => {
    const q = busqueda.toLowerCase();
    const matchQ = !q || f.nombre.toLowerCase().includes(q) || f.hijos?.some(h => (typeof h==="string"?h:h.nombre)?.toLowerCase().includes(q));
    const matchR = filtroRol==="Todos" || f.grado===filtroRol;
    return matchQ && matchR;
  }).sort((a,b) => a.nombre.localeCompare(b.nombre,"es"));

  const NAV_ITEMS = [
    { id: "home", label: "Inicio", icon: "🏠" },
    { id: "confirmados", label: "Familias", icon: "👨‍👩‍👧" },
    { id: "voluntarios", label: "Voluntarios", icon: "🙌" },
    { id: "servicios", label: "Servicios", icon: "🎨" },
    { id: "actividad", label: "Visitas", icon: "📖" },
  ];

  const headerTitle = menu==="home"?"Inicio":menu==="actividad"?"Visitas":menu==="voluntarios"?"Voluntarios":menu==="servicios"?"Servicios":"Familias";

  // Public PerfilFamilia — no conversations
  const PerfilPublico = ({ familia, onClose }) => (
    <div className="fixed inset-0 bg-gray-50 z-[60] flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 flex-shrink-0">
        <button onClick={onClose} className="text-sm text-violet-500 font-medium mb-3 block">← Volver</button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg flex-shrink-0">{familia.nombre[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap"><span className="font-bold text-gray-900 text-lg">{familia.nombre}</span><Badge text={familia.grado} /></div>
            {familia.servicio && <p className="text-xs text-gray-500 mt-0.5">{familia.servicio}</p>}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {(familia.hijos||[]).length > 0 && (
          <div className="space-y-2">
            <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide">Hijos</p>
            {(familia.hijos||[]).map((h,i) => {
              const hijo = typeof h==="string" ? {nombre:h,edad:"",curso:"Huevito"} : h;
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0 text-sm">{(hijo.nombre||"?")[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-800">{hijo.nombre||"—"}</span><Badge text={hijo.curso} /></div>
                    {hijo.edad && <p className="text-[13px] text-gray-500 mt-0.5">{hijo.edad} años</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Visitas: solo resumen, sin desglose */}
        {visitas.filter(v=>v.familia_id===familia.id).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Visitas Ruhi</p>
            <p className="text-sm text-gray-700 font-medium">{visitas.filter(v=>v.familia_id===familia.id).length} visita{visitas.filter(v=>v.familia_id===familia.id).length!==1?"s":""} registradas</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {familiaPerfilTarget && (
        <PerfilPublico familia={familiaPerfilTarget} onClose={() => setFamiliaPerfilTarget(null)} />
      )}
      {showAvatarMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setShowAvatarMenu(false)}>
          <div className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 w-56 overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-gray-50"><p className="text-[13px] text-gray-500">Campamento Bahá'í Madrid</p></div>
            <button onClick={() => { setShowAvatarMenu(false); onLogin(); }} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-violet-50 text-left">
              <span className="text-lg">🔑</span>
              <div><p className="text-sm font-semibold text-gray-800">Iniciar sesión</p><p className="text-[13px] text-gray-500">Acceso para organizadores</p></div>
            </button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-violet-500 font-semibold uppercase tracking-widest">Campamento Bahá'í</p>
            <button onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-violet-100 hover:text-violet-700 transition-colors">
              <span className="text-lg">👤</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{headerTitle}</h1>
          {menu==="confirmados" && (
            <div className="flex gap-1 mt-3 bg-gray-100 rounded-xl p-1">
              {[{id:"familias",label:"Familias"},{id:"participantes",label:"Participantes"}].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab===t.id?"bg-white text-violet-700 shadow-sm":"text-gray-500"}`}>{t.label}</button>
              ))}
            </div>
          )}
          {offline && <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex items-center gap-2"><span className="text-sm">📶</span><p className="text-xs text-amber-700 font-medium">Sin conexión</p></div>}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">

          {menu==="home" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-5 text-white">
                <p className="text-sm opacity-80 mb-1">Campamento Urbano Comunitario</p>
                <h2 className="text-xl font-bold mb-0.5">¡Bienvenidos! 👋</h2>
                <p className="text-sm opacity-70">6 – 31 julio · Centro Bahá'í de Estudios · Madrid</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {label:"Familias",value:familias.length,icon:"👨‍👩‍👧",m:"confirmados"},
                  {label:"Voluntarios",value:voluntarios?.length||0,icon:"🙌",m:"voluntarios"},
                  {label:"Ofrecimientos",value:ofrecimientos.length,icon:"🎁",m:"servicios"},
                ].map(s=>(
                  <button key={s.label} onClick={() => setMenu(s.m)}
                    className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100 hover:border-violet-200 transition-all active:scale-95">
                    <p className="text-xl mb-1">{s.icon}</p>
                    <p className="text-lg font-bold text-violet-600">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </button>
                ))}
              </div>
              <CalendarioView ofrecimientos={ofrecimientos} talleres={talleres} familias={familias} excursiones={excursiones} onAddOfrecimiento={onAddOfrecimiento} onAddTaller={onAddTaller} />
            </div>
          )}

          {menu==="confirmados" && tab==="participantes" && (
            <ParticipantesView familias={familias} onVerFamilia={(f) => setFamiliaPerfilTarget(f)} />
          )}

          {menu==="confirmados" && tab==="familias" && (
            <>
              <div className="flex gap-2">
                <input type="text" placeholder="Buscar familia o hijo..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                <div className="relative">
                  <button onClick={() => setShowFiltro(!showFiltro)}
                    className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${filtroRol!=="Todos"?"bg-violet-600 text-white border-violet-600":"bg-white text-gray-600 border-gray-200"}`}>
                    🔽 {filtroRol==="Todos"?"Filtrar":filtroRol}
                  </button>
                  {showFiltro && (
                    <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 w-40 overflow-hidden">
                      {roles.map(r=>(
                        <button key={r} onClick={() => { setFiltroRol(r); setShowFiltro(false); }}
                          className={`w-full text-left px-4 py-3 text-sm ${filtroRol===r?"bg-violet-50 text-violet-700 font-semibold":"text-gray-600 hover:bg-gray-50"}`}>{r}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {familiasFiltradas.map(f => (
                  <button key={f.id} onClick={() => setFamiliaPerfilTarget(f)}
                    className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 flex items-center gap-3 hover:border-violet-200 transition-all active:bg-gray-50 text-left">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">{f.nombre[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5"><span className="font-semibold text-gray-800">{f.nombre}</span><Badge text={f.grado} /></div>
                      {f.hijos?.length > 0 && <p className="text-xs text-gray-500 truncate">{f.hijos.map(h=>typeof h==="string"?h:h.nombre).join(" · ")}</p>}
                    </div>
                    <span className="text-gray-500">›</span>
                  </button>
                ))}
                {familiasFiltradas.length===0 && <p className="text-center text-gray-400 py-8">Sin resultados</p>}
              </div>
            </>
          )}

          {menu==="voluntarios" && (
            <VoluntariosView voluntarios={voluntarios||[]} isAdmin={false} onAdd={()=>{}} onEdit={()=>{}} />
          )}

          {menu==="servicios" && (
            <ServiciosView talleres={talleres} ofrecimientos={ofrecimientos} familias={familias}
              onAddTaller={onAddTaller} onEditTaller={()=>{}} onDeleteTaller={()=>{}}
              onAddOfrecimiento={onAddOfrecimiento} onDeleteOfrecimiento={onDeleteOfrecimiento} />
          )}

          {menu==="actividad" && (
            <div className="space-y-2.5">
              {[...visitas].sort((a,b)=>(b.created_at||b.fecha||"").localeCompare(a.created_at||a.fecha||"")).map(v => {
                const familia = familias.find(f=>f.id===v.familia_id);
                return (
                  <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">{(familia?.nombre||"?")[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{familia?.nombre||"—"}</p>
                        <p className="text-xs text-gray-500">U{v.unidad} · {v.completada?"✓ Completada":"En progreso"}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">📖</span>
                    </div>
                  </div>
                );
              })}
              {visitas.length===0 && <div className="text-center py-16"><p className="text-4xl mb-3">📖</p><p className="text-gray-400 text-sm">Sin visitas aún</p></div>}
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="bg-white border-t border-gray-100 flex-shrink-0 pb-safe z-10">
          <div className="flex max-w-lg mx-auto">
            {NAV_ITEMS.map(item=>(
              <button key={item.id} onClick={() => setMenu(item.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${(menu===item.id||(item.id==="confirmados"&&menu==="participantes"))?"text-violet-600":"text-gray-400"}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-[13px] font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [ofrecimientos, setOfrecimientos] = useState([]);
  const [excursiones, setExcursiones] = useState([]);
  const [menu, setMenu] = useState("home");
  const [tab, setTab] = useState("familias");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [showFiltro, setShowFiltro] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [familiaPerfilTarget, setFamiliaPerfilTarget] = useState(null);
  const [showNuevaFamilia, setShowNuevaFamilia] = useState(false);
  const [serviciosTab, setServiciosTab] = useState("ofrecimientos");
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  const loadPublicData = async () => {
    try {
      const [{ data: talls }, { data: ofrecs }, { data: fams }, { data: excurs }, { data: vols }, { data: vis }] = await Promise.all([
        supabase.from("talleres").select("*").order("created_at", { ascending: false }),
        supabase.from("ofrecimientos").select("*").order("fecha", { ascending: true }),
        supabase.from("familias").select("*").order("nombre", { ascending: true }),
        supabase.from("excursiones").select("*").order("fecha"),
        supabase.from("voluntarios").select("*").order("created_at", { ascending: true }),
        supabase.from("visitas").select("*, profiles(nombre)"),
      ]);
      setTalleres(talls || []);
      setOfrecimientos(ofrecs || []);
      setFamilias(fams || []);
      setExcursiones(excurs || []);
      setVoluntarios(vols || []);
      setVisitas(vis || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const initUser = async (u) => {
    setUser(u);
    try {
      const [{ data: prof }, { data: profs }, { data: fams }, { data: vis }, { data: vols }, { data: talls }, { data: ofrecs }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.id).single(),
        supabase.from("profiles").select("*"),
        supabase.from("familias").select("*").order("nombre", { ascending: true }),
        supabase.from("visitas").select("*, profiles(nombre)"),
        supabase.from("voluntarios").select("*").order("created_at", { ascending: true }),
        supabase.from("talleres").select("*").order("created_at", { ascending: false }),
        supabase.from("ofrecimientos").select("*").order("fecha", { ascending: true }),
      ]);
      setProfile(prof); setAllProfiles(profs || []); setFamilias(fams || []);
      setVisitas(vis || []); setVoluntarios(vols || []); setTalleres(talls || []); setOfrecimientos(ofrecs || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) initUser(session.user);
      else loadPublicData();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (_e === "PASSWORD_RECOVERY") { setShowResetPassword(true); return; }
      if (session?.user) initUser(session.user);
      else { setUser(null); setProfile(null); loadPublicData(); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = profile?.is_admin;

  // Handlers
  const handleAddVisita = (v) => setVisitas(prev => [...prev, v]);
  const handleDeleteVisita = async (id) => { await supabase.from("visitas").delete().eq("id", id); setVisitas(prev => prev.filter(v=>v.id!==id)); };
  const handleAddFamilia = (f) => { setFamilias(prev => [f, ...prev]); setShowNuevaFamilia(false); };
  const handleEditFamilia = (f) => setFamilias(prev => prev.map(x=>x.id===f.id?f:x));
  const handleDeleteFamilia = async (id) => { await supabase.from("familias").delete().eq("id", id); setFamilias(prev => prev.filter(f=>f.id!==id)); };
  const handleAddVoluntario = (v) => setVoluntarios(prev => [...prev, v]);
  const handleEditVoluntario = (v) => setVoluntarios(prev => prev.map(x=>x.id===v.id?v:x));
  const handleAddTaller = (t) => setTalleres(prev => [t, ...prev]);
  const handleEditTaller = (t) => setTalleres(prev => prev.map(x=>x.id===t.id?t:x));
  const handleDeleteTaller = async (id) => { await supabase.from("talleres").delete().eq("id", id); setTalleres(prev => prev.filter(t=>t.id!==id)); };
  const handleAddOfrecimiento = (o) => setOfrecimientos(prev => [...prev, o]);
  const handleDeleteOfrecimiento = async (id) => { await supabase.from("ofrecimientos").delete().eq("id", id); setOfrecimientos(prev => prev.filter(o=>o.id!==id)); };
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setProfile(null); };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="space-y-3 w-64">
        {[1,2,3].map(i => <div key={i} className="h-14 bg-white rounded-2xl animate-pulse border border-gray-100"></div>)}
      </div>
    </div>
  );

  if (showResetPassword) return <ResetPasswordScreen onDone={() => setShowResetPassword(false)} />;

  // PUBLIC: no user → show public app
  if (!user) {
    if (showLogin) return (
      <FullScreen title="Iniciar sesión" onBack={() => setShowLogin(false)}>
        <AuthScreen onAuth={(u) => { setShowLogin(false); initUser(u); }} />
      </FullScreen>
    );
    return (
      <PublicApp
        talleres={talleres} ofrecimientos={ofrecimientos} familias={familias} excursiones={excursiones}
        voluntarios={voluntarios} visitas={visitas} allProfiles={allProfiles}
        onAddTaller={handleAddTaller} onAddOfrecimiento={handleAddOfrecimiento} onDeleteOfrecimiento={handleDeleteOfrecimiento}
        offline={offline} onLogin={() => setShowLogin(true)}
      />
    );
  }

  // PENDING APPROVAL
  if (profile && !profile.aprobado && !isAdmin) return <PendienteAprobacion email={user.email} onLogout={handleLogout} />;

  // LOGGED IN APP
  const NAV_ITEMS = [
    { id: "home", label: "Inicio", icon: "🏠" },
    { id: "confirmados", label: "Familias", icon: "👨‍👩‍👧" },
    { id: "voluntarios", label: "Voluntarios", icon: "🙌" },
    { id: "servicios", label: "Servicios", icon: "🎨" },
    { id: "actividad", label: "Visitas", icon: "📖" },
  ];

  const roles = ["Todos", "Madre", "Padre", "Abuela", "Abuelo", "Voluntario"];
  const familiasFiltradas = familias.filter(f => {
    const q = busqueda.toLowerCase();
    const matchQ = !q || f.nombre.toLowerCase().includes(q) || f.hijos?.some(h => (typeof h==="string"?h:h.nombre)?.toLowerCase().includes(q));
    const matchR = filtroRol==="Todos" || f.grado===filtroRol;
    return matchQ && matchR;
  }).sort((a,b) => a.nombre.localeCompare(b.nombre, "es"));

  return (
    <>
      {familiaPerfilTarget && (
        <PerfilFamiliaScreen
          familia={familiaPerfilTarget}
          allProfiles={allProfiles} currentUser={user} isAdmin={isAdmin}
          onClose={() => setFamiliaPerfilTarget(null)}
          onEdit={(f) => { handleEditFamilia(f); setFamiliaPerfilTarget(f); }}
          onDelete={(id) => { handleDeleteFamilia(id); setFamiliaPerfilTarget(null); }}
        />
      )}
      {showNuevaFamilia && (
        <FullScreen title="Nueva familia" onBack={() => setShowNuevaFamilia(false)}>
          <FamiliaForm onSave={handleAddFamilia} onCancel={() => setShowNuevaFamilia(false)} />
        </FullScreen>
      )}
      {showAdmin && isAdmin && (
        <FullScreen title="Administración" onBack={() => setShowAdmin(false)}>
          <AdminView currentUserId={user.id} />
        </FullScreen>
      )}
      {showAvatarMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setShowAvatarMenu(false)}>
          <div className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 w-64 overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold mb-2">{profile?.nombre?.[0]||"?"}</div>
              <p className="font-bold text-gray-900">{profile?.nombre} 👋</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{user.email}</p>
            </div>
            <div className="px-2 py-2">
              {isAdmin && <button onClick={() => { setShowAvatarMenu(false); setShowAdmin(true); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-violet-50 text-left"><span>⚙️</span><p className="text-sm font-semibold text-gray-800">Administración</p></button>}
              <button onClick={() => { setShowAvatarMenu(false); handleLogout(); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-left"><span>🚪</span><p className="text-sm font-medium text-red-500">Cerrar sesión</p></button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-violet-500 font-semibold uppercase tracking-widest">Campamento Urbano Comunitario</p>
            <button onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-sm hover:bg-violet-200 transition-colors">
              {profile?.nombre?.[0]?.toUpperCase()||"?"}
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {menu==="home"?"Inicio":menu==="actividad"?"Visitas":menu==="voluntarios"?"Voluntarios":menu==="servicios"?"Servicios":"Familias"}
          </h1>
          {offline && <div className="mt-1 text-xs text-amber-600">📶 Sin conexión</div>}
          {menu==="confirmados" && (
            <div className="flex gap-1 mt-3 bg-gray-100 rounded-xl p-1">
              {[{id:"familias",label:"Familias"},{id:"participantes",label:"Participantes"}].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab===t.id?"bg-white text-violet-700 shadow-sm":"text-gray-500"}`}>{t.label}</button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">

          {/* HOME */}
          {menu==="home" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-5 text-white">
                <p className="text-sm opacity-80 mb-1">Campamento Urbano Comunitario</p>
                <h2 className="text-xl font-bold mb-0.5">Hola, {profile?.nombre} 👋</h2>
                <p className="text-sm opacity-70">6 – 31 julio · Madrid</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {label:"Familias",value:familias.length,icon:"👨‍👩‍👧",m:"confirmados"},
                  {label:"Voluntarios",value:voluntarios.length,icon:"🙌",m:"voluntarios"},
                  {label:"Ofrecimientos",value:ofrecimientos.length,icon:"🎁",m:"servicios"},
                ].map(s=>(
                  <button key={s.label} onClick={() => setMenu(s.m)} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100 hover:border-violet-200 transition-all active:scale-95">
                    <p className="text-xl mb-1">{s.icon}</p><p className="text-lg font-bold text-violet-600">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p>
                  </button>
                ))}
              </div>
              <CalendarioView ofrecimientos={ofrecimientos} talleres={talleres} familias={familias} excursiones={excursiones} onAddOfrecimiento={handleAddOfrecimiento} onAddTaller={handleAddTaller} onEditTaller={handleEditTaller} onDeleteTaller={handleDeleteTaller} onAddExcursion={(e) => setExcursiones(prev => prev.some(x=>x.id===e.id) ? prev.map(x=>x.id===e.id?e:x) : [...prev, e])} />
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide px-4 pt-4 pb-2">Acceso rápido</p>
                {[
                  {label:"Familias confirmadas",icon:"👨‍👩‍👧",m:"confirmados",t:"familias"},
                  {label:"Participantes",icon:"🧒",m:"confirmados",t:"participantes"},
                ].map((item,i)=>(
                  <button key={i} onClick={() => { setMenu(item.m); if(item.t) setTab(item.t); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-t border-gray-50 text-left">
                    <span className="text-lg">{item.icon}</span><span className="text-sm text-gray-700 font-medium">{item.label}</span><span className="ml-auto text-gray-500">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAMILIAS */}
          {menu==="actividad" && (
            <ActividadView familias={familias} allProfiles={allProfiles} currentUser={user}
              visitas={visitas} onAddVisita={handleAddVisita}
              onVerFamilia={(f) => setFamiliaPerfilTarget(f)} />
          )}

          {menu==="confirmados" && tab==="participantes" && (
            <ParticipantesView familias={familias} onVerFamilia={(f) => setFamiliaPerfilTarget(f)} />
          )}

          {menu==="confirmados" && tab==="familias" && (
            <>
              <button onClick={() => setShowNuevaFamilia(true)} className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700">+ Nueva familia</button>
              <div className="flex gap-2">
                <input type="text" placeholder="Buscar familia o hijo..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
                <div className="relative">
                  <button onClick={() => setShowFiltro(!showFiltro)}
                    className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${filtroRol!=="Todos"?"bg-violet-600 text-white border-violet-600":"bg-white text-gray-600 border-gray-200"}`}>
                    🔽 {filtroRol==="Todos"?"Filtrar":filtroRol}
                  </button>
                  {showFiltro && (
                    <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 w-40 overflow-hidden">
                      {roles.map(r=>(
                        <button key={r} onClick={() => { setFiltroRol(r); setShowFiltro(false); }}
                          className={`w-full text-left px-4 py-3 text-sm ${filtroRol===r?"bg-violet-50 text-violet-700 font-semibold":"text-gray-600 hover:bg-gray-50"}`}>{r}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2.5">
                {familiasFiltradas.map(f=>(
                  <FamiliaCard key={f.id} familia={f} visitas={visitas.filter(v=>v.familia_id===f.id)}
                    currentUser={user} allProfiles={allProfiles} onAddVisita={handleAddVisita} onDeleteVisita={handleDeleteVisita}
                    onEdit={handleEditFamilia} onDelete={handleDeleteFamilia} isAdmin={isAdmin}
                    onAddOfrecimiento={handleAddOfrecimiento} onVerDetalle={setFamiliaPerfilTarget} />
                ))}
                {familiasFiltradas.length===0 && <p className="text-center text-gray-400 py-8">Sin resultados</p>}
              </div>
            </>
          )}

          {/* VOLUNTARIOS */}
          {menu==="voluntarios" && <VoluntariosView voluntarios={voluntarios} isAdmin={isAdmin} onAdd={handleAddVoluntario} onEdit={handleEditVoluntario} />}

          {/* SERVICIOS */}
          {menu==="servicios" && (
            <ServiciosView talleres={talleres} ofrecimientos={ofrecimientos} familias={familias}
              onAddTaller={handleAddTaller} onEditTaller={handleEditTaller} onDeleteTaller={handleDeleteTaller}
              onAddOfrecimiento={handleAddOfrecimiento} onDeleteOfrecimiento={handleDeleteOfrecimiento} />
          )}
        </div>

        {/* Bottom Nav */}
        <div className="bg-white border-t border-gray-100 flex-shrink-0 safe-bottom z-10">
          <div className="flex max-w-lg mx-auto">
            {NAV_ITEMS.map(item=>(
              <button key={item.id} onClick={() => setMenu(item.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${menu===item.id?"text-violet-600":"text-gray-400"}`}>
                <span className="text-xl">{item.icon}</span><span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── RECIENTES Y PARTICIPANTES lala ─────────────────────────────────────────────────


function ParticipantesView({ familias, onVerFamilia }) {
  const [gradoSeleccionado, setGradoSeleccionado] = useState(null);

  const GRADO_ICONS = {
    "Huevito": "🐣", "Grado 1": "✏️", "Grado 2": "📖", "Grado 3": "🌟", "Prejuvenil": "🌿"
  };

  const participantesPorGrado = CURSOS.reduce((acc, curso) => {
    acc[curso] = familias.flatMap(f =>
      (f.hijos || [])
        .map(h => typeof h === "string" ? { nombre: h, edad: "", curso: "Huevito", familia: f } : { ...h, familia: f })
        .filter(h => h.curso === curso)
    ).sort((a,b) => (a.nombre||"").localeCompare(b.nombre||"","es"));
    return acc;
  }, {});

  if (gradoSeleccionado) {
    const lista = participantesPorGrado[gradoSeleccionado];
    return (
      <div className="space-y-3">
        <button onClick={() => setGradoSeleccionado(null)} className="text-sm text-violet-500 font-medium flex items-center gap-1">
          ← {gradoSeleccionado}
        </button>
        {lista.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Sin participantes en este grado</p>
        ) : lista.map((p, i) => (
          <button key={i} onClick={() => onVerFamilia(p.familia)}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3.5 flex items-center gap-3 hover:border-violet-200 transition-all active:bg-gray-50 text-left">
            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0 text-sm">{(p.nombre||"?")[0]}</div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-800">{p.nombre || "—"}</span>
              <div className="flex items-center gap-2 mt-0.5">
                {p.edad && <span className="text-[13px] text-gray-500">{p.edad} años</span>}
                <span className="text-[13px] text-gray-500">· {p.familia?.nombre}</span>
              </div>
            </div>
            <span className="text-gray-500 text-sm flex-shrink-0">›</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {CURSOS.map(curso => {
        const count = participantesPorGrado[curso].length;
        return (
          <button key={curso} onClick={() => setGradoSeleccionado(curso)}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 flex items-center gap-4 hover:border-violet-200 transition-all active:bg-gray-50 text-left">
            <span className="text-3xl flex-shrink-0">{GRADO_ICONS[curso]}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{curso}</p>
              <p className="text-[13px] text-gray-500 mt-0.5">{count} participante{count !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {count > 0 && <span className="text-sm font-bold text-violet-600">{count}</span>}
              <span className="text-gray-500">›</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}


