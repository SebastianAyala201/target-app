import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '', apellidoPaterno: '', apellidoMaterno: '',
    username: '', email: '', password: '', confirmPassword: '',
    terms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async () => {
    setError('')

    if (!form.nombre || !form.apellidoPaterno || !form.username || !form.email || !form.password) {
      setError('Por favor completa todos los campos obligatorios.'); return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.'); return
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.'); return
    }
    if (!form.terms) {
      setError('Debes aceptar los términos y condiciones.'); return
    }

    setLoading(true)

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          apellido_paterno: form.apellidoPaterno,
          apellido_materno: form.apellidoMaterno,
          username: form.username
        }
      }
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message); return
    }

    alert('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.')
    navigate('/signin')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif', padding: '2rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '480px', boxShadow: '0 10px 40px rgba(22,101,52,0.12)' }}>

        <h2 style={{ color: '#14532d', fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.3rem' }}>Crear cuenta</h2>
        <p style={{ color: '#16a34a', fontSize: '0.95rem', marginBottom: '1.8rem' }}>Únete a Target y empieza a practicar</p>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Nombre</label>
            <input style={inputStyle} name="nombre" type="text" placeholder="Juan" onChange={handleChange} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Apellido Paterno</label>
            <input style={inputStyle} name="apellidoPaterno" type="text" placeholder="Pérez" onChange={handleChange} />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>Apellido Materno</label>
          <input style={inputStyle} name="apellidoMaterno" type="text" placeholder="García" onChange={handleChange} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>Nombre de usuario</label>
          <input style={inputStyle} name="username" type="text" placeholder="juanperez123" onChange={handleChange} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>Correo electrónico</label>
          <input style={inputStyle} name="email" type="email" placeholder="juan@email.com" onChange={handleChange} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>Contraseña</label>
          <input style={inputStyle} name="password" type="password" placeholder="Mínimo 8 caracteres" onChange={handleChange} />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={labelStyle}>Confirmar contraseña</label>
          <input style={inputStyle} name="confirmPassword" type="password" placeholder="Repite tu contraseña" onChange={handleChange} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem' }}>
          <input type="checkbox" name="terms" id="terms" onChange={handleChange} />
          <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#166534' }}>
            Acepto los{' '}
            <span
              onClick={() => window.open('/terminos', '_blank')}
              style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}>
              términos y condiciones
            </span>
          </label>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, marginTop: '1.5rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#166534' }}>
          ¿Ya tienes cuenta?{' '}
          <span onClick={() => navigate('/signin')} style={{ fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
            Inicia sesión
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

export default Register