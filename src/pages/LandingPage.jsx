import { useNavigate } from 'react-router-dom'

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Verde bosque profundo como color primario — diferente al verde claro genérico.
// Acento lima para contraste vibrante. Tipografía Inter + Georgia para jerarquía.
const T = {
  forest:    '#0f3d2e',   // verde oscuro profundo — navbar, headings
  pine:      '#1a5c3a',   // verde medio — hover states
  emerald:   '#16a34a',   // verde acción — botón primario
  mist:      '#f0faf4',   // fondo general
  surface:   '#ffffff',
  text:      '#0f1a14',   // casi negro con tinte verde
  textMuted: '#4a6355',
  border:    '#c8e6d4',
  lime:      '#a3e635',   // acento — solo para detalles
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
          background-color: ${T.emerald};
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
        }
        .btn-primary:hover {
          background-color: ${T.pine};
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22,163,74,0.35);
        }

        .btn-ghost {
          background: transparent;
          color: ${T.forest};
          border: 1.5px solid ${T.border};
          padding: 13px 32px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
        }
        .btn-ghost:hover {
          border-color: ${T.emerald};
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
          background: ${T.emerald};
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
        .nav-btn-solid:hover { background: ${T.pine}; }

        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .stat-number {
          font-size: 1.75rem;
          font-weight: 800;
          color: ${T.forest};
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .stat-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: ${T.textMuted};
          letter-spacing: 0.02em;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid ${T.border};
        }
        .feature-item:last-child { border-bottom: none; }

        .feature-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${T.emerald};
          margin-top: 6px;
          flex-shrink: 0;
        }

        .feature-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: ${T.forest};
          margin: 0 0 2px;
        }
        .feature-desc {
          font-size: 0.82rem;
          color: ${T.textMuted};
          margin: 0;
          line-height: 1.5;
        }

        /* Línea decorativa verde lima — signature element */
        .accent-bar {
          display: inline-block;
          width: 40px;
          height: 4px;
          background: ${T.lime};
          border-radius: 2px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .hero-text { max-width: 100% !important; }
          .hero-visual { display: none !important; }
        }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
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
        borderBottom: `1px solid rgba(255,255,255,0.06)`,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Símbolo — cruz médica minimal */}
          <div style={{
            width: '28px', height: '28px',
            backgroundColor: T.emerald,
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="5.5" y="1" width="3" height="12" rx="1" fill="white"/>
              <rect x="1" y="5.5" width="12" height="3" rx="1" fill="white"/>
            </svg>
          </div>
          <span style={{
            color: 'white',
            fontWeight: '800',
            fontSize: '1rem',
            letterSpacing: '0.06em',
          }}>HIGH YIELDS</span>
        </div>

        {/* Links centrales */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button className="nav-link" onClick={() => {}}>Plataforma</button>
          <button className="nav-link" onClick={() => {}}>Especialidades</button>
          <button className="nav-link" onClick={() => {}}>Nosotros</button>
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button className="nav-btn-outline" onClick={() => navigate('/register')}>
            Registrarse
          </button>
          <button className="nav-btn-solid" onClick={() => navigate('/signin')}>
            Iniciar sesión
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <div className="hero-grid" style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '80px 4rem 4rem',
        gap: '4rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>

        {/* COLUMNA TEXTO */}
        <div className="hero-text" style={{ flex: '1', minWidth: '300px', maxWidth: '540px' }}>

          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: '999px',
            padding: '5px 14px',
            marginBottom: '20px',
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
            fontSize: '1.05rem',
            color: T.textMuted,
            lineHeight: 1.75,
            marginBottom: '2.25rem',
            maxWidth: '420px',
            fontWeight: '400',
          }}>
            Banco de preguntas médicas de nivel USMLE. Practica por especialidad, analiza tu rendimiento y estudia con explicaciones detalladas.
          </p>

          <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button className="btn-primary" onClick={() => navigate('/signin')}>
              Comenzar ahora
            </button>
            <button className="btn-ghost" onClick={() => {}}>
              Ver especialidades
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            paddingTop: '2rem',
            borderTop: `1px solid ${T.border}`,
            flexWrap: 'wrap',
          }}>
            <div className="stat-card">
              <span className="stat-number">+500</span>
              <span className="stat-label">Preguntas</span>
            </div>
            <div style={{ width: '1px', background: T.border, alignSelf: 'stretch' }} />
            <div className="stat-card">
              <span className="stat-number">6</span>
              <span className="stat-label">Especialidades</span>
            </div>
            <div style={{ width: '1px', background: T.border, alignSelf: 'stretch' }} />
            <div className="stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-label">Gratuito</span>
            </div>
          </div>
        </div>

        {/* COLUMNA VISUAL — card lateral con features */}
        <div className="hero-visual" style={{
          flex: '1',
          minWidth: '300px',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>

          {/* Imagen + overlay */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(15,61,46,0.18)',
            border: `1px solid ${T.border}`,
          }}>
            <img
              src="/medicina.png"
              alt="Plataforma High Yields"
              style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '280px' }}
            />
            {/* Overlay degradado inferior */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
              background: `linear-gradient(to top, ${T.forest}cc, transparent)`,
            }} />
            {/* Label sobre imagen */}
            <div style={{
              position: 'absolute', bottom: '16px', left: '16px',
              color: 'white',
            }}>
              <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '500', opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Modo estudio</p>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Preguntas clínicas nivel USMLE</p>
            </div>
          </div>

          {/* Feature list card */}
          <div style={{
            backgroundColor: T.surface,
            borderRadius: '14px',
            padding: '1.5rem 1.75rem',
            border: `1px solid ${T.border}`,
            boxShadow: '0 4px 20px rgba(15,61,46,0.07)',
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1rem' }}>
              Incluido en la plataforma
            </p>

            <div className="feature-item">
              <div className="feature-dot" />
              <div>
                <p className="feature-title">Banco de preguntas por especialidad</p>
                <p className="feature-desc">Fisiología, Embriología, Histología, Anatomía y más.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-dot" />
              <div>
                <p className="feature-title">Explicaciones con KaTeX y tablas</p>
                <p className="feature-desc">Comentario general y análisis opción por opción.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-dot" />
              <div>
                <p className="feature-title">Modo examen cronometrado</p>
                <p className="feature-desc">Simula condiciones reales con temporizador ajustable.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-dot" />
              <div>
                <p className="feature-title">Dashboard de progreso</p>
                <p className="feature-desc">Seguimiento semanal y rendimiento por tópico.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── FOOTER MÍNIMO ──────────────────────────────────────────────────── */}
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
          style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: T.textMuted, cursor: 'pointer', textDecoration: 'underline' }}>
          Términos y condiciones
        </button>
      </footer>

    </div>
  )
}
