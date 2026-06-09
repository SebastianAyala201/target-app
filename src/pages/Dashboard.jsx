import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [porTopico, setPorTopico] = useState([])
  const [recientes, setRecientes] = useState([])
  const [semana, setSemana] = useState([])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { navigate('/signin'); return }

    const { data } = await supabase
      .from('sesiones_usuario')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (data) {
      const total = data.length
      const correctas = data.filter(r => r.correcta).length
      const incorrectas = total - correctas
      const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0
      setStats({ total, correctas, incorrectas, porcentaje })

      // Por tópico
      const topicos = {}
      data.forEach(r => {
        if (!topicos[r.topico]) topicos[r.topico] = { total: 0, correctas: 0 }
        topicos[r.topico].total++
        if (r.correcta) topicos[r.topico].correctas++
      })
      const topicosArr = Object.entries(topicos).map(([topico, d]) => ({
        topico, total: d.total, correctas: d.correctas,
        porcentaje: Math.round((d.correctas / d.total) * 100)
      })).sort((a, b) => b.total - a.total)
      setPorTopico(topicosArr)

      // Últimas 5 sesiones por día
      const porDia = {}
      data.forEach(r => {
        const dia = r.created_at.split('T')[0]
        if (!porDia[dia]) porDia[dia] = { total: 0, correctas: 0 }
        porDia[dia].total++
        if (r.correcta) porDia[dia].correctas++
      })
      const diasArr = Object.entries(porDia)
        .map(([dia, d]) => ({ dia, ...d, porcentaje: Math.round((d.correctas / d.total) * 100) }))
        .slice(0, 5)
      setRecientes(diasArr)

      // SEMANA ACTUAL
      const hoy = new Date()
      const diaSemana = hoy.getDay() // 0=dom, 1=lun...
      const lunes = new Date(hoy)
      lunes.setDate(hoy.getDate() - ((diaSemana + 6) % 7))

      const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      const semanaData = diasSemana.map((nombre, i) => {
        const fecha = new Date(lunes)
        fecha.setDate(lunes.getDate() + i)
        const fechaStr = fecha.toISOString().split('T')[0]
        const hoySt = hoy.toISOString().split('T')[0]
        const esFuturo = fechaStr > hoySt
        const esHoy = fechaStr === hoySt

        const registros = data.filter(r => r.created_at.split('T')[0] === fechaStr)
        const preguntas = registros.length
        const correctasDia = registros.filter(r => r.correcta).length
        const minutos = Math.round(preguntas * 2)
        const pct = preguntas > 0 ? Math.round((correctasDia / preguntas) * 100) : 0

        return { nombre, fecha: fechaStr, esHoy, esFuturo, preguntas, minutos, pct, activo: preguntas > 0 }
      })
      setSemana(semanaData)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const getMensaje = (pct) => {
    if (pct >= 80) return { texto: '¡Excelente!', color: '#16a34a' }
    if (pct >= 60) return { texto: 'Buen trabajo', color: '#ca8a04' }
    return { texto: 'Sigue practicando', color: '#dc2626' }
  }

  const formatTopico = (t) => t?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const formatFecha = (f) => new Date(f).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>
      <p style={{ color: '#166534', fontSize: '1.2rem' }}>Cargando tu progreso...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: '#166534', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>HIGH YIELDS</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/topics')} style={{ background: 'none', border: '1.5px solid white', color: 'white', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
            Practicar
          </button>
          <button onClick={handleLogout} style={{ background: 'none', border: '1.5px solid white', color: 'white', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <h2 style={{ color: '#14532d', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Mi progreso</h2>
        <p style={{ color: '#16a34a', marginBottom: '2rem' }}>Resumen de tu desempeño en High Yields</p>

        {/* CALENDARIO SEMANAL */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(22,101,52,0.08)' }}>
          <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', marginBottom: '1.2rem' }}>📅 Esta semana</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {semana.map((dia, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: dia.esHoy ? '#166534' : '#9ca3af', marginBottom: '0.4rem' }}>
                  {dia.nombre}
                </p>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: '10px', display: 'flex',
                  flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: dia.esFuturo ? '#f9fafb' : dia.activo ? '#dcfce7' : '#f3f4f6',
                  border: dia.esHoy ? '2px solid #16a34a' : '1.5px solid transparent',
                  padding: '4px'
                }}>
                  {dia.esFuturo ? (
                    <span style={{ fontSize: '1rem', color: '#d1d5db' }}>—</span>
                  ) : dia.activo ? (
                    <>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a' }}>✓</span>
                      <span style={{ fontSize: '0.65rem', color: '#166534', fontWeight: '600' }}>{dia.minutos}m</span>
                      <span style={{ fontSize: '0.6rem', color: getMensaje(dia.pct).color, fontWeight: '600' }}>{dia.pct}%</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '1rem', color: '#d1d5db' }}>—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#166534' }}>✓ Verde = estudió ese día</span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>m = minutos estimados</span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>% = aciertos del día</span>
          </div>
        </div>

        {!stats || stats.total === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(22,101,52,0.1)' }}>
            <p style={{ fontSize: '3rem', margin: '0 0 1rem' }}>📚</p>
            <h3 style={{ color: '#14532d', marginBottom: '0.5rem' }}>Aún no has respondido preguntas</h3>
            <p style={{ color: '#166534', marginBottom: '1.5rem' }}>Empieza a practicar para ver tu progreso aquí</p>
            <button onClick={() => navigate('/topics')}
              style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
              Comenzar ahora →
            </button>
          </div>
        ) : (
          <>
            {/* STATS GENERALES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total respondidas', valor: stats.total, color: '#14532d' },
                { label: 'Correctas', valor: stats.correctas, color: '#16a34a' },
                { label: 'Incorrectas', valor: stats.incorrectas, color: '#dc2626' },
                { label: 'Aciertos', valor: `${stats.porcentaje}%`, color: getMensaje(stats.porcentaje).color },
              ].map((s, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(22,101,52,0.08)' }}>
                  <p style={{ fontSize: '2rem', fontWeight: '800', color: s.color, margin: '0 0 4px' }}>{s.valor}</p>
                  <p style={{ fontSize: '0.8rem', color: '#166534', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* BARRA PROGRESO GENERAL */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(22,101,52,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: '#14532d', fontWeight: '600' }}>Rendimiento general</span>
                <span style={{ color: getMensaje(stats.porcentaje).color, fontWeight: '700' }}>{getMensaje(stats.porcentaje).texto}</span>
              </div>
              <div style={{ backgroundColor: '#dcfce7', borderRadius: '999px', height: '16px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', transition: 'width 1s ease', width: `${stats.porcentaje}%`, backgroundColor: getMensaje(stats.porcentaje).color }} />
              </div>
              <p style={{ color: '#166534', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {stats.correctas} de {stats.total} preguntas correctas
              </p>
            </div>

            {/* POR TÓPICO */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(22,101,52,0.08)' }}>
              <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', marginBottom: '1.2rem' }}>Rendimiento por tópico</h3>
              {porTopico.map((t, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#166534', fontSize: '0.9rem', fontWeight: '500' }}>{formatTopico(t.topico)}</span>
                    <span style={{ color: getMensaje(t.porcentaje).color, fontSize: '0.9rem', fontWeight: '700' }}>{t.porcentaje}% — {t.total} preguntas</span>
                  </div>
                  <div style={{ backgroundColor: '#dcfce7', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '999px', width: `${t.porcentaje}%`, backgroundColor: getMensaje(t.porcentaje).color, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* HISTORIAL POR DÍA */}
            {recientes.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(22,101,52,0.08)' }}>
                <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', marginBottom: '1.2rem' }}>Actividad reciente</h3>
                {recientes.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < recientes.length - 1 ? '1px solid #f0fdf4' : 'none' }}>
                    <span style={{ color: '#166534', fontSize: '0.9rem' }}>{formatFecha(r.dia)}</span>
                    <span style={{ color: '#166534', fontSize: '0.9rem' }}>{r.total} preguntas — {r.total * 2} min</span>
                    <span style={{ color: getMensaje(r.porcentaje).color, fontWeight: '700', fontSize: '0.9rem' }}>{r.porcentaje}% aciertos</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard