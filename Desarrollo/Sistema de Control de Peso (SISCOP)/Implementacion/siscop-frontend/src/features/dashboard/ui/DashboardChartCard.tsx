import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardChartCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export function DashboardChartCard({
    title,
    description,
    children
}: DashboardChartCardProps) {
    const [periodo, setPeriodo] = useState<'Jornada' | 'Mensual' | 'Anual'>('Jornada');

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between w-full h-full min-h-[320px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-50 pb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 tracking-tight">{title}</h3>
                    {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
                </div>

                <div className="flex items-center gap-1.5 select-none bg-slate-50 border border-slate-100 rounded-full p-1 text-[11px] font-semibold text-slate-500">
                    <button className="p-1 hover:text-slate-800 transition-colors cursor-pointer">
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    {(['Jornada', 'Mensual', 'Anual'] as const).map((p) => {
                        const isActive = periodo === p;
                        return (
                            <button
                                key={p}
                                onClick={() => setPeriodo(p)}
                                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${isActive
                                    ? 'bg-[#1A82C4] text-white shadow-xs'
                                    : 'hover:bg-slate-100 text-slate-500'
                                    }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                    <button className="p-1 hover:text-slate-800 transition-colors cursor-pointer">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center w-full">
                {children}
            </div>
        </div>
    );
}

export default DashboardChartCard;
