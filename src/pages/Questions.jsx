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

  useEffect(() => {
    cargarPreguntas()
  }, [topico])

  const cargarPreguntas = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('preguntas')
      .select('*')
      .eq('topico', topico)
    console.log('data:', data)
    console.log('error:', error)
    console.log('topico:', topico)
    if (!error) setPreguntas(data)
    setLoading(false)
  }

  const preguntaActual = preguntas[indice]

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
    setRespuestas([...respuestas, { id: preguntaActual.id, correcta }])
  }

  const handleSiguiente = () => {
    setSeleccion(null)
    setRespondida(false)
    setIndice(indice + 1)
  }

  const handleFinalizar = () => {
    navigate('/stats', {
      state: {
        respuestas,
        total: preguntas.length
      }
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

  if (indice >= preguntas.length) {
    handleFinalizar()
    return null
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: '#166534', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>TARGET</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#86efac', fontSize: '0.9rem' }}>
            Pregunta {indice + 1} de {preguntas.length}
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
            <img
              src={`/preguntas/${preguntaActual.imagen_pregunta}`}
              alt="Imagen pregunta"
              style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0' }}
            />
          )}

          {preguntaActual.acotacion && (
            <p style={{ fontWeight: '600', color: '#166534', marginTop: '1rem', fontSize: '1rem' }}>
              {preguntaActual.acotacion}
            </p>
          )}

          {/* OPCIONES */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            {opciones.map((opcion) => (
              <button
                key={opcion.letra}
                onClick={() => handleSeleccion(opcion.letra)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  padding: '12px 16px', borderRadius: '10px', cursor: respondida ? 'default' : 'pointer',
                  backgroundColor: getColorOpcion(opcion.letra),
                  border: getBorderOpcion(opcion.letra),
                  textAlign: 'left', fontSize: '0.95rem', color: '#14532d',
                  transition: 'all 0.2s'
                }}
              >
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
              <img
                src={`/preguntas/${preguntaActual.imagen_solucion}`}
                alt="Imagen solución"
                style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0' }}
              />
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
              {indice + 1 < preguntas.length && (
                <button onClick={handleSiguiente} style={btnPrimaryStyle}>
                  Siguiente pregunta →
                </button>
              )}
              <button onClick={() => navigate('/topics')} style={btnSecStyle}>
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
  backgroundColor: 'transparent', color: '#166534',
  border: '1.5px solid #16a34a', padding: '12px 28px',
  borderRadius: '8px', fontSize: '1rem', cursor: 'pointer'
}

export default Questions