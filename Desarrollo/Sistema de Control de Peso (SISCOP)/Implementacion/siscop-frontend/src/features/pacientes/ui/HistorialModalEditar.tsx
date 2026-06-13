import { useState, useEffect, useMemo } from 'react';
import { X, Activity, FileText, Calendar, Scale } from 'lucide-react';
import type { Evaluacion } from '../../../mocks/mockPacientes';
import ModalConfirmacion from '../../../components/ui/ModalConfirmacion';
import { Button } from '../../../components/ui/Boton';

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

    const [modalConfirm, setModalConfirm] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        type: 'info' | 'success' | 'warning' | 'danger';
        onConfirm: () => void | Promise<void>;
        isLoading?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: () => {}
    });

    useEffect(() => {
        if (evaluacion && isOpen) {
            setEditPeso(evaluacion.peso.toString());
            setEditTalla(evaluacion.talla.toString());
            setEditPerimetro(evaluacion.perimetroAbdominal.toString());
            
            // Convertir DD-MM-YYYY o DD/MM/YYYY a YYYY-MM-DD para compatibilidad de input type="date"
            let formattedDate = '';
            if (evaluacion.fechaProximoControl) {
                const parts = evaluacion.fechaProximoControl.replace(/\//g, '-').split('-');
                if (parts.length === 3) {
                    formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }
            if (!formattedDate) {
                const d = new Date();
                d.setMonth(d.getMonth() + 1);
                formattedDate = d.toISOString().split('T')[0];
            }
            setEditProximoControl(formattedDate);
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

    const imcInfo = useMemo(() => {
        if (editImc <= 0) {
            return {
                label: 'Ingresa peso/talla',
                colorClass: 'bg-slate-50 text-slate-400 border border-slate-200'
            };
        }
        if (editImc < 18.5) {
            return {
                label: 'Bajo peso',
                colorClass: 'bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB]'
            };
        }
        if (editImc < 25) {
            return {
                label: 'Normal',
                colorClass: 'bg-[#E2F0EC] text-[#2E7D32] border border-[#BDE5D8]'
            };
        }
        if (editImc < 30) {
            return {
                label: 'Sobrepeso',
                colorClass: 'bg-[#FFF3E0] text-[#EF6C00] border border-[#FFE0B2]'
            };
        }
        return {
            label: 'Obesidad',
            colorClass: 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]'
        };
    }, [editImc]);

    const handleSave = () => {
        const pNum = parseFloat(editPeso);
        const tNum = parseFloat(editTalla);
        const perNum = parseFloat(editPerimetro);

        const showWarning = (msg: string) => {
            setModalConfirm({
                isOpen: true,
                title: 'Dato Requerido o Inválido',
                message: msg,
                type: 'warning',
                confirmText: 'Corregir',
                cancelText: 'Cerrar',
                onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
            });
        };

        if (!pNum || isNaN(pNum) || pNum <= 0) {
            showWarning('Por favor, ingresa un peso válido (mayor a 0 kg).');
            return;
        }
        if (!tNum || isNaN(tNum) || tNum <= 0) {
            showWarning('Por favor, ingresa una talla válida en centímetros (mayor a 0 cm).');
            return;
        }
        if (!perNum || isNaN(perNum) || perNum <= 0) {
            showWarning('Por favor, ingresa un perímetro abdominal válido en centímetros.');
            return;
        }
        if (!editIndicaciones.trim()) {
            showWarning('Por favor, ingresa las indicaciones nutricionales.');
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

            setModalConfirm({
                isOpen: true,
                title: 'Confirmar Modificación',
                message: '¿Está seguro de que desea guardar los cambios en esta evaluación?',
                type: 'info',
                confirmText: 'Guardar',
                cancelText: 'Cancelar',
                onConfirm: () => {
                    setModalConfirm(prev => ({ ...prev, isOpen: false }));
                    onSave(updatedEval, editProximoControl);
                }
            });
        }
    };

    if (!isOpen || !evaluacion) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={onClose}></div>

            <div className="relative bg-white border border-slate-100 rounded-3xl p-8 w-full max-w-3xl shadow-xl flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 z-50">
                {/* Cabecera del modal */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Editar Registro</h3>
                        <p className="text-xs text-slate-400 font-semibold mt-1">
                            Modifique los datos de la consulta del {evaluacion.fecha.replace(/-/g, ' / ')}
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

                {/* Formulario */}
                <div className="space-y-6">
                    {/* Fecha de próximo control */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#1A82C4]" />
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha de Próximo Control</label>
                            </div>
                        </div>
                        <input
                            type="date"
                            value={editProximoControl}
                            onChange={(e) => setEditProximoControl(e.target.value)}
                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#1A82C4] focus:ring-2 focus:ring-[#1A82C4]/10 transition-all cursor-pointer w-48 text-center"
                        />
                    </div>

                    {/* Datos Antropométricos */}
                    <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#1A82C4]" />
                            <h4 className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Datos Antropométricos</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peso (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={editPeso}
                                    onChange={(e) => setEditPeso(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#1A82C4] focus:ring-2 focus:ring-[#1A82C4]/10 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Talla (cm)</label>
                                <input
                                    type="number"
                                    value={editTalla}
                                    onChange={(e) => setEditTalla(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#1A82C4] focus:ring-2 focus:ring-[#1A82C4]/10 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perímetro Abd. (cm)</label>
                                <input
                                    type="number"
                                    value={editPerimetro}
                                    onChange={(e) => setEditPerimetro(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#1A82C4] focus:ring-2 focus:ring-[#1A82C4]/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fila Inferior: IMC e Indicaciones */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Tarjeta de IMC */}
                        <div className="md:col-span-1 flex flex-col justify-stretch">
                            <div className={`p-5 rounded-2xl flex flex-col justify-center items-center text-center h-full border transition-all ${imcInfo.colorClass}`}>
                                <Scale className="w-5 h-5 mb-1.5 opacity-80" />
                                <span className="text-[9px] font-bold uppercase tracking-wider opacity-85">IMC Resultante</span>
                                <h4 className="text-3xl font-extrabold my-1">{editImc > 0 ? editImc.toFixed(1) : '--.-'}</h4>
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
                            <textarea
                                value={editIndicaciones}
                                onChange={(e) => setEditIndicaciones(e.target.value)}
                                placeholder="Observaciones médicas internas, antecedentes, diagnóstico..."
                                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 outline-none focus:border-[#1A82C4] focus:ring-2 focus:ring-[#1A82C4]/10 transition-all h-28 resize-none font-medium leading-relaxed"
                            />
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        className="px-6"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="primary"
                        className="px-6"
                    >
                        Guardar Cambios
                    </Button>
                </div>
            </div>

            <ModalConfirmacion
                isOpen={modalConfirm.isOpen}
                onClose={() => setModalConfirm(prev => ({ ...prev, isOpen: false }))}
                onConfirm={modalConfirm.onConfirm}
                title={modalConfirm.title}
                message={modalConfirm.message}
                confirmText={modalConfirm.confirmText}
                cancelText={modalConfirm.cancelText}
                type={modalConfirm.type}
                isLoading={modalConfirm.isLoading}
            />
        </div>
    );
}

