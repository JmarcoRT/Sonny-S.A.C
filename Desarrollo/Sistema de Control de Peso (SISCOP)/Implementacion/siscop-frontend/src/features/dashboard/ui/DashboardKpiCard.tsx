import type { LucideIcon } from 'lucide-react';

interface DashboardKpiCardProps {
    title: string;
    value: number | string;
    description: string;
    icon: LucideIcon;
    iconColorClass?: string;
    iconBgClass?: string;
    valueColorClass?: string;
}

export function DashboardKpiCard({
    title,
    value,
    description,
    icon: Icon,
    iconColorClass = 'text-[#1A82C4]',
    iconBgClass = 'bg-blue-50',
    valueColorClass = 'text-[#1A82C4]'
}: DashboardKpiCardProps) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between h-[150px] w-full">
            <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-slate-600">{title}</span>
                <div className={`w-8 h-8 ${iconBgClass} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${iconColorClass}`} />
                </div>
            </div>
            <div className="flex flex-col mt-2">
                <span className={`text-4xl font-semibold tracking-tight ${valueColorClass}`}>{value}</span>
                <span className="text-xs text-slate-400 mt-1">{description}</span>
            </div>
        </div>
    );
}

export default DashboardKpiCard;
