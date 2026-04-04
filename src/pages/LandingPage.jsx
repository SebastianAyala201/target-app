import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', minHeight: '100vh', backgroundColor: '#f0faf4', margin: 0 }}>

      {/* NAVBAR */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2.5rem',
        backgroundColor: '#166534',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={() => alert('Sección: ¿Quiénes somos?')}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '1rem', cursor: 'pointer', fontWeight: '500' }}>
          ¿Quiénes somos?
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/register')}
            style={{ background: 'none', border: '1.5px solid white', color: 'white', padding: '8px 22px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}>
            Login
          </button>
          <button
            onClick={() => navigate('/signin')}
            style={{ backgroundColor: '#22c55e', border: 'none', color: 'white', padding: '8px 22px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600' }}>
            Sign In
          </button>
        </div>
      </nav>

      {/* HERO — dos columnas */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '6rem 4rem 2rem',
        gap: '3rem',
        flexWrap: 'wrap'
      }}>

        {/* COLUMNA IZQUIERDA — texto */}
        <div style={{ flex: '1', minWidth: '280px', maxWidth: '520px' }}>
          <span style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            fontSize: '0.8rem',
            fontWeight: '600',
            padding: '6px 14px',
            borderRadius: '999px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Plataforma médica
          </span>

          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            fontWeight: '800',
            color: '#14532d',
            margin: '1rem 0 0.5rem',
            letterSpacing: '0.04em',
            lineHeight: 1.1
          }}>
            TARGET
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#166534',
            lineHeight: 1.7,
            marginBottom: '2rem',
            maxWidth: '420px'
          }}>
            Practica preguntas médicas de nivel profesional, analiza tu desempeño y lleva tu preparación al siguiente nivel.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/signin')}
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 14px rgba(22,163,74,0.4)'
              }}>
              Comenzar ahora
            </button>
            <button
              onClick={() => alert('Sección: ¿Quiénes somos?')}
              style={{
                backgroundColor: 'transparent',
                color: '#166534',
                border: '1.5px solid #16a34a',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
              Saber más
            </button>
          </div>

          {/* Estadísticas pequeñas */}
          <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '1.6rem', fontWeight: '800', color: '#14532d', margin: 0 }}>+500</p>
              <p style={{ fontSize: '0.85rem', color: '#4ade80', margin: 0 }}>Preguntas</p>
            </div>
            <div>
              <p style={{ fontSize: '1.6rem', fontWeight: '800', color: '#14532d', margin: 0 }}>6</p>
              <p style={{ fontSize: '0.85rem', color: '#4ade80', margin: 0 }}>Especialidades</p>
            </div>
            <div>
              <p style={{ fontSize: '1.6rem', fontWeight: '800', color: '#14532d', margin: 0 }}>100%</p>
              <p style={{ fontSize: '0.85rem', color: '#4ade80', margin: 0 }}>Gratuito</p>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA — imagen */}
        <div style={{ flex: '1', minWidth: '280px', maxWidth: '500px', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/medicina.png"
            alt="Medicina"
            style={{
              width: '100%',
              maxWidth: '460px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(22,101,52,0.25)',
              objectFit: 'cover'
            }}
          />
        </div>

      </div>

    </div>
  )
}

export default LandingPage