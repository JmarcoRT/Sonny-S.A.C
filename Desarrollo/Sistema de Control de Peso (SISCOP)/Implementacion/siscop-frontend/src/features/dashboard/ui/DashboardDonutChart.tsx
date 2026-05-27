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
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <div className="relative w-[180px] h-[180px] flex items-center justify-center">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    {data.map((item, index) => {
                        const strokeLength = (item.value / 100) * circumference;
                        const strokeOffset = circumference - (accumulatedPercent / 100) * circumference;
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
                    <span className="absolute top-[35%] left-[10%] text-[10px] font-semibold text-slate-500 bg-white/80 px-1 rounded-sm">
                        {data[0].value}%
                    </span>
                    <span className="absolute bottom-[35%] right-[10%] text-[10px] font-semibold text-slate-500 bg-white/80 px-1 rounded-sm">
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
