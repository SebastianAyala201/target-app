import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

const mdProps = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
}

const mdStyle = {
  color: '#166534', lineHeight: '1.8', fontSize: '0.95rem'
}

function Questions() {
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

  useEffect(() => {
    cargarIds()
  }, [topico])

  useEffect(() => {
    if (tiempoRestante === null) return
    if (tiempoRestante <= 0) {
      clearInterval(timerRef.current)
      handleFinalizar()
      return
    }
    timerRef.current = setInterval(() => {
      setTiempoRestante(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [tiempoRestante])

  const cargarIds = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('preguntas')
      .select('id')
      .eq('topico', topico)
    if (!error && data) {
      const shuffled = data.map(d => d.id).sort(() => Math.random() - 0.5)
      setIds(shuffled)
      setTotalDisponible(shuffled.length)
    }
    setLoading(false)
  }

  const cargarPregunta = async (idx, idsActuales) => {
    setLoadingPregunta(true)
    const id = idsActuales[idx]
    const { data, error } = await supabase
      .from('preguntas')
      .select('*')
      .eq('id', id)
      .single()
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
    const nuevasRespuestas = [...respuestas, { id: preguntaActual.id, correcta }]
    setRespuestas(nuevasRespuestas)
    setHistorial([...historial, { seleccion: letra, respondida: true, pregunta: preguntaActual }])

    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('sesiones_usuario').insert({
        user_id: session.user.id,
        topico: preguntaActual.topico,
        area: preguntaActual.area,
        pregunta_id: preguntaActual.id,
        correcta,
        modo_examen: modoExamen
      })
    }
  }

  const handleSiguiente = async () => {
    const nuevoIndice = indice + 1
    const sig = historial[nuevoIndice]
    setIndice(nuevoIndice)
    if (sig) {
      setPreguntaActual(sig.pregunta)
      setSeleccion(sig.seleccion)
      setRespondida(sig.respondida)
    } else {
      setSeleccion(null)
      setRespondida(false)
      await cargarPregunta(nuevoIndice, idsActivos)
    }
  }

  const handleAnterior = async () => {
    const nuevoIndice = indice - 1
    const ant = historial[nuevoIndice]
    setIndice(nuevoIndice)
    setPreguntaActual(ant.pregunta)
    setSeleccion(ant.seleccion)
    setRespondida(ant.respondida)
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

  const getColorTimer = () => {
    if (tiempoRestante > tiempoTotal * 60 * 0.5) return '#86efac'
    if (tiempoRestante > tiempoTotal * 60 * 0.25) return '#fde047'
    return '#f87171'
  }

  const getColorOpcion = (letra) => {
    if (!respondida) return '#fff'
    if (modoExamen) return seleccion === letra ? '#fef9c3' : '#fff'
    if (letra === preguntaActual.respuesta_correcta) return '#dcfce7'
    if (letra === seleccion) return '#fee2e2'
    return '#fff'
  }

  const getBorderOpcion = (letra) => {
    if (!respondida) return seleccion === letra ? '2px solid #16a34a' : '1.5px solid #d1fae5'
    if (modoExamen) return seleccion === letra ? '2px solid #ca8a04' : '1.5px solid #d1fae5'
    if (letra === preguntaActual.respuesta_correcta) return '2px solid #16a34a'
    if (letra === seleccion) return '2px solid #dc2626'
    return '1.5px solid #d1fae5'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>
      <p style={{ color: '#166534', fontSize: '1.2rem' }}>Cargando preguntas...</p>
    </div>
  )

  if (totalDisponible === 0) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>
      <p style={{ color: '#166534', fontSize: '1.2rem' }}>No hay preguntas disponibles aún.</p>
    </div>
  )

  if (configurando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', maxWidth: '480px', width: '100%', boxShadow: '0 10px 40px rgba(22,101,52,0.12)' }}>
        <h2 style={{ color: '#14532d', fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.5rem' }}>Configurar sesión</h2>
        <p style={{ color: '#166534', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Hay <strong>{totalDisponible}</strong> preguntas disponibles.
        </p>
        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
          ¿Cuántas preguntas?
        </label>
        <select value={totalSeleccionado} onChange={e => setTotalSeleccionado(Number(e.target.value))}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #bbf7d0', fontSize: '1rem', color: '#14532d', marginBottom: '1.5rem', outline: 'none' }}>
          {[5, 10, 15, 20, 25, 30].filter(n => n <= totalDisponible).map(n => (
            <option key={n} value={n}>{n} preguntas</option>
          ))}
          <option value={totalDisponible}>Todas ({totalDisponible})</option>
        </select>
        <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: modoExamen ? '1rem' : 0 }}>
            <div>
              <p style={{ color: '#14532d', fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>⏱️ Modo examen</p>
              <p style={{ color: '#166534', fontSize: '0.8rem', margin: '2px 0 0' }}>Sin explicaciones, con temporizador</p>
            </div>
            <div onClick={() => setModoExamen(!modoExamen)}
              style={{ width: '48px', height: '26px', borderRadius: '999px', cursor: 'pointer', backgroundColor: modoExamen ? '#16a34a' : '#d1fae5', position: 'relative', transition: 'background 0.2s' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: modoExamen ? '25px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
          {modoExamen && (
            <>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
                Tiempo total (minutos)
              </label>
              <select value={tiempoTotal} onChange={e => setTiempoTotal(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #bbf7d0', fontSize: '1rem', color: '#14532d', outline: 'none' }}>
                {[10, 15, 20, 30, 45, 60, 90].map(n => (
                  <option key={n} value={n}>{n} minutos</option>
                ))}
              </select>
            </>
          )}
        </div>
        <button onClick={iniciarSesion}
          style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
          {modoExamen ? '🎯 Iniciar examen' : 'Comenzar →'}
        </button>
        <button onClick={() => navigate(-1)}
          style={{ width: '100%', marginTop: '0.75rem', backgroundColor: 'transparent', color: '#166534', border: '1.5px solid #16a34a', padding: '12px', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </div>
  )

  if (indice >= idsActivos.length) { handleFinalizar(); return null }

  return (
    <div
      style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}
      onContextMenu={e => e.preventDefault()}
    >
      <style>{`
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .md-content p { margin: 0.4rem 0; }
        .md-content ul, .md-content ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .md-content table { border-collapse: collapse; width: 100%; margin: 0.5rem 0; }
        .md-content th, .md-content td { border: 1px solid #bbf7d0; padding: 6px 12px; text-align: left; }
        .md-content th { background-color: #f0fdf4; font-weight: 700; }
        .md-content strong { color: #052e16; font-weight: 800; }
      `}</style>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: '#166534', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>HIGH YIELDS</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {modoExamen && tiempoRestante !== null && (
            <span style={{ color: getColorTimer(), fontSize: '1.1rem', fontWeight: '700', letterSpacing: '0.05em' }}>
              ⏱️ {formatTiempo(tiempoRestante)}
            </span>
          )}
          <span style={{ color: '#86efac', fontSize: '0.9rem' }}>
            Pregunta {indice + 1} de {idsActivos.length}
          </span>
          <button onClick={handleFinalizar} style={{ backgroundColor: 'transparent', border: '1.5px solid white', color: 'white', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
            Finalizar
          </button>
        </div>
      </nav>

      {modoExamen && (
        <div style={{ backgroundColor: '#fef9c3', borderBottom: '1px solid #fde047', padding: '8px', textAlign: 'center' }}>
          <span style={{ color: '#854d0e', fontSize: '0.85rem', fontWeight: '600' }}>
            🎯 Modo examen activo — Las explicaciones se mostrarán al finalizar
          </span>
        </div>
      )}

      <div className="no-select" style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem' }}>
        {loadingPregunta ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <p style={{ color: '#166534', fontSize: '1.1rem' }}>Cargando pregunta...</p>
          </div>
        ) : preguntaActual && (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={tagStyle}>📍 {preguntaActual.enfoque?.toUpperCase()}</span>
              <span style={tagStyle}>🧬 {preguntaActual.topico?.charAt(0).toUpperCase() + preguntaActual.topico?.slice(1)}</span>
              {preguntaActual.subtopico && (
                <span style={tagStyle}>📂 {preguntaActual.subtopico?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              )}
              {modoExamen && <span style={{ ...tagStyle, backgroundColor: '#fef9c3', color: '#854d0e' }}>Modo examen</span>}
            </div>

            <div style={cardStyle}>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#14532d', whiteSpace: 'pre-line', marginBottom: '0' }}>
                {preguntaActual.enunciado?.trimEnd()}
              </p>
              {preguntaActual.imagen_pregunta && (
                <img src={`/preguntas/${preguntaActual.imagen_pregunta}`} alt="Imagen pregunta"
                  style={{ maxWidth: '100%', borderRadius: '8px', margin: '0', pointerEvents: 'none' }} />
              )}
              {preguntaActual.acotacion && (
                <p style={{ fontWeight: '600', color: '#166534', marginTop: '1rem', fontSize: '1rem' }}>
                  {preguntaActual.acotacion}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                {opciones.map((opcion) => (
                  <button key={opcion.letra} onClick={() => handleSeleccion(opcion.letra)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                      padding: '12px 16px', borderRadius: '10px', cursor: respondida ? 'default' : 'pointer',
                      backgroundColor: getColorOpcion(opcion.letra),
                      border: getBorderOpcion(opcion.letra),
                      textAlign: 'left', fontSize: '0.95rem', color: '#14532d', transition: 'all 0.2s'
                    }}>
                    <span style={{ fontWeight: '700', minWidth: '20px' }}>{opcion.letra}.</span>
                    <span>{opcion.texto}</span>
                  </button>
                ))}
              </div>
            </div>

            {respondida && !modoExamen && (
              <div style={{ ...cardStyle, marginTop: '1.5rem', borderLeft: '4px solid #16a34a' }}>
                <div style={{ marginBottom: '1rem' }}>
                  {seleccion === preguntaActual.respuesta_correcta
                    ? <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#16a34a' }}>✓ ¡Correcto!</span>
                    : <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#dc2626' }}>✗ Incorrecto — La respuesta correcta es {preguntaActual.respuesta_correcta}</span>
                  }
                </div>
                <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Comentario general</h3>
                <div className="md-content" style={mdStyle}>
                  <ReactMarkdown {...mdProps}>{preguntaActual.comentario_general}</ReactMarkdown>
                </div>
                {preguntaActual.imagen_solucion && (
                  <img src={`/soluciones/${preguntaActual.imagen_solucion}`} alt="Imagen solución"
                    style={{ maxWidth: '100%', borderRadius: '8px', margin: '1.5rem 0', pointerEvents: 'none' }} />
                )}
                {preguntaActual.explicacion_opciones && (
                  <>
                    <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', margin: '1rem 0 0.5rem' }}>Explicación por opción</h3>
                    <div className="md-content" style={mdStyle}>
                      <ReactMarkdown {...mdProps}>{preguntaActual.explicacion_opciones}</ReactMarkdown>
                    </div>
                  </>
                )}
                {preguntaActual.objetivo_educativo && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
                    <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>🎯 Objetivo educativo</h3>
                    <div className="md-content" style={{ ...mdStyle, margin: 0 }}>
                      <ReactMarkdown {...mdProps}>{preguntaActual.objetivo_educativo}</ReactMarkdown>
                    </div>
                  </div>
                )}
                {preguntaActual.bibliografia && (
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
                    <h3 style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>📚 Bibliografía</h3>
                    <div className="md-content" style={{ ...mdStyle, fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                      <ReactMarkdown {...mdProps}>{preguntaActual.bibliografia}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}

            {respondida && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                {indice > 0 && <button onClick={handleAnterior} style={btnSecStyle}>← Anterior</button>}
                {indice + 1 < idsActivos.length && <button onClick={handleSiguiente} style={btnPrimaryStyle}>Siguiente →</button>}
                <button onClick={() => navigate(-1)} style={btnSecStyle}>Volver</button>
                <button onClick={handleFinalizar} style={btnSecStyle}>Finalizar</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const cardStyle = { backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(22,101,52,0.1)' }
const tagStyle = { backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.8rem', fontWeight: '600', padding: '4px 12px', borderRadius: '999px' }
const btnPrimaryStyle = { backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }
const btnSecStyle = { backgroundColor: 'transparent', color: '#166534', border: '1.5px solid #16a34a', padding: '12px 28px', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }

export default Questions