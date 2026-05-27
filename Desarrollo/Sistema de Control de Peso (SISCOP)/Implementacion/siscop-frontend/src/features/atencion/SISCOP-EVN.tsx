import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Activity, FileText, Calendar } from 'lucide-react';
import SiscopWrap from './SISCOP-WRAP';
import { MOCK_PACIENTES, MOCK_EVALUACIONES } from '../../mocks/mockPacientes';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function SiscopEvn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const pacienteId = searchParams.get('id') || '';

    // Form inputs state
    const [peso, setPeso] = useState<string>('');
    const [talla, setTalla] = useState<string>('');
    const [perimetro, setPerimetro] = useState<string>('');
    const [indicaciones, setIndicaciones] = useState<string>('');

    // Calendar state (inicializado en 1 mes en el futuro para agendar el próximo control)
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d;
    });
    const [currentMonth, setCurrentMonth] = useState<number>(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.getMonth();
    });
    const [currentYear, setCurrentYear] = useState<number>(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.getFullYear();
    });

    // Cargar últimos datos antropométricos del paciente si existen
    useEffect(() => {
        if (pacienteId) {
            const evs = MOCK_EVALUACIONES.filter(e => e.pacienteId === pacienteId);
            if (evs.length > 0) {
                // Ordenar por fecha descendente
                const ordenadas = [...evs].sort((a, b) => {
                    const dateA = a.fecha.split('-').reverse().join('-');
                    const dateB = b.fecha.split('-').reverse().join('-');
                    return new Date(dateB).getTime() - new Date(dateA).getTime();
                });
                // Autocompletar la talla de la última consulta como punto de partida útil
                setTalla(ordenadas[0].talla.toString());
            }
        }
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

        if (!pesoNum || isNaN(pesoNum) || pesoNum <= 0) {
            alert('Por favor, ingresa un peso válido (mayor a 0).');
            return;
        }
        if (!tallaNum || isNaN(tallaNum) || tallaNum <= 0) {
            alert('Por favor, ingresa una talla válida en centímetros (mayor a 0).');
            return;
        }
        if (!perimetroNum || isNaN(perimetroNum) || perimetroNum <= 0) {
            alert('Por favor, ingresa un perímetro abdominal válido.');
            return;
        }
        if (!indicaciones.trim()) {
            alert('Por favor, ingresa las indicaciones nutricionales del paciente.');
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

        // Guardar la evaluación en el mock mutable
        const nuevaEvaluacion = {
            id: (MOCK_EVALUACIONES.length + 1).toString(),
            pacienteId,
            fecha: fechaActualFormateada, // Fecha actual para este control
            fechaProximoControl: fechaProximoFormateada, // Próximo control programado
            tipo: 'Control Nutricional',
            peso: pesoNum,
            talla: tallaNum,
            perimetroAbdominal: perimetroNum,
            imc: parseFloat(imc.toFixed(1)),
            clasificacionImc: clasificacion,
            indicaciones: indicaciones
        };

        MOCK_EVALUACIONES.unshift(nuevaEvaluacion);

        // Actualizar la fechaUltimoRegistro del paciente en el array MOCK_PACIENTES
        const pac = MOCK_PACIENTES.find(p => p.id === pacienteId);
        if (pac) {
            pac.fechaUltimoRegistro = `${yToday} / ${mToday} / ${dToday}`;
            pac.edad = pac.edad; // mantiene edad
        }

        alert('¡Evaluación registrada con éxito!');
        // Redirigir al historial para mostrar la entrada recién añadida
        navigate(`/nutricionista/pacientes/atencion/historial?id=${pacienteId}`);
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
                        <Input
                            label="Peso (kg)"
                            placeholder="Ej. 67.2"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                            type="number"
                            step="0.1"
                        />
                        <Input
                            label="Talla (cm)"
                            placeholder="Ej. 165"
                            value={talla}
                            onChange={(e) => setTalla(e.target.value)}
                            type="number"
                        />
                        <Input
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
                                                    : isToday
                                                    ? 'border border-[#1A82C4] text-[#1A82C4] hover:bg-slate-50'
                                                    : 'text-slate-600 hover:bg-slate-100'
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
        </SiscopWrap>
    );
}