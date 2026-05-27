import type { Paciente } from '../../../mocks/mockPacientes';

interface PacienteTablaNutricionistaProps {
    pacientes: Paciente[];
    onAbrirHistoria: (id: string) => void;
}

export default function PacienteTablaNutricionista({
    pacientes,
    onAbrirHistoria
}: PacienteTablaNutricionistaProps) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Apellido</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">N° de documento</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sexo</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Edad</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pacientes.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-400">
                                    No se encontraron pacientes que coincidan con la búsqueda.
                                </td>
                            </tr>
                        ) : (
                            pacientes.map((paciente) => (
                                <tr key={paciente.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{paciente.nombre}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{paciente.apellido}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{paciente.documento}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{paciente.sexo}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{paciente.edad}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{paciente.telefono}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => onAbrirHistoria(paciente.id)}
                                            className="bg-[#1A82C4] hover:bg-[#156fa9] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                                        >
                                            Abrir historia
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
