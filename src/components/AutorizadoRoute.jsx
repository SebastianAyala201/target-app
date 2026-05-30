import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AutorizadoRoute({ children }) {
    const navigate = useNavigate()
    const [verificando, setVerificando] = useState(true)
    const [autorizado, setAutorizado] = useState(false)

    useEffect(() => {
        const verificar = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                navigate('/signin')
                return
            }

            const email = session.user.email
            console.log('Email sesión:', email)

            const { data, error } = await supabase
                .from('usuarios_autorizados')
                .select('email')
                .eq('email', email)

            console.log('Data:', data)
            console.log('Error:', error)

            if (data && data.length > 0) {
                setAutorizado(true)
            } else {
                setAutorizado(false)
            }

            setVerificando(false)
        }

        verificar()
    }, [])

    if (verificando) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>
            <p style={{ color: '#166534', fontSize: '1.2rem' }}>Verificando acceso...</p>
        </div>
    )

    if (!autorizado) return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif', padding: '2rem', textAlign: 'center' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', maxWidth: '480px', boxShadow: '0 10px 40px rgba(22,101,52,0.12)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h2 style={{ color: '#14532d', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Acceso restringido</h2>
                <p style={{ color: '#166534', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    Tu cuenta aún no ha sido activada. Para obtener acceso, comunícate con el equipo de Target.
                </p>
                <button
                    onClick={async () => { await supabase.auth.signOut(); navigate('/') }}
                    style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                    Volver al inicio
                </button>
            </div>
        </div>
    )

    return children
}

export default AutorizadoRoute