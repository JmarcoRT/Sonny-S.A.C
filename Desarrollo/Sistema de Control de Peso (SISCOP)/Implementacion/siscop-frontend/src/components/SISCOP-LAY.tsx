import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/SISCOP-AUTH';

export default function SiscopLay() {
    const { rol } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* SIDEBAR */}
            <aside style={{ width: '260px', background: '#fff', borderRight: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <div style={{ width: '32px', height: '32px', background: '#0284c7', borderRadius: '8px' }}></div>
                    <div>
                        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem' }}>SISCOP</h3>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Portal {rol}</span>
                    </div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <Link to={`/${rol?.toLowerCase()}/dashboard`} style={{ padding: '0.75rem 1rem', color: '#334155', textDecoration: 'none' }}>📊 Dashboard</Link>
                    <Link to={`/${rol?.toLowerCase()}/pacientes`} style={{ padding: '0.75rem 1rem', color: '#334155', textDecoration: 'none' }}>👥 Pacientes</Link>
                    {rol === 'Administrador' && (
                        <Link to="/administrador/usuarios" style={{ padding: '0.75rem 1rem', color: '#334155', textDecoration: 'none' }}>🔑 Usuarios</Link>
                    )}
                </nav>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: 'auto' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>{rol === 'Nutricionista' ? 'Dra. Silva' : 'Roberto Vargas'}</p>
                    <button onClick={() => navigate('/login')} style={{ width: '100%', background: 'none', border: 'none', color: '#ef4444', textAlign: 'left', padding: '0.5rem 0', cursor: 'pointer', fontWeight: 'bold' }}>
                        ➔ Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* CONTENEDOR CENTRAL */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                <header style={{ padding: '1rem 2rem', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>📅 Lunes, 11 de mayo 2026</span>
                </header>
                <main style={{ flex: 1, padding: '2rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}