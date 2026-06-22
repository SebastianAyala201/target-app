import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

const supabase = createClient(
  'https://wwaqrfpuiplblucqaudx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YXFyZnB1aXBsYmx1Y3FhdWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDEwNDIsImV4cCI6MjA5MDc3NzA0Mn0.G-1K6YEPwrPu8MiiGuRH6V-6yTuIU-fmuVrMa10yMdo'
)

const areaColors = {
  histologia:       { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
  embriologia:      { bg: '#dcfce7', color: '#166534', border: '#86efac' },
  anatomia:         { bg: '#ffedd5', color: '#9a3412', border: '#fdba74' },
  fisiologia:       { bg: '#f3e8ff', color: '#6b21a8', border: '#d8b4fe' },
  fisiopatologia:   { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
  farmacologia:     { bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
  medicina_interna: { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' },
}

const mdProps = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [rehypeKatex],
}

export default function QuestionInspector() {
  const [inputId, setInputId] = useState('')
  const [pregunta, setPregunta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [seleccion, setSeleccion] = useState(null)
  const [revelada, setRevelada] = useState(false)

  const inspeccionar = async () => {
    const id = parseInt(inputId)
    if (!id || id < 1) { setError('Ingresa un ID válido.'); return }
    setLoading(true)
    setError('')
    setPregunta(null)
    setSeleccion(null)
    setRevelada(false)

    const { data, error: err } = await supabase
      .from('preguntas')
      .select('*')
      .eq('id', id)
      .single()

    setLoading(false)
    if (err || !data) {
      setError(`No se encontró una pregunta con ID ${id}.`)
    } else {
      setPregunta(data)
    }
  }

  const limpiar = () => {
    setPregunta(null)
    setInputId('')
    setError('')
    setSeleccion(null)
    setRevelada(false)
  }

  const handleOpcion = (letra) => {
    if (revelada) return
    setSeleccion(letra)
    setRevelada(true)
  }

  const getColorOpcion = (letra) => {
    if (!revelada) return seleccion === letra ? '#e0f2fe' : 'white'
    if (letra === pregunta.respuesta_correcta) return '#dcfce7'
    if (letra === seleccion) return '#fee2e2'
    return 'white'
  }

  const getBorderOpcion = (letra) => {
    if (!revelada) return seleccion === letra ? '2px solid #0284c7' : '1.5px solid #e2e8f0'
    if (letra === pregunta.respuesta_correcta) return '2px solid #16a34a'
    if (letra === seleccion) return '2px solid #dc2626'
    return '1.5px solid #e2e8f0'
  }

  const opciones = pregunta ? [
    { letra: 'A', texto: pregunta.opcion_a },
    { letra: 'B', texto: pregunta.opcion_b },
    { letra: 'C', texto: pregunta.opcion_c },
    { letra: 'D', texto: pregunta.opcion_d },
    { letra: 'E', texto: pregunta.opcion_e },
    { letra: 'F', texto: pregunta.opcion_f },
  ].filter(o => o.texto) : []

  const areaStyle = pregunta ? (areaColors[pregunta.area] || areaColors.medicina_interna) : null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Segoe UI, sans-serif', padding: '2rem' }}>
      <style>{`
        .md-content p { margin: 0.4rem 0; color: inherit; }
        .md-content ul, .md-content ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        .md-content table { border-collapse: collapse; width: 100%; margin: 0.5rem 0; }
        .md-content th, .md-content td { border: 1px solid #e2e8f0; padding: 6px 12px; text-align: left; font-size: 0.9rem; }
        .md-content th { background-color: #f1f5f9; font-weight: 700; }
        .md-content strong { color: #0f172a; font-weight: 700; }
      `}</style>

      {/* HEADER */}
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>
              🔍 Inspector de Preguntas
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' }}>
              High Yields — Herramienta de verificación
            </p>
          </div>
          {pregunta && (
            <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.8rem', fontWeight: '600', padding: '4px 12px', borderRadius: '999px', border: '1px solid #e2e8f0' }}>
              ID #{pregunta.id}
            </span>
          )}
        </div>

        {/* BUSCADOR */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
              ID de la pregunta
            </label>
            <input
              type="number"
              value={inputId}
              onChange={e => setInputId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && inspeccionar()}
              placeholder="Ej: 1, 23, 47..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '1rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '26px' }}>
            <button
              onClick={inspeccionar}
              disabled={loading}
              style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Buscando...' : 'Inspeccionar'}
            </button>
            {pregunta && (
              <button
                onClick={limpiar}
                style={{ backgroundColor: 'white', color: '#475569', border: '1.5px solid #e2e8f0', padding: '10px 20px', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* PREGUNTA */}
        {pregunta && (
          <>
            {/* BADGES */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: areaStyle.bg, color: areaStyle.color, border: `1px solid ${areaStyle.border}`, fontSize: '0.78rem', fontWeight: '700', padding: '4px 12px', borderRadius: '999px' }}>
                {pregunta.area?.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontSize: '0.78rem', fontWeight: '600', padding: '4px 12px', borderRadius: '999px' }}>
                {pregunta.topico?.replace(/_/g, ' ')}
              </span>
              {pregunta.subtopico && (
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontSize: '0.78rem', fontWeight: '600', padding: '4px 12px', borderRadius: '999px' }}>
                  {pregunta.subtopico?.replace(/_/g, ' ')}
                </span>
              )}
              <span style={{ backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fde047', fontSize: '0.78rem', fontWeight: '600', padding: '4px 12px', borderRadius: '999px' }}>
                {pregunta.enfoque}
              </span>
            </div>

            {/* CARD PREGUNTA */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>

              {/* ENUNCIADO */}
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#0f172a', whiteSpace: 'pre-line', marginBottom: '0' }}>
                {pregunta.enunciado?.trimEnd()}
              </p>

              {/* IMAGEN PREGUNTA */}
              {pregunta.imagen_pregunta && (
                <img
                  src={`/preguntas/${pregunta.imagen_pregunta}`}
                  alt="Imagen pregunta"
                  style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0 0' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              )}

              {/* ACOTACION */}
              {pregunta.acotacion && (
                <p style={{ fontWeight: '700', color: '#0f172a', marginTop: '1rem', paddingTop: '1rem', borderTop: '1.5px solid #e2e8f0', fontSize: '1rem' }}>
                  {pregunta.acotacion}
                </p>
              )}

              {/* OPCIONES */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.5rem' }}>
                {opciones.map(op => (
                  <button
                    key={op.letra}
                    onClick={() => handleOpcion(op.letra)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                      padding: '12px 16px', borderRadius: '10px',
                      cursor: revelada ? 'default' : 'pointer',
                      backgroundColor: getColorOpcion(op.letra),
                      border: getBorderOpcion(op.letra),
                      textAlign: 'left', fontSize: '0.95rem', color: '#0f172a',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{ fontWeight: '700', minWidth: '20px' }}>{op.letra}.</span>
                    <span>{op.texto}</span>
                    {revelada && op.letra === pregunta.respuesta_correcta && (
                      <span style={{ marginLeft: 'auto', color: '#16a34a', fontWeight: '700', fontSize: '0.85rem' }}>✓ CORRECTA</span>
                    )}
                    {revelada && op.letra === seleccion && op.letra !== pregunta.respuesta_correcta && (
                      <span style={{ marginLeft: 'auto', color: '#dc2626', fontWeight: '700', fontSize: '0.85rem' }}>✗ INCORRECTA</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CARD EXPLICACION */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #16a34a' }}>

              {/* COMENTARIO GENERAL */}
              <h3 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem', marginTop: 0 }}>
                💬 Comentario general
              </h3>
              <div className="md-content" style={{ color: '#334155', lineHeight: '1.8', fontSize: '0.95rem' }}>
                <ReactMarkdown {...mdProps}>{pregunta.comentario_general}</ReactMarkdown>
              </div>

              {/* IMAGEN SOLUCION */}
              {pregunta.imagen_solucion && (
                <img
                  src={`/soluciones/${pregunta.imagen_solucion}`}
                  alt="Imagen solución"
                  style={{ maxWidth: '100%', borderRadius: '8px', margin: '1.5rem 0' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              )}

              {/* EXPLICACION OPCIONES */}
              {pregunta.explicacion_opciones && (
                <>
                  <h3 style={{ color: '#0f172a', fontSize: '0.95rem', fontWeight: '700', margin: '1.5rem 0 0.75rem' }}>
                    🔎 Explicación por opción
                  </h3>
                  <div className="md-content" style={{ color: '#334155', lineHeight: '1.8', fontSize: '0.95rem' }}>
                    <ReactMarkdown {...mdProps}>{pregunta.explicacion_opciones}</ReactMarkdown>
                  </div>
                </>
              )}

              {/* OBJETIVO EDUCATIVO */}
              {pregunta.objetivo_educativo && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem', marginTop: '1.5rem' }}>
                  <h3 style={{ color: '#14532d', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem', marginTop: 0 }}>🎯 Objetivo educativo</h3>
                  <div className="md-content" style={{ color: '#166534', lineHeight: '1.7', fontSize: '0.9rem' }}>
                    <ReactMarkdown {...mdProps}>{pregunta.objetivo_educativo}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* BIBLIOGRAFIA */}
              {pregunta.bibliografia && (
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', marginTop: '1rem' }}>
                  <h3 style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', marginTop: 0 }}>📚 Bibliografía</h3>
                  <div className="md-content" style={{ color: '#64748b', lineHeight: '1.7', fontSize: '0.85rem' }}>
                    <ReactMarkdown {...mdProps}>{pregunta.bibliografia}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* DATOS TECNICOS */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: <strong style={{ color: '#475569' }}>{pregunta.id}</strong></span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Respuesta: <strong style={{ color: '#16a34a' }}>{pregunta.respuesta_correcta}</strong></span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>img_pregunta: <strong style={{ color: '#475569' }}>{pregunta.imagen_pregunta || 'null'}</strong></span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>img_solucion: <strong style={{ color: '#475569' }}>{pregunta.imagen_solucion || 'null'}</strong></span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
