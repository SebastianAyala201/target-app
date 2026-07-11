import { useNavigate } from 'react-router-dom'

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

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      minHeight: '100vh',
      backgroundColor: T.mist,
      margin: 0,
      overflowX: 'hidden',
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        .btn-primary {
          background-color: #16a34a;
          color: white;
          border: none;
          padding: 13px 32px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
          box-shadow: 0 2px 12px rgba(22,163,74,0.28);
          font-family: inherit;
        }
        .btn-primary:hover {
          background-color: #1a5c3a;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22,163,74,0.35);
        }
        .btn-ghost {
          background: transparent;
          color: #0f3d2e;
          border: 1.5px solid #c8e6d4;
          padding: 13px 32px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          font-family: inherit;
        }
        .btn-ghost:hover {
          border-color: #16a34a;
          background: rgba(22,163,74,0.05);
        }
        .nav-link {
          background: none;
          border: none;
          color: rgba(255,255,255,0.75);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 2px;
          letter-spacing: 0.01em;
          transition: color 0.15s;
          font-family: inherit;
        }
        .nav-link:hover { color: white; }
        .nav-btn-outline {
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.35);
          color: white;
          padding: 7px 20px;
          border-radius: 7px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          font-family: inherit;
        }
        .nav-btn-outline:hover {
          border-color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.07);
        }
        .nav-btn-solid {
          background: #16a34a;
          border: none;
          color: white;
          padding: 7px 20px;
          border-radius: 7px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
          font-family: inherit;
        }
        .nav-btn-solid:hover { background: #1a5c3a; }

        .accent-bar {
          display: inline-block;
          width: 40px;
          height: 4px;
          background: #a3e635;
          border-radius: 2px;
          margin-bottom: 20px;
        }

        .opcion {
          padding: 9px 13px;
          border-radius: 8px;
          border: 1.5px solid #c8e6d4;
          font-size: 0.8rem;
          color: #0f1a14;
          display: flex;
          gap: 8px;
          align-items: center;
          background: white;
          margin-bottom: 6px;
          font-family: inherit;
        }
        .opcion.correcta {
          border-color: #16a34a;
          background: #dcfce7;
          color: #0f3d2e;
        }

        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .hero-text { max-width: 100% !important; }
          .hero-visual { display: none !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2.5rem',
        height: '58px',
        backgroundColor: T.forest,
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="/logo.png"
            alt="High Yields logo"
            style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }}
          />
          <span style={{ color: 'white', fontWeight: '800', fontSize: '1rem', letterSpacing: '0.06em' }}>
            HIGH YIELDS
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <button className="nav-link">Plataforma</button>
          <button className="nav-link">Especialidades</button>
          <button className="nav-link">Nosotros</button>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button className="nav-btn-outline" onClick={() => navigate('/register')}>Registrarse</button>
          <button className="nav-btn-solid" onClick={() => navigate('/signin')}>Iniciar sesión</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="hero-grid" style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '80px 4rem 4rem',
        gap: '4rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>

        {/* COLUMNA IZQUIERDA */}
        <div className="hero-text" style={{ flex: '1', minWidth: '300px', maxWidth: '540px' }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#dcfce7', border: '1px solid #bbf7d0',
            borderRadius: '999px', padding: '5px 14px', marginBottom: '20px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.emerald }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: T.pine, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Plataforma médica
            </span>
          </div>

          <div className="accent-bar" />

          <h1 style={{
            fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)',
            fontWeight: '900',
            color: T.forest,
            margin: '0 0 1.25rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
          }}>
            Prepárate para<br />
            <span style={{ color: T.emerald }}>el examen</span><br />
            que define tu carrera.
          </h1>

          <p style={{
            fontSize: '1.05rem', color: T.textMuted, lineHeight: 1.75,
            marginBottom: '2.25rem', maxWidth: '420px', fontWeight: '400',
          }}>
            Banco de preguntas médicas de nivel USMLE. Practica por especialidad,
            analiza tu rendimiento y estudia con explicaciones detalladas.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button className="btn-primary" onClick={() => navigate('/signin')}>Comenzar ahora</button>
            <button className="btn-ghost">Ver especialidades</button>
          </div>

          <div style={{
            display: 'flex', gap: '2.5rem',
            paddingTop: '2rem', borderTop: `1px solid ${T.border}`, flexWrap: 'wrap',
          }}>
            {[
              { n: '+500', l: 'Preguntas' },
              { n: '6',    l: 'Especialidades' },
              { n: '100%', l: 'Gratuito' },
            ].map((s, i, arr) => (
              <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                <div>
                  <p style={{ fontSize: '1.75rem', fontWeight: '800', color: T.forest, margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: '500', color: T.textMuted, margin: '2px 0 0', letterSpacing: '0.02em' }}>{s.l}</p>
                </div>
                {i < arr.length - 1 && <div style={{ width: '1px', height: '36px', background: T.border }} />}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="hero-visual" style={{
          flex: '1', minWidth: '300px', maxWidth: '440px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>

          {/* Card oscura con imagen */}
          <div style={{
            position: 'relative', borderRadius: '16px', overflow: 'hidden',
            border: `1px solid ${T.border}`,
            boxShadow: '0 24px 64px rgba(15,61,46,0.15)',
          }}>
            <img
              src="/medicina.png"
              alt="High Yields"
              style={{ width: '100%', display: 'block', objectFit: 'cover', height: '200px' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, #0f3d2eee 40%, transparent)',
            }} />
            {/* ECG decorativo sobre imagen */}
            <svg style={{ position: 'absolute', bottom: '44px', left: 0, right: 0, width: '100%' }}
              height="32" viewBox="0 0 440 32" preserveAspectRatio="none">
              <polyline
                points="0,20 80,20 100,20 110,4 120,28 130,2 140,28 150,20 200,20 440,20"
                fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"
              />
            </svg>
            <div style={{ position: 'absolute', bottom: '14px', left: '16px' }}>
              <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '600', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Modo estudio</p>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'white' }}>Preguntas clínicas nivel USMLE</p>
            </div>
          </div>

          {/* Mockup pregunta */}
          <div style={{
            backgroundColor: T.surface, borderRadius: '14px', padding: '18px 20px',
            border: `1px solid ${T.border}`, boxShadow: '0 4px 20px rgba(15,61,46,0.07)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ backgroundColor: '#dcfce7', color: T.pine, fontSize: '0.65rem', fontWeight: '700', padding: '3px 8px', borderRadius: '999px', letterSpacing: '0.04em' }}>CARDIOLOGÍA</span>
                <span style={{ backgroundColor: '#f0fdf4', color: T.textMuted, fontSize: '0.65rem', fontWeight: '600', padding: '3px 8px', borderRadius: '999px' }}>Pregunta 3 de 10</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: T.emerald }}>02:34</span>
            </div>

            {/* Enunciado */}
            <p style={{ fontSize: '0.82rem', color: T.text, lineHeight: 1.65, margin: '0 0 14px', fontWeight: '400' }}>
              Paciente de 58 años con disnea progresiva de 3 meses. ECG muestra bloqueo de rama izquierda completo. ¿Cuál es el diagnóstico más probable?
            </p>

            {/* Opciones */}
            <div className="opcion">
              <span style={{ fontWeight: '700', color: T.textMuted, minWidth: '16px' }}>A.</span>
              Cardiopatía isquémica crónica
            </div>
            <div className="opcion correcta">
              <span style={{ fontWeight: '700', minWidth: '16px' }}>B.</span>
              Miocardiopatía dilatada
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: '700', color: T.emerald }}>✓ Correcta</span>
            </div>
            <div className="opcion">
              <span style={{ fontWeight: '700', color: T.textMuted, minWidth: '16px' }}>C.</span>
              Pericarditis constrictiva
            </div>
            <div className="opcion" style={{ marginBottom: 0 }}>
              <span style={{ fontWeight: '700', color: T.textMuted, minWidth: '16px' }}>D.</span>
              Estenosis aórtica severa
            </div>
          </div>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${T.border}`,
        padding: '1.5rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <span style={{ fontSize: '0.8rem', color: T.textMuted }}>
          © 2026 High Yields — Todos los derechos reservados.
        </span>
        <button
          onClick={() => navigate('/terminos')}
          style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: T.textMuted, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
          Términos y condiciones
        </button>
      </footer>

    </div>
  )
}
