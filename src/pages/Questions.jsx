import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Questions() {
  const { topico } = useParams()
  const navigate = useNavigate()

  const [preguntas, setPreguntas] = useState([])
  const [indice, setIndice] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [respondida, setRespondida] = useState(false)
  const [loading, setLoading] = useState(true)
  const [respuestas, setRespuestas] = useState([])
  const [historial, setHistorial] = useState([])
  const [configurando, setConfigurando] = useState(true)
  const [totalSeleccionado, setTotalSeleccionado] = useState(10)

  useEffect(() => {
    cargarPreguntas()
  }, [topico])

  const cargarPreguntas = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('preguntas')
      .select('*')
      .eq('topico', topico)
    if (!error) {
      const shuffled = data.sort(() => Math.random() - 0.5)
      setPreguntas(shuffled)
    }
    setLoading(false)
  }

  const preguntasActivas = preguntas.slice(0, totalSeleccionado)
  const preguntaActual = preguntasActivas[indice]

  const opciones = preguntaActual ? [
    { letra: 'A', texto: preguntaActual.opcion_a },
    { letra: 'B', texto: preguntaActual.opcion_b },
    { letra: 'C', texto: preguntaActual.opcion_c },
    { letra: 'D', texto: preguntaActual.opcion_d },
    { letra: 'E', texto: preguntaActual.opcion_e },
    { letra: 'F', texto: preguntaActual.opcion_f },
  ].filter(o => o.texto) : []

  const handleSeleccion = (letra) => {
    if (respondida) return
    setSeleccion(letra)
    setRespondida(true)
    const correcta = letra === preguntaActual.respuesta_correcta
    const nuevasRespuestas = [...respuestas, { id: preguntaActual.id, correcta }]
    setRespuestas(nuevasRespuestas)
    setHistorial([...historial, { seleccion: letra, respondida: true }])
  }

  const handleSiguiente = () => {
    setIndice(indice + 1)
    const sig = historial[indice + 1]
    if (sig) {
      setSeleccion(sig.seleccion)
      setRespondida(sig.respondida)
    } else {
      setSeleccion(null)
      setRespondida(false)
    }
  }

  const handleAnterior = () => {
    const ant = historial[indice - 1]
    setIndice(indice - 1)
    setSeleccion(ant.seleccion)
    setRespondida(ant.respondida)
  }

  const handleFinalizar = () => {
    navigate('/stats', {
      state: { respuestas, total: preguntasActivas.length }
    })
  }

  const getColorOpcion = (letra) => {
    if (!respondida) return '#fff'
    if (letra === preguntaActual.respuesta_correcta) return '#dcfce7'
    if (letra === seleccion) return '#fee2e2'
    return '#fff'
  }

  const getBorderOpcion = (letra) => {
    if (!respondida) return seleccion === letra ? '2px solid #16a34a' : '1.5px solid #d1fae5'
    if (letra === preguntaActual.respuesta_correcta) return '2px solid #16a34a'
    if (letra === seleccion) return '2px solid #dc2626'
    return '1.5px solid #d1fae5'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>
      <p style={{ color: '#166534', fontSize: '1.2rem' }}>Cargando preguntas...</p>
    </div>
  )

  if (preguntas.length === 0) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>
      <p style={{ color: '#166534', fontSize: '1.2rem' }}>No hay preguntas disponibles aún.</p>
    </div>
  )

  // PANTALLA DE CONFIGURACIÓN
  if (configurando) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', maxWidth: '480px', width: '100%', boxShadow: '0 10px 40px rgba(22,101,52,0.12)' }}>
        <h2 style={{ color: '#14532d', fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.5rem' }}>Configurar sesión</h2>
        <p style={{ color: '#166534', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Hay <strong>{preguntas.length}</strong> preguntas disponibles en este tópico.
        </p>

        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#166534', marginBottom: '0.5rem' }}>
          ¿Cuántas preguntas quieres responder?
        </label>
        <select
          value={totalSeleccionado}
          onChange={e => setTotalSeleccionado(Number(e.target.value))}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #bbf7d0', fontSize: '1rem', color: '#14532d', marginBottom: '2rem', outline: 'none' }}
        >
          {[5, 10, 15, 20, 25, 30].filter(n => n <= preguntas.length).map(n => (
            <option key={n} value={n}>{n} preguntas</option>
          ))}
          <option value={preguntas.length}>Todas ({preguntas.length})</option>
        </select>

        <button
          onClick={() => setConfigurando(false)}
          style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
          Comenzar →
        </button>

        <button
          onClick={() => navigate(-1)}
          style={{ width: '100%', marginTop: '0.75rem', backgroundColor: 'transparent', color: '#166534', border: '1.5px solid #16a34a', padding: '12px', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </div>
  )

  if (indice >= preguntasActivas.length) {
    handleFinalizar()
    return null
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: '#166534', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>HIGH YIELDS</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#86efac', fontSize: '0.9rem' }}>
            Pregunta {indice + 1} de {preguntasActivas.length}
          </span>
          <button onClick={handleFinalizar} style={{ backgroundColor: 'transparent', border: '1.5px solid white', color: 'white', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
            Finalizar estudio
          </button>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem' }}>

        {/* INFO PREGUNTA */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={tagStyle}>📍 {preguntaActual.enfoque?.toUpperCase()}</span>
          <span style={tagStyle}>🧬 {preguntaActual.topico?.charAt(0).toUpperCase() + preguntaActual.topico?.slice(1)}</span>
          <span style={tagStyle}>ID: Pregunta N°{preguntaActual.id}</span>
        </div>

        {/* TARJETA PREGUNTA */}
        <div style={cardStyle}>
          <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#14532d', whiteSpace: 'pre-line' }}>
            {preguntaActual.enunciado}
          </p>

          {preguntaActual.imagen_pregunta && (
            <img src={`/preguntas/${preguntaActual.imagen_pregunta}`} alt="Imagen pregunta"
              style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0' }} />
          )}

          {preguntaActual.acotacion && (
            <p style={{ fontWeight: '600', color: '#166534', marginTop: '1rem', fontSize: '1rem' }}>
              {preguntaActual.acotacion}
            </p>
          )}

          {/* OPCIONES */}
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

        {/* SECCION RESPUESTA */}
        {respondida && (
          <div style={{ ...cardStyle, marginTop: '1.5rem', borderLeft: '4px solid #16a34a' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              {seleccion === preguntaActual.respuesta_correcta
                ? <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#16a34a' }}>✓ ¡Correcto!</span>
                : <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#dc2626' }}>✗ Incorrecto — La respuesta correcta es {preguntaActual.respuesta_correcta}</span>
              }
            </div>

            <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Comentario general</h3>
            <p style={{ color: '#166534', lineHeight: '1.8', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {preguntaActual.comentario_general}
            </p>

            {preguntaActual.imagen_solucion && (
              <img src={`/preguntas/${preguntaActual.imagen_solucion}`} alt="Imagen solución"
                style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0' }} />
            )}

            {preguntaActual.explicacion_opciones && (
              <>
                <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', margin: '1rem 0 0.5rem' }}>Explicación por opción</h3>
                <p style={{ color: '#166534', lineHeight: '1.8', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                  {preguntaActual.explicacion_opciones}
                </p>
              </>
            )}

            {preguntaActual.objetivo_educativo && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
                <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>🎯 Objetivo educativo</h3>
                <p style={{ color: '#166534', lineHeight: '1.8', fontSize: '0.95rem', whiteSpace: 'pre-line', margin: 0 }}>
                  {preguntaActual.objetivo_educativo}
                </p>
              </div>
            )}

            {preguntaActual.bibliografia && (
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
                <h3 style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>📚 Bibliografía</h3>
                <p style={{ color: '#64748b', lineHeight: '1.8', fontSize: '0.85rem', whiteSpace: 'pre-line', margin: 0 }}>
                  {preguntaActual.bibliografia}
                </p>
              </div>
            )}

            {/* BOTONES */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {indice > 0 && (
                <button onClick={handleAnterior} style={btnSecStyle}>
                  ← Pregunta anterior
                </button>
              )}
              {indice + 1 < preguntasActivas.length && (
                <button onClick={handleSiguiente} style={btnPrimaryStyle}>
                  Siguiente pregunta →
                </button>
              )}
              <button onClick={() => navigate(-1)} style={btnSecStyle}>
                Volver a tópicos
              </button>
              <button onClick={handleFinalizar} style={btnSecStyle}>
                Finalizar estudio
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

const cardStyle = {
  backgroundColor: 'white', borderRadius: '16px', padding: '2rem',
  boxShadow: '0 4px 20px rgba(22,101,52,0.1)'
}
const tagStyle = {
  backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.8rem',
  fontWeight: '600', padding: '4px 12px', borderRadius: '999px'
}
const btnPrimaryStyle = {
  backgroundColor: '#16a34a', color: 'white', border: 'none',
  padding: '12px 28px', borderRadius: '8px', fontSize: '1rem',
  fontWeight: '600', cursor: 'pointer'
}
const btnSecStyle = {
  backgroundColor: 'transparent', color: '#166634',
  border: '1.5px solid #16a34a', padding: '12px 28px',
  borderRadius: '8px', fontSize: '1rem', cursor: 'pointer'
}

export default Questions