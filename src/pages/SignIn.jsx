import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos.'); return
    }
    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })
    setLoading(false)
    if (signInError) {
      setError('Correo o contraseña incorrectos.'); return
    }
    navigate('/areas')
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://target-app-gray.vercel.app/areas'
      }
    })
  }
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif', padding: '2rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 10px 40px rgba(22,101,52,0.12)' }}>

        <h2 style={{ color: '#14532d', fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.3rem' }}>Iniciar sesión</h2>
        <p style={{ color: '#16a34a', fontSize: '0.95rem', marginBottom: '1.8rem' }}>Bienvenido de vuelta a High Yields</p>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <label style={labelStyle}>Correo electrónico</label>
        <input style={inputStyle} name="email" type="email" placeholder="juan@email.com" onChange={handleChange} />

        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>Contraseña</label>
          <input style={inputStyle} name="password" type="password" placeholder="Tu contraseña" onChange={handleChange} />
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, marginTop: '1.5rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        {/* DIVISOR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.2rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#bbf7d0' }} />
          <span style={{ color: '#166534', fontSize: '0.85rem' }}>o</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#bbf7d0' }} />
        </div>

        {/* BOTÓN GOOGLE */}
        <button onClick={handleGoogleLogin} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.75rem', backgroundColor: 'white', color: '#14532d',
          border: '1.5px solid #bbf7d0', padding: '12px', borderRadius: '8px',
          fontSize: '1rem', cursor: 'pointer', fontWeight: '500'
        }}>
          <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="Google" />
          Continuar con Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#166534' }}>
          ¿No tienes cuenta?{' '}
          <span onClick={() => navigate('/register')} style={{ fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
            Regístrate
          </span>
        </p>

      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#166534', marginBottom: '4px'
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #bbf7d0',
  fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', color: '#14532d'
}

const btnStyle = {
  width: '100%', backgroundColor: '#16a34a', color: 'white', border: 'none',
  padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
}

export default SignIn