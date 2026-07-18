import { useState, useEffect } from "react";
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

function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4">
        <p className="font-semibold text-gray-800">{title}</p>
        {message && <p className="text-sm text-gray-500">{message}</p>}
        <div className="flex gap-2">
          <button onClick={onConfirm} className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold">{confirmLabel}</button>
          <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-gray-100">Cancelar</button>
        </div>
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
  const [hijos, setHijos] = useState((familia?.hijos || []).map(h => typeof h === "string" ? { nombre: h, edad: "", curso: "Huevito" } : h));
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

function VisitaForm({ familiaId, currentUser, allProfiles, onSave, onCancel }) {
  const [unidad, setUnidad] = useState(1);
  const [seccion, setSeccion] = useState(1);
  const [visitadorId, setVisitadorId] = useState(currentUser.id);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10));
  const [completada, setCompletada] = useState(false);
  const [comentario, setComentario] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { data } = await supabase.from("visitas").insert({
      familia_id: familiaId, fecha, unidad, seccion, visitador_id: visitadorId, completada, comentario: comentario || null,
    }).select("*, profiles(nombre)").single();
    if (data) onSave(data);
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div><label className="text-xs text-gray-500 mb-1 block">Fecha</label>
        <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      <div><label className="text-xs text-gray-500 mb-2 block">¿Quién fue?</label>
        <select value={visitadorId} onChange={e=>setVisitadorId(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
          {allProfiles.map(p => <option key={p.id} value={p.id}>{p.nombre}{p.id===currentUser.id?" (yo)":""}</option>)}</select></div>
      <div><label className="text-xs text-gray-500 mb-2 block">Unidad</label>
        <div className="flex gap-2">{[1,2,3].map(u => (
          <button key={u} onClick={()=>{setUnidad(u);setSeccion(1);}}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${unidad===u?"bg-violet-600 text-white":"bg-gray-100 text-gray-600"}`}>{u}</button>
        ))}</div>
        <p className="text-xs text-violet-600 mt-1.5 font-medium">{UNIDADES[unidad].nombre}</p></div>
      <div><label className="text-xs text-gray-500 mb-2 block">Sección</label>
        <div className="flex flex-wrap gap-1.5">{Object.keys(UNIDADES[unidad].secciones).map(s => (
          <button key={s} onClick={()=>setSeccion(Number(s))}
            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${seccion===Number(s)?"bg-violet-600 text-white":"bg-gray-100 text-gray-600"}`}>{s}</button>
        ))}</div>
        <p className="text-xs text-gray-500 mt-1.5 italic">{UNIDADES[unidad].secciones[seccion]}</p></div>
      <button onClick={()=>setCompletada(!completada)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${completada?"bg-emerald-500 text-white":"bg-gray-100 text-gray-500"}`}>
        {completada?"✓ Completada":"En progreso"}</button>
      <div><label className="text-xs text-gray-500 mb-1 block">Comentario (opcional)</label>
        <textarea value={comentario} onChange={e=>setComentario(e.target.value)} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="flex-1 bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-40">{saving?"Guardando...":"Guardar visita"}</button>
        <button onClick={onCancel} className="px-4 py-3 rounded-xl text-sm text-gray-500">Cancelar</button>
      </div>
    </div>
  );
}

function DetalleScreen({ familia, visitas, currentUser, allProfiles, onAddVisita, onDeleteVisita, onClose, isAdmin }) {
  const [tab, setTab] = useState("conversaciones");
  const [conversaciones, setConversaciones] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showNuevaConv, setShowNuevaConv] = useState(false);
  const [showNuevaVisita, setShowNuevaVisita] = useState(false);
  const [nuevaNota, setNuevaNota] = useState("");

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

  const handleSaveConv = async () => {
    if (!nuevaNota.trim()) return;
    const { data } = await supabase.from("conversaciones").insert({
      familia_id: familia.id, nota: nuevaNota.trim(), autor_id: currentUser.id,
    }).select("*, profiles(nombre)").single();
    if (data) setConversaciones(prev => [data, ...prev]);
    setNuevaNota(""); setShowNuevaConv(false);
  };

  const sorted = [...visitas].sort((a,b) => b.fecha.localeCompare(a.fecha));

  return (
    <div className="fixed inset-0 bg-gray-50 z-[60] flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-3 flex-shrink-0">
        <button onClick={onClose} className="text-sm text-violet-500 font-medium mb-3">← Volver</button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">{familia.nombre[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap"><span className="font-bold text-gray-900">{familia.nombre}</span><Badge text={familia.grado} /></div>
            {familia.hijos?.length > 0 && <p className="text-xs text-gray-500 truncate mt-0.5">{familia.hijos.map(h=>typeof h==="string"?h:`${h.nombre}${h.edad?`, ${h.edad}a`:""}`).join(" · ")}</p>}
            {familia.servicio && <p className="text-xs text-gray-400 truncate">{familia.servicio}</p>}
          </div>
        </div>
        {familia.telefono && <div className="mb-2"><ContactoButtons telefono={familia.telefono} isAdmin={isAdmin} /></div>}
        {familia.contacto2_nombre && (
          <div className="mb-2 bg-gray-50 rounded-xl p-2.5 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{familia.contacto2_nombre}</span>
            <Badge text={familia.contacto2_parentesco} />
          </div>
        )}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: "conversaciones", label: `💬 Conv.${conversaciones.length > 0 ? ` (${conversaciones.length})` : ""}` },
            { id: "visitas", label: `📖 Visitas${visitas.length > 0 ? ` (${visitas.length})` : ""}` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t.id?"bg-white text-violet-700 shadow-sm":"text-gray-500"}`}>{t.label}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {tab === "conversaciones" && (
          <>
            {showNuevaConv ? (
              <div className="space-y-2">
                <textarea value={nuevaNota} onChange={e=>setNuevaNota(e.target.value)} rows={3} autoFocus placeholder="Escribe un mensaje..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
                <div className="flex gap-2">
                  <button onClick={handleSaveConv} disabled={!nuevaNota.trim()} className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40">Enviar</button>
                  <button onClick={() => { setShowNuevaConv(false); setNuevaNota(""); }} className="px-4 py-2.5 rounded-xl text-sm text-gray-500">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowNuevaConv(true)} className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold">+ Nuevo mensaje</button>
            )}
            {conversaciones.length === 0 ? <p className="text-center text-gray-400 py-8">Sin mensajes aún</p> :
              conversaciones.map(c => {
                const nombre = c.profiles?.nombre || "—";
                const fecha = new Date(c.created_at);
                const esHoy = fecha.toDateString() === new Date().toDateString();
                const hora = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                const fechaStr = esHoy ? hora : `${fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} ${hora}`;
                return (
                  <div key={c.id} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0 mt-0.5">{nombre[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-gray-800">{nombre}</span>
                        <span className="text-xs text-gray-400">{fechaStr}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{c.nota}</p>
                    </div>
                    <button onClick={() => handleDeleteConv(c.id)} className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1">✕</button>
                  </div>
                );
              })}
          </>
        )}
        {tab === "visitas" && (
          <>
            {showNuevaVisita ? (
              <VisitaForm familiaId={familia.id} currentUser={currentUser} allProfiles={allProfiles}
                onSave={(v) => { onAddVisita(v); setShowNuevaVisita(false); }} onCancel={() => setShowNuevaVisita(false)} />
            ) : (
              <button onClick={() => setShowNuevaVisita(true)} className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold">+ Nueva visita</button>
            )}
            {sorted.length === 0 ? <p className="text-center text-gray-400 py-8">Sin visitas aún</p> :
              sorted.map(v => (
                <div key={v.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">{v.fecha}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.completada?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{v.completada?"Completada":"En progreso"}</span>
                      <button onClick={() => onDeleteVisita(v.id)} className="text-gray-300 hover:text-red-400">✕</button>
                    </div>
                  </div>
                  <p className="text-xs text-violet-600 font-medium">{UNIDADES[v.unidad]?.nombre}</p>
                  <p className="text-sm text-gray-700">S{v.seccion}: {UNIDADES[v.unidad]?.secciones[v.seccion]}</p>
                  <p className="text-xs text-gray-500">Fue: {v.profiles?.nombre}</p>
                  {v.comentario && <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">💬 {v.comentario}</p>}
                </div>
              ))}
          </>
        )}
      </div>
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
        <button onClick={() => setEditing(false)} className="text-xs text-gray-400">Cancelar</button>
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
        {hijo.edad && <p className="text-xs text-gray-400 mt-0.5">{hijo.edad} años</p>}
      </div>
      <button onClick={() => setEditing(true)} className="text-xs text-violet-500 font-medium hover:text-violet-700 flex-shrink-0">Editar</button>
    </div>
  );
}

function PerfilFamiliaScreen({ familia: familiaInicial, visitas, allProfiles, currentUser, isAdmin, onClose, onEdit, onDelete }) {
  const [familia, setFamilia] = useState(familiaInicial);
  const [showEdit, setShowEdit] = useState(false);
  const [conversaciones, setConversaciones] = useState([]);
  const [tab, setTab] = useState("conversaciones");
  const [nuevaNota, setNuevaNota] = useState("");
  const [showNuevaConv, setShowNuevaConv] = useState(false);
  const [showNuevaVisita, setShowNuevaVisita] = useState(false);

  useEffect(() => {
    supabase.from("conversaciones").select("*, profiles(nombre)")
      .eq("familia_id", familia.id).order("created_at", { ascending: false })
      .then(({ data }) => setConversaciones(data || []));
  }, [familia.id]);

  const handleSaveHijo = async (idx, hijoData) => {
    const nuevosHijos = (familia.hijos || []).map((h, i) => i === idx ? hijoData : h);
    const { data } = await supabase.from("familias").update({ hijos: nuevosHijos }).eq("id", familia.id).select().single();
    if (data) { setFamilia(data); onEdit(data); }
  };

  const handleDeleteConv = async (id) => {
    await supabase.from("conversaciones").delete().eq("id", id);
    setConversaciones(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveConv = async () => {
    if (!nuevaNota.trim()) return;
    const { data } = await supabase.from("conversaciones").insert({
      familia_id: familia.id, nota: nuevaNota.trim(), autor_id: currentUser.id,
    }).select("*, profiles(nombre)").single();
    if (data) setConversaciones(prev => [data, ...prev]);
    setNuevaNota(""); setShowNuevaConv(false);
  };

  const sortedVisitas = [...visitas].sort((a,b) => b.fecha.localeCompare(a.fecha));
  const hijos = (familia.hijos || []).map(h => typeof h === "string" ? { nombre: h, edad: "", curso: "Huevito" } : h);

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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg flex-shrink-0">{familia.nombre[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap"><span className="font-bold text-gray-900 text-lg">{familia.nombre}</span><Badge text={familia.grado} /></div>
            {familia.servicio && <p className="text-xs text-gray-500 mt-0.5">{familia.servicio}</p>}
          </div>
        </div>
        {familia.telefono && (
          <div className="mb-3">
            {isAdmin ? (
              <div className="flex gap-2">
                <a href={`https://wa.me/${familia.telefono.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-sm font-semibold">💬 WhatsApp</a>
                <a href={`tel:${familia.telefono}`} className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm font-semibold">📞 Llamar</a>
              </div>
            ) : null}
          </div>
        )}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { id:"conversaciones", label:`💬${conversaciones.length>0?` (${conversaciones.length})`:""}`},
            { id:"visitas", label:`📖${visitas.length>0?` (${visitas.length})`:""}`},
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t.id?"bg-white text-violet-700 shadow-sm":"text-gray-500"}`}>{t.label}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {familia.contacto2_nombre && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold flex-shrink-0">{familia.contacto2_nombre[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-800">{familia.contacto2_nombre}</span><Badge text={familia.contacto2_parentesco} /></div>
              {familia.contacto2_telefono && isAdmin && (
                <a href={`https://wa.me/${familia.contacto2_telefono.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-emerald-600 font-medium mt-0.5 block">💬 {familia.contacto2_telefono}</a>
              )}
            </div>
          </div>
        )}
        {hijos.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Hijos</p>
            {hijos.map((h, i) => <HijoCard key={i} hijo={h} onSave={(data) => handleSaveHijo(i, data)} />)}
          </div>
        )}
        {tab === "conversaciones" && (
          <div className="space-y-3">
            {showNuevaConv ? (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
                <textarea value={nuevaNota} onChange={e=>setNuevaNota(e.target.value)} rows={3} autoFocus placeholder="Escribe un mensaje..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
                <div className="flex gap-2">
                  <button onClick={handleSaveConv} disabled={!nuevaNota.trim()} className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40">Enviar</button>
                  <button onClick={() => { setShowNuevaConv(false); setNuevaNota(""); }} className="px-4 py-2.5 rounded-xl text-sm text-gray-500">Cancelar</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowNuevaConv(true)} className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold">+ Nuevo mensaje</button>
            )}
            {conversaciones.length === 0 ? <p className="text-center text-gray-400 py-8">Sin mensajes aún</p> :
              conversaciones.map(c => {
                const nombre = c.profiles?.nombre || "—";
                const fecha = new Date(c.created_at);
                const esHoy = fecha.toDateString() === new Date().toDateString();
                const hora = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                const fechaStr = esHoy ? hora : `${fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} ${hora}`;
                return (
                  <div key={c.id} className="flex gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs flex-shrink-0 mt-0.5">{nombre[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-gray-800">{nombre}</span>
                        <span className="text-xs text-gray-400">{fechaStr}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{c.nota}</p>
                    </div>
                    <button onClick={() => handleDeleteConv(c.id)} className="text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1 text-xs">✕</button>
                  </div>
                );
              })}
          </div>
        )}
        {tab === "visitas" && (
          <div className="space-y-3">
            {showNuevaVisita ? (
              <VisitaFormInline familiaId={familia.id} currentUser={currentUser} allProfiles={allProfiles}
                onSave={() => setShowNuevaVisita(false)} onCancel={() => setShowNuevaVisita(false)} />
            ) : (
              <button onClick={() => setShowNuevaVisita(true)} className="w-full py-3 bg-violet-600 text-white rounded-2xl text-sm font-semibold">+ Nueva visita</button>
            )}
            {sortedVisitas.length === 0 ? <p className="text-center text-gray-400 py-8">Sin visitas aún</p> :
              sortedVisitas.map(v => (
                <div key={v.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">{v.fecha}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.completada?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{v.completada?"Completada":"En progreso"}</span>
                  </div>
                  <p className="text-xs text-violet-600 font-medium">{UNIDADES[v.unidad]?.nombre}</p>
                  <p className="text-sm text-gray-700">S{v.seccion}: {UNIDADES[v.unidad]?.secciones[v.seccion]}</p>
                  <p className="text-xs text-gray-500">Fue: {v.profiles?.nombre}</p>
                  {v.comentario && <p className="text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">💬 {v.comentario}</p>}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VisitaFormInline({ familiaId, currentUser, allProfiles, onSave, onCancel }) {
  const [unidad, setUnidad] = useState(1);
  const [seccion, setSeccion] = useState(1);
  const [visitadorId, setVisitadorId] = useState(currentUser.id);
  const [completada, setCompletada] = useState(false);
  const [comentario, setComentario] = useState("");
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    setSaving(true);
    const { data } = await supabase.from("visitas").insert({
      familia_id: familiaId, fecha: new Date().toISOString().slice(0,10),
      unidad, seccion, visitador_id: visitadorId, completada, comentario: comentario || null,
    }).select("*, profiles(nombre)").single();
    if (data) onSave(data);
    setSaving(false);
  };
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
      <select value={visitadorId} onChange={e=>setVisitadorId(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white">
        {allProfiles.map(p => <option key={p.id} value={p.id}>{p.nombre}{p.id===currentUser.id?" (yo)":""}</option>)}
      </select>
      <div className="flex gap-2">{[1,2,3].map(u => (
        <button key={u} onClick={()=>{setUnidad(u);setSeccion(1);}} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${unidad===u?"bg-violet-600 text-white":"bg-gray-100 text-gray-600"}`}>{u}</button>
      ))}</div>
      <p className="text-xs text-violet-600 font-medium">{UNIDADES[unidad].nombre}</p>
      <div className="flex flex-wrap gap-1.5">{Object.keys(UNIDADES[unidad].secciones).map(s => (
        <button key={s} onClick={()=>setSeccion(Number(s))} className={`w-10 h-10 rounded-xl text-sm font-medium ${seccion===Number(s)?"bg-violet-600 text-white":"bg-gray-100 text-gray-600"}`}>{s}</button>
      ))}</div>
      <p className="text-xs text-gray-500 italic">{UNIDADES[unidad].secciones[seccion]}</p>
      <button onClick={()=>setCompletada(!completada)} className={`px-4 py-2 rounded-full text-sm font-medium ${completada?"bg-emerald-500 text-white":"bg-gray-100 text-gray-500"}`}>{completada?"✓ Completada":"En progreso"}</button>
      <textarea value={comentario} onChange={e=>setComentario(e.target.value)} rows={2} placeholder="Comentario..."
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" />
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="flex-1 bg-violet-600 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40">{saving?"Guardando...":"Guardar"}</button>
        <button onClick={onCancel} className="px-4 py-2.5 rounded-xl text-sm text-gray-500">Cancelar</button>
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
        {familia.servicio && <p className="text-xs text-gray-400 truncate mt-0.5">{familia.servicio}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {visitas.length > 0 && <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">{visitas.length}v</span>}
        <span className="text-gray-300 text-sm">›</span>
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

  if (showForm) return <FullScreen title="Nuevo voluntario" onBack={() => setShowForm(false)}><VoluntarioForm onSave={(v) => { onAdd(v); setShowForm(false); }} onCancel={() => setShowForm(false)} /></FullScreen>;
  if (editTarget) return <FullScreen title="Editar voluntario" onBack={() => setEditTarget(null)}><VoluntarioForm voluntario={editTarget} onSave={(v) => { onEdit(v); setEditTarget(null); }} onCancel={() => setEditTarget(null)} /></FullScreen>;

  return (
    <div className="space-y-4">
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
  if (showForm) return <FullScreen title="Nuevo ofrecimiento" onBack={() => setShowForm(false)}><OfrecimientoForm familias={familias} onSave={(o) => { onAdd(o); setShowForm(false); }} onCancel={() => setShowForm(false)} /></FullScreen>;
  return (
    <div className="space-y-4">
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
                {onDelete && <button onClick={() => onDelete(o.id)} className="text-gray-300 hover:text-red-400">✕</button>}
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
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-4 py-4">
        <p className="font-bold text-gray-900 mb-1">{t.descripcion}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {t.fecha ? <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">📅 {new Date(t.fecha+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short"})}</span>
            : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">📅 Por confirmar</span>}
          <span className="text-xs text-gray-500">· {t.quien}</span>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
          {t.necesita ? <div className="bg-amber-50 rounded-xl px-3 py-2.5"><p className="text-xs text-amber-600 font-medium mb-0.5">Necesita</p><p className="text-sm text-gray-700">{t.necesita}</p></div>
            : <p className="text-sm text-gray-400 italic">Sin necesidades indicadas</p>}
          <button onClick={onEdit} className="w-full py-2.5 rounded-xl text-sm text-violet-500 font-medium bg-violet-50 hover:bg-violet-100">Editar</button>
        </div>
      )}
    </div>
  );
}

function TalleresView({ talleres, onAdd, onEdit, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  if (showForm) return <FullScreen title="Nuevo taller" onBack={() => setShowForm(false)}><TallerForm onSave={(t) => { onAdd(t); setShowForm(false); }} onCancel={() => setShowForm(false)} /></FullScreen>;
  if (editTarget) return <FullScreen title="Editar taller" onBack={() => setEditTarget(null)}><TallerForm taller={editTarget} onSave={(t) => { onEdit(t); setEditTarget(null); }} onCancel={() => setEditTarget(null)} onDelete={(id) => { onDelete(id); setEditTarget(null); }} /></FullScreen>;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">🎨</span>
        <div><p className="text-sm font-semibold text-amber-800">Hacen falta {Math.max(0, 16 - talleres.length)} talleres</p><p className="text-xs text-amber-600">{talleres.length} de 16 registrados</p></div>
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

function CalendarioView({ ofrecimientos, talleres, familias, excursiones }) {
  const hoy = new Date();
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const diasEnMes = new Date(anio, mes+1, 0).getDate();
  const primerDia = new Date(anio, mes, 1).getDay();
  const offset = primerDia === 0 ? 6 : primerDia - 1;

  const eventos = [
    ...(ofrecimientos||[]).filter(o=>{const d=new Date(o.fecha+"T12:00:00");return d.getMonth()===mes&&d.getFullYear()===anio;}).map(o=>({...o,tipo:"ofrecimiento",dia:new Date(o.fecha+"T12:00:00").getDate()})),
    ...(talleres||[]).filter(t=>t.fecha).filter(t=>{const d=new Date(t.fecha+"T12:00:00");return d.getMonth()===mes&&d.getFullYear()===anio;}).map(t=>({...t,tipo:"taller",dia:new Date(t.fecha+"T12:00:00").getDate()})),
    ...(excursiones||[]).filter(e=>{const d=new Date(e.fecha+"T12:00:00");return d.getMonth()===mes&&d.getFullYear()===anio;}).map(e=>({...e,tipo:"excursion",dia:new Date(e.fecha+"T12:00:00").getDate()})),
  ];
  const porDia = {};
  eventos.forEach(e=>{ if(!porDia[e.dia]) porDia[e.dia]=[]; porDia[e.dia].push(e); });

  const celdas = [...Array(offset).fill(null), ...Array.from({length:diasEnMes},(_,i)=>i+1)];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
        <button onClick={()=>mes===0?[setMes(11),setAnio(a=>a-1)]:setMes(m=>m-1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 font-bold text-gray-600">‹</button>
        <p className="font-semibold text-gray-800">{MESES[mes]} {anio}</p>
        <button onClick={()=>mes===11?[setMes(0),setAnio(a=>a+1)]:setMes(m=>m+1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 font-bold text-gray-600">›</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100">{["Lu","Ma","Mi","Ju","Vi","Sá","Do"].map(d=><div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>)}</div>
        <div className="grid grid-cols-7">{celdas.map((dia,i)=>{
          const evs = dia?(porDia[dia]||[]):[];
          const esHoy = dia&&dia===hoy.getDate()&&mes===hoy.getMonth()&&anio===hoy.getFullYear();
          return <div key={i} className={`min-h-12 p-1 border-b border-r border-gray-50 ${!dia?"bg-gray-50":""}`}>
            {dia&&<><p className={`text-xs font-medium text-center mb-0.5 w-6 h-6 flex items-center justify-center rounded-full mx-auto ${esHoy?"bg-violet-600 text-white":"text-gray-600"}`}>{dia}</p>
            {evs.map((e,j)=><div key={j} className={`text-[10px] rounded px-1 py-0.5 mb-0.5 truncate ${e.tipo==="taller"?"bg-amber-100 text-amber-700":e.tipo==="excursion"?"bg-emerald-100 text-emerald-700":"bg-violet-100 text-violet-700"}`}>{e.tipo==="taller"?e.quien:e.tipo==="excursion"?e.titulo:(familias?.find(f=>f.id===e.familia_id)?.nombre||"—")}</div>)}</>}
          </div>;
        })}</div>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-violet-100"></div><span className="text-xs text-gray-500">Ofrecimiento</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-100"></div><span className="text-xs text-gray-500">Taller</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-100"></div><span className="text-xs text-gray-500">Excursión</span></div>
      </div>
      {eventos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Este mes</p>
          {[...eventos].sort((a,b)=>a.dia-b.dia).map((e,i)=>(
            <div key={i} className="bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100 flex items-center gap-3">
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${e.tipo==="taller"?"bg-amber-100 text-amber-700":e.tipo==="excursion"?"bg-emerald-100 text-emerald-700":"bg-violet-100 text-violet-700"}`}>{e.dia}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{e.tipo==="taller"?e.quien:e.tipo==="excursion"?e.titulo:(familias?.find(f=>f.id===e.familia_id)?.nombre||"—")}</p>
                <p className="text-xs text-gray-500 truncate">{e.tipo==="taller"?e.descripcion:e.tipo==="excursion"?e.descripcion:e.que}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${e.tipo==="taller"?"bg-amber-50 text-amber-600":e.tipo==="excursion"?"bg-emerald-50 text-emerald-600":"bg-violet-50 text-violet-600"}`}>{e.tipo==="taller"?"Taller":e.tipo==="excursion"?"Excursión":"Ofrecimiento"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExcursionCard({ excursion }) {
  const [expanded, setExpanded] = useState(false);
  const [apuntados, setApuntados] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("monitor");
  const [detalle, setDetalle] = useState("");
  const [saving, setSaving] = useState(false);

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
      <button onClick={handleExpand} className="w-full text-left px-4 py-4 flex items-center gap-3">
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
        <span className="text-gray-400 text-xs">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-3">
          {excursion.descripcion && <p className="text-sm text-gray-500">{excursion.descripcion}</p>}

          {monitores.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Monitores</p>
              <div className="space-y-1.5">{monitores.map(a => (
                <div key={a.id} className="flex items-center justify-between bg-blue-50 rounded-xl px-3 py-2">
                  <span className="text-sm font-medium text-gray-800">{a.nombre}</span>
                  <button onClick={() => handleEliminar(a.id)} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
                </div>
              ))}</div>
            </div>
          )}

          {actividades.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Actividades</p>
              <div className="space-y-1.5">{actividades.map(a => (
                <div key={a.id} className="bg-amber-50 rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">{a.nombre}</span>
                    <button onClick={() => handleEliminar(a.id)} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
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

function ExcursionesView() {
  const [excursiones, setExcursiones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("excursiones").select("*").order("fecha").then(({ data }) => {
      setExcursiones(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-center text-gray-400 py-8">Cargando...</p>;

  return (
    <div className="space-y-3">
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">🚌</span>
        <div>
          <p className="text-sm font-semibold text-emerald-800">Excursiones de julio</p>
          <p className="text-xs text-emerald-600">Todos los miércoles · Apúntate como monitor o propón una actividad</p>
        </div>
      </div>
      {excursiones.map(e => <ExcursionCard key={e.id} excursion={e} />)}
    </div>
  );
}

function ServiciosView({ talleres, ofrecimientos, familias, onAddTaller, onEditTaller, onDeleteTaller, onAddOfrecimiento, onDeleteOfrecimiento, initialTab }) {
  const [tab, setTab] = useState(initialTab || "ofrecimientos");
  useEffect(() => { if (initialTab) setTab(initialTab); }, [initialTab]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {[{id:"ofrecimientos",label:"Ofrecimientos"},{id:"talleres",label:"Talleres"},{id:"excursiones",label:"Excursiones"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${tab===t.id?"bg-white text-violet-700 shadow-sm":"text-gray-500"}`}>{t.label}</button>
        ))}
      </div>
      {tab==="ofrecimientos" && <OfrecimientosView ofrecimientos={ofrecimientos} familias={familias} onAdd={onAddOfrecimiento} onDelete={onDeleteOfrecimiento} />}
      {tab==="talleres" && <TalleresView talleres={talleres} onAdd={onAddTaller} onEdit={onEditTaller} onDelete={onDeleteTaller} />}
      {tab==="excursiones" && <ExcursionesView />}
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
            <div className="flex-1 min-w-0"><p className="font-semibold text-gray-800">{u.nombre}</p><p className="text-xs text-gray-400 truncate">{u.email}</p></div>
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

function NuevoRegistroScreen({ familias, allProfiles, currentUser, onSave, onCancel }) {
  const [tipo, setTipo] = useState("conversacion");
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
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNuevo, setShowNuevo] = useState(false);

  const cargar = async () => {
    const { data: convs } = await supabase.from("conversaciones")
      .select("*, profiles(nombre)").order("created_at", { ascending: false });
    const items = [
      ...(convs || []).map(c => ({ ...c, tipo: "conversacion", _sort: c.created_at })),
      ...visitas.map(v => ({ ...v, tipo: "visita", _sort: v.created_at || v.fecha + "T00:00:00" })),
    ].sort((a, b) => b._sort.localeCompare(a._sort));
    setFeed(items);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, [visitas.length]);

  const handleSave = (item) => {
    if (item.tipo === "visita") onAddVisita(item);
    setFeed(prev => [item, ...prev].sort((a,b) => b._sort.localeCompare(a._sort)));
    setShowNuevo(false);
  };

  const handleDelete = async (item) => {
    if (item.tipo === "conversacion") {
      await supabase.from("conversaciones").delete().eq("id", item.id);
    } else {
      await supabase.from("visitas").delete().eq("id", item.id);
    }
    setFeed(prev => prev.filter(x => !(x.id === item.id && x.tipo === item.tipo)));
  };

  if (showNuevo) return (
    <NuevoRegistroScreen familias={familias} allProfiles={allProfiles} currentUser={currentUser}
      onSave={handleSave} onCancel={() => setShowNuevo(false)} />
  );

  return (
    <div className="space-y-3">
      <button onClick={() => setShowNuevo(true)}
        className="w-full py-3.5 bg-violet-600 text-white rounded-2xl text-sm font-semibold hover:bg-violet-700 transition-all">
        + Nuevo registro
      </button>
      {loading ? (
        <div className="space-y-2.5">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100"></div>)}</div>
      ) : feed.length === 0 ? (
        <div className="text-center py-16"><p className="text-4xl mb-3">💬</p><p className="text-gray-400 text-sm">Sin registros aún</p></div>
      ) : (
        <div className="space-y-2.5">
          {feed.map((item) => {
            const familia = familias.find(f => f.id === item.familia_id);
            const esConv = item.tipo === "conversacion";
            const _s = item._sort || (esConv ? item.created_at : item.fecha);
            const fecha = new Date(_s);
            const esHoy = fecha.toDateString() === new Date().toDateString();
            const fechaStr = esHoy
              ? fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
              : fecha.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
            return (
              <div key={`${item.tipo}-${item.id}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  <button onClick={() => familia && onVerFamilia(familia)}
                    className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0 mt-0.5">
                    {(familia?.nombre || "?")[0]}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <button onClick={() => familia && onVerFamilia(familia)}
                        className="text-sm font-semibold text-gray-800 hover:text-violet-600 transition-colors">
                        {familia?.nombre || "—"}
                      </button>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${esConv?"bg-violet-100 text-violet-700":"bg-blue-100 text-blue-700"}`}>
                        {esConv?"💬 Conv.":"📖 Visita"}
                      </span>
                    </div>
                    {esConv ? (
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.nota}</p>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-700 font-medium">U{item.unidad} · S{item.seccion}</p>
                        <p className="text-xs text-gray-500 truncate">{UNIDADES[item.unidad]?.secciones[item.seccion]}</p>
                        {item.comentario && <p className="text-xs text-gray-400 mt-0.5 truncate">{item.comentario}</p>}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs text-gray-400">{fechaStr}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400">{item.profiles?.nombre || "—"}</span>
                      {!esConv && (
                        <><span className="text-gray-200">·</span>
                        <span className={`text-xs font-medium ${item.completada?"text-emerald-600":"text-amber-600"}`}>
                          {item.completada?"✓ Completada":"En progreso"}
                        </span></>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item)} className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0 mt-1 text-xs">✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


// ── PUBLIC APP ────────────────────────────────────────────────────────────────

function PublicApp({ talleres, ofrecimientos, familias, excursiones, onAddTaller, onEditTaller, onDeleteTaller, onAddOfrecimiento, onDeleteOfrecimiento, offline, onLogin }) {
  const [menu, setMenu] = useState("home");
  const [serviciosTab, setServiciosTab] = useState("ofrecimientos");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const hoy = new Date().toISOString().slice(0,10);
  const eventosHoy = [...(ofrecimientos||[]).filter(o=>o.fecha===hoy), ...(talleres||[]).filter(t=>t.fecha===hoy)];

  return (
    <>
      {showAvatarMenu && (
        <div className="fixed inset-0 z-50" onClick={() => setShowAvatarMenu(false)}>
          <div className="absolute top-16 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 w-56 overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-gray-50"><p className="text-xs text-gray-400">Campamento Bahá'í Madrid</p></div>
            <button onClick={() => { setShowAvatarMenu(false); onLogin(); }} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-violet-50 text-left">
              <span className="text-lg">🔑</span><div><p className="text-sm font-semibold text-gray-800">Iniciar sesión</p><p className="text-xs text-gray-400">Acceso para organizadores</p></div>
            </button>
          </div>
        </div>
      )}
      <div className="fixed inset-0 bg-gray-50 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-violet-500 font-semibold uppercase tracking-widest">Campamento Bahá'í</p>
            <button onClick={() => setShowAvatarMenu(!showAvatarMenu)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-violet-100 hover:text-violet-700 transition-colors"><span className="text-lg">👤</span></button>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{menu==="home"?"Inicio":"Servicios"}</h1>
          {offline && <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex items-center gap-2"><span className="text-sm">📶</span><p className="text-xs text-amber-700 font-medium">Sin conexión</p></div>}
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4">
          {menu==="home" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl p-5 text-white">
                <p className="text-sm opacity-80 mb-1">Campamento Urbano Comunitario</p>
                <h2 className="text-xl font-bold mb-0.5">¡Bienvenido! 👋</h2>
                <p className="text-sm opacity-70">6 – 31 julio · Centro Bahá'í de Estudios · Madrid</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setServiciosTab("ofrecimientos"); setMenu("servicios"); }} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:border-violet-200 transition-all active:scale-95">
                  <p className="text-2xl mb-2">🎁</p><p className="text-sm font-semibold text-gray-800">Ofrecimientos</p><p className="text-xs text-gray-400 mt-0.5">{ofrecimientos.length} registrados</p>
                </button>
                <button onClick={() => { setServiciosTab("talleres"); setMenu("servicios"); }} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:border-violet-200 transition-all active:scale-95">
                  <p className="text-2xl mb-2">🎨</p><p className="text-sm font-semibold text-gray-800">Talleres</p><p className="text-xs text-gray-400 mt-0.5">{talleres.length} registrados</p>
                </button>
              </div>
              {eventosHoy.length > 0 && (
                <div className="bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3">
                  <p className="text-sm font-semibold text-violet-800 mb-2">📅 Hoy</p>
                  {eventosHoy.map((e,i) => <p key={i} className="text-sm text-violet-700">{e.quien||e.que}</p>)}
                </div>
              )}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 pt-4 pb-2">Calendario</p>
                <div className="px-4 pb-4">
                  <CalendarioView ofrecimientos={ofrecimientos} talleres={talleres} familias={familias} excursiones={excursiones} />
                </div>
              </div>
            </div>
          )}
          {menu==="servicios" && (
            <ServiciosView talleres={talleres} ofrecimientos={ofrecimientos} familias={familias}
              onAddTaller={onAddTaller} onEditTaller={onEditTaller} onDeleteTaller={onDeleteTaller}
              onAddOfrecimiento={onAddOfrecimiento} onDeleteOfrecimiento={onDeleteOfrecimiento}
              initialTab={serviciosTab} />
          )}
        </div>
        <div className="bg-white border-t border-gray-100 flex-shrink-0 safe-bottom z-10">
          <div className="flex max-w-lg mx-auto">
            {[{id:"home",label:"Inicio",icon:"🏠"},{id:"servicios",label:"Servicios",icon:"🎨"}].map(item=>(
              <button key={item.id} onClick={() => setMenu(item.id)} className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${(menu===item.id||(item.id==="confirmados"&&menu==="participantes"))?"text-violet-600":"text-gray-400"}`}>
                <span className="text-xl">{item.icon}</span><span className="text-xs font-medium">{item.label}</span>
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
  const [showNuevaFamilia, setShowNuevaFamilia] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [detalleTarget, setDetalleTarget] = useState(null);
  const [familiaPerfilTarget, setFamiliaPerfilTarget] = useState(null);
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
      const [{ data: talls }, { data: ofrecs }, { data: fams }, { data: excurs }] = await Promise.all([
        supabase.from("talleres").select("*").order("created_at", { ascending: false }),
        supabase.from("ofrecimientos").select("*").order("fecha", { ascending: true }),
        supabase.from("familias").select("id, nombre, grado"),
        supabase.from("excursiones").select("*").order("fecha"),
      ]);
      setTalleres(talls || []);
      setOfrecimientos(ofrecs || []);
      setFamilias(fams || []);
      setExcursiones(excurs || []);
      setExcursiones(excurs || []);
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
        onAddTaller={handleAddTaller} onEditTaller={handleEditTaller} onDeleteTaller={handleDeleteTaller}
        onAddOfrecimiento={handleAddOfrecimiento} onDeleteOfrecimiento={handleDeleteOfrecimiento}
        offline={offline} onLogin={() => setShowLogin(true)}
      />
    );
  }

  // PENDING APPROVAL
  if (profile && !profile.aprobado && !isAdmin) return <PendienteAprobacion email={user.email} onLogout={handleLogout} />;

  // LOGGED IN APP
  const NAV_ITEMS = [
    { id: "home", label: "Inicio", icon: "🏠" },
    { id: "actividad", label: "Actividad", icon: "💬" },
    { id: "confirmados", label: "Familias", icon: "👨‍👩‍👧" },
    { id: "voluntarios", label: "Voluntarios", icon: "🙌" },
    { id: "servicios", label: "Servicios", icon: "🎨" },
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
      {detalleTarget && (
        <DetalleScreen familia={detalleTarget} visitas={visitas.filter(v=>v.familia_id===detalleTarget.id)}
          currentUser={user} allProfiles={allProfiles} onAddVisita={handleAddVisita} onDeleteVisita={handleDeleteVisita}
          onClose={() => setDetalleTarget(null)} isAdmin={isAdmin} />
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
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
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
        <div className="bg-white border-b border-gray-100 px-4 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-violet-500 font-semibold uppercase tracking-widest">Campamento Urbano Comunitario</p>
            <button onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-violet-100 text-violet-700 font-bold text-sm hover:bg-violet-200 transition-colors">
              {profile?.nombre?.[0]?.toUpperCase()||"?"}
            </button>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {menu==="home"?"Inicio":menu==="actividad"?"Actividad":menu==="voluntarios"?"Voluntarios":menu==="servicios"?"Servicios":"Familias"}
          </h1>
          {offline && <div className="mt-1 text-xs text-amber-600">📶 Sin conexión</div>}
          {menu==="confirmados" && (
            <div className="flex gap-1 mt-3 bg-gray-100 rounded-xl p-1">
              {[{id:"familias",label:"Familias"},{id:"recientes",label:"Conversaciones"},{id:"participantes",label:"Participantes"}].map(t=>(
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
                  {label:"Talleres",value:`${talleres.length}/16`,icon:"🎨",m:"servicios"},
                ].map(s=>(
                  <button key={s.label} onClick={() => setMenu(s.m)} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100 hover:border-violet-200 transition-all active:scale-95">
                    <p className="text-xl mb-1">{s.icon}</p><p className="text-lg font-bold text-violet-600">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p>
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 pt-4 pb-2">Acceso rápido</p>
                {[
                  {label:"Familias confirmadas",icon:"👨‍👩‍👧",m:"confirmados",t:"familias"},
                  {label:"Participantes",icon:"🧒",m:"confirmados",t:"participantes"},
                  {label:"Conversaciones recientes",icon:"💬",m:"confirmados",t:"recientes"},
                ].map((item,i)=>(
                  <button key={i} onClick={() => { setMenu(item.m); if(item.t) setTab(item.t); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-t border-gray-50 text-left">
                    <span className="text-lg">{item.icon}</span><span className="text-sm text-gray-700 font-medium">{item.label}</span><span className="ml-auto text-gray-300">›</span>
                  </button>
                ))}
              </div>
              {talleres.length < 16 && (
                <button onClick={() => setMenu("servicios")} className="w-full bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-3 text-left">
                  <span className="text-xl">⚠️</span><div><p className="text-sm font-semibold text-amber-800">Faltan {16-talleres.length} talleres</p><p className="text-xs text-amber-600">Toca para ir a Servicios</p></div><span className="ml-auto text-amber-300">›</span>
                </button>
              )}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 pt-4 pb-2">Calendario</p>
                <div className="px-4 pb-4">
                  <CalendarioView ofrecimientos={ofrecimientos} talleres={talleres} familias={familias} excursiones={excursiones} />
                </div>
              </div>
            </div>
          )}

          {/* FAMILIAS */}
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
                    onAddOfrecimiento={handleAddOfrecimiento} onVerDetalle={setDetalleTarget} />
                ))}
                {familiasFiltradas.length===0 && <p className="text-center text-gray-400 py-8">Sin resultados</p>}
              </div>
            </>
          )}

          {/* CONVERSACIONES RECIENTES */}
          {menu==="confirmados" && tab==="recientes" && (
            <RecientesView visitas={visitas} familias={familias} onVerPerfil={(f) => setDetalleTarget(f)} />
          )}

          {/* PARTICIPANTES */}
          {menu==="confirmados" && tab==="participantes" && <ParticipantesView familias={familias} />}

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
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${(menu===item.id||(item.id==="confirmados"&&menu==="participantes"))?"text-violet-600":"text-gray-400"}`}>
                <span className="text-xl">{item.icon}</span><span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── RECIENTES Y PARTICIPANTES ─────────────────────────────────────────────────

function RecientesView({ visitas, familias, onVerPerfil }) {
  const [conversaciones, setConversaciones] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      supabase.from("conversaciones").select("*, profiles(nombre)").order("created_at", { ascending: false })
        .then(({ data }) => { setConversaciones(data || []); setLoaded(true); });
    }
  }, [loaded]);

  const feed = [
    ...visitas.map(v => ({ ...v, tipo: "visita", _sort: v.created_at || v.fecha })),
    ...conversaciones.map(c => ({ ...c, tipo: "conversacion", _sort: c.created_at })),
  ].sort((a,b) => b._sort.localeCompare(a._sort));

  return (
    <div className="space-y-3">
      {feed.length === 0 ? <p className="text-center text-gray-400 py-12">Sin actividad</p> :
        feed.map(item => {
          const familia = familias.find(f => f.id === item.familia_id);
          const esVisita = item.tipo === "visita";
          const preview = esVisita ? `U${item.unidad} · S${item.seccion} · ${UNIDADES[item.unidad]?.secciones[item.seccion]}` : item.nota;
          const fecha = esVisita ? item.fecha : new Date(item.created_at).toLocaleDateString("es-ES");
          return (
            <button key={item.id} onClick={() => familia && onVerPerfil(familia)} className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3.5 active:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${esVisita?"bg-violet-100 text-violet-700":"bg-amber-100 text-amber-700"}`}>{esVisita?"📖 Visita":"💬 Conversación"}</span>
                {familia && <Badge text={familia.grado} />}
              </div>
              <p className="text-sm text-gray-700 line-clamp-2 mb-1.5">{preview}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{fecha}</span>
                <span className="text-gray-200">·</span>
                <span className="text-xs font-medium text-gray-600">{familia?.nombre}</span>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-400">{item.profiles?.nombre}</span>
              </div>
            </button>
          );
        })}
    </div>
  );
}

function ParticipantesView({ familias }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [showFiltro, setShowFiltro] = useState(false);

  const participantes = familias.flatMap(f =>
    (f.hijos || []).map(h => ({ ...(typeof h==="string"?{nombre:h,edad:"",curso:""}:h), madre: f.nombre }))
  ).filter(p => {
    const q = busqueda.toLowerCase();
    const matchQ = !q || p.nombre?.toLowerCase().includes(q) || p.madre?.toLowerCase().includes(q);
    const matchF = filtro==="Todos" || p.curso===filtro;
    return matchQ && matchF;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input type="text" placeholder="Buscar participante..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
        <div className="relative">
          <button onClick={() => setShowFiltro(!showFiltro)}
            className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${filtro!=="Todos"?"bg-violet-600 text-white border-violet-600":"bg-white text-gray-600 border-gray-200"}`}>
            🔽 {filtro==="Todos"?"Filtrar":filtro}
          </button>
          {showFiltro && (
            <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-gray-100 z-20 w-40 overflow-hidden">
              {["Todos",...CURSOS].map(c=>(
                <button key={c} onClick={() => { setFiltro(c); setShowFiltro(false); }}
                  className={`w-full text-left px-4 py-3 text-sm ${filtro===c?"bg-violet-50 text-violet-700 font-semibold":"text-gray-600 hover:bg-gray-50"}`}>{c}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      {participantes.length === 0 ? <p className="text-center text-gray-400 py-12">Sin participantes</p> : (
        <div className="space-y-2.5">{participantes.map((p,i)=>(
          <div key={i} className="bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">{(p.nombre||"?")[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-gray-800">{p.nombre||"—"}</span>{p.curso&&<Badge text={p.curso}/>}</div>
              <div className="flex items-center gap-2 mt-0.5">{p.edad&&<span className="text-xs text-gray-400">{p.edad} años</span>}<span className="text-xs text-gray-400">· {p.madre}</span></div>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
