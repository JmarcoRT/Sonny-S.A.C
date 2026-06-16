import { useSearchParams } from 'react-router-dom';
import { TrendingUp, Scale } from 'lucide-react';
import SiscopWrap from './SISCOP-WRAP';
import { useState, useEffect } from 'react';
import { listarEvaluaciones } from '../../services/evaluacionService';

interface BarChartPoint {
    label: string;
    value: number;
}

interface SVGBarChartProps {
    data: BarChartPoint[];
    color: string;
    title: string;
}

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function mesDesdeFecha(fecha: string): string {
    const partes = fecha.split('-'); // [DD, MM, YYYY]
    const mm = parseInt(partes[1], 10);
    return MESES_CORTOS[mm - 1] || '';
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

    const [weightData, setWeightData] = useState<BarChartPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let activo = true;
        (async () => {
            if (!pacienteId) { if (activo) { setWeightData([]); setLoading(false); } return; }
            try {
                setLoading(true);
                const resp = await listarEvaluaciones(pacienteId);
                // Ordenar de más antigua a más reciente (para leer izquierda → derecha)
                const ordenadas = [...resp.data].sort(
                    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
                );
                const puntos: BarChartPoint[] = ordenadas.map((ev) => ({
                    label: mesDesdeFecha(
                        // ev.fecha viene ISO del backend; lo paso a DD-MM-YYYY simple para el helper
                        (() => {
                            const d = new Date(ev.fecha);
                            const dd = String(d.getDate()).padStart(2, '0');
                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                            return `${dd}-${mm}-${d.getFullYear()}`;
                        })()
                    ),
                    value: ev.peso,
                }));
                if (activo) setWeightData(puntos);
            } catch {
                if (activo) setWeightData([]);
            } finally {
                if (activo) setLoading(false);
            }
        })();
        return () => { activo = false; };
    }, [pacienteId]);

    const hasData = weightData.length > 0;

    return (
        <SiscopWrap>
            <div className="space-y-6">
                <div>
                    <h3 className="text-base font-semibold text-slate-800">Evolución del Paciente</h3>
                    <p className="text-xs text-slate-400">Progreso histórico del peso del paciente</p>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400 text-sm">Cargando evolución…</div>
                ) : !hasData ? (
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