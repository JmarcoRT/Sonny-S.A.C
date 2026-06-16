import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileText, Activity } from 'lucide-react';
import type { Paciente } from '../../mocks/mockPacientes';
import { obtenerPaciente } from '../../services/pacientes';
import { obtenerEvaluacion, actualizarEvaluacion } from '../../services/evaluacionService';
import { ApiError } from '../../services/api';
import { Button } from '../../components/ui/Boton';
import CampoTexto from '../../components/ui/CampoTexto';
import ModalConfirmacion from '../../components/ui/ModalConfirmacion';

export default function SiscopMate() {
    const { atencionId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const pacienteId = searchParams.get('id') || '';

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

    // Buscar la evaluacion a editar
    const [evaluacionExistente, setEvaluacionExistente] = useState<{
        id: string; peso: number; talla: number; perimetroAbdominal: number;
        indicaciones: string; fecha: string;
    } | null>(null);
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let activo = true;
        (async () => {
            if (!atencionId || !pacienteId) { if (activo) setLoading(false); return; }
            try {
                setLoading(true);
                const [evResp, pacResp] = await Promise.all([
                    obtenerEvaluacion(atencionId),
                    obtenerPaciente(pacienteId),
                ]);
                if (!activo) return;
                const ev = evResp.data;
                setEvaluacionExistente({
                    id: ev.id,
                    peso: ev.peso,
                    talla: ev.talla,
                    perimetroAbdominal: ev.perimetroAbdominal,
                    indicaciones: ev.indicaciones,
                    fecha: new Date(ev.fecha).toLocaleDateString('es-PE'),
                });
                setPaciente({ ...pacResp.data, telefono: pacResp.data.telefono ?? '' });
            } catch {
                if (activo) { setEvaluacionExistente(null); setPaciente(null); }
            } finally {
                if (activo) setLoading(false);
            }
        })();
        return () => { activo = false; };
    }, [atencionId, pacienteId]);

    // Inputs state
    const [peso, setPeso] = useState<string>('');
    const [talla, setTalla] = useState<string>('');
    const [perimetro, setPerimetro] = useState<string>('');
    const [indicaciones, setIndicaciones] = useState<string>('');

    // Rellenar datos existentes
    useEffect(() => {
        if (evaluacionExistente) {
            setPeso(evaluacionExistente.peso.toString());
            setTalla(evaluacionExistente.talla.toString());
            setPerimetro(evaluacionExistente.perimetroAbdominal.toString());
            setIndicaciones(evaluacionExistente.indicaciones);
        }
    }, [evaluacionExistente]);

    // Calcular IMC en tiempo real
    const imc = useMemo(() => {
        const pesoNum = parseFloat(peso);
        const tallaNum = parseFloat(talla);

        if (!pesoNum || !tallaNum || tallaNum <= 0) return 0;

        const tallaMeters = tallaNum / 100;
        return pesoNum / (tallaMeters * tallaMeters);
    }, [peso, talla]);

    const imcInfo = useMemo(() => {
        if (imc === 0) {
            return {
                label: 'Ingresa peso y talla',
                colorClass: 'bg-slate-50 text-slate-400 border border-slate-200',
                textClass: 'text-slate-500'
            };
        }
        if (imc < 18.5) {
            return {
                label: 'Bajo peso',
                colorClass: 'bg-[#E3F2FD] text-[#1565C0] border border-[#BBDEFB]',
                textClass: 'text-[#1565C0]'
            };
        }
        if (imc < 25) {
            return {
                label: 'Normal',
                colorClass: 'bg-[#E2F0EC] text-[#2E7D32] border border-[#BDE5D8]',
                textClass: 'text-[#2E7D32]'
            };
        }
        if (imc < 30) {
            return {
                label: 'Sobrepeso',
                colorClass: 'bg-[#FFF3E0] text-[#EF6C00] border border-[#FFE0B2]',
                textClass: 'text-[#EF6C00]'
            };
        }
        return {
            label: 'Obesidad',
            colorClass: 'bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]',
            textClass: 'text-[#C62828]'
        };
    }, [imc]);

    const handleBack = () => {
        navigate(`/nutricionista/pacientes/atencion/historial?id=${pacienteId}`);
    };

    const handleSave = () => {
        const pesoNum = parseFloat(peso);
        const tallaNum = parseFloat(talla);
        const perimetroNum = parseFloat(perimetro);

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

        if (!pesoNum || isNaN(pesoNum) || pesoNum <= 0) {
            showWarning('Por favor, ingresa un peso válido (mayor a 0 kg).');
            return;
        }
        if (!tallaNum || isNaN(tallaNum) || tallaNum <= 0) {
            showWarning('Por favor, ingresa una talla válida en centímetros (mayor a 0 cm).');
            return;
        }
        if (!perimetroNum || isNaN(perimetroNum) || perimetroNum <= 0) {
            showWarning('Por favor, ingresa un perímetro abdominal válido en centímetros.');
            return;
        }
        if (!indicaciones.trim()) {
            showWarning('Por favor, ingresa las indicaciones nutricionales del paciente.');
            return;
        }

        if (evaluacionExistente) {
            // Clasificacion
            let clasificacion: 'Bajo peso' | 'Normal' | 'Sobrepeso' | 'Obesidad' = 'Normal';
            if (imc < 18.5) clasificacion = 'Bajo peso';
            else if (imc < 25) clasificacion = 'Normal';
            else if (imc < 30) clasificacion = 'Sobrepeso';
            else clasificacion = 'Obesidad';

            setModalConfirm({
                isOpen: true,
                title: 'Confirmar Modificación',
                message: '¿Está seguro de que desea guardar los cambios en esta evaluación médica?',
                type: 'info',
                confirmText: 'Guardar',
                cancelText: 'Cancelar',
                onConfirm: async () => {
                    setModalConfirm(prev => ({ ...prev, isLoading: true }));
                    try {
                        await actualizarEvaluacion(evaluacionExistente.id, {
                            id_paciente: Number(pacienteId),
                            peso_kg: pesoNum,
                            talla_cm: tallaNum,
                            perimetro_abdom_cm: perimetroNum,
                            recomendaciones_ali: indicaciones.trim(), // opción C
                        });
                        setModalConfirm({
                            isOpen: true,
                            title: '¡Cambios Guardados!',
                            message: 'La evaluación médica ha sido modificada correctamente en el sistema.',
                            type: 'success',
                            confirmText: 'Aceptar',
                            cancelText: 'Cerrar',
                            onConfirm: () => {
                                setModalConfirm(prev => ({ ...prev, isOpen: false }));
                                handleBack();
                            }
                        });
                    } catch (err) {
                        const msg = err instanceof ApiError ? err.message : 'No se pudo guardar la evaluación.';
                        setModalConfirm({
                            isOpen: true,
                            title: 'Error al Guardar',
                            message: msg,   // ← acá saldrá el aviso de "plazo de 24h vencido" si aplica
                            type: 'danger',
                            confirmText: 'Cerrar',
                            cancelText: 'Cerrar',
                            onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
                        });
                    }
                }
            });
        } else {
            showWarning('No se encontró la consulta a editar.');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Cargando consulta…</div>;
    }

    if (!paciente || !evaluacionExistente) {
        return (
            <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-xs">
                <p className="text-slate-500 font-semibold mb-4">No se especificó una consulta válida para modificar.</p>
                <Button onClick={() => navigate('/nutricionista/pacientes')} variant="secondary">
                    Volver a Pacientes
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cabecera */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleBack}
                    className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 cursor-pointer bg-white transition-all shadow-xs"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-semibold text-slate-800">Modificar Consulta Médica</h2>
                    <p className="text-xs text-slate-400">Edición de registro del paciente: {paciente.apellido}, {paciente.nombre} (Fecha: {evaluacionExistente.fecha})</p>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
                {/* 1. Datos Antropomotricos */}
                <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#1A82C4]" />
                        <h3 className="font-semibold text-slate-800 text-sm">Datos Antropométricos</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CampoTexto
                            label="Peso (kg)"
                            placeholder="Ej. 67.2"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                            type="number"
                            step="0.1"
                        />
                        <CampoTexto
                            label="Talla (cm)"
                            placeholder="Ej. 165"
                            value={talla}
                            onChange={(e) => setTalla(e.target.value)}
                            type="number"
                        />
                        <CampoTexto
                            label="Perímetro Abdominal (cm)"
                            placeholder="Ej. 75"
                            value={perimetro}
                            onChange={(e) => setPerimetro(e.target.value)}
                            type="number"
                        />
                    </div>
                </div>

                {/* 2. Fila inferior: Indicaciones e IMC */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Indicaciones Nutricionales */}
                    <div className="md:col-span-2 flex flex-col">
                        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex flex-col flex-1 gap-3">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-slate-600" />
                                <h3 className="font-semibold text-slate-800 text-sm">Indicaciones nutricionales</h3>
                            </div>
                            <textarea
                                placeholder="Observaciones médicas internas, antecedentes, diagnóstico..."
                                value={indicaciones}
                                onChange={(e) => setIndicaciones(e.target.value)}
                                className="w-full h-80 bg-white border border-slate-200 rounded-xl p-4 outline-none focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all text-slate-700 text-sm resize-none flex-1"
                            />
                        </div>
                    </div>

                    {/* IMC y Acciones*/}
                    <div className="md:col-span-1 space-y-6">
                        {/* Tarjeta de IMC */}
                        <div className={`p-5 rounded-2xl transition-all ${imcInfo.colorClass}`}>
                            <p className="text-xs font-semibold uppercase tracking-wider opacity-90">IMC Calculado</p>
                            <h2 className="text-5xl font-semibold my-2">
                                {imc > 0 ? imc.toFixed(1) : '--.-'}
                            </h2>
                            <p className="text-xs font-semibold uppercase mt-1 tracking-wide">
                                {imcInfo.label}
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleSave}
                                variant="primary"
                                className="w-full justify-center select-none"
                            >
                                Guardar Cambios
                            </Button>
                            <Button
                                onClick={handleBack}
                                variant="secondary"
                                className="w-full justify-center select-none"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
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
