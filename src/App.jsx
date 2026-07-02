import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uufznuiclxuevcpznwll.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1ZnpudWljbHh1ZXZjcHpud2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDA4NjIsImV4cCI6MjA5ODI3Njg2Mn0.cqi5XePwSu7q192PZ2L15hOoRqmMvbQOpO3uZ8qwHvU"
);

const UNIDADES = {
  1: {
    nombre: "Comprensión de  los Escritos  bahá'ís",
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

const FAMILIAS = [
  { id: "maximo", nombre: "Máximo", hijos: ["Izac (5 años)"], grado: "Huevito", servicio: "Presente todo el campus" },
  { id: "aurora", nombre: "Aurora", hijos: ["Amin (5 años)"], grado: "Huevito", servicio: "Presente 3 semanas" },
  { id: "maryorie", nombre: "Maryorie", hijos: ["Meghan (10 años)", "Hijo (4 años)"], grado: "Huevito / Grado 3", servicio: "Visitas y oraciones" },
  { id: "richel", nombre: "Richel", hijos: ["Hijo (edad por confirmar)"], grado: "Grado 1", servicio: "Por confirmar" },
  { id: "rosalyn", nombre: "Rosalyn", hijos: ["Samuel (6 años)", "Zafia Elise (9 años)"], grado: "Grado 1 / Grado 2", servicio: "Limpieza una vez a la semana" },
  { id: "josephine", nombre: "Joséphine", hijos: ["Marc (8 años)"], grado: "Grado 2", servicio: "No puede colaborar en campus" },
  { id: "kristine", nombre: "Kristine", hijos: ["Kyrie (8 años)"], grado: "Grado 2", servicio: "No puede colaborar en campus" },
  { id: "janelle", nombre: "Janelle", hijos: ["Jerran (8 años)"], grado: "Grado 2", servicio: "Taller" },
  { id: "miriam", nombre: "Miriam", hijos: ["Daniel (11 años)"], grado: "Grado 3", servicio: "No puede colaborar en campus" },
  { id: "mercedes", nombre: "Mercedes", hijos: ["Dariel Valentín (11 años)"], grado: "Grado 3", servicio: "Limpieza tarde/noche" },
  { id: "marializ", nombre: "María Liz", hijos: ["Bruno Rafael (13 años)"], grado: "Prejuvenil", servicio: "Limpieza" },
  { id: "marlaainhoa", nombre: "Marla Ainhoa", hijos: ["Ángel (14 años)"], grado: "Prejuvenil", servicio: "Invitar familiar joven como voluntario" },
  { id: "ismael", nombre: "Ismael", hijos: [], grado: "Voluntario", servicio: "Ayudar en todo" },
];

const GRADO_COLOR = {
  "Huevito": "bg-blue-100 text-blue-700",
  "Grado 1": "bg-green-100 text-green-700",
  "Grado 2": "bg-orange-100 text-orange-700",
  "Grado 3": "bg-red-100 text-red-700",
  "Prejuvenil": "bg-purple-100 text-purple-700",
  "Voluntario": "bg-gray-100 text-gray-700",
};

function Badge({ text }) {
  const base = text.split(" / ")[0];
  const cls = GRADO_COLOR[base] || "bg-gray-100 text-gray-600";
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{text}</span>;
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
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Correo o contraseña incorrectos");
    else onAuth(data.user);
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!nombre.trim()) { setError("Escribe tu nombre"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nombre } }
    });
    if (error) setError(error.message);
    else { setSuccess("¡Cuenta creada! Ya puedes iniciar sesión."); setMode("login"); }
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
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); setSuccess(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode===m?"bg-white text-violet-700 shadow-sm":"text-gray-500"}`}>
                {m==="login"?"Entrar":"Crear cuenta"}
              </button>
            ))}
          </div>
          {mode==="register" && (
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
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          {success && <p className="text-emerald-600 text-sm bg-emerald-50 rounded-xl px-3 py-2">{success}</p>}
          <button onClick={mode==="login"?handleLogin:handleRegister} disabled={loading}
            className="w-full bg-violet-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 transition-all">
            {loading?"Un momento...":mode==="login"?"Entrar":"Crear cuenta"}
          </button>
        </div>
      </div>
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

function FamiliaCard({ familia, visitas, currentUser, allProfiles, onAddVisita, onDeleteVisita }) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const sorted = [...visitas].sort((a,b)=>b.fecha.localeCompare(a.fecha));
  const ultima = sorted[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={()=>setExpanded(!expanded)}
        className="w-full text-left px-4 py-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold flex-shrink-0">
          {familia.nombre[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-800">{familia.nombre}</span>
            <Badge text={familia.grado} />
          </div>
          {familia.hijos.length > 0 && <p className="text-xs text-gray-500 truncate mt-0.5">{familia.hijos.join(" · ")}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {visitas.length > 0 && (
            <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">
              {visitas.length} visita{visitas.length!==1?"s":""}
            </span>
          )}
          <span className="text-gray-400 text-xs">{expanded?"▲":"▼"}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-50">
          <div className="pt-3">
            <p className="text-xs text-gray-400 mb-1">Colaboración</p>
            <p className="text-sm text-gray-700">{familia.servicio}</p>
          </div>
          {ultima && (
            <div className="bg-violet-50 rounded-xl px-3 py-2.5">
              <p className="text-xs text-violet-500 mb-0.5 font-medium">Última visita</p>
              <p className="text-sm text-gray-700">{ultima.fecha} · U{ultima.unidad} S{ultima.seccion} · {ultima.profiles?.nombre}</p>
            </div>
          )}
          {sorted.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Historial</p>
              {sorted.map(v => <VisitaCard key={v.id} visita={v} onDelete={()=>onDeleteVisita(v.id)} />)}
            </div>
          )}
          {showForm ? (
            <VisitaForm familiaId={familia.id} currentUser={currentUser} allProfiles={allProfiles}
              onSave={(v)=>{onAddVisita(v);setShowForm(false);}} onCancel={()=>setShowForm(false)} />
          ) : (
            <button onClick={()=>setShowForm(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-violet-200 text-violet-500 text-sm hover:border-violet-400 hover:bg-violet-50 transition-all font-semibold">
              + Registrar visita
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ResumenView({ visitas }) {
  const total = visitas.length;
  const completadas = visitas.filter(v=>v.completada).length;
  const familiasCon = [...new Set(visitas.map(v=>v.familia_id))].length;
  const porFamilia = FAMILIAS.map(f=>({...f,visitas:visitas.filter(v=>v.familia_id===f.id)})).filter(f=>f.visitas.length>0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[{label:"Visitas",value:total},{label:"Completadas",value:completadas},{label:"Familias",value:familiasCon}].map(s=>(
          <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-violet-600">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      {porFamilia.length===0 ? (
        <div className="text-center py-12 text-gray-400">Aún no hay visitas registradas</div>
      ) : (
        <div className="space-y-3">
          {porFamilia.map(f=>(
            <div key={f.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{f.nombre}</span>
                  <Badge text={f.grado} />
                </div>
                <span className="text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full font-medium">
                  {f.visitas.length} visita{f.visitas.length!==1?"s":""}
                </span>
              </div>
              {f.visitas.sort((a,b)=>b.fecha.localeCompare(a.fecha)).map(v=>(
                <div key={v.id} className="bg-gray-50 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{v.fecha}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.completada?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>
                      {v.completada?"Completada":"En progreso"}
                    </span>
                  </div>
                  <p className="text-xs text-violet-600">U{v.unidad} · S{v.seccion} · {UNIDADES[v.unidad]?.secciones[v.seccion]}</p>
                  <p className="text-xs text-gray-500">Fue: {v.profiles?.nombre}</p>
                  {v.comentario && <p className="text-xs text-gray-400 italic">💬 {v.comentario}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [tab, setTab] = useState("familias");
  const [busqueda, setBusqueda] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("Todos");
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
    const [{ data: prof }, { data: profs }, { data: vis }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", u.id).single(),
      supabase.from("profiles").select("*"),
      supabase.from("visitas").select("*, profiles(nombre)"),
    ]);
    setProfile(prof);
    setAllProfiles(profs || []);
    setVisitas(vis || []);
    setLoading(false);
  };

  const handleAddVisita = (v) => setVisitas(prev => [...prev, v]);
  const handleDeleteVisita = async (id) => {
    await supabase.from("visitas").delete().eq("id", id);
    setVisitas(prev => prev.filter(v => v.id !== id));
  };
  const handleLogout = async () => { await supabase.auth.signOut(); };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-violet-400">Cargando...</p>
    </div>
  );

  if (!user) return <AuthScreen onAuth={(u) => initUser(u)} />;

  const grados = ["Todos","Huevito","Grado 1","Grado 2","Grado 3","Prejuvenil","Voluntario"];
  const familiasFiltradas = FAMILIAS.filter(f => {
    const q = busqueda.toLowerCase();
    const matchQ = !q || f.nombre.toLowerCase().includes(q) || f.hijos.some(h=>h.toLowerCase().includes(q));
    const matchG = filtroGrado==="Todos" || f.grado.includes(filtroGrado);
    return matchQ && matchG;
  });

  return (
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
          {[{id:"familias",label:"Familias"},{id:"resumen",label:"Resumen"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t.id?"bg-white text-violet-700 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {tab==="familias" && (
          <>
            <input type="text" placeholder="Buscar familia o hijo..." value={busqueda} onChange={e=>setBusqueda(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white" />
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {grados.map(g=>(
                <button key={g} onClick={()=>setFiltroGrado(g)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filtroGrado===g?"bg-violet-600 text-white":"bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>
                  {g}
                </button>
              ))}
            </div>
            <div className="space-y-2.5">
              {familiasFiltradas.map(f=>(
                <FamiliaCard key={f.id} familia={f} visitas={visitas.filter(v=>v.familia_id===f.id)}
                  currentUser={user} allProfiles={allProfiles}
                  onAddVisita={handleAddVisita} onDeleteVisita={handleDeleteVisita} />
              ))}
              {familiasFiltradas.length===0 && <p className="text-center text-gray-400 py-8">Sin resultados</p>}
            </div>
          </>
        )}
        {tab==="resumen" && <ResumenView visitas={visitas} />}
      </div>
    </div>
  );
}
