import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const topicos = [
  { id: 'nefrologia', nombre: 'Nefrología', imagen: '/topicos/nefrologia.jpg', disponible: true },
  { id: 'fisiologia_celular' , nombre: 'Fisiología Celular', imagen: '/topicos/fisiologia_celular.jpg', disponible:true},
  { id: 'cardiologia', nombre: 'Cardiología', imagen: '/topicos/cardiologia.jpg', disponible: false },
  { id: 'neurologia', nombre: 'Neurología', imagen: '/topicos/neurologia.jpg', disponible: false },
  { id: 'gastroenterologia', nombre: 'Gastroenterología', imagen: '/topicos/gastroenterologia.jpg', disponible: false },
  { id: 'neumologia', nombre: 'Neumología', imagen: '/topicos/neumologia.jpg', disponible: false },
  { id: 'pediatria', nombre: 'Pediatría', imagen: '/topicos/pediatria.jpg', disponible: false },
]

function Topics() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleTopico = (topico) => {
    if (!topico.disponible) {
      alert('Este tópico estará disponible próximamente.')
      return
    }
    navigate(`/questions/${topico.id}`)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: '#166534', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '0.05em', margin: 0 }}>TARGET</h1>
        <button onClick={handleLogout} style={{ background: 'none', border: '1.5px solid white', color: 'white', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
          Cerrar sesión
        </button>
      </nav>

      {/* CONTENIDO */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ color: '#14532d', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Elige un tópico</h2>
        <p style={{ color: '#16a34a', fontSize: '1rem', marginBottom: '2.5rem' }}>Selecciona el área médica que deseas practicar hoy</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {topicos.map((topico) => (
            <div
              key={topico.id}
              onClick={() => handleTopico(topico)}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(22,101,52,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                opacity: topico.disponible ? 1 : 0.6,
                position: 'relative'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(22,101,52,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(22,101,52,0.1)' }}
            >
              {/* Imagen */}
              <div style={{ height: '160px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img
                  src={topico.imagen}
                  alt={topico.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>

              {/* Info */}
              <div style={{ padding: '1.2rem' }}>
                <h3 style={{ color: '#14532d', fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.3rem' }}>{topico.nombre}</h3>
                {topico.disponible
                  ? <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>✓ Disponible</span>
                  : <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Próximamente</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Topics