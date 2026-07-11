import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import remarkGfm from 'remark-gfm'

const mdProps = {
  remarkPlugins: [remarkMath, remarkGfm],
  rehypePlugins: [rehypeKatex],
}

const T = {
  forest:    '#0f3d2e',
  pine:      '#1a5c3a',
  emerald:   '#16a34a',
  mist:      '#f0faf4',
  surface:   '#ffffff',
  text:      '#0f1a14',
  textMuted: '#4a6355',
  border:    '#c8e6d4',
  lime:      '#a3e635',
}

export default function Questions() {
  const { topico } = useParams()
  const navigate = useNavigate()

  const [ids, setIds] = useState([])
  const [preguntaActual, setPreguntaActual] = useState(null)
  const [indice, setIndice] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [respondida, setRespondida] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingPregunta, setLoadingPregunta] = useState(false)
  const [respuestas, setRespuestas] = useState([])
  const [historial, setHistorial] = useState([])
  const [configurando, setConfigurando] = useState(true)
  const [totalSeleccionado, setTotalSeleccionado] = useState(10)
  const [totalDisponible, setTotalDisponible] = useState(0)
  const [modoExamen, setModoExamen] = useState(false)
  const [tiempoTotal, setTiempoTotal] = useState(30)
  const [tiempoRestante, setTiempoRestante] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => { cargarIds() }, [topico])

  useEffect(() => {
    if (tiempoRestante === null) return
    if (tiempoRestante <= 0) { clearInterval(timerRef.current); handleFinalizar(); return }
    timerRef.current = setInterval(() => setTiempoRestante(prev => prev - 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [tiempoRestante])

  const cargarIds = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('preguntas').select('id').eq('topico', topico)
    if (!error && data) {
      const shuffled = data.map(d => d.id).sort(() => Math.random() - 0.5)
      setIds(shuffled)
      setTotalDisponible(shuffled.length)
    }
    setLoading(false)
  }

  const cargarPregunta = async (idx, idsActuales) => {
    setLoadingPregunta(true)
    const { data, error } = await supabase.from('preguntas').select('*').eq('id', idsActuales[idx]).single()
    if (!error && data) setPreguntaActual(data)
    setLoadingPregunta(false)
  }

  const idsActivos = ids.slice(0, totalSeleccionado)

  const iniciarSesion = async () => {
    setConfigurando(false)
    await cargarPregunta(0, ids.slice(0, totalSeleccionado))
    if (modoExamen) setTiempoRestante(tiempoTotal * 60)
  }

  const opciones = preguntaActual ? [
    { letra: 'A', texto: preguntaActual.opcion_a },
    { letra: 'B', texto: preguntaActual.opcion_b },
    { letra: 'C', texto: preguntaActual.opcion_c },
    { letra: 'D', texto: preguntaActual.opcion_d },
    { letra: 'E', texto: preguntaActual.opcion_e },
    { letra: 'F', texto: preguntaActual.opcion_f },
  ].filter(o => o.texto) : []

  const handleSeleccion = async (letra) => {
    if (respondida) return
    setSeleccion(letra)
    setRespondida(true)
    const correcta = letra === preguntaActual.respuesta_correcta
    setRespuestas([...respuestas, { id: preguntaActual.id, correcta }])
    setHistorial([...historial, { seleccion: letra, respondida: true, pregunta: preguntaActual }])
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('sesiones_usuario').insert({
        user_id: session.user.id, topico: preguntaActual.topico,
        area: preguntaActual.area, pregunta_id: preguntaActual.id,
        correcta, modo_examen: modoExamen
      })
    }
  }

  const handleSiguiente = async () => {
    const nuevoIndice = indice + 1
    const sig = historial[nuevoIndice]
    setIndice(nuevoIndice)
    if (sig) { setPreguntaActual(sig.pregunta); setSeleccion(sig.seleccion); setRespondida(sig.respondida) }
    else { setSeleccion(null); setRespondida(false); await cargarPregunta(nuevoIndice, idsActivos) }
  }

  const handleAnterior = async () => {
    const nuevoIndice = indice - 1
    const ant = historial[nuevoIndice]
    setIndice(nuevoIndice)
    setPreguntaActual(ant.pregunta); setSeleccion(ant.seleccion); setRespondida(ant.respondida)
  }

  const handleFinalizar = () => {
    clearInterval(timerRef.current)
    navigate('/stats', { state: { respuestas, total: idsActivos.length, modoExamen } })
  }

  const formatTiempo = (seg) => {
    const m = Math.floor(seg / 60).toString().padStart(2, '0')
    const s = (seg % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const pct = tiempoRestante !== null ? tiempoRestante / (tiempoTotal * 60) : 1
  const timerColor = pct > 0.5 ? T.lime : pct > 0.25 ? '#fbbf24' : '#f87171'

  const getColorOpcion = (letra) => {
    if (!respondida) return T.surface
    if (modoExamen) return seleccion === letra ? '#fefce8' : T.surface
    if (letra === preguntaActual.respuesta_correcta) return '#f0fdf4'
    if (letra === seleccion) return '#fef2f2'
    return T.surface
  }

  const getBorderOpcion = (letra) => {
    if (!respondida) return `1.5px solid ${T.border}`
    if (modoExamen) return seleccion === letra ? '2px solid #ca8a04' : `1.5px solid ${T.border}`
    if (letra === preguntaActual.respuesta_correcta) return `2px solid ${T.emerald}`
    if (letra === seleccion) return '2px solid #dc2626'
    return `1.5px solid ${T.border}`
  }

  const getIconOpcion = (letra) => {
    if (!respondida || modoExamen) return null
    if (letra === preguntaActual.respuesta_correcta) return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginLeft: 'auto' }}>
        <circle cx="8" cy="8" r="8" fill={T.emerald}/>
        <path d="M4.5 8l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
    if (letra === seleccion) return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginLeft: 'auto' }}>
        <circle cx="8" cy="8" r="8" fill="#dc2626"/>
        <path d="M5 5l6 6M11 5l-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
    return null
  }

  // ── LOADING ──
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: T.mist, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: `3px solid ${T.border}`, borderTopColor: T.emerald, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: T.textMuted, fontSize: '0.9rem', margin: 0 }}>Cargando preguntas...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (totalDisponible === 0) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: T.mist, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: T.forest, fontSize: '1.1rem', fontWeight: '700', margin: '0 0 8px' }}>Sin preguntas disponibles</p>
        <p style={{ color: T.textMuted, fontSize: '0.875rem', margin: '0 0 20px' }}>Este tópico aún no tiene preguntas cargadas.</p>
        <button onClick={() => navigate(-1)} style={{ background: T.emerald, color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
          Volver
        </button>
      </div>
    </div>
  )

  // ── CONFIGURACIÓN ──
  if (configurando) return (
    <div style={{ minHeight: '100vh', backgroundColor: T.mist, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ backgroundColor: T.surface, borderRadius: '16px', padding: '2.5rem', maxWidth: '460px', width: '100%', border: `1px solid ${T.border}`, boxShadow: '0 8px 40px rgba(15,61,46,0.1)' }}>

        {/* Header config */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>
            {topico?.replace(/_/g, ' ')}
          </p>
          <h2 style={{ color: T.forest, fontSize: '1.5rem', fontWeight: '900', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Configurar sesión
          </h2>
          <p style={{ color: T.textMuted, fontSize: '0.875rem', margin: 0 }}>
            {totalDisponible} preguntas disponibles
          </p>
        </div>

        {/* Número de preguntas */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: T.forest, marginBottom: '6px' }}>
            Número de preguntas
          </label>
          <select
            value={totalSeleccionado}
            onChange={e => setTotalSeleccionado(Number(e.target.value))}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1.5px solid ${T.border}`, fontSize: '0.95rem', color: T.text, outline: 'none', backgroundColor: T.surface, fontFamily: 'inherit', cursor: 'pointer' }}
          >
            {[5, 10, 15, 20, 25, 30].filter(n => n <= totalDisponible).map(n => (
              <option key={n} value={n}>{n} preguntas</option>
            ))}
            <option value={totalDisponible}>Todas ({totalDisponible})</option>
          </select>
        </div>

        {/* Modo examen toggle */}
        <div style={{ backgroundColor: T.mist, border: `1.5px solid ${T.border}`, borderRadius: '12px', padding: '1.1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: modoExamen ? '1rem' : 0 }}>
            <div>
              <p style={{ color: T.forest, fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>Modo examen</p>
              <p style={{ color: T.textMuted, fontSize: '0.78rem', margin: '2px 0 0' }}>Sin explicaciones, con temporizador</p>
            </div>
            <div
              onClick={() => setModoExamen(!modoExamen)}
              style={{ width: '44px', height: '24px', borderRadius: '999px', cursor: 'pointer', backgroundColor: modoExamen ? T.emerald : T.border, position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
            >
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: modoExamen ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
            </div>
          </div>
          {modoExamen && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: T.forest, marginBottom: '6px' }}>Tiempo total</label>
              <select
                value={tiempoTotal}
                onChange={e => setTiempoTotal(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 14px', borderRadius: '8px', border: `1.5px solid ${T.border}`, fontSize: '0.9rem', color: T.text, outline: 'none', backgroundColor: T.surface, fontFamily: 'inherit' }}
              >
                {[10, 15, 20, 30, 45, 60, 90].map(n => (
                  <option key={n} value={n}>{n} minutos</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={iniciarSesion}
          style={{ width: '100%', backgroundColor: T.emerald, color: 'white', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '0.75rem' }}
        >
          {modoExamen ? 'Iniciar examen' : 'Comenzar sesión'}
        </button>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '100%', backgroundColor: 'transparent', color: T.textMuted, border: `1.5px solid ${T.border}`, padding: '12px', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )

  if (indice >= idsActivos.length) { handleFinalizar(); return null }

  // ── PREGUNTA ──
  const progresoPct = ((indice + 1) / idsActivos.length) * 100

  return (
    <div
      style={{ minHeight: '100vh', backgroundColor: T.mist, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}
      onContextMenu={e => e.preventDefault()}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .no-select { user-select: none; -webkit-user-select: none; }

        .md-content p { margin: 0.4rem 0; }
        .md-content ul, .md-content ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .md-content table { border-collapse: collapse; width: 100%; margin: 0.75rem 0; font-size: 0.9rem; }
        .md-content th, .md-content td { border: 1px solid #c8e6d4; padding: 7px 12px; text-align: left; }
        .md-content th { background-color: #f0fdf4; font-weight: 700; color: #0f3d2e; }
        .md-content strong { color: #0f3d2e; font-weight: 700; }
        .md-content em { color: #4a6355; }

        .opcion-btn {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          text-align: left;
          font-size: 0.92rem;
          font-family: inherit;
          line-height: 1.55;
          transition: border-color 0.15s, background 0.15s;
        }
        .opcion-btn:not([disabled]):hover {
          border-color: #16a34a !important;
          background-color: #f0fdf4 !important;
        }

        .nav-btn-q {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.85);
          padding: 6px 16px;
          border-radius: 7px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          font-family: inherit;
        }
        .nav-btn-q:hover { border-color: rgba(255,255,255,0.7); color: white; }

        .btn-primary-q {
          background-color: #16a34a;
          color: white;
          border: none;
          padding: 11px 28px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }
        .btn-primary-q:hover { background-color: #1a5c3a; }

        .btn-sec-q {
          background: transparent;
          color: #4a6355;
          border: 1.5px solid #c8e6d4;
          padding: 11px 24px;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-sec-q:hover { border-color: #16a34a; color: #0f3d2e; }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 2rem', height: '54px',
        backgroundColor: T.forest,
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Logo + progreso */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo.png" alt="High Yields" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: '600', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {topico?.replace(/_/g, ' ')}
            </p>
            <p style={{ color: 'white', fontSize: '0.82rem', fontWeight: '600', margin: 0 }}>
              Pregunta {indice + 1} de {idsActivos.length}
            </p>
          </div>
        </div>

        {/* Timer + botones */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {modoExamen && tiempoRestante !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: '999px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: timerColor }} />
              <span style={{ color: timerColor, fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums' }}>
                {formatTiempo(tiempoRestante)}
              </span>
            </div>
          )}
          {modoExamen && (
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.12)', padding: '4px 10px', borderRadius: '999px', letterSpacing: '0.04em' }}>
              EXAMEN
            </span>
          )}
          <button className="nav-btn-q" onClick={handleFinalizar}>Finalizar</button>
        </div>
      </nav>

      {/* Barra de progreso */}
      <div style={{ height: '3px', backgroundColor: 'rgba(15,61,46,0.1)' }}>
        <div style={{ height: '100%', width: `${progresoPct}%`, backgroundColor: T.lime, transition: 'width 0.3s ease' }} />
      </div>

      <div className="no-select" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {loadingPregunta ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div style={{ width: '28px', height: '28px', border: `3px solid ${T.border}`, borderTopColor: T.emerald, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : preguntaActual && (
          <>
            {/* Tags */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#dcfce7', color: T.pine, fontSize: '0.7rem', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', letterSpacing: '0.04em', border: '1px solid #bbf7d0' }}>
                {preguntaActual.enfoque?.toUpperCase()}
              </span>
              <span style={{ backgroundColor: T.surface, color: T.textMuted, fontSize: '0.7rem', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', border: `1px solid ${T.border}` }}>
                {preguntaActual.topico?.replace(/_/g, ' ')}
              </span>
              {preguntaActual.subtopico && (
                <span style={{ backgroundColor: T.surface, color: T.textMuted, fontSize: '0.7rem', fontWeight: '600', padding: '3px 10px', borderRadius: '999px', border: `1px solid ${T.border}` }}>
                  {preguntaActual.subtopico?.replace(/_/g, ' ')}
                </span>
              )}
            </div>

            {/* Card pregunta */}
            <div style={{ backgroundColor: T.surface, borderRadius: '14px', padding: '1.75rem 2rem', border: `1px solid ${T.border}`, boxShadow: '0 2px 16px rgba(15,61,46,0.07)', marginBottom: '1rem' }}>

              {/* Enunciado */}
              <div className="md-content" style={{ fontSize: '1rem', lineHeight: '1.8', color: T.text, marginBottom: '1.5rem' }}>
                <ReactMarkdown {...mdProps}>{preguntaActual.enunciado?.trimEnd()}</ReactMarkdown>
              </div>

              {preguntaActual.imagen_pregunta && (
                <img
                  src={`/preguntas/${preguntaActual.imagen_pregunta}`}
                  alt="Imagen pregunta"
                  style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '1.25rem', pointerEvents: 'none', border: `1px solid ${T.border}` }}
                />
              )}

              {preguntaActual.acotacion && (
                <p style={{ fontWeight: '700', color: T.forest, paddingTop: '1rem', borderTop: `1.5px solid ${T.border}`, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  {preguntaActual.acotacion}
                </p>
              )}

              {/* Opciones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {opciones.map((opcion) => (
                  <button
                    key={opcion.letra}
                    className="opcion-btn"
                    onClick={() => handleSeleccion(opcion.letra)}
                    disabled={respondida}
                    style={{
                      backgroundColor: getColorOpcion(opcion.letra),
                      border: getBorderOpcion(opcion.letra),
                      cursor: respondida ? 'default' : 'pointer',
                      color: T.text,
                    }}
                  >
                    <span style={{
                      fontWeight: '800', minWidth: '22px', fontSize: '0.85rem',
                      color: respondida && opcion.letra === preguntaActual.respuesta_correcta ? T.emerald
                           : respondida && opcion.letra === seleccion ? '#dc2626'
                           : T.textMuted
                    }}>
                      {opcion.letra}
                    </span>
                    <span style={{ flex: 1 }}>{opcion.texto}</span>
                    {getIconOpcion(opcion.letra)}
                  </button>
                ))}
              </div>
            </div>

            {/* Card explicación */}
            {respondida && !modoExamen && (
              <div style={{ backgroundColor: T.surface, borderRadius: '14px', padding: '1.75rem 2rem', border: `1px solid ${T.border}`, borderLeft: `4px solid ${seleccion === preguntaActual.respuesta_correcta ? T.emerald : '#dc2626'}`, boxShadow: '0 2px 16px rgba(15,61,46,0.07)', marginBottom: '1rem' }}>

                {/* Resultado */}
                <div style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: `1px solid ${T.border}` }}>
                  {seleccion === preguntaActual.respuesta_correcta ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7l3 3 6-6" stroke={T.emerald} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: '700', color: T.emerald }}>Correcto</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 3l8 8M11 3l-8 8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: '700', color: '#dc2626' }}>
                        Incorrecto — Respuesta correcta: <strong>{preguntaActual.respuesta_correcta}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Comentario general */}
                <h3 style={{ color: T.forest, fontSize: '0.85rem', fontWeight: '700', margin: '0 0 0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Comentario general
                </h3>
                <div className="md-content" style={{ color: T.text, lineHeight: '1.8', fontSize: '0.92rem' }}>
                  <ReactMarkdown {...mdProps}>{preguntaActual.comentario_general}</ReactMarkdown>
                </div>

                {preguntaActual.imagen_solucion && (
                  <img src={`/soluciones/${preguntaActual.imagen_solucion}`} alt="Imagen solución"
                    style={{ maxWidth: '100%', borderRadius: '8px', margin: '1.25rem 0', pointerEvents: 'none', border: `1px solid ${T.border}` }} />
                )}

                {preguntaActual.explicacion_opciones && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: `1px solid ${T.border}` }}>
                    <h3 style={{ color: T.forest, fontSize: '0.85rem', fontWeight: '700', margin: '0 0 0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Análisis por opción
                    </h3>
                    <div className="md-content" style={{ color: T.text, lineHeight: '1.8', fontSize: '0.92rem' }}>
                      <ReactMarkdown {...mdProps}>{preguntaActual.explicacion_opciones}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {preguntaActual.objetivo_educativo && (
                  <div style={{ backgroundColor: '#f0fdf4', border: `1px solid ${T.border}`, borderRadius: '10px', padding: '1rem 1.25rem', marginTop: '1.25rem' }}>
                    <h3 style={{ color: T.forest, fontSize: '0.82rem', fontWeight: '700', margin: '0 0 0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Objetivo educativo
                    </h3>
                    <div className="md-content" style={{ color: T.textMuted, lineHeight: '1.7', fontSize: '0.88rem' }}>
                      <ReactMarkdown {...mdProps}>{preguntaActual.objetivo_educativo}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {preguntaActual.bibliografia && (
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem 1.25rem', marginTop: '0.75rem' }}>
                    <h3 style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '700', margin: '0 0 0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Bibliografía
                    </h3>
                    <div className="md-content" style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.82rem' }}>
                      <ReactMarkdown {...mdProps}>{preguntaActual.bibliografia}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botones navegación */}
            {respondida && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {indice > 0 && <button className="btn-sec-q" onClick={handleAnterior}>← Anterior</button>}
                {indice + 1 < idsActivos.length && <button className="btn-primary-q" onClick={handleSiguiente}>Siguiente →</button>}
                <button className="btn-sec-q" onClick={() => navigate(-1)}>Volver</button>
                <button className="btn-sec-q" onClick={handleFinalizar}>Finalizar</button>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  )
}
