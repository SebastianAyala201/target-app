import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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

const areas = [
  { id: 'fisiologia',       nombre: 'Fisiología',       imagen: '/topicos/fisiologia.jpg',       preguntas: '+23',  disponible: true  },
  { id: 'fisiopatologia',   nombre: 'Fisiopatología',   imagen: '/topicos/fisiopatologia.jpg',   preguntas: '+40',  disponible: true  },
  { id: 'anatomia',         nombre: 'Anatomía',         imagen: '/topicos/anatomia.jpg',         preguntas: '+10',  disponible: true  },
  { id: 'histologia',       nombre: 'Histología',       imagen: '/topicos/histologia.jpg',       preguntas: '+26',  disponible: true  },
  { id: 'embriologia',      nombre: 'Embriología',      imagen: '/topicos/embriologia.jpg',      preguntas: '+31',  disponible: true  },
  { id: 'medicina_interna', nombre: 'Medicina Interna', imagen: '/topicos/medicina_interna.jpg', preguntas: 'Pronto', disponible: true },
]

export default function Areas() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleArea = (area) => {
    if (!area.disponible) return
    navigate(`/topicos/${area.id}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: T.mist,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        .area-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #c8e6d4;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
          display: flex;
          flex-direction: column;
        }
        .area-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(15,61,46,0.14);
          border-color: #16a34a;
        }
        .area-card.disabled {
          cursor: default;
          opacity: 0.55;
        }
        .area-card.disabled:hover {
          transform: none;
          box-shadow: none;
          border-color: #c8e6d4;
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
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="nav-btn" onClick={() => navigate('/dashboard')}>Mi progreso</button>
          <button className="nav-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Banco de preguntas
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '900', color: T.forest, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Elige un área
          </h1>
          <p style={{ fontSize: '0.95rem', color: T.textMuted, margin: 0 }}>
            Selecciona la especialidad que quieres practicar hoy.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {areas.map((area) => (
            <div
              key={area.id}
              className={`area-card${!area.disponible ? ' disabled' : ''}`}
              onClick={() => handleArea(area)}
            >
              {/* Imagen */}
              <div style={{ height: '150px', backgroundColor: '#dcfce7', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={area.imagen}
                  alt={area.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
                {/* Badge preguntas */}
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  backgroundColor: area.disponible ? T.forest : '#6b7280',
                  color: area.disponible ? T.lime : 'white',
                  fontSize: '0.7rem', fontWeight: '800',
                  padding: '3px 10px', borderRadius: '999px',
                  letterSpacing: '0.03em',
                }}>
                  {area.preguntas} preguntas
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1.1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: T.forest, fontSize: '1rem', fontWeight: '700', margin: '0 0 3px', letterSpacing: '-0.01em' }}>
                    {area.nombre}
                  </h3>
                  {area.disponible
                    ? <span style={{ fontSize: '0.75rem', color: T.emerald, fontWeight: '600' }}>Disponible</span>
                    : <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>Próximamente</span>
                  }
                </div>
                {area.disponible && (
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    backgroundColor: '#dcfce7', border: `1.5px solid ${T.border}`,
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
          ))}
        </div>

      </div>
    </div>
  )
}
