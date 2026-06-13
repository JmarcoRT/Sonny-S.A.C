import type { SexDistribution } from '../../../mocks/mockDashboard';

interface DashboardDonutChartProps {
    data: SexDistribution[];
}

export function DashboardDonutChart({ data }: DashboardDonutChartProps) {
    const size = 180;
    const center = size / 2;
    const radius = 50;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    let accumulatedPercent = 0;

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-2 flex-1 min-h-0">
            <div className="relative w-full h-full max-w-[160px] max-h-[160px] flex items-center justify-center flex-1 min-h-0">
                <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    {data.map((item, index) => {
                        const strokeLength = (item.value / 100) * circumference;
                        const strokeOffset = -(accumulatedPercent / 100) * circumference;
                        accumulatedPercent += item.value;

                        return (
                            <circle
                                key={index}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="transparent"
                                stroke={item.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${strokeLength} ${circumference}`}
                                strokeDashoffset={strokeOffset}
                                className="transition-all duration-500 hover:opacity-90"
                            />
                        );
                    })}
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="absolute top-[30%] left-[15%] text-[10px] font-semibold text-slate-500 bg-white/80 px-1 rounded-sm">
                        {data[0].value}%
                    </span>
                    <span className="absolute bottom-[30%] right-[15%] text-[10px] font-semibold text-slate-500 bg-white/80 px-1 rounded-sm">
                        {data[1].value}%
                    </span>
                </div>
            </div>

            <div className="flex justify-center items-center gap-6 mt-2 text-xs font-semibold text-slate-600">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardDonutChart;
