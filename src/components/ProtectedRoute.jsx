import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/signin')
      }
      setVerificando(false)
    }
    verificarSesion()
  }, [])

  if (verificando) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>
      <p style={{ color: '#166534', fontSize: '1.2rem' }}>Cargando...</p>
    </div>
  )

  return children
}

export default ProtectedRoute