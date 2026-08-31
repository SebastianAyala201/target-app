import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
}

const topicos = {
  fisiologia: {
    nombre: 'Fisiología',
    descripcion: 'Mecanismos fundamentales del funcionamiento del cuerpo humano.',
    topicos: [
      { id: 'fisiologia_celular',   nombre: 'Fisiología Celular',   imagen: '/topicos/fisiologia_celular.jpg',   preguntas: 19,     disponible: true  },
      { id: 'fisiologia_digestiva', nombre: 'Fisiología Digestiva', imagen: '/topicos/fisiologia_digestiva.jpg', preguntas: 36,     disponible: true  },
      { id: 'fisiologia_endocrina', nombre: 'Fisiología Endocrina', imagen: '/topicos/fisiologia_endocrina.jpg', preguntas: 1,      disponible: false },
      { id: 'fisiologia_renal',     nombre: 'Fisiología Renal',     imagen: '/topicos/fisiologia_renal.jpg',     preguntas: 80,     disponible: true  },
    ]
  },
  fisiopatologia: {
    nombre: 'Fisiopatología',
    descripcion: 'Alteraciones de los mecanismos fisiológicos en la enfermedad.',
    topicos: [
      { id: 'reumatologia',      nombre: 'Reumatología',      imagen: '/topicos/reumatologia.jpg',      preguntas: 47,     disponible: true },
      { id: 'nefrologia',        nombre: 'Nefrología',        imagen: '/topicos/nefrologia.jpg',        preguntas: 23,     disponible: true },
      { id: 'gastroenterologia', nombre: 'Gastroenterología', imagen: '/topicos/gastroenterologia.jpg', preguntas: 47,     disponible: true },
    ]
  },
  anatomia: {
    nombre: 'Anatomía',
    descripcion: 'Estructura y organización del cuerpo humano.',
    topicos: [
      { id: 'anatomia_cardiovascular', nombre: 'Cardiovascular', imagen: '/topicos/anatomia_cardiovascular.jpg', preguntas: 36,  disponible: true },
    ]
  },
  histologia: {
    nombre: 'Histología',
    descripcion: 'Estudio microscópico de los tejidos del organismo.',
    topicos: [
      { id: 'histologia_cardiovascular', nombre: 'Cardiovascular', imagen: '/topicos/histologia_cardiovascular.jpg', preguntas: 26,  disponible: true },
    ]
  },
  embriologia: {
    nombre: 'Embriología',
    descripcion: 'Desarrollo y formación de los órganos durante la gestación.',
    topicos: [
      { id: 'embriologia_cardiovascular', nombre: 'Cardiovascular', imagen: '/topicos/embriologia_cardiovascular.jpg', preguntas: 30,  disponible: true },
      { id: 'embriologia_renal',          nombre: 'Renal',          imagen: '/topicos/embriologia_renal.jpg',          preguntas: 1,   disponible: false },
    ]
  },
  medicina_interna: {
    nombre: 'Medicina Interna',
    descripcion: 'Diagnóstico y tratamiento de enfermedades del adulto.',
    topicos: [
      { id: 'hematologia', nombre: 'Hematología', imagen: '/topicos/hematologia.jpg', preguntas: 185,    disponible: true  },
      { id: 'neurologia',  nombre: 'Neurología',  imagen: '/topicos/neurologia.jpg',  preguntas: 71,     disponible: true },
    ]
  },
}

export default function Topicos() {
  const { area } = useParams()
  const navigate = useNavigate()
  const areaData = topicos[area]
  const [topicosData, setTopicosData] = useState([])

  useEffect(() => {
    async function fetchData() {
      let { data, error } = await supabase
        .from('preguntas')
        .select('topico, count(*)')
        .eq('area', area)
        .groupBy('topico')

      if (error) {
        console.error('Error fetching topicos data:', error)
      } else {
        setTopicosData(data)
      }
    }

    fetchData()
  }, [area])

  if (!areaData) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: T.mist }}>
      <p style={{ color: T.textMuted }}>Área no encontrada.</p>
    </div>
  )

  const handleTopico = (top) => {
    if (!top.disponible) return
    navigate(`/preguntas/${top.id}`)
  }

  const disponibles = topicosData.filter(t => t.count >= 10).length

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: T.mist,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        .topico-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #cbd5e1;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          display: flex;
          flex-direction: column;
        }
        .topico-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(15,42,74,0.14);
          border-color: #2563a8;
        }
        .topico-card.disabled {
          cursor: default;
          opacity: 0.5;
        }
        .topico-card.disabled:hover {
          transform: none;
          box-shadow: none;
          border-color: #cbd5e1;
        }

        .nav-btn {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.85);
          padding: 7px 18px;
          border-radius: 7px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-btn:hover {
          border-color: rgba(255,255,255,0.7);
          color: white;
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 2.5rem', height: '58px',
        backgroundColor: T.forest,
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="High Yields" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'white', fontWeight: '800', fontSize: '0.95rem', letterSpacing: '0.06em' }}>HIGH YIELDS</span>
        </div>
        <button className="nav-btn" onClick={() => navigate('/areas')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Áreas
        </button>
      </nav>

      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: T.textMuted, cursor: 'pointer', fontWeight: '500' }} onClick={() => navigate('/areas')}>
            Áreas
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 2l4 4-4 4" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: '0.82rem', color: T.forest, fontWeight: '700' }}>{areaData.nombre}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '900', color: T.forest, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {areaData.nombre}
          </h1>
          <p style={{ fontSize: '0.95rem', color: T.textMuted, margin: '0 0 16px' }}>
            {areaData.descripcion}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '4px 12px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.emerald }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: T.pine }}>
              {disponibles} {disponibles === 1 ? 'tópico disponible' : 'tópicos disponibles'}
            </span>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {areaData.topicos.map((top) => {
            const topicoData = topicosData.find(data => data.topico === top.id)
            const preguntasCount = topicoData ? topicoData.count : 0
            const disponible = preguntasCount >= 10

            return (
              <div
                key={top.id}
                className={`topico-card${!disponible ? ' disabled' : ''}`}
                onClick={() => handleTopico({...top, disponible})}
              >
                <div style={{ height: '150px', backgroundColor: '#dbeafe', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={top.imagen}
                    alt={top.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    backgroundColor: disponible ? T.forest : '#6b7280',
                    color: disponible ? T.lime : 'white',
                    fontSize: '0.7rem', fontWeight: '800',
                    padding: '3px 10px', borderRadius: '999px',
                    letterSpacing: '0.03em',
                  }}>
                    {preguntasCount} preguntas
                  </div>
                </div>

                <div style={{ padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: T.forest, fontSize: '1rem', fontWeight: '700', margin: '0 0 3px', letterSpacing: '-0.01em' }}>
                      {top.nombre}
                    </h3>
                    {disponible
                      ? <span style={{ fontSize: '0.75rem', color: T.emerald, fontWeight: '600' }}>Disponible</span>
                      : <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>Próximamente</span>
                    }
                  </div>
                  {disponible && (
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: '#dbeafe', border: `1.5px solid ${T.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M7 3l3 3-3 3" stroke={T.emerald} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}