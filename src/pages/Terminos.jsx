import { useNavigate } from 'react-router-dom'

function Terminos() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0faf4', fontFamily: 'Segoe UI, sans-serif' }}>

            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2.5rem', backgroundColor: '#166534' }}>
                <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>HIGH YIELDS</h1>
                <button onClick={() => window.close()} style={{ background: 'none', border: '1.5px solid white', color: 'white', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                    ← Cerrar
                </button>
            </nav>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
                <h2 style={{ color: '#14532d', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Términos y Condiciones</h2>
                <p style={{ color: '#166534', fontSize: '0.9rem', marginBottom: '2rem' }}>Última actualización: Junio 2026</p>

                {[
                    {
                        titulo: '1. Aceptación de los términos',
                        texto: 'Al registrarte y usar High Yields, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no debes usar la plataforma.'
                    },
                    {
                        titulo: '2. Uso de la plataforma',
                        texto: 'High Yields es una plataforma educativa diseñada exclusivamente para estudiantes de medicina. El acceso es personal e intransferible. Queda prohibido compartir tu cuenta con terceros.'
                    },
                    {
                        titulo: '3. Propiedad intelectual',
                        texto: 'Todo el contenido de High Yields, incluyendo preguntas, explicaciones, imágenes y material educativo, es propiedad exclusiva de High Yields y sus creadores. Queda estrictamente prohibida la reproducción, distribución, publicación o cualquier uso del contenido sin autorización escrita previa. El incumplimiento podrá derivar en acciones legales.'
                    },
                    {
                        titulo: '4. Confidencialidad del contenido',
                        texto: 'Las preguntas y material educativo de High Yields son confidenciales. El usuario se compromete a no reproducir, copiar, fotografiar, grabar ni difundir el contenido de la plataforma por ningún medio, incluyendo redes sociales, grupos de mensajería o cualquier otro canal.'
                    },
                    {
                        titulo: '5. Acceso y pagos',
                        texto: 'El acceso a High Yields requiere autorización previa. Los pagos realizados no son reembolsables una vez activado el acceso a la plataforma.'
                    },
                    {
                        titulo: '6. Modificaciones',
                        texto: 'High Yields se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma y entrarán en vigor inmediatamente.'
                    },
                    {
                        titulo: '7. Limitación de responsabilidad',
                        texto: 'High Yields no garantiza resultados académicos específicos. El contenido es de carácter educativo y complementario. No reemplaza el criterio médico profesional ni los materiales oficiales de estudio.'
                    },
                    {
                        titulo: '8. Contacto',
                        texto: 'Para cualquier consulta sobre estos términos, puedes contactarnos a través de los canales oficiales de High Yields.'
                    },
                ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: '#14532d', fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.titulo}</h3>
                        <p style={{ color: '#166534', lineHeight: '1.8', fontSize: '0.95rem' }}>{item.texto}</p>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Terminos