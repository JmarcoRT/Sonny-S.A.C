import type { ChartPoint } from '../../../mocks/mockDashboard';

interface DashboardLineChartProps {
    data: ChartPoint[];
}

export function DashboardLineChart({ data }: DashboardLineChartProps) {
    const width = 500;
    const height = 180;
    const paddingLeft = 50;
    const paddingRight = 30;


    const chartWidth = width - paddingLeft - paddingRight;

    const getCoordinates = (index: number, value: number) => {
        const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
        const y = 140 - (value - 40);
        return { x, y };
    };

    const points = data.map((pt, i) => getCoordinates(i, pt.value));

    const linePath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    return (
        <div className="w-full h-full flex justify-center items-center flex-1 min-h-0">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-w-[550px] max-h-[180px] overflow-visible">

                <g className="stroke-slate-100" strokeWidth="1" strokeDasharray="3 3">
                    <line x1={paddingLeft} y1="40" x2={width - paddingRight} y2="40" />
                    <line x1={paddingLeft} y1="90" x2={width - paddingRight} y2="90" />
                    <line x1={paddingLeft} y1="140" x2={width - paddingRight} y2="140" />
                </g>

                <g className="fill-slate-400 text-[10px] font-semibold" textAnchor="end">
                    <text x={paddingLeft - 10} y="43">140</text>
                    <text x={paddingLeft - 10} y="93">90</text>
                    <text x={paddingLeft - 10} y="143">40</text>
                </g>


                <line
                    x1={paddingLeft}
                    y1="140"
                    x2={width - paddingRight}
                    y2="140"
                    className="stroke-slate-300"
                    strokeWidth="1.5"
                />

                <path
                    d={linePath}
                    fill="none"
                    stroke="#1A82C4"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />


                {points.map((p, i) => {
                    const isTarget = data[i].label === '7 abr';

                    return (
                        <g key={i}>

                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                className="fill-white stroke-[#1A82C4]"
                                strokeWidth="2.5"
                            />

                            {isTarget && (
                                <g>

                                    <rect
                                        x={p.x - 25}
                                        y={p.y - 45}
                                        width="50"
                                        height="32"
                                        rx="6"
                                        className="fill-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] stroke-slate-100"
                                        strokeWidth="1"
                                    />

                                    <text x={p.x} y={p.y - 32} className="fill-slate-800 text-[8px] font-semibold" textAnchor="middle">
                                        {data[i].label}
                                    </text>
                                    <text x={p.x} y={p.y - 20} className="fill-[#1A82C4] text-[10px] font-semibold" textAnchor="middle">
                                        {data[i].value}
                                    </text>
                                </g>
                            )}

                            <text
                                x={p.x}
                                y={height - 10}
                                className="fill-slate-400 text-[9px] font-semibold"
                                textAnchor="middle"
                            >
                                {data[i].label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default DashboardLineChart;
