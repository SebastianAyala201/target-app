import { useLocation, useNavigate } from 'react-router-dom'

const T = {
  forest:    '#0f2a4a',
  pine:      '#1a3f6b',
  emerald:   '#2563a8',
  mist:      '#e8f2fb',
  surface:   '#ffffff',
  text:      '#0f1a2e',
  textMuted: '#4a6580',
  border:    '#cbd5e1',
  accent:    '#60a5d4',
}

export default function Stats() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const respuestas = state?.respuestas || []
  const total = state?.total || 0
  const modoExamen = state?.modoExamen || false
  const correctas = respuestas.filter(r => r.correcta).length
  const incorrectas = respuestas.filter(r => !r.correcta).length
  const respondidas = respuestas.length
  const porcentaje = respondidas > 0 ? Math.round((correctas / respondidas) * 100) : 0

  const nivel = porcentaje >= 80 ? { texto: 'Excelente', color: T.emerald, bg: '#dbeafe', border: '#bfdbfe' }
              : porcentaje >= 60 ? { texto: 'Buen trabajo', color: '#ca8a04', bg: '#fefce8', border: '#fde047' }
              : { texto: 'Sigue practicando', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' }

  const circleSize = 140
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (porcentaje / 100) * circumference

  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.mist, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .btn-primary {
          background-color: #2563a8; color: white; border: none;
          padding: 12px 28px; border-radius: 8px; font-size: 0.9rem;
          font-weight: 700; cursor: pointer; font-family: inherit;
          transition: background 0.15s;
        }
        .btn-primary:hover { background-color: #1a3f6b; }
        .btn-sec {
          background: transparent; color: #4a6580;
          border: 1.5px solid #cbd5e1; padding: 12px 24px;
          border-radius: 8px; font-size: 0.9rem; cursor: pointer;
          font-family: inherit; transition: border-color 0.15s, color 0.15s;
        }
        .btn-sec:hover { border-color: #2563a8; color: #0f2a4a; }
        .nav-btn {
          background: transparent; border: 1.5px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.85); padding: 7px 18px; border-radius: 7px;
          font-size: 0.85rem; font-weight: 500; cursor: pointer;
          transition: border-color 0.15s; font-family: inherit;
        }
        .nav-btn:hover { border-color: rgba(255,255,255,0.7); color: white; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2.5rem', height: '58px', backgroundColor: T.forest, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="High Yields" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'white', fontWeight: '800', fontSize: '0.95rem', letterSpacing: '0.06em' }}>HIGH YIELDS</span>
        </div>
        <button className="nav-btn" onClick={() => navigate('/areas')}>Practicar de nuevo</button>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>
            {modoExamen ? 'Modo examen' : 'Modo estudio'}
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: T.forest, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Sesión completada
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: nivel.bg, border: `1px solid ${nivel.border}`, borderRadius: '999px', padding: '4px 12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: nivel.color }}>{nivel.texto}</span>
          </div>
        </div>

        {/* Card principal — círculo + stats */}
        <div style={{ backgroundColor: T.surface, borderRadius: '16px', padding: '2rem', border: `1px solid ${T.border}`, boxShadow: '0 4px 24px rgba(15,42,74,0.08)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>

            {/* Círculo de progreso SVG */}
            <div style={{ position: 'relative', width: circleSize, height: circleSize, flexShrink: 0 }}>
              <svg width={circleSize} height={circleSize} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={circleSize/2} cy={circleSize/2} r={radius} fill="none" stroke="#dbeafe" strokeWidth="10"/>
                <circle
                  cx={circleSize/2} cy={circleSize/2} r={radius}
                  fill="none" stroke={nivel.color} strokeWidth="10"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: T.forest, lineHeight: 1, letterSpacing: '-0.03em' }}>{porcentaje}%</span>
                <span style={{ fontSize: '0.7rem', fontWeight: '600', color: T.textMuted }}>aciertos</span>
              </div>
            </div>

            {/* Stats verticales */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '180px' }}>
              {[
                { label: 'Respondidas', valor: respondidas, color: T.forest },
                { label: 'Correctas',   valor: correctas,   color: T.emerald },
                { label: 'Incorrectas', valor: incorrectas,  color: '#dc2626' },
                { label: 'Sin responder', valor: total - respondidas, color: T.textMuted },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: '0.875rem', color: T.textMuted, fontWeight: '500' }}>{s.label}</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: s.color }}>{s.valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aviso preguntas sin responder */}
        {respondidas < total && (
          <div style={{ backgroundColor: '#fefce8', border: '1px solid #fde047', borderRadius: '10px', padding: '12px 16px', marginBottom: '1.25rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="8" cy="8" r="8" fill="#fbbf24"/>
              <path d="M8 5v4M8 11v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p style={{ color: '#854d0e', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              Finalizaste antes de completar la sesión. Respondiste {respondidas} de {total} preguntas.
            </p>
          </div>
        )}

        {/* Barra visual correctas/incorrectas */}
        <div style={{ backgroundColor: T.surface, borderRadius: '14px', padding: '1.5rem', border: `1px solid ${T.border}`, boxShadow: '0 2px 12px rgba(15,42,74,0.06)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: T.textMuted }}>Distribución de respuestas</span>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: nivel.color }}>{correctas} / {respondidas}</span>
          </div>
          <div style={{ display: 'flex', height: '10px', borderRadius: '999px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            {respondidas > 0 && (
              <>
                <div style={{ width: `${(correctas/respondidas)*100}%`, backgroundColor: T.emerald, transition: 'width 1s ease' }} />
                <div style={{ width: `${(incorrectas/respondidas)*100}%`, backgroundColor: '#fca5a5', transition: 'width 1s ease' }} />
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: T.emerald }} />
              <span style={{ fontSize: '0.75rem', color: T.textMuted }}>Correctas ({correctas})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fca5a5' }} />
              <span style={{ fontSize: '0.75rem', color: T.textMuted }}>Incorrectas ({incorrectas})</span>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/areas')}>Practicar de nuevo</button>
          <button className="btn-sec" onClick={() => navigate('/dashboard')}>Ver mi progreso</button>
        </div>

      </div>
    </div>
  )
}
