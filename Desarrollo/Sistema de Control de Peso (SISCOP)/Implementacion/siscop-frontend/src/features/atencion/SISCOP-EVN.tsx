import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Activity, FileText, Calendar } from 'lucide-react';
import SiscopWrap from './SISCOP-WRAP';
import { crearEvaluacion, listarEvaluaciones } from '../../services/evaluacionService';
import { ApiError } from '../../services/api';
import { Button } from '../../components/ui/Boton';
import CampoTexto from '../../components/ui/CampoTexto';
import ModalConfirmacion from '../../components/ui/ModalConfirmacion';

export default function SiscopEvn() {
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

    const [peso, setPeso] = useState<string>(() => sessionStorage.getItem(`peso_${pacienteId}`) || '');
    const [talla, setTalla] = useState<string>(() => sessionStorage.getItem(`talla_${pacienteId}`) || '');
    const [perimetro, setPerimetro] = useState<string>(() => sessionStorage.getItem(`perimetro_${pacienteId}`) || '');
    const [indicaciones, setIndicaciones] = useState<string>(() => sessionStorage.getItem(`indicaciones_${pacienteId}`) || '');

    // Calendar state (inicializado en 1 mes en el futuro para agendar el próximo control)
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const saved = sessionStorage.getItem(`selectedDate_${pacienteId}`);
        if (saved) return new Date(saved);
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d;
    });
    const [currentMonth, setCurrentMonth] = useState<number>(() => {
        const saved = sessionStorage.getItem(`selectedDate_${pacienteId}`);
        if (saved) return new Date(saved).getMonth();
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.getMonth();
    });
    const [currentYear, setCurrentYear] = useState<number>(() => {
        const saved = sessionStorage.getItem(`selectedDate_${pacienteId}`);
        if (saved) return new Date(saved).getFullYear();
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.getFullYear();
    });

    const lastPacienteId = useRef(pacienteId);

    // Sincronizar estados con sessionStorage y cargar datos al cambiar de paciente
    useEffect(() => {
        if (lastPacienteId.current !== pacienteId) {
            // Si el paciente ha cambiado, cargamos sus datos de sessionStorage o los reiniciamos
            const savedPeso = sessionStorage.getItem(`peso_${pacienteId}`) || '';
            const savedTalla = sessionStorage.getItem(`talla_${pacienteId}`) || '';
            const savedPerimetro = sessionStorage.getItem(`perimetro_${pacienteId}`) || '';
            const savedIndicaciones = sessionStorage.getItem(`indicaciones_${pacienteId}`) || '';

            setPeso(savedPeso);
            setPerimetro(savedPerimetro);
            setIndicaciones(savedIndicaciones);
            setTalla(savedTalla);

            const savedDate = sessionStorage.getItem(`selectedDate_${pacienteId}`);
            if (savedDate) {
                const parsedDate = new Date(savedDate);
                setSelectedDate(parsedDate);
                setCurrentMonth(parsedDate.getMonth());
                setCurrentYear(parsedDate.getFullYear());
            } else {
                const d = new Date();
                d.setMonth(d.getMonth() + 1);
                setSelectedDate(d);
                setCurrentMonth(d.getMonth());
                setCurrentYear(d.getFullYear());
            }

            lastPacienteId.current = pacienteId;
            return;
        }

        // Si el paciente es el mismo, guardamos los cambios de estado en sessionStorage
        sessionStorage.setItem(`peso_${pacienteId}`, peso);
        sessionStorage.setItem(`talla_${pacienteId}`, talla);
        sessionStorage.setItem(`perimetro_${pacienteId}`, perimetro);
        sessionStorage.setItem(`indicaciones_${pacienteId}`, indicaciones);
        sessionStorage.setItem(`selectedDate_${pacienteId}`, selectedDate.toISOString());
    }, [peso, talla, perimetro, indicaciones, selectedDate, pacienteId]);

    useEffect(() => {
        let activo = true;
        (async () => {
            if (!pacienteId) return;
            if (sessionStorage.getItem(`talla_${pacienteId}`)) return;
            try {
                const resp = await listarEvaluaciones(pacienteId);
                if (!activo || resp.data.length === 0) return;
                const ordenadas = [...resp.data].sort(
                    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
                );
                if (activo) setTalla(prev => prev || String(ordenadas[0].talla));
            } catch {
                /* sin sugerencia */
            }
        })();
        return () => { activo = false; };
    }, [pacienteId]);

    // Calcular IMC en tiempo real
    const imc = useMemo(() => {
        const pesoNum = parseFloat(peso);
        const tallaNum = parseFloat(talla);

        if (!pesoNum || !tallaNum || tallaNum <= 0) return 0;

        // Fórmula: peso (kg) / (talla (m))^2
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

    // Calendario: Obtener días del mes
    const daysInMonth = useMemo(() => {
        return new Date(currentYear, currentMonth + 1, 0).getDate();
    }, [currentMonth, currentYear]);

    const firstDayIndex = useMemo(() => {
        return new Date(currentYear, currentMonth, 1).getDay();
    }, [currentMonth, currentYear]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };


    const shortMonths = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

    const years = useMemo(() => {
        const current = new Date().getFullYear();
        const list = [];
        for (let i = current - 5; i <= current + 5; i++) {
            list.push(i);
        }
        return list;
    }, []);

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

        // Fecha del control actual (hoy)
        const today = new Date();
        const dToday = today.getDate().toString().padStart(2, '0');
        const mToday = (today.getMonth() + 1).toString().padStart(2, '0');
        const yToday = today.getFullYear();
        const fechaActualFormateada = `${dToday}-${mToday}-${yToday}`;

        // Fecha del próximo control agendado (del calendario)
        const dNext = selectedDate.getDate().toString().padStart(2, '0');
        const mNext = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const yNext = selectedDate.getFullYear();
        const fechaProximoFormateada = `${dNext}-${mNext}-${yNext}`;

        // Clasificación
        let clasificacion: 'Bajo peso' | 'Normal' | 'Sobrepeso' | 'Obesidad' = 'Normal';
        if (imc < 18.5) clasificacion = 'Bajo peso';
        else if (imc < 25) clasificacion = 'Normal';
        else if (imc < 30) clasificacion = 'Sobrepeso';
        else clasificacion = 'Obesidad';

        // Guardar la evaluación
        setModalConfirm({
            isOpen: true,
            title: 'Confirmar Registro',
            message: '¿Está seguro de que desea registrar este control nutricional? Se guardará en el historial clínico del paciente.',
            type: 'info',
            confirmText: 'Registrar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                setModalConfirm(prev => ({ ...prev, isLoading: true }));
                try {
                    await crearEvaluacion({
                        id_paciente: Number(pacienteId),
                        peso_kg: pesoNum,
                        talla_cm: tallaNum,
                        perimetro_abdom_cm: perimetroNum,
                        recomendaciones_ali: indicaciones.trim(), // opción C: todo acá
                        fecha_proximo_ctrl: selectedDate.toISOString(),
                    });

                    setModalConfirm({
                        isOpen: true,
                        title: '¡Operación Exitosa!',
                        message: 'La evaluación nutricional ha sido guardada correctamente en el historial clínico del paciente.',
                        type: 'success',
                        confirmText: 'Aceptar',
                        cancelText: 'Cerrar',
                        onConfirm: () => {
                            sessionStorage.removeItem(`peso_${pacienteId}`);
                            sessionStorage.removeItem(`talla_${pacienteId}`);
                            sessionStorage.removeItem(`perimetro_${pacienteId}`);
                            sessionStorage.removeItem(`indicaciones_${pacienteId}`);
                            sessionStorage.removeItem(`selectedDate_${pacienteId}`);

                            setPeso('');
                            setTalla('');
                            setPerimetro('');
                            setIndicaciones('');
                            const d = new Date();
                            d.setMonth(d.getMonth() + 1);
                            setSelectedDate(d);

                            setModalConfirm(prev => ({ ...prev, isOpen: false }));
                            navigate(`/nutricionista/pacientes/atencion/historial?id=${pacienteId}`);
                        }
                    });
                } catch (err) {
                    const msg = err instanceof ApiError
                        ? err.message
                        : 'No se pudo guardar la evaluación. Revisa tu conexión.';
                    setModalConfirm({
                        isOpen: true,
                        title: 'Error al Registrar',
                        message: msg,
                        type: 'danger',
                        confirmText: 'Cerrar',
                        cancelText: 'Cerrar',
                        onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
                    });
                }
            }
        });
    };

    return (
        <SiscopWrap>
            <div className="space-y-6">
                {/* 1. Datos Antropométricos */}
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

                {/* 2. Fila inferior: Indicaciones (Izq) e IMC/Calendario/Guardar (Der) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Indicaciones Nutricionales (Span 2) */}
                    <div className="md:col-span-2 flex flex-col">
                        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex flex-col flex-1 gap-3">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-slate-600" />
                                <h3 className="font-semibold text-slate-800 text-sm">Indicaciones nutricionales</h3>
                            </div>
                            <textarea
                                placeholder="Observaciones médicas internas, antecedentes, diagnóstico nutricional, metas físicas del paciente..."
                                value={indicaciones}
                                onChange={(e) => setIndicaciones(e.target.value)}
                                className="w-full h-80 bg-white border border-slate-200 rounded-xl p-4 outline-none focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all text-slate-700 text-sm resize-none flex-1"
                            />
                        </div>
                    </div>

                    {/* Lado Derecho (Span 1): IMC, Calendario y Botón de Acción */}
                    <div className="md:col-span-1 space-y-4">
                        {/* Tarjeta de IMC */}
                        <div className={`p-4 rounded-2xl transition-all ${imcInfo.colorClass}`}>
                            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-90">IMC</p>
                            <h2 className="text-3xl font-semibold my-1">
                                {imc > 0 ? imc.toFixed(1) : '--.-'}
                            </h2>
                            <p className="text-[10px] font-semibold uppercase mt-0.5 tracking-wide">
                                {imcInfo.label}
                            </p>
                        </div>

                        {/* Calendario Personalizado */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2">
                                <Calendar className="w-3.5 h-3.5 text-[#1A82C4]" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    Agendar Próximo Control
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-1">
                                    <select
                                        value={currentMonth}
                                        onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                                        className="text-xs font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer"
                                    >
                                        {shortMonths.map((m, idx) => (
                                            <option key={idx} value={idx}>{m}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={currentYear}
                                        onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                                        className="text-xs font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer"
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleNextMonth}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Días de la semana */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {weekdays.map((day, idx) => (
                                    <span key={idx} className="text-[10px] font-semibold text-slate-400">
                                        {day}
                                    </span>
                                ))}
                            </div>

                            {/* Cuadrícula de días */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {/* Celdas vacías del principio del mes */}
                                {Array.from({ length: firstDayIndex }).map((_, idx) => (
                                    <div key={`empty-${idx}`} />
                                ))}

                                {/* Días del mes */}
                                {Array.from({ length: daysInMonth }).map((_, idx) => {
                                    const dayNumber = idx + 1;
                                    const isSelected = selectedDate.getDate() === dayNumber &&
                                        selectedDate.getMonth() === currentMonth &&
                                        selectedDate.getFullYear() === currentYear;

                                    const isToday = new Date().getDate() === dayNumber &&
                                        new Date().getMonth() === currentMonth &&
                                        new Date().getFullYear() === currentYear;

                                    return (
                                        <button
                                            key={`day-${dayNumber}`}
                                            onClick={() => setSelectedDate(new Date(currentYear, currentMonth, dayNumber))}
                                            className={`h-7 w-7 mx-auto rounded-lg text-xs font-semibold flex items-center justify-center cursor-pointer transition-all ${
                                                isSelected
                                                    ? 'bg-[#1A82C4] text-white'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            } ${
                                                isToday
                                                    ? 'ring-2 ring-[#1A82C4] ring-offset-2 font-bold'
                                                    : ''
                                            }`}
                                        >
                                            {dayNumber}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Botón de acción */}
                        <Button
                            onClick={handleSave}
                            variant="primary"
                            className="w-full justify-center select-none"
                        >
                            Guardar Evaluación
                        </Button>
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
        </SiscopWrap>
    );
}
