import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import QuestionInspector from './QuestionInspector'

const T = {
  forest:    '#0f2a4a',
  pine:      '#1a3f6b',
  emerald:   '#2563a8',
  mist:      '#e8f2fb',
  surface:   '#ffffff',
  text:      '#0f1a2e',
  textMuted: '#4a6580',
  border:    '#cbd5e1',
  lime:      '#60a5d4',
  danger:    '#dc2626',
  dangerBg:  '#fef2f2',
  success:   '#16a34a',
  successBg: '#f0fdf4',
}

// Mismo umbral usado en Areas.jsx / Topicos.jsx — solo para mostrar
// un indicador visual de "ya visible para estudiantes" en las estadísticas.
const UMBRAL_DISPONIBLE = 20

// Mapa de áreas → tópicos válidos, usado para los selects del formulario
// (evita errores de tipeo que hacen que una pregunta "desaparezca").
// Si agregan un área o tópico nuevo, actualícenlo aquí y en Areas.jsx/Topicos.jsx.
const AREA_TOPICO_MAP = {
  fisiologia: {
    nombre: 'Fisiología',
    topicos: [
      { id: 'fisiologia_celular',  nombre: 'Fisiología Celular' },
      { id: 'fisiologia_nerviosa', nombre: 'Fisiología Nerviosa' },
      { id: 'fisiologia_renal',    nombre: 'Fisiología Renal' },
    ]
  },
  fisiopatologia: {
    nombre: 'Fisiopatología',
    topicos: [
      { id: 'reumatologia',      nombre: 'Reumatología' },
      { id: 'nefrologia',        nombre: 'Nefrología' },
      { id: 'gastroenterologia', nombre: 'Gastroenterología' },
    ]
  },
  anatomia: {
    nombre: 'Anatomía',
    topicos: [
      { id: 'anatomia_cardiovascular', nombre: 'Cardiovascular' },
    ]
  },
  histologia: {
    nombre: 'Histología',
    topicos: [
      { id: 'histologia_cardiovascular', nombre: 'Cardiovascular' },
    ]
  },
  embriologia: {
    nombre: 'Embriología',
    topicos: [
      { id: 'embriologia_cardiovascular', nombre: 'Cardiovascular' },
      { id: 'embriologia_renal',          nombre: 'Renal' },
    ]
  },
  medicina_interna: {
    nombre: 'Medicina Interna',
    topicos: [
      { id: 'hematologia', nombre: 'Hematología' },
      { id: 'neurologia',  nombre: 'Neurología' },
    ]
  },
}

const CAMPO_VACIO = {
  id: null,
  area: '',
  topico: '',
  subtopico: '',
  enfoque: '',
  enunciado: '',
  opcion_a: '',
  opcion_b: '',
  opcion_c: '',
  opcion_d: '',
  opcion_e: '',
  opcion_f: '',
  respuesta_correcta: 'A',
  acotacion: '',
  imagen_pregunta: '',
  imagen_solucion: '',
  comentario_general: '',
  explicacion_opciones: '',
  objetivo_educativo: '',
  bibliografia: '',
}

const PAGE_SIZE = 15

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: `1.5px solid ${T.border}`, fontSize: '0.9rem', color: T.text,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}
const labelStyle = {
  display: 'block', fontSize: '0.8rem', fontWeight: '600', color: T.forest, marginBottom: '5px',
}
const fieldWrap = { marginBottom: '1rem' }

export default function AdminPanel() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('stats')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.mist, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .tab-btn {
          background: transparent; border: none; padding: 10px 18px;
          font-size: 0.88rem; font-weight: 600; color: rgba(255,255,255,0.6);
          cursor: pointer; font-family: inherit; border-bottom: 2px solid transparent;
          transition: color 0.15s, border-color 0.15s;
        }
        .tab-btn.active { color: white; border-bottom-color: #60a5d4; }
        .tab-btn:hover:not(.active) { color: rgba(255,255,255,0.85); }
        .btn-primary {
          background-color: #2563a8; color: white; border: none;
          padding: 10px 20px; border-radius: 8px; font-size: 0.88rem;
          font-weight: 700; cursor: pointer; font-family: inherit;
        }
        .btn-primary:hover { background-color: #1a3f6b; }
        .btn-primary:disabled { opacity: 0.6; cursor: default; }
        .btn-sec {
          background: white; color: #4a6580; border: 1.5px solid #cbd5e1;
          padding: 10px 18px; border-radius: 8px; font-size: 0.85rem;
          cursor: pointer; font-family: inherit;
        }
        .btn-sec:hover { border-color: #2563a8; color: #0f2a4a; }
        .btn-danger {
          background: #fef2f2; color: #dc2626; border: 1.5px solid #fca5a5;
          padding: 6px 12px; border-radius: 6px; font-size: 0.78rem;
          font-weight: 600; cursor: pointer; font-family: inherit;
        }
        .btn-danger:hover { background: #fee2e2; }
        .btn-edit {
          background: #eff6ff; color: #1a3f6b; border: 1.5px solid #bfdbfe;
          padding: 6px 12px; border-radius: 6px; font-size: 0.78rem;
          font-weight: 600; cursor: pointer; font-family: inherit;
        }
        .btn-edit:hover { background: #dbeafe; }
        table.admin-tabla { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        table.admin-tabla th {
          text-align: left; padding: 10px 12px; background: #f1f5f9;
          color: #475569; font-weight: 700; font-size: 0.75rem;
          text-transform: uppercase; letter-spacing: 0.03em;
          border-bottom: 1.5px solid #e2e8f0;
        }
        table.admin-tabla td {
          padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #0f1a2e; vertical-align: top;
        }
        details.stats-area summary {
          cursor: pointer; font-weight: 800; color: #0f2a4a; font-size: 1rem;
          padding: 12px 0; list-style: none;
        }
        details.stats-area summary::-webkit-details-marker { display: none; }
        details.stats-topico summary {
          cursor: pointer; font-weight: 600; color: #1a3f6b; font-size: 0.9rem;
          padding: 8px 0 8px 1.25rem; list-style: none;
        }
        details.stats-topico summary::-webkit-details-marker { display: none; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 2.5rem', height: '58px', backgroundColor: T.forest,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="High Yields" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'white', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.06em' }}>PANEL ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`tab-btn${tab === 'stats' ? ' active' : ''}`} onClick={() => setTab('stats')}>Estadísticas</button>
          <button className={`tab-btn${tab === 'crud' ? ' active' : ''}`} onClick={() => setTab('crud')}>Gestionar preguntas</button>
          <button className={`tab-btn${tab === 'inspector' ? ' active' : ''}`} onClick={() => setTab('inspector')}>Inspector</button>
        </div>
        <button
          onClick={() => navigate('/areas')}
          style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)', padding: '7px 16px', borderRadius: '7px', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ← Volver a la app
        </button>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        {tab === 'stats' && <StatsTab />}
        {tab === 'crud' && <CrudTab />}
        {tab === 'inspector' && (
          <div style={{ margin: '-2.5rem -2rem' }}>
            <QuestionInspector />
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// PESTAÑA: ESTADÍSTICAS
// ─────────────────────────────────────────────────────────
function StatsTab() {
  const [estructura, setEstructura] = useState(null)
  const [totalGeneral, setTotalGeneral] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { cargar() }, [])

  const cargar = async () => {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.from('preguntas').select('area, topico, subtopico')

    if (err) {
      setError('No se pudo cargar. Revisa que la tabla admins tenga tu correo y que corriste el script SQL.')
      setLoading(false)
      return
    }

    const est = {}
    data.forEach(row => {
      const area = row.area || '(sin área)'
      const topico = row.topico || '(sin tópico)'
      const subtopico = row.subtopico || '(sin subtópico)'
      if (!est[area]) est[area] = { total: 0, topicos: {} }
      est[area].total++
      if (!est[area].topicos[topico]) est[area].topicos[topico] = { total: 0, subtopicos: {} }
      est[area].topicos[topico].total++
      est[area].topicos[topico].subtopicos[subtopico] = (est[area].topicos[topico].subtopicos[subtopico] || 0) + 1
    })

    setEstructura(est)
    setTotalGeneral(data.length)
    setLoading(false)
  }

  if (loading) return <p style={{ color: T.textMuted }}>Cargando estadísticas…</p>
  if (error) return <p style={{ color: T.danger }}>{error}</p>

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: T.forest, margin: '0 0 4px' }}>Estadísticas</h1>
          <p style={{ fontSize: '0.85rem', color: T.textMuted, margin: 0 }}>
            {totalGeneral} preguntas en total · un tópico se muestra como "Disponible" a estudiantes desde las {UMBRAL_DISPONIBLE} preguntas
          </p>
        </div>
        <button className="btn-sec" onClick={cargar}>Actualizar</button>
      </div>

      <div style={{ backgroundColor: T.surface, borderRadius: '14px', border: `1px solid ${T.border}`, padding: '0.5rem 1.5rem' }}>
        {Object.entries(estructura).sort((a, b) => b[1].total - a[1].total).map(([area, dataArea]) => (
          <details key={area} className="stats-area" style={{ borderBottom: `1px solid ${T.border}` }}>
            <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{AREA_TOPICO_MAP[area]?.nombre || area}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: T.emerald, background: '#dbeafe', padding: '2px 10px', borderRadius: '999px' }}>
                {dataArea.total} preguntas
              </span>
            </summary>
            <div style={{ paddingBottom: '0.5rem' }}>
              {Object.entries(dataArea.topicos).sort((a, b) => b[1].total - a[1].total).map(([topico, dataTopico]) => {
                const disponible = dataTopico.total >= UMBRAL_DISPONIBLE
                return (
                  <details key={topico} className="stats-topico">
                    <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: disponible ? T.success : '#cbd5e1', flexShrink: 0 }} />
                        {topico}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: disponible ? T.success : T.textMuted }}>
                        {dataTopico.total}
                      </span>
                    </summary>
                    <div style={{ paddingLeft: '2.5rem', paddingBottom: '10px' }}>
                      {Object.entries(dataTopico.subtopicos).sort((a, b) => b[1] - a[1]).map(([subtopico, count]) => (
                        <div key={subtopico} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.82rem', color: T.textMuted, maxWidth: '420px' }}>
                          <span>{subtopico}</span>
                          <span style={{ fontWeight: '600', color: T.text }}>{count}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// PESTAÑA: CRUD DE PREGUNTAS
// ─────────────────────────────────────────────────────────
function CrudTab() {
  const [vista, setVista] = useState('lista') // 'lista' | 'form'
  const [lista, setLista] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pagina, setPagina] = useState(0)
  const [loadingLista, setLoadingLista] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroArea, setFiltroArea] = useState('')
  const [form, setForm] = useState(CAMPO_VACIO)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => { cargarLista() }, [pagina, filtroArea])

  const cargarLista = async () => {
    setLoadingLista(true)
    let query = supabase
      .from('preguntas')
      .select('id, area, topico, subtopico, enunciado, respuesta_correcta', { count: 'exact' })

    if (filtroArea) query = query.eq('area', filtroArea)

    if (busqueda.trim()) {
      const num = parseInt(busqueda.trim())
      if (!isNaN(num) && String(num) === busqueda.trim()) {
        query = query.eq('id', num)
      } else {
        query = query.ilike('enunciado', `%${busqueda.trim()}%`)
      }
    }

    const from = pagina * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.order('id', { ascending: false }).range(from, to)

    const { data, error, count } = await query
    if (!error) {
      setLista(data || [])
      setTotalCount(count || 0)
    }
    setLoadingLista(false)
  }

  const buscar = () => {
    setPagina(0)
    cargarLista()
  }

  const abrirNueva = () => {
    setForm(CAMPO_VACIO)
    setMensaje('')
    setVista('form')
  }

  const abrirEdicion = async (id) => {
    setMensaje('')
    const { data, error } = await supabase.from('preguntas').select('*').eq('id', id).single()
    if (!error && data) {
      setForm(data)
      setVista('form')
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm(`¿Eliminar la pregunta #${id}? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('preguntas').delete().eq('id', id)
    if (error) {
      alert('No se pudo eliminar: ' + error.message)
    } else {
      cargarLista()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value, ...(name === 'area' ? { topico: '' } : {}) }))
  }

  const guardar = async () => {
    if (!form.area || !form.topico || !form.enunciado || !form.opcion_a || !form.opcion_b) {
      setMensaje('⚠️ Completa al menos: área, tópico, enunciado, opción A y opción B.')
      return
    }
    setGuardando(true)
    setMensaje('')

    const { id, ...payload } = form
    const res = id
      ? await supabase.from('preguntas').update(payload).eq('id', id)
      : await supabase.from('preguntas').insert(payload)

    setGuardando(false)

    if (res.error) {
      setMensaje('❌ Error: ' + res.error.message)
    } else {
      setVista('lista')
      cargarLista()
    }
  }

  const totalPaginas = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const topicosDelArea = form.area ? (AREA_TOPICO_MAP[form.area]?.topicos || []) : []

  if (vista === 'form') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: T.forest, margin: 0 }}>
            {form.id ? `Editar pregunta #${form.id}` : 'Nueva pregunta'}
          </h1>
          <button className="btn-sec" onClick={() => setVista('lista')}>← Volver a la lista</button>
        </div>

        {mensaje && (
          <div style={{ backgroundColor: T.dangerBg, border: `1px solid #fca5a5`, color: T.danger, padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {mensaje}
          </div>
        )}

        <div style={{ backgroundColor: T.surface, borderRadius: '14px', border: `1px solid ${T.border}`, padding: '1.5rem' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Área *</label>
              <select name="area" value={form.area} onChange={handleChange} style={inputStyle}>
                <option value="">Selecciona…</option>
                {Object.entries(AREA_TOPICO_MAP).map(([id, a]) => (
                  <option key={id} value={id}>{a.nombre}</option>
                ))}
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Tópico *</label>
              <select name="topico" value={form.topico} onChange={handleChange} style={inputStyle} disabled={!form.area}>
                <option value="">Selecciona…</option>
                {topicosDelArea.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Subtópico</label>
              <input name="subtopico" value={form.subtopico || ''} onChange={handleChange} style={inputStyle} placeholder="ej: tubulo_renal" />
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Enfoque</label>
            <input name="enfoque" value={form.enfoque || ''} onChange={handleChange} style={{ ...inputStyle, maxWidth: '200px' }} placeholder="ej: USA" />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Enunciado * (admite Markdown/LaTeX con $…$)</label>
            <textarea name="enunciado" value={form.enunciado || ''} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {['a', 'b', 'c', 'd', 'e', 'f'].map(letra => (
              <div style={fieldWrap} key={letra}>
                <label style={labelStyle}>Opción {letra.toUpperCase()}{(letra === 'a' || letra === 'b') ? ' *' : ' (opcional)'}</label>
                <input name={`opcion_${letra}`} value={form[`opcion_${letra}`] || ''} onChange={handleChange} style={inputStyle} />
              </div>
            ))}
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Respuesta correcta *</label>
            <select name="respuesta_correcta" value={form.respuesta_correcta || 'A'} onChange={handleChange} style={{ ...inputStyle, maxWidth: '120px' }}>
              {['A', 'B', 'C', 'D', 'E', 'F'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Acotación (aclaración corta antes de las opciones)</label>
            <input name="acotacion" value={form.acotacion || ''} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Nombre de archivo — imagen de la pregunta</label>
              <input name="imagen_pregunta" value={form.imagen_pregunta || ''} onChange={handleChange} style={inputStyle} placeholder="ej: pregunta12.png" />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Nombre de archivo — imagen de la solución</label>
              <input name="imagen_solucion" value={form.imagen_solucion || ''} onChange={handleChange} style={inputStyle} placeholder="ej: solucion12.png" />
            </div>
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Comentario general</label>
            <textarea name="comentario_general" value={form.comentario_general || ''} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Explicación por opción</label>
            <textarea name="explicacion_opciones" value={form.explicacion_opciones || ''} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Objetivo educativo</label>
            <textarea name="objetivo_educativo" value={form.objetivo_educativo || ''} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={fieldWrap}>
            <label style={labelStyle}>Bibliografía</label>
            <textarea name="bibliografia" value={form.bibliografia || ''} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${T.border}` }}>
            <button className="btn-primary" onClick={guardar} disabled={guardando}>
              {guardando ? 'Guardando…' : (form.id ? 'Guardar cambios' : 'Crear pregunta')}
            </button>
            <button className="btn-sec" onClick={() => setVista('lista')}>Cancelar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: T.forest, margin: 0 }}>Gestionar preguntas</h1>
        <button className="btn-primary" onClick={abrirNueva}>+ Nueva pregunta</button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && buscar()}
          placeholder="Buscar por ID o texto del enunciado…"
          style={{ ...inputStyle, maxWidth: '320px' }}
        />
        <select
          value={filtroArea}
          onChange={e => { setFiltroArea(e.target.value); setPagina(0) }}
          style={{ ...inputStyle, maxWidth: '220px' }}
        >
          <option value="">Todas las áreas</option>
          {Object.entries(AREA_TOPICO_MAP).map(([id, a]) => (
            <option key={id} value={id}>{a.nombre}</option>
          ))}
        </select>
        <button className="btn-sec" onClick={buscar}>Buscar</button>
      </div>

      <div style={{ backgroundColor: T.surface, borderRadius: '14px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
        {loadingLista ? (
          <p style={{ padding: '1.5rem', color: T.textMuted }}>Cargando…</p>
        ) : lista.length === 0 ? (
          <p style={{ padding: '1.5rem', color: T.textMuted }}>No se encontraron preguntas con esos filtros.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Área</th>
                  <th>Tópico</th>
                  <th>Enunciado</th>
                  <th>Resp.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lista.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '700', color: T.textMuted }}>#{p.id}</td>
                    <td>{AREA_TOPICO_MAP[p.area]?.nombre || p.area}</td>
                    <td>{p.topico}</td>
                    <td style={{ maxWidth: '360px' }}>{(p.enunciado || '').slice(0, 90)}{(p.enunciado || '').length > 90 ? '…' : ''}</td>
                    <td style={{ fontWeight: '700', color: T.emerald }}>{p.respuesta_correcta}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-edit" onClick={() => abrirEdicion(p.id)}>Editar</button>
                        <button className="btn-danger" onClick={() => eliminar(p.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.82rem', color: T.textMuted }}>{totalCount} resultados</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="btn-sec" disabled={pagina === 0} onClick={() => setPagina(p => p - 1)}>Anterior</button>
          <span style={{ fontSize: '0.82rem', color: T.textMuted }}>Página {pagina + 1} de {totalPaginas}</span>
          <button className="btn-sec" disabled={pagina + 1 >= totalPaginas} onClick={() => setPagina(p => p + 1)}>Siguiente</button>
        </div>
      </div>
    </div>
  )
}
