import { Search, Filter } from 'lucide-react';

interface PacienteFiltrosProps {
    rol: 'Nutricionista' | 'Recepcionista';
    nombreFilter: string;
    setNombreFilter: (val: string) => void;
    documentoFilter: string;
    setDocumentoFilter: (val: string) => void;
    onFiltrar: () => void;
}

export default function PacienteFiltros({
    rol,
    nombreFilter,
    setNombreFilter,
    documentoFilter,
    setDocumentoFilter,
    onFiltrar
}: PacienteFiltrosProps) {
    const docLabel = rol === 'Recepcionista' ? 'Filtrar por N° de documento' : 'Filtrar por DNI';
    const docPlaceholder = rol === 'Recepcionista' ? 'Ingrese N° de documento del paciente...' : 'Ingrese DNI del paciente...';

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onFiltrar();
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-5 items-end">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-800">Filtrar por nombre</label>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Ingrese Nombre del paciente..."
                            value={nombreFilter}
                            onChange={(e) => setNombreFilter(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all text-slate-700"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-800">{docLabel}</label>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder={docPlaceholder}
                            value={documentoFilter}
                            onChange={(e) => setDocumentoFilter(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all text-slate-700"
                        />
                    </div>
                </div>

                {/* Filter button */}
                <button
                    onClick={onFiltrar}
                    className="bg-slate-600 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm shadow-xs"
                >
                    Filtrar
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
