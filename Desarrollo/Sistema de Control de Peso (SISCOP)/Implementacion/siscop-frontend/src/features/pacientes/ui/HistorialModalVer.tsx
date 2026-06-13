
import { X, Activity, FileText, Calendar, Scale } from 'lucide-react';
import type { Evaluacion } from '../../../mocks/mockPacientes';

interface HistorialModalVerProps {
    isOpen: boolean;
    evaluacion: Evaluacion | null;
    onClose: () => void;
}

export function HistorialModalVer({
    isOpen,
    evaluacion,
    onClose,
}: HistorialModalVerProps) {
    if (!isOpen || !evaluacion) return null;

    const imcValue = evaluacion.imc;
    const imcInfo = (() => {
        if (imcValue <= 0) return { label: 'Sin datos', colorClass: 'bg-slate-50 text-slate-400 border border-slate-200' };
        if (imcValue < 18.5) return { label: 'Bajo peso', colorClass: 'bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB]' };
        if (imcValue < 25) return { label: 'Normal', colorClass: 'bg-[#E2F0EC] text-[#2E7D32] border border-[#BDE5D8]' };
        if (imcValue < 30) return { label: 'Sobrepeso', colorClass: 'bg-[#FFF3E0] text-[#EF6C00] border border-[#FFE0B2]' };
        return { label: 'Obesidad', colorClass: 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]' };
    })();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={onClose}></div>

            <div className="relative bg-white border border-slate-100 rounded-3xl p-8 w-full max-w-3xl shadow-xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 z-10">
                {/* Cabecera del modal */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Detalle de Consulta</h3>
                        <p className="text-xs text-slate-400 font-semibold mt-1">
                            Evaluación registrada el {evaluacion.fecha.replace(/-/g, ' / ')}
                        </p>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Cerrar
                    </button>
                </div>

                {/* Contenido */}
                <div className="space-y-6">
                    {/* Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#1A82C4]" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Consulta</p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">{evaluacion.fecha.replace(/-/g, ' / ')}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#1A82C4]" />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Próximo Control Programado</p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                    {evaluacion.fechaProximoControl ? evaluacion.fechaProximoControl.replace(/-/g, ' / ') : 'No agendado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Datos Antropométricos */}
                    <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#1A82C4]" />
                            <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Datos Antropométricos</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white border border-slate-200/60 rounded-xl px-4 py-2.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peso</label>
                                <p className="text-sm font-bold text-slate-850 mt-0.5">{evaluacion.peso} kg</p>
                            </div>
                            <div className="bg-white border border-slate-200/60 rounded-xl px-4 py-2.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talla</label>
                                <p className="text-sm font-bold text-slate-850 mt-0.5">{evaluacion.talla} cm</p>
                            </div>
                            <div className="bg-white border border-slate-200/60 rounded-xl px-4 py-2.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perímetro Abd.</label>
                                <p className="text-sm font-bold text-slate-850 mt-0.5">{evaluacion.perimetroAbdominal} cm</p>
                            </div>
                        </div>
                    </div>

                    {/* Fila Inferior: IMC e Indicaciones */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Tarjeta de IMC */}
                        <div className="md:col-span-1 flex flex-col justify-stretch">
                            <div className={`p-5 rounded-2xl flex flex-col justify-center items-center text-center h-full border ${imcInfo.colorClass}`}>
                                <Scale className="w-5 h-5 mb-1.5 opacity-80" />
                                <span className="text-[9px] font-bold uppercase tracking-wider opacity-85">IMC Resultante</span>
                                <h4 className="text-3xl font-extrabold my-1">{imcValue.toFixed(1)}</h4>
                                <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white/50 rounded-full mt-0.5 border border-current/10">
                                    {imcInfo.label}
                                </span>
                            </div>
                        </div>

                        {/* Indicaciones */}
                        <div className="md:col-span-2 bg-slate-50/50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-500" />
                                <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Indicaciones Médicas</h4>
                            </div>
                            <div className="bg-white border border-slate-200/60 rounded-xl p-3.5 text-xs text-slate-600 font-semibold h-28 overflow-y-auto leading-relaxed whitespace-pre-line">
                                {evaluacion.indicaciones || 'Sin indicaciones registradas.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
