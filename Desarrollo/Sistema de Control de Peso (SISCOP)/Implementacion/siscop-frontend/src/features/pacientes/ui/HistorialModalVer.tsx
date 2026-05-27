import React from 'react';
import { X } from 'lucide-react';
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none">
            <div className="bg-white border border-slate-100 rounded-[24px] p-8 w-full max-w-3xl shadow-xl flex flex-col gap-6 relative">
                {/* Cabecera del modal */}
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">Ver Registro</h3>
                        <p className="text-sm text-slate-500 mt-1">Revise los datos ingresados</p>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Cerrar
                    </button>
                </div>

                {/* Campos del modal (Todos deshabilitados) */}
                <div className="space-y-5">
                    <div>
                        <label className="text-sm font-semibold text-slate-900 block mb-2">Fecha del control</label>
                        <input
                            type="text"
                            readOnly
                            value={evaluacion.fecha}
                            className="w-full md:w-[calc(50%-10px)] bg-slate-100/70 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-900 block mb-2">Peso (kg)</label>
                            <input
                                type="text"
                                readOnly
                                value={evaluacion.peso}
                                className="w-full bg-slate-100/70 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-900 block mb-2">Perímetro Abdominal (cm)</label>
                            <input
                                type="text"
                                readOnly
                                value={evaluacion.perimetroAbdominal}
                                className="w-full bg-slate-100/70 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-900 block mb-2">Talla (cm)</label>
                            <input
                                type="text"
                                readOnly
                                value={evaluacion.talla}
                                className="w-full bg-slate-100/70 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-900 block mb-2">IMC</label>
                            <div className="w-full bg-[#E2F0EC] border border-[#BDE5D8] rounded-xl px-4 py-3 text-sm text-[#2E7D32] font-semibold flex items-center h-[46px]">
                                {evaluacion.imc.toFixed(1)}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-900 block mb-2">Indicaciones</label>
                        <textarea
                            readOnly
                            value={evaluacion.indicaciones}
                            className="w-full bg-slate-100/70 border border-slate-200 rounded-xl p-4 text-sm font-semibold text-slate-900 outline-none h-40 resize-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
