import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/SISCOP-AUTH';
import { LayoutDashboard, Users, User, LogOut } from 'lucide-react';
export function Sidebar() {
    const { usuario } = useAuth();
    const rol = usuario?.rol;
    const navigate = useNavigate();
    const location = useLocation();
    const roleLower = rol?.toLowerCase() || '';
    const displayName = rol === 'Nutricionista' ? `Dra. ${usuario?.apellidos || ''}` : `${usuario?.nombre || ''} ${usuario?.apellidos || ''}`;
    const isActive = (path: string) => location.pathname.includes(`/${path}`);
    return (
        <aside className="w-[210px] bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 flex-shrink-0 select-none">
            {/* Header del Sidebar (Fila superior alineada con el Headbar a 85px) */}
            <div className="h-[85px] border-b border-slate-200 flex items-center px-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img src="/logoblanco.svg" alt="Logo SISCOP" className="w-10 h-10 object-contain" />
                    <div className="flex flex-col justify-center">
                        <h3 className="m-0 text-[#1A82C4] text-xl font-black leading-none">SISCOP</h3>
                        <span className="text-[12px] text-slate-400 font-bold -mt-0.5">Portal {rol}</span>
                    </div>
                </div>
            </div>

            {/* Cuerpo del Sidebar */}
            <div className="flex flex-col flex-1 p-4 overflow-y-auto">
                {/* Navegación */}
                <nav className="flex flex-col gap-2 flex-1">
                    <Link
                        to={`/${roleLower}/dashboard`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${isActive('dashboard')
                            ? 'bg-[#1A82C4] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <LayoutDashboard className="w-[22px] h-[22px]" />
                        Dashboard
                    </Link>
                    <Link
                        to={`/${roleLower}/pacientes`}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${isActive('pacientes')
                            ? 'bg-[#1A82C4] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                    >
                        <Users className="w-[22px] h-[22px]" />
                        Pacientes
                    </Link>
                </nav>

                {/* Footer con Tarjeta de Usuario */}
                <div className="border-t border-slate-100 pt-4 mt-auto space-y-3">
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-[#1A82C4] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                            <User className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="m-0 text-[14px] font-bold text-slate-800 truncate">
                                {displayName || 'Usuario'}
                            </p>
                            <p className="m-0 text-[12px] text-slate-500 font-semibold">{rol}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full flex items-center justify-center gap-2.5 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl text-[15px] font-bold transition-colors cursor-pointer"
                    >
                        <LogOut className="w-[20px] h-[20px]" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </aside>
    );
}
