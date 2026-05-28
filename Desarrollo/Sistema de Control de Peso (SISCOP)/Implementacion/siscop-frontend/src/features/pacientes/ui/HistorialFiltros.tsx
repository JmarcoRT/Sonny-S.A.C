import React from 'react';
import { Search } from 'lucide-react';

interface HistorialFiltrosProps {
    filterMonth: string;
    setFilterMonth: (val: string) => void;
    filterYear: string;
    setFilterYear: (val: string) => void;
    onFiltrar: () => void;
}

const meses = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
];

export function HistorialFiltros({
    filterMonth,
    setFilterMonth,
    filterYear,
    setFilterYear,
    onFiltrar
}: HistorialFiltrosProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#1A82C4] transition-all text-slate-600 w-36 cursor-pointer"
            >
                <option value="Todos">Mes</option>
                {meses.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
            </select>

            <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-[#1A82C4] transition-all text-slate-600 w-32 cursor-pointer"
            >
                <option value="Todos">Año</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
            </select>

            <button
                onClick={onFiltrar}
                className="bg-slate-500 hover:bg-slate-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-[0.98]"
            >
                <Search className="w-3.5 h-3.5" />
                Filtrar
            </button>
        </div>
    );
}
