import React, { useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { User, X, Activity, TrendingUp, FileText } from 'lucide-react';
import { MOCK_PACIENTES, MOCK_EVALUACIONES } from '../../mocks/mockPacientes';

interface AtencionWrapperProps {
    children: React.ReactNode;
}

export default function SiscopWrap({ children }: AtencionWrapperProps) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const pacienteId = searchParams.get('id');

    // Cargar paciente
    const paciente = useMemo(() => {
        if (!pacienteId) return null;
        return MOCK_PACIENTES.find((p) => p.id === pacienteId) || null;
    }, [pacienteId]);

    // Cargar evaluaciones del paciente para el timeline
    const evaluaciones = useMemo(() => {
        if (!pacienteId) return [];
        return MOCK_EVALUACIONES
            .filter((e) => e.pacienteId === pacienteId)
            .sort((a, b) => {
                // Ordenar por fecha descendente (DD-MM-YYYY)
                const dateA = a.fecha.split('-').reverse().join('-');
                const dateB = b.fecha.split('-').reverse().join('-');
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });
    }, [pacienteId]);

    if (!pacienteId || !paciente) {
        return (
            <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-xs">
                <p className="text-slate-500 font-semibold mb-4">No se especificó un paciente válido para iniciar la atención.</p>
                <button
                    onClick={() => navigate('/nutricionista/pacientes')}
                    className="bg-[#1A82C4] hover:bg-[#156fa9] text-white font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                    Volver a Pacientes
                </button>
            </div>
        );
    }

    const currentTab = location.pathname.split('/').pop() || 'evaluacion';

    const getImcBadgeStyles = (imc: number) => {
        if (imc < 18.5) return 'bg-[#E3F2FD] text-[#1565C0]'; // Bajo peso (celeste)
        if (imc < 25) return 'bg-[#E2F0EC] text-[#2E7D32]'; // Normal (verde)
        if (imc < 30) return 'bg-[#FFF3E0] text-[#EF6C00]'; // Sobrepeso (naranja)
        return 'bg-[#FFEBEE] text-[#C62828]'; // Obesidad (rojo)
    };


    const handleTabChange = (tab: string) => {
        navigate(`/nutricionista/pacientes/atencion/${tab}?id=${pacienteId}`);
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden select-none">
            {/* Header del Paciente (Sub-headbar) */}
            <div className="w-full bg-gradient-to-r from-[#E5F6FD] to-[#E2F2ED] border-b border-slate-200/80 px-8 py-3.5 flex justify-between items-center shadow-xs flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-white text-[#1A82C4] p-2.5 rounded-full flex items-center justify-center border border-slate-100 shadow-xs">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 text-base">
                            {paciente.apellido}, {paciente.nombre}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            Nº de documento: {paciente.documento}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/nutricionista/pacientes')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm cursor-pointer select-none bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/60 px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                    <X className="w-4 h-4 text-slate-500" />
                    Cerrar historia
                </button>
            </div>

            {/* Layout Principal: Sub-Sidebar Izquierdo + Panel Contenedor Derecho */}
            <div className="flex flex-1 w-full bg-slate-50/50 overflow-hidden">
                <aside className="w-[195px] bg-white border-r border-slate-200 p-4.5 flex flex-col space-y-6 h-full overflow-y-auto flex-shrink-0">
                    {/* Resumen */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-slate-400 text-xs tracking-wider uppercase">Resumen</h4>
                        <div className="space-y-3.5">
                            <div>
                                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Edad</p>
                                <p className="text-sm text-slate-850 font-semibold mt-0.5">{paciente.edad}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Sexo</p>
                                <p className="text-sm text-slate-850 font-semibold mt-0.5">{paciente.sexo}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Teléfono</p>
                                <p className="text-sm text-slate-850 font-semibold mt-0.5">
                                    {paciente.telefono ? paciente.telefono.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : 'No registrado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Últimas Visitas */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-slate-400 text-xs tracking-wider uppercase">Últimas visitas</h4>
                        {evaluaciones.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">No hay visitas previas registradas.</p>
                        ) : (
                            <div className="relative pl-4 space-y-5 border-l border-slate-200 ml-1">
                                {evaluaciones.slice(0, 3).map((evaluacion) => (
                                    <div key={evaluacion.id} className="relative">
                                        {/* Nodo del timeline */}
                                        <div className="absolute -left-[20.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-[#1A82C4] border border-white ring-4 ring-[#1A82C4]/10" />

                                        <div className="space-y-0.5">
                                            <p className="text-xs font-semibold text-slate-400 tracking-wider">{evaluacion.fecha}</p>
                                            <p className="text-sm font-semibold text-slate-800">{evaluacion.tipo}</p>
                                            <div className="flex flex-col gap-0.5 mt-0.5 text-xs">
                                                <div className="text-slate-500 font-medium">
                                                    Peso: <span className="font-semibold text-slate-800">{evaluacion.peso} kg</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="text-slate-500 font-medium">IMC:</span>
                                                    <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${getImcBadgeStyles(evaluacion.imc)}`}>
                                                        {evaluacion.imc.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Panel de Contenido Derecho (Scrolling) */}
                <div className="flex-1 p-6 space-y-5 overflow-y-auto h-full">
                    {/* Tab Navigation */}
                    <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex gap-1.5">
                        <button
                            onClick={() => handleTabChange('evaluacion')}
                            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${currentTab === 'evaluacion'
                                ? 'bg-[#1A82C4] text-white shadow-xs'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <Activity className="w-4 h-4" />
                            Evaluación
                        </button>
                        <button
                            onClick={() => handleTabChange('evolucion')}
                            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${currentTab === 'evolucion'
                                ? 'bg-[#1A82C4] text-white shadow-xs'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Evolución
                        </button>
                        <button
                            onClick={() => handleTabChange('historial')}
                            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${currentTab === 'historial'
                                ? 'bg-[#1A82C4] text-white shadow-xs'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Historial
                        </button>
                    </div>

                    {/* Contenido Dinámico */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
