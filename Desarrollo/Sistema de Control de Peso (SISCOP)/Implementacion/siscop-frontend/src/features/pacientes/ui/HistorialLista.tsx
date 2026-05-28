import React from 'react';
import { FileText, Printer, Edit } from 'lucide-react';
import type { Evaluacion } from '../../../mocks/mockPacientes';

interface HistorialListaProps {
    evaluaciones: Evaluacion[];
    todasLasEvaluaciones: Evaluacion[];
    isNutricionista: boolean;
    pacienteId: string;
    onVerRegistro: (ev: Evaluacion) => void;
    onImprimirPDF: (evalId: string) => void;
    onEditarRegistro: (ev: Evaluacion) => void;
}

export function HistorialLista({
    evaluaciones,
    todasLasEvaluaciones,
    isNutricionista,
    onVerRegistro,
    onImprimirPDF,
    onEditarRegistro
}: HistorialListaProps) {
    const displayFecha = (fechaStr: string) => {
        return fechaStr.replace(/-/g, ' / ');
    };

    if (evaluaciones.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500">No se encontraron evaluaciones con los filtros aplicados.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {evaluaciones.map((ev) => {
                // Solo la última evaluación absoluta del paciente es editable
                const esEditable = todasLasEvaluaciones[0]?.id === ev.id;

                return (
                    <div
                        key={ev.id}
                        className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl p-4 flex items-center justify-between transition-colors shadow-none"
                    >
                        <div className="w-1/3" />
                        {/* Fecha centrada */}
                        <div className="text-center w-1/3 text-sm font-semibold text-slate-700 select-none">
                            {displayFecha(ev.fecha)}
                        </div>
                        {/* Iconos de acción a la derecha */}
                        <div className="w-1/3 flex justify-end items-center gap-4">
                            <button
                                onClick={() => onVerRegistro(ev)}
                                className="text-slate-400 hover:text-[#1A82C4] cursor-pointer transition-colors p-1"
                                title="Ver Registro"
                            >
                                <FileText className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => onImprimirPDF(ev.id)}
                                className="text-slate-400 hover:text-[#1A82C4] cursor-pointer transition-colors p-1"
                                title="Ver PDF"
                            >
                                <Printer className="w-5 h-5" />
                            </button>

                            {isNutricionista && esEditable && (
                                <button
                                    onClick={() => onEditarRegistro(ev)}
                                    className="text-[#1A82C4] hover:text-[#156fa9] cursor-pointer transition-colors p-1"
                                    title="Editar Registro"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
