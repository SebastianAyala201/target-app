import { useLocation, useNavigate } from 'react-router-dom'

function Stats() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const respuestas = state?.respuestas || []
  const total = state?.total || 0
  const correctas = respuestas.filter(r => r.correcta).length
  const incorrectas = respuestas.filter(r => !r.correcta).length
  const respondidas = respuestas.length
  const porcentaje = respondidas > 0 ? Math.round((correctas / respondidas) * 100) : 0

  const getMensaje = () => {
    if (porcentaje >= 80) return { texto: '¡Excelente desempeño!', color: '#16a34a' }
    if (porcentaje >= 60) return { texto: '¡Buen trabajo, sigue practicando!', color: '#ca8a04' }
    return { texto: 'Necesitas repasar más, ¡tú puedes!', color: '#dc2626' }
  }

  const mensaje = getMensaje()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: '#166534', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>TARGET</h1>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 2rem' }}>

        <h2 style={{ color: '#14532d', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Resumen de estudio</h2>
        <p style={{ color: mensaje.color, fontSize: '1.1rem', fontWeight: '600', marginBottom: '2rem' }}>{mensaje.texto}</p>

        {/* TARJETAS STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={statCardStyle}>
            <p style={statNumStyle}>{respondidas}</p>
            <p style={statLabelStyle}>Respondidas</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ ...statNumStyle, color: '#16a34a' }}>{correctas}</p>
            <p style={statLabelStyle}>Correctas</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ ...statNumStyle, color: '#dc2626' }}>{incorrectas}</p>
            <p style={statLabelStyle}>Incorrectas</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ ...statNumStyle, color: '#2563eb' }}>{porcentaje}%</p>
            <p style={statLabelStyle}>Aciertos</p>
          </div>
        </div>

        {/* BARRA DE PROGRESO */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 20px rgba(22,101,52,0.1)', marginBottom: '2rem' }}>
          <p style={{ color: '#14532d', fontWeight: '600', marginBottom: '1rem' }}>Porcentaje de aciertos</p>
          <div style={{ backgroundColor: '#dcfce7', borderRadius: '999px', height: '20px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${porcentaje}%`,
              backgroundColor: porcentaje >= 80 ? '#16a34a' : porcentaje >= 60 ? '#ca8a04' : '#dc2626',
              borderRadius: '999px',
              transition: 'width 1s ease'
            }} />
          </div>
          <p style={{ color: '#166534', fontSize: '0.9rem', marginTop: '0.5rem' }}>{correctas} de {respondidas} preguntas correctas</p>
        </div>

        {/* PREGUNTAS NO RESPONDIDAS */}
        {respondidas < total && (
          <div style={{ backgroundColor: '#fef9c3', border: '1px solid #fde047', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '2rem' }}>
            <p style={{ color: '#854d0e', fontSize: '0.95rem', margin: 0 }}>
              ⚠️ Finalizaste antes de responder todas las preguntas. Respondiste {respondidas} de {total}.
            </p>
          </div>
        )}

        {/* BOTONES */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/areas')} style={btnPrimaryStyle}>
            Volver a tópicos
          </button>
        </div>

      </div>
    </div>
  )
}

const statCardStyle = {
  backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem',
  boxShadow: '0 4px 20px rgba(22,101,52,0.1)', textAlign: 'center'
}

const statNumStyle = {
  fontSize: '2rem', fontWeight: '800', color: '#14532d', margin: '0 0 4px'
}

const statLabelStyle = {
  fontSize: '0.85rem', color: '#166534', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em'
}

const btnPrimaryStyle = {
  backgroundColor: '#16a34a', color: 'white', border: 'none',
  padding: '12px 28px', borderRadius: '8px', fontSize: '1rem',
  fontWeight: '600', cursor: 'pointer'
}

export default Stats