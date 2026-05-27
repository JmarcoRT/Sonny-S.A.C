import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import type { Evaluacion } from '../../../mocks/mockPacientes';

interface HistorialModalEditarProps {
    isOpen: boolean;
    evaluacion: Evaluacion | null;
    onClose: () => void;
    onSave: (updatedEval: Evaluacion, editProximoControl: string) => void;
}

export function HistorialModalEditar({
    isOpen,
    evaluacion,
    onClose,
    onSave
}: HistorialModalEditarProps) {
    const [editPeso, setEditPeso] = useState<string>('');
    const [editTalla, setEditTalla] = useState<string>('');
    const [editPerimetro, setEditPerimetro] = useState<string>('');
    const [editProximoControl, setEditProximoControl] = useState<string>('');
    const [editIndicaciones, setEditIndicaciones] = useState<string>('');

    useEffect(() => {
        if (evaluacion && isOpen) {
            setEditPeso(evaluacion.peso.toString());
            setEditTalla(evaluacion.talla.toString());
            setEditPerimetro(evaluacion.perimetroAbdominal.toString());
            setEditProximoControl('13/05/2026'); // Mock default
            setEditIndicaciones(evaluacion.indicaciones);
        }
    }, [evaluacion, isOpen]);

    const editImc = useMemo(() => {
        const pNum = parseFloat(editPeso);
        const tNum = parseFloat(editTalla);
        if (!pNum || !tNum || tNum <= 0) return 0;
        const tMeters = tNum / 100;
        return pNum / (tMeters * tMeters);
    }, [editPeso, editTalla]);

    const handleSave = () => {
        const pNum = parseFloat(editPeso);
        const tNum = parseFloat(editTalla);
        const perNum = parseFloat(editPerimetro);

        if (!pNum || isNaN(pNum) || pNum <= 0) {
            alert('Por favor, ingresa un peso válido.');
            return;
        }
        if (!tNum || isNaN(tNum) || tNum <= 0) {
            alert('Por favor, ingresa una talla válida.');
            return;
        }
        if (!perNum || isNaN(perNum) || perNum <= 0) {
            alert('Por favor, ingresa un perímetro abdominal válido.');
            return;
        }
        if (!editIndicaciones.trim()) {
            alert('Por favor, ingresa las indicaciones nutricionales.');
            return;
        }

        if (evaluacion) {
            let clasificacion: 'Bajo peso' | 'Normal' | 'Sobrepeso' | 'Obesidad' = 'Normal';
            if (editImc < 18.5) clasificacion = 'Bajo peso';
            else if (editImc < 25) clasificacion = 'Normal';
            else if (editImc < 30) clasificacion = 'Sobrepeso';
            else clasificacion = 'Obesidad';

            const updatedEval: Evaluacion = {
                ...evaluacion,
                peso: pNum,
                talla: tNum,
                perimetroAbdominal: perNum,
                imc: parseFloat(editImc.toFixed(1)),
                clasificacionImc: clasificacion,
                indicaciones: editIndicaciones
            };

            onSave(updatedEval, editProximoControl);
        }
    };

    if (!isOpen || !evaluacion) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm select-none">
            <div className="bg-white border border-slate-100 rounded-[24px] p-8 w-full max-w-3xl shadow-xl flex flex-col gap-6 relative">
                {/* Cabecera del modal */}
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">Editar Registro</h3>
                        <p className="text-sm text-slate-500 mt-1">Modifique los datos del registro</p>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Cerrar
                    </button>
                </div>

                {/* Formulario */}
                <div className="space-y-5">
                    <div>
                        <label className="text-sm font-semibold text-slate-900 block mb-2">Fecha de próximo control</label>
                        <input
                            type="date"
                            value={editProximoControl}
                            onChange={(e) => setEditProximoControl(e.target.value)}
                            className="w-full md:w-[calc(50%-10px)] bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-900 block mb-2">Peso (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={editPeso}
                                onChange={(e) => setEditPeso(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-900 block mb-2">Perímetro Abdominal (cm)</label>
                            <input
                                type="number"
                                value={editPerimetro}
                                onChange={(e) => setEditPerimetro(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-900 block mb-2">Talla (cm)</label>
                            <input
                                type="number"
                                value={editTalla}
                                onChange={(e) => setEditTalla(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-900 block mb-2">IMC</label>
                            <div className="w-full bg-[#E2F0EC] border border-[#BDE5D8] rounded-xl px-4 py-3 text-sm text-[#2E7D32] font-semibold outline-none flex items-center h-[46px]">
                                {editImc > 0 ? editImc.toFixed(1) : '--.-'}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-900 block mb-2">Indicaciones</label>
                        <textarea
                            value={editIndicaciones}
                            onChange={(e) => setEditIndicaciones(e.target.value)}
                            placeholder="Observaciones médicas internas, antecedentes, diagnóstico..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all h-40 resize-none"
                        />
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 justify-start mt-2">
                    <button
                        onClick={handleSave}
                        className="bg-[#1A82C4] hover:bg-[#156fa9] text-white font-semibold text-sm px-8 py-3 rounded-xl cursor-pointer select-none active:scale-[0.98] transition-all"
                    >
                        Guardar
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-[#EF4444] hover:bg-[#dc2626] text-white font-semibold text-sm px-8 py-3 rounded-xl cursor-pointer select-none active:scale-[0.98] transition-all"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
