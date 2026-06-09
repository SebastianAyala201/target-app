import { useNavigate, useParams } from 'react-router-dom'

const areas = {
  fisiologia: {
    nombre: 'Fisiología',
    subtopicos: [
      { id: 'fisiologia_celular', nombre: 'Fisiología Celular', imagen: '/topicos/fisiologia_celular.jpg', disponible: true },
      { id: 'fisiologia_nerviosa', nombre: 'Fisiología Nerviosa', imagen: '/topicos/neurologia.jpg', disponible: false },
      { id: 'fisiologia_renal', nombre: 'Fisiología Renal', imagen: '/topicos/nefrologia.jpg', disponible: false },
    ]
  },
  fisiopatologia: {
    nombre: 'Fisiopatología',
    subtopicos: [
      { id: 'reumatologia', nombre: 'Reumatología', imagen: '/topicos/reumatologia.jpg', disponible: true },
      { id: 'nefrologia', nombre: 'Renal', imagen: '/topicos/nefrologia.jpg', disponible: true },
      { id: 'gastroenterologia', nombre: 'Gastrointestinal', imagen: '/topicos/gastroenterologia.jpg', disponible: true },
    ]
  },
  anatomia: {
    nombre: 'Anatomía',
    subtopicos: [
      { id: 'anatomia_general', nombre: 'Anatomía General', imagen: '/topicos/anatomia.jpg', disponible: false },
    ]
  },
  histologia: {
    nombre: 'Histología',
    subtopicos: [
      { id: 'histologia_general', nombre: 'Histología General', imagen: '/topicos/histologia.jpg', disponible: false },
    ]
  },
  embriologia: {
    nombre: 'Embriología',
    subtopicos: [
      { id: 'embriologia_general', nombre: 'Embriología General', imagen: '/topicos/embriologia.jpg', disponible: false },
    ]
  },
  medicina_interna: {
    nombre: 'Medicina Interna',
    subtopicos: [
      { id: 'medicina_interna_general', nombre: 'Medicina Interna', imagen: '/topicos/medicina_interna.jpg', disponible: false },
    ]
  },
}

function SubTopics() {
  const { area } = useParams()
  const navigate = useNavigate()
  const areaData = areas[area]

  if (!areaData) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf4' }}>
      <p>Área no encontrada.</p>
    </div>
  )

  const handleSubtopico = (subtopico) => {
    if (!subtopico.disponible) {
      alert('Este tópico estará disponible próximamente.')
      return
    }
    navigate(`/questions/${subtopico.id}`)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: '#166534', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>HIGH YIELDS</h1>
        <button onClick={() => navigate('/topics')} style={{ background: 'none', border: '1.5px solid white', color: 'white', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
          ← Volver a áreas
        </button>
      </nav>

      <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ color: '#14532d', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>{areaData.nombre}</h2>
        <p style={{ color: '#16a34a', fontSize: '1rem', marginBottom: '2.5rem' }}>Selecciona el tópico que deseas practicar</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {areaData.subtopicos.map((sub) => (
            <div
              key={sub.id}
              onClick={() => handleSubtopico(sub)}
              style={{
                backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(22,101,52,0.1)', cursor: 'pointer',
                opacity: sub.disponible ? 1 : 0.6, transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(22,101,52,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(22,101,52,0.1)' }}
            >
              <div style={{ height: '160px', backgroundColor: '#dcfce7', overflow: 'hidden' }}>
                <img src={sub.imagen} alt={sub.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
              </div>
              <div style={{ padding: '1.2rem' }}>
                <h3 style={{ color: '#14532d', fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.3rem' }}>{sub.nombre}</h3>
                {sub.disponible
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

export default SubTopics