import type { Paciente } from '../../../mocks/mockPacientes';
import { FileText, Pencil } from 'lucide-react';

interface PacienteTablaRecepcionistaProps {
    pacientes: Paciente[];
    onVerHistorial: (id: string) => void;
    onUltimaEvaluacion: (id: string) => void;
    onEditar: (paciente: Paciente) => void;
}

export default function PacienteTablaRecepcionista({
    pacientes,
    onVerHistorial,
    onUltimaEvaluacion,
    onEditar
}: PacienteTablaRecepcionistaProps) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">N° de documento</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Apellido y nombres</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha último registro</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pacientes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">
                                    No se encontraron pacientes que coincidan con la búsqueda.
                                </td>
                            </tr>
                        ) : (
                            pacientes.map((paciente) => (
                                <tr key={paciente.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{paciente.documento}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                        {paciente.apellido}, {paciente.nombre}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{paciente.fechaUltimoRegistro}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onVerHistorial(paciente.id)}
                                                className="bg-[#1A82C4] hover:bg-[#156fa9] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                            >
                                                <FileText className="w-3.5 h-3.5" />
                                                Ver historial
                                            </button>
                                            <button
                                                onClick={() => onUltimaEvaluacion(paciente.id)}
                                                className="border border-[#1A82C4] text-[#1A82C4] hover:bg-[#1A82C4]/5 bg-transparent text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                                            >
                                                Última evaluación
                                            </button>
                                            <button
                                                onClick={() => onEditar(paciente)}
                                                className="border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Editar
                                            </button>
                                        </div>
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
