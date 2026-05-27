import type { AgeGroupDistribution } from '../../../mocks/mockDashboard';

interface DashboardBarChartProps {
    data: AgeGroupDistribution[];
}

export function DashboardBarChart({ data }: DashboardBarChartProps) {
    const width = 300;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 10;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxVal = 40;

    const getBarCoords = (index: number, value: number) => {
        const barWidth = 26;
        const spacing = chartWidth / data.length;
        const x = paddingLeft + index * spacing + (spacing - barWidth) / 2;
        const h = (value / maxVal) * chartHeight;
        const y = height - paddingBottom - h;
        return { x, y, w: barWidth, h };
    };

    return (
        <div className="w-full flex justify-center items-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] overflow-visible">
                <g className="stroke-slate-100" strokeWidth="1" strokeDasharray="3 3">
                    <line x1={paddingLeft} y1={height - paddingBottom - (30 / maxVal) * chartHeight} x2={width - paddingRight} y2={height - paddingBottom - (30 / maxVal) * chartHeight} />
                    <line x1={paddingLeft} y1={height - paddingBottom - (10 / maxVal) * chartHeight} x2={width - paddingRight} y2={height - paddingBottom - (10 / maxVal) * chartHeight} />
                    <line x1={paddingLeft} y1={height - paddingBottom - (5 / maxVal) * chartHeight} x2={width - paddingRight} y2={height - paddingBottom - (5 / maxVal) * chartHeight} />
                </g>

                <g className="fill-slate-400 text-[10px] font-semibold" textAnchor="end">
                    <text x={paddingLeft - 8} y={height - paddingBottom - (30 / maxVal) * chartHeight + 3}>30%</text>
                    <text x={paddingLeft - 8} y={height - paddingBottom - (10 / maxVal) * chartHeight + 3}>10%</text>
                    <text x={paddingLeft - 8} y={height - paddingBottom - (5 / maxVal) * chartHeight + 3}>5%</text>
                </g>


                <line
                    x1={paddingLeft}
                    y1={height - paddingBottom}
                    x2={width - paddingRight}
                    y2={height - paddingBottom}
                    className="stroke-slate-200"
                    strokeWidth="1.5"
                />

                {data.map((item, i) => {
                    const coords = getBarCoords(i, item.value);

                    return (
                        <g key={i}>
                            <rect
                                x={coords.x}
                                y={coords.y}
                                width={coords.w}
                                height={coords.h}
                                fill={item.color}
                                rx="4"
                                className="transition-all duration-300 hover:brightness-95"
                            />

                            <text
                                x={coords.x + coords.w / 2}
                                y={coords.y - 6}
                                className="fill-slate-700 text-[9px] font-semibold"
                                textAnchor="middle"
                            >
                                {item.value}%
                            </text>

                            <text
                                x={coords.x + coords.w / 2}
                                y={height - 12}
                                className="fill-slate-400 text-[10px] font-semibold"
                                textAnchor="middle"
                            >
                                {item.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default DashboardBarChart;
