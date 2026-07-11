import { useState, useEffect } from 'react'
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

const getNivel = (pct) =>
  pct >= 80 ? { color: T.emerald, bg: '#dcfce7' }
: pct >= 60 ? { color: '#ca8a04', bg: '#fefce8' }
: { color: '#dc2626', bg: '#fef2f2' }

const formatTopico = (t) => t?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
const formatFecha = (f) => new Date(f + 'T12:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [porTopico, setPorTopico] = useState([])
  const [recientes, setRecientes] = useState([])
  const [semana, setSemana] = useState([])

  useEffect(() => { cargarDatos() }, [])

  const cargarDatos = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { navigate('/signin'); return }

    const { data } = await supabase
      .from('sesiones_usuario').select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (data) {
      const total = data.length
      const correctas = data.filter(r => r.correcta).length
      setStats({ total, correctas, incorrectas: total - correctas, porcentaje: total > 0 ? Math.round((correctas / total) * 100) : 0 })

      const topicosMap = {}
      data.forEach(r => {
        if (!topicosMap[r.topico]) topicosMap[r.topico] = { total: 0, correctas: 0 }
        topicosMap[r.topico].total++
        if (r.correcta) topicosMap[r.topico].correctas++
      })
      setPorTopico(Object.entries(topicosMap).map(([topico, d]) => ({
        topico, total: d.total, correctas: d.correctas,
        porcentaje: Math.round((d.correctas / d.total) * 100)
      })).sort((a, b) => b.total - a.total))

      const porDia = {}
      data.forEach(r => {
        const dia = r.created_at.split('T')[0]
        if (!porDia[dia]) porDia[dia] = { total: 0, correctas: 0 }
        porDia[dia].total++
        if (r.correcta) porDia[dia].correctas++
      })
      setRecientes(Object.entries(porDia)
        .map(([dia, d]) => ({ dia, ...d, porcentaje: Math.round((d.correctas / d.total) * 100) }))
        .slice(0, 5))

      const hoy = new Date()
      const lunes = new Date(hoy)
      lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7))
      const hoySt = hoy.toISOString().split('T')[0]
      setSemana(['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((nombre, i) => {
        const fecha = new Date(lunes)
        fecha.setDate(lunes.getDate() + i)
        const fechaStr = fecha.toISOString().split('T')[0]
        const registros = data.filter(r => r.created_at.split('T')[0] === fechaStr)
        const preguntas = registros.length
        const correctasDia = registros.filter(r => r.correcta).length
        return {
          nombre, fechaStr,
          esHoy: fechaStr === hoySt,
          esFuturo: fechaStr > hoySt,
          preguntas,
          pct: preguntas > 0 ? Math.round((correctasDia / preguntas) * 100) : 0,
          activo: preguntas > 0,
        }
      }))
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: T.mist, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: `3px solid ${T.border}`, borderTopColor: T.emerald, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: T.textMuted, fontSize: '0.9rem', margin: 0 }}>Cargando tu progreso...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: T.mist, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .nav-btn {
          background: transparent; border: 1.5px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.85); padding: 7px 18px; border-radius: 7px;
          font-size: 0.85rem; font-weight: 500; cursor: pointer;
          transition: border-color 0.15s; font-family: inherit;
        }
        .nav-btn:hover { border-color: rgba(255,255,255,0.7); color: white; }
        .card {
          background: white; border-radius: 14px; border: 1px solid #c8e6d4;
          box-shadow: 0 2px 16px rgba(15,61,46,0.06);
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2.5rem', height: '58px', backgroundColor: T.forest, position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="High Yields" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'white', fontWeight: '800', fontSize: '0.95rem', letterSpacing: '0.06em' }}>HIGH YIELDS</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="nav-btn" onClick={() => navigate('/areas')}>Practicar</button>
          <button className="nav-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>Panel de usuario</p>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '900', color: T.forest, margin: 0, letterSpacing: '-0.02em' }}>Mi progreso</h1>
        </div>

        {/* SEMANA */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1rem' }}>Esta semana</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {semana.map((dia, i) => {
              const nivel = dia.activo ? getNivel(dia.pct) : null
              return (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: '700', color: dia.esHoy ? T.emerald : T.textMuted, margin: '0 0 5px', letterSpacing: '0.02em' }}>
                    {dia.nombre}
                  </p>
                  <div style={{
                    aspectRatio: '1', borderRadius: '10px', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: dia.esFuturo ? '#f9fafb'
                                   : dia.activo ? nivel.bg : '#f3f4f6',
                    border: dia.esHoy ? `2px solid ${T.emerald}` : '1.5px solid transparent',
                    padding: '4px', gap: '1px'
                  }}>
                    {dia.activo ? (
                      <>
                        <span style={{ fontSize: '0.72rem', fontWeight: '800', color: nivel.color }}>{dia.pct}%</span>
                        <span style={{ fontSize: '0.6rem', color: T.textMuted, fontWeight: '500' }}>{dia.preguntas}p</span>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#d1d5db' }}>·</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#dcfce7' }} />
              <span style={{ fontSize: '0.7rem', color: T.textMuted }}>≥80% aciertos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#fefce8' }} />
              <span style={{ fontSize: '0.7rem', color: T.textMuted }}>60–79%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#fef2f2' }} />
              <span style={{ fontSize: '0.7rem', color: T.textMuted }}>&lt;60%</span>
            </div>
          </div>
        </div>

        {!stats || stats.total === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#dcfce7', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 6v6l4 2" stroke={T.emerald} strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="10" stroke={T.emerald} strokeWidth="2"/>
              </svg>
            </div>
            <h3 style={{ color: T.forest, fontSize: '1.1rem', fontWeight: '700', margin: '0 0 6px' }}>Sin actividad aún</h3>
            <p style={{ color: T.textMuted, fontSize: '0.875rem', margin: '0 0 1.5rem' }}>Responde preguntas para ver tu progreso aquí.</p>
            <button
              onClick={() => navigate('/areas')}
              style={{ backgroundColor: T.emerald, color: 'white', border: 'none', padding: '11px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
              Comenzar a practicar
            </button>
          </div>
        ) : (
          <>
            {/* STATS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '1.25rem' }}>
              {[
                { label: 'Total',       valor: stats.total,       color: T.forest },
                { label: 'Correctas',   valor: stats.correctas,   color: T.emerald },
                { label: 'Incorrectas', valor: stats.incorrectas,  color: '#dc2626' },
                { label: 'Aciertos',    valor: `${stats.porcentaje}%`, color: getNivel(stats.porcentaje).color },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.9rem', fontWeight: '900', color: s.color, margin: '0 0 3px', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.valor}</p>
                  <p style={{ fontSize: '0.72rem', color: T.textMuted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* RENDIMIENTO GENERAL */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Rendimiento general</p>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: getNivel(stats.porcentaje).color }}>{stats.correctas} / {stats.total}</span>
              </div>
              <div style={{ backgroundColor: '#f1f5f9', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stats.porcentaje}%`, backgroundColor: getNivel(stats.porcentaje).color, borderRadius: '999px', transition: 'width 1s ease' }} />
              </div>
            </div>

            {/* POR TÓPICO */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1.25rem' }}>Por tópico</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {porTopico.map((t, i) => {
                  const n = getNivel(t.porcentaje)
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.875rem', color: T.text, fontWeight: '500' }}>{formatTopico(t.topico)}</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: T.textMuted }}>{t.total} preguntas</span>
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: n.color, backgroundColor: n.bg, padding: '2px 8px', borderRadius: '999px' }}>{t.porcentaje}%</span>
                        </div>
                      </div>
                      <div style={{ backgroundColor: '#f1f5f9', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${t.porcentaje}%`, backgroundColor: n.color, borderRadius: '999px', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ACTIVIDAD RECIENTE */}
            {recientes.length > 0 && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: '700', color: T.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 1rem' }}>Actividad reciente</p>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {recientes.map((r, i) => {
                    const n = getNivel(r.porcentaje)
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < recientes.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                        <span style={{ fontSize: '0.85rem', color: T.text, fontWeight: '500' }}>{formatFecha(r.dia)}</span>
                        <span style={{ fontSize: '0.82rem', color: T.textMuted }}>{r.total} preguntas</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: n.color, backgroundColor: n.bg, padding: '2px 10px', borderRadius: '999px' }}>{r.porcentaje}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
