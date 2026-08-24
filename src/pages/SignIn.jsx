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
  borderFocus: '#2563a8',
  lime:        '#60a5d4',
  error:       '#dc2626',
  errorBg:     '#fef2f2',
  errorBorder: '#fca5a5',
}

export default function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })
  const [focused, setFocused] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) { setError('Completa todos los campos.'); return }
    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password
    })
    setLoading(false)
    if (signInError) { setError('Correo o contraseña incorrectos.'); return }
    navigate('/areas')
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://target-app-gray.vercel.app/areas' }
    })
  }

  const inputStyle = (name) => ({
    width: '100%',
    padding: '11px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${focused === name ? T.borderFocus : T.border}`,
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    color: T.text,
    backgroundColor: focused === name ? '#eff6ff' : T.surface,
    transition: 'border-color 0.15s, background 0.15s',
    fontFamily: 'inherit',
  })

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
          margin-top: 1.5rem;
        }
        .btn-submit:hover:not(:disabled) {
          background-color: #1a3f6b;
          transform: translateY(-1px);
        }
        .btn-submit:disabled { opacity: 0.65; cursor: default; }

        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: white;
          color: #0f1a2e;
          border: 1.5px solid #cbd5e1;
          padding: 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          font-family: inherit;
        }
        .btn-google:hover {
          border-color: #2563a8;
          background: #eff6ff;
        }

        .link-text {
          color: #2563a8;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1.5px solid transparent;
          transition: border-color 0.15s;
        }
        .link-text:hover { border-bottom-color: #2563a8; }
      `}</style>

      {/* Panel izquierdo */}
      <div style={{
        width: '42%',
        backgroundColor: T.forest,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }} className="left-panel">
        <style>{`
          @media (max-width: 768px) { .left-panel { display: none !important; } }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="High Yields" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
          <span style={{ color: 'white', fontWeight: '800', fontSize: '1rem', letterSpacing: '0.06em' }}>HIGH YIELDS</span>
        </div>

        <div>
          <svg width="100%" height="48" viewBox="0 0 300 48" style={{ marginBottom: '2rem', opacity: 0.4 }}>
            <polyline
              points="0,28 60,28 80,28 90,8 100,40 110,4 120,40 130,28 180,28 300,28"
              fill="none" stroke="#60a5d4" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
            Plataforma médica
          </p>
          <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: '900', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.02em' }}>
            Prepárate con preguntas de nivel USMLE.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            Más de 500 preguntas clínicas con explicaciones detalladas, modo examen cronometrado y seguimiento de tu progreso.
          </p>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem' }}>
            {[{ n: '+500', l: 'Preguntas' }, { n: '6', l: 'Especialidades' }, { n: '100%', l: 'Gratuito' }].map(s => (
              <div key={s.l}>
                <p style={{ color: T.lime, fontSize: '1.4rem', fontWeight: '900', margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>{s.n}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', fontWeight: '500', margin: '3px 0 0' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', margin: 0 }}>
          © 2026 High Yields
        </p>

        <div style={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '280px', height: '280px', borderRadius: '50%',
          border: '1px solid rgba(96,165,212,0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', right: '-40px',
          width: '180px', height: '180px', borderRadius: '50%',
          border: '1px solid rgba(96,165,212,0.08)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Panel derecho */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: T.forest, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Bienvenido de vuelta
            </h1>
            <p style={{ fontSize: '0.9rem', color: T.textMuted, margin: 0 }}>
              Ingresa a tu cuenta para continuar estudiando.
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: T.errorBg, border: `1px solid ${T.errorBorder}`,
              color: T.error, padding: '10px 14px', borderRadius: '8px',
              fontSize: '0.85rem', marginBottom: '1.25rem',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: T.forest, marginBottom: '5px' }}>
              Correo electrónico
            </label>
            <input
              name="email" type="email" placeholder="juan@email.com"
              onChange={handleChange}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused('')}
              style={inputStyle('email')}
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: T.forest, marginBottom: '5px' }}>
              Contraseña
            </label>
            <input
              name="password" type="password" placeholder="Tu contraseña"
              onChange={handleChange}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused('')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle('password')}
            />
          </div>

          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: T.border }} />
            <span style={{ color: T.textMuted, fontSize: '0.8rem', fontWeight: '500' }}>o</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: T.border }} />
          </div>

          <button className="btn-google" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: T.textMuted }}>
            ¿No tienes cuenta?{' '}
            <span className="link-text" onClick={() => navigate('/register')}>
              Regístrate gratis
            </span>
          </p>

        </div>
      </div>

    </div>
  )
}
