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

const secciones = [
  {
    numero: '01',
    titulo: 'Aceptación de los términos',
    texto: 'Al registrarte y usar High Yields, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no debes usar la plataforma.'
  },
  {
    numero: '02',
    titulo: 'Uso de la plataforma',
    texto: 'High Yields es una plataforma educativa diseñada exclusivamente para estudiantes de medicina. El acceso es personal e intransferible. Queda prohibido compartir tu cuenta con terceros.'
  },
  {
    numero: '03',
    titulo: 'Propiedad intelectual',
    texto: 'Todo el contenido de High Yields, incluyendo preguntas, explicaciones, imágenes y material educativo, es propiedad exclusiva de High Yields y sus creadores. Queda estrictamente prohibida la reproducción, distribución, publicación o cualquier uso del contenido sin autorización escrita previa. El incumplimiento podrá derivar en acciones legales.'
  },
  {
    numero: '04',
    titulo: 'Confidencialidad del contenido',
    texto: 'Las preguntas y material educativo de High Yields son confidenciales. El usuario se compromete a no reproducir, copiar, fotografiar, grabar ni difundir el contenido de la plataforma por ningún medio, incluyendo redes sociales, grupos de mensajería o cualquier otro canal.'
  },
  {
    numero: '05',
    titulo: 'Acceso y pagos',
    texto: 'El acceso a High Yields requiere autorización previa. Los pagos realizados no son reembolsables una vez activado el acceso a la plataforma.'
  },
  {
    numero: '06',
    titulo: 'Modificaciones',
    texto: 'High Yields se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma y entrarán en vigor inmediatamente.'
  },
  {
    numero: '07',
    titulo: 'Limitación de responsabilidad',
    texto: 'High Yields no garantiza resultados académicos específicos. El contenido es de carácter educativo y complementario. No reemplaza el criterio médico profesional ni los materiales oficiales de estudio.'
  },
  {
    numero: '08',
    titulo: 'Contacto',
    texto: 'Para cualquier consulta sobre estos términos, puedes contactarnos a través de los canales oficiales de High Yields.'
  },
]

export default function Terminos() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.mist, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
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
        .nav-btn:hover { border-color: rgba(255,255,255,0.7); color: white; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 2.5rem', height: '58px',
        backgroundColor: T.forest,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="High Yields" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'white', fontWeight: '800', fontSize: '0.95rem', letterSpacing: '0.06em' }}>HIGH YIELDS</span>
        </div>
        <button className="nav-btn" onClick={() => window.close()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Cerrar
        </button>
      </nav>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: `1px solid ${T.border}` }}>
          <p style={{ fontSize: '0.72rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Documento legal
          </p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: '900', color: T.forest, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Términos y condiciones
          </h1>
          <p style={{ fontSize: '0.85rem', color: T.textMuted, margin: 0 }}>
            Última actualización: Junio 2026
          </p>
        </div>

        {/* Secciones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {secciones.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '1.5rem',
                padding: '1.75rem 0',
                borderBottom: i < secciones.length - 1 ? `1px solid ${T.border}` : 'none',
              }}
            >
              {/* Número */}
              <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  color: T.lime,
                  letterSpacing: '0.06em',
                  fontVariantNumeric: 'tabular-nums',
                  backgroundColor: T.forest,
                  padding: '3px 8px',
                  borderRadius: '5px',
                }}>
                  {s.numero}
                </span>
              </div>

              {/* Contenido */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  color: T.forest,
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  margin: '0 0 8px',
                  letterSpacing: '-0.01em',
                }}>
                  {s.titulo}
                </h3>
                <p style={{
                  color: T.textMuted,
                  lineHeight: '1.75',
                  fontSize: '0.9rem',
                  margin: 0,
                }}>
                  {s.texto}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${T.border}`,
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
            onClick={() => window.close()}
            style={{
              backgroundColor: T.emerald, color: 'white', border: 'none',
              padding: '9px 20px', borderRadius: '7px', fontSize: '0.85rem',
              fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  )
}
