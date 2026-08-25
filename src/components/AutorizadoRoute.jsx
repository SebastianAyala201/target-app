import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AutorizadoRoute({ children }) {
    const navigate = useNavigate()
    const [verificando, setVerificando] = useState(true)

    useEffect(() => {
        const verificar = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                navigate('/signin')
                return
            }

            setVerificando(false)
        }

        verificar()
    }, [])

    if (verificando) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8f2fb', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <p style={{ color: '#1a3f6b', fontSize: '1.2rem' }}>Verificando acceso...</p>
        </div>
    )

    return children
}

export default AutorizadoRoute