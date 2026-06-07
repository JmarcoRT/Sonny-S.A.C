import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, Scale } from 'lucide-react';
import SiscopWrap from './SISCOP-WRAP';
import { MOCK_PACIENTES, MOCK_EVALUACIONES } from '../../mocks/mockPacientes';

interface BarChartPoint {
    label: string;
    value: number;
}

interface SVGBarChartProps {
    data: BarChartPoint[];
    color: string;
    title: string;
}

function SVGBarChart({ data, color, title }: SVGBarChartProps) {
    const width = 1000;
    const height = 300;
    const paddingLeft = 50;
    const paddingRight = 30;
    const paddingTop = 40;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const values = data.map((d) => d.value);
    const maxVal = Math.max(...values, 0);

    const max = maxVal * 1.15 || 100;

    const getBarCoords = (index: number, value: number) => {
        const stepWidth = chartWidth / data.length;
        const barWidth = 32; // Ancho de la barra
        const x = paddingLeft + index * stepWidth + (stepWidth - barWidth) / 2;

        // La altura de la barra es proporcional al valor
        const barHeight = (value / max) * chartHeight;
        const y = height - paddingBottom - barHeight;

        return { x, y, barWidth, barHeight };
    };

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col w-full">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-[#1A82C4]" />
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">{title}</h4>
            </div>

            <div className="w-full flex justify-center items-center">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[1000px] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[320px] overflow-visible">

                    <line
                        x1={paddingLeft}
                        y1={paddingTop - 10}
                        x2={paddingLeft}
                        y2={height - paddingBottom}
                        className="stroke-slate-300"
                        strokeWidth="1.5"
                    />

                    <line
                        x1={paddingLeft}
                        y1={height - paddingBottom}
                        x2={width - paddingRight}
                        y2={height - paddingBottom}
                        className="stroke-slate-300"
                        strokeWidth="1.5"
                    />

                    {/* Dibujo de barras */}
                    {data.map((pt, i) => {
                        const { x, y, barWidth, barHeight } = getBarCoords(i, pt.value);
                        const radius = 6;
                        const pathData = `
                            M ${x} ${y + barHeight}
                            L ${x} ${y + radius}
                            Q ${x} ${y} ${x + radius} ${y}
                            L ${x + barWidth - radius} ${y}
                            Q ${x + barWidth} ${y} ${x + barWidth} ${y + radius}
                            L ${x + barWidth} ${y + barHeight}
                            Z
                        `;

                        return (
                            <g key={i} className="group cursor-pointer">
                                <path
                                    d={pathData}
                                    fill={color}
                                    className="hover:opacity-90 transition-opacity"
                                />

                                <text
                                    x={x + barWidth / 2}
                                    y={y - 8}
                                    className="fill-slate-800 text-[10px] font-semibold"
                                    textAnchor="middle"
                                >
                                    {pt.value.toFixed(1)}
                                </text>

                                <text
                                    x={x + barWidth / 2}
                                    y={height - 18}
                                    className="fill-slate-500 text-[10px] font-semibold"
                                    textAnchor="middle"
                                >
                                    {pt.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

export default function SiscopGraf() {
    const [searchParams] = useSearchParams();
    const pacienteId = searchParams.get('id') || '';

    // Cargar y ordenar puntos de peso para el paciente actual
    const weightData = useMemo(() => {
        if (pacienteId === '1') {
            return [
                { label: 'Jul', value: 86.2 },
                { label: 'Ago', value: 84.7 },
                { label: 'Sep', value: 82.9 },
                { label: 'Oct', value: 80.5 },
                { label: 'Nov', value: 78.8 },
                { label: 'Dic', value: 76.9 },
                { label: 'Ene', value: 74.8 },
                { label: 'Feb', value: 72.9 },
                { label: 'Mar', value: 70.8 },
                { label: 'Abr', value: 69.0 },
                { label: 'May', value: 67.2 }
            ];
        } else {
            // Generar datos simulados de 11 meses para otros pacientes terminando en su peso actual
            const pac = MOCK_PACIENTES.find(p => p.id === pacienteId);
            const evs = MOCK_EVALUACIONES.filter(e => e.pacienteId === pacienteId);
            const currentWeight = evs.length > 0 ? evs[0].peso : (pac?.sexo === 'Masculino' ? 82.0 : 64.0);

            const monthsList = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'];
            return monthsList.map((m, i) => {
                const diff = (10 - i) * 1.5;
                return {
                    label: m,
                    value: parseFloat((currentWeight + diff).toFixed(1))
                };
            });
        }
    }, [pacienteId]);

    const hasData = useMemo(() => {
        return MOCK_EVALUACIONES.some(e => e.pacienteId === pacienteId);
    }, [pacienteId]);

    return (
        <SiscopWrap>
            <div className="space-y-6">
                <div>
                    <h3 className="text-base font-semibold text-slate-800">Evolución del Paciente</h3>
                    <p className="text-xs text-slate-400">Progreso histórico del peso del paciente</p>
                </div>

                {!hasData ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-500">No se encontraron evaluaciones registradas.</p>
                        <p className="text-xs text-slate-400 mt-1">Registra la primera consulta para comenzar a graficar.</p>
                    </div>
                ) : (
                    <div className="w-full">
                        <SVGBarChart
                            data={weightData}
                            color="#1A82C4"
                            title="Gráfica de Evolución de Peso"
                        />
                    </div>
                )}
            </div>
        </SiscopWrap>
    );
}