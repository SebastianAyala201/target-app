import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const T = {
  forest:      '#0f2a4a',
  pine:        '#1a3f6b',
  emerald:     '#2563a8',
  mist:        '#e8f2fb',
  surface:     '#ffffff',
  text:        '#0f1a2e',
  textMuted:   '#4a6580',
  border:      '#cbd5e1',
  lime:        '#60a5d4',
  error:       '#dc2626',
  errorBg:     '#fef2f2',
  errorBorder: '#fca5a5',
}

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState('')
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
      setError('Completa todos los campos obligatorios.'); return
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
    if (signUpError) { setError(signUpError.message); return }
    alert('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.')
    navigate('/signin')
  }

  const inputStyle = (name) => ({
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${focused === name ? T.emerald : T.border}`,
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    color: T.text,
    backgroundColor: focused === name ? '#eff6ff' : T.surface,
    transition: 'border-color 0.15s, background 0.15s',
    fontFamily: 'inherit',
  })

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: T.forest, marginBottom: '4px' }}>
        {label}
      </label>
      <input
        name={name} type={type} placeholder={placeholder}
        onChange={handleChange}
        onFocus={() => setFocused(name)}
        onBlur={() => setFocused('')}
        style={inputStyle(name)}
      />
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: T.mist,
      display: 'flex',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        .btn-submit {
          width: 100%;
          background-color: #2563a8;
          color: white;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          font-family: inherit;
          letter-spacing: 0.01em;
        }
        .btn-submit:hover:not(:disabled) {
          background-color: #1a3f6b;
          transform: translateY(-1px);
        }
        .btn-submit:disabled { opacity: 0.65; cursor: default; }

        .link-text {
          color: #2563a8;
          font-weight: 700;
          cursor: pointer;
          border-bottom: 1.5px solid transparent;
          transition: border-color 0.15s;
        }
        .link-text:hover { border-bottom-color: #2563a8; }

        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .step-item:last-child { border-bottom: none; }

        @media (max-width: 768px) { .left-panel { display: none !important; } }
      `}</style>

      {/* PANEL IZQUIERDO */}
      <div className="left-panel" style={{
        width: '40%',
        backgroundColor: T.forest,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="High Yields" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'white', fontWeight: '800', fontSize: '1rem', letterSpacing: '0.06em' }}>HIGH YIELDS</span>
        </div>

        <div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Empieza hoy
          </p>
          <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '900', lineHeight: 1.15, margin: '0 0 2rem', letterSpacing: '-0.02em' }}>
            Crea tu cuenta y accede al banco de preguntas.
          </h2>

          <div className="step-item">
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: T.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: T.forest }}>1</span>
            </div>
            <div>
              <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: '700', margin: '0 0 2px' }}>Crea tu cuenta</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>Completa el formulario con tus datos.</p>
            </div>
          </div>

          <div className="step-item">
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(96,165,212,0.15)', border: '1px solid rgba(96,165,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: T.lime }}>2</span>
            </div>
            <div>
              <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: '700', margin: '0 0 2px' }}>Confirma tu correo</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>Revisa tu bandeja de entrada.</p>
            </div>
          </div>

          <div className="step-item">
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(96,165,212,0.15)', border: '1px solid rgba(96,165,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: T.lime }}>3</span>
            </div>
            <div>
              <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: '700', margin: '0 0 2px' }}>Empieza a practicar</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>+500 preguntas clínicas te esperan.</p>
            </div>
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', margin: 0 }}>© 2026 High Yields</p>

        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '260px', height: '260px', borderRadius: '50%', border: '1px solid rgba(96,165,212,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', border: '1px solid rgba(96,165,212,0.07)', pointerEvents: 'none' }} />
      </div>

      {/* PANEL DERECHO */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '420px', paddingTop: '1rem', paddingBottom: '2rem' }}>

          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: T.forest, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Crear cuenta
            </h1>
            <p style={{ fontSize: '0.875rem', color: T.textMuted, margin: 0 }}>
              Es gratis. Siempre.
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: T.errorBg, border: `1px solid ${T.errorBorder}`, color: T.error, padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}><Field label="Nombre *" name="nombre" placeholder="Juan" /></div>
            <div style={{ flex: 1 }}><Field label="Apellido paterno *" name="apellidoPaterno" placeholder="Pérez" /></div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <Field label="Apellido materno" name="apellidoMaterno" placeholder="García (opcional)" />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Field label="Nombre de usuario *" name="username" placeholder="juanperez123" />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Field label="Correo electrónico *" name="email" type="email" placeholder="juan@email.com" />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Field label="Contraseña *" name="password" type="password" placeholder="Mínimo 8 caracteres" />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <Field label="Confirmar contraseña *" name="confirmPassword" type="password" placeholder="Repite tu contraseña" />
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '1.5rem' }}>
            <input
              type="checkbox" name="terms"
              onChange={handleChange}
              style={{ marginTop: '2px', accentColor: T.emerald, width: '15px', height: '15px', flexShrink: 0 }}
            />
            <span style={{ fontSize: '0.82rem', color: T.textMuted, lineHeight: 1.5 }}>
              Acepto los{' '}
              <span className="link-text" onClick={(e) => { e.preventDefault(); window.open('/terminos', '_blank') }}>
                términos y condiciones
              </span>
              {' '}de High Yields.
            </span>
          </label>

          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: T.textMuted }}>
            ¿Ya tienes cuenta?{' '}
            <span className="link-text" onClick={() => navigate('/signin')}>Inicia sesión</span>
          </p>

        </div>
      </div>

    </div>
  )
}
