import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SiscopWrap from '../atencion/SISCOP-WRAP';
import { MOCK_PACIENTES, MOCK_EVALUACIONES } from '../../mocks/mockPacientes';
import type { Evaluacion } from '../../mocks/mockPacientes';

import { HistorialFiltros } from './ui/HistorialFiltros';
import { HistorialLista } from './ui/HistorialLista';
import { HistorialModalVer } from './ui/HistorialModalVer';
import { HistorialModalEditar } from './ui/HistorialModalEditar';
import Paginacion from '../../components/ui/Paginacion';

export default function SiscopHc() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const pacienteId = searchParams.get('id') || '';
    const isNutricionista = location.pathname.includes('/nutricionista');

    // Cargar paciente
    const paciente = useMemo(() => {
        if (!pacienteId) return null;
        return MOCK_PACIENTES.find((p) => p.id === pacienteId) || null;
    }, [pacienteId]);

    // Filtros de fecha (Estados locales para los dropdowns)
    const [filterMonth, setFilterMonth] = useState<string>('Todos');
    const [filterYear, setFilterYear] = useState<string>('Todos');

    // Filtros aplicados al hacer clic en "Filtrar"
    const [appliedMonth, setAppliedMonth] = useState<string>('Todos');
    const [appliedYear, setAppliedYear] = useState<string>('Todos');

    // Paginación
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 8;

    // Modales
    const [isVerModalOpen, setIsVerModalOpen] = useState<boolean>(false);
    const [isEditarModalOpen, setIsEditarModalOpen] = useState<boolean>(false);
    const [selectedEval, setSelectedEval] = useState<Evaluacion | null>(null);

    // Todas las evaluaciones del paciente, de más reciente a más antigua
    const todasLasEvaluaciones = useMemo(() => {
        if (!pacienteId) return [];
        return MOCK_EVALUACIONES
            .filter((e) => e.pacienteId === pacienteId)
            .sort((a, b) => {
                const dateA = a.fecha.split('-').reverse().join('-');
                const dateB = b.fecha.split('-').reverse().join('-');
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            });
    }, [pacienteId]);

    // Filtrar evaluaciones
    const evaluacionesFiltradas = useMemo(() => {
        return todasLasEvaluaciones.filter((ev) => {
            const parts = ev.fecha.split('-');
            const evMonth = parseInt(parts[1]); // 1-12
            const evYear = parts[2]; // YYYY

            const matchMonth = appliedMonth === 'Todos' || evMonth === parseInt(appliedMonth);
            const matchYear = appliedYear === 'Todos' || evYear === appliedYear;

            return matchMonth && matchYear;
        });
    }, [todasLasEvaluaciones, appliedMonth, appliedYear]);

    // Paginación de evaluaciones
    const paginatedEvaluaciones = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return evaluacionesFiltradas.slice(startIndex, startIndex + itemsPerPage);
    }, [evaluacionesFiltradas, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(evaluacionesFiltradas.length / itemsPerPage) || 1;

    const handleFiltrar = () => {
        setAppliedMonth(filterMonth);
        setAppliedYear(filterYear);
        setCurrentPage(1);
    };

    // Funciones para acciones
    const handleOpenVer = (ev: Evaluacion) => {
        setSelectedEval(ev);
        setIsVerModalOpen(true);
    };

    const handleEditarRegistro = (ev: Evaluacion) => {
        setSelectedEval(ev);
        setIsEditarModalOpen(true);
    };

    // Contenido general (filtros + listado + paginación)
    const renderHistorialContent = () => (
        <div className="space-y-6">
            <HistorialFiltros 
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                filterYear={filterYear}
                setFilterYear={setFilterYear}
                onFiltrar={handleFiltrar}
            />

            <HistorialLista 
                evaluaciones={paginatedEvaluaciones}
                todasLasEvaluaciones={todasLasEvaluaciones}
                isNutricionista={isNutricionista}
                pacienteId={pacienteId}
                onVerRegistro={handleOpenVer}
                onEditarRegistro={handleEditarRegistro}
            />

            {totalPages > 1 && (
                <Paginacion 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );

    if (!paciente) {
        return (
            <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl shadow-xs">
                <p className="text-slate-500 font-semibold mb-4">No se especificó un paciente válido para ver el historial.</p>
                <button
                    onClick={() => navigate(isNutricionista ? '/nutricionista/pacientes' : '/recepcionista/pacientes')}
                    className="bg-[#1A82C4] hover:bg-[#156fa9] text-white font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                    Volver a Pacientes
                </button>
            </div>
        );
    }

    return (
        <>
            {isNutricionista ? (
                <SiscopWrap>
                    <div className="space-y-4">
                        <div className="pb-2 border-b border-slate-100">
                            <h3 className="text-base font-semibold text-slate-800">Historial del Paciente</h3>
                            <p className="text-xs text-slate-400">Revisa y edita evaluaciones - solo se pueden editar evaluaciones hasta 24h después</p>
                        </div>
                        {renderHistorialContent()}
                    </div>
                </SiscopWrap>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/recepcionista/pacientes')}
                            className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 cursor-pointer bg-white transition-all shadow-xs"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Historial Clínico</h2>
                            <p className="text-xs text-slate-400">Consultas e historial de registros del paciente</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-4 shadow-xs">
                        <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Paciente</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{paciente.apellido}, {paciente.nombre}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">N° Documento</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{paciente.documento}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Sexo / Edad</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{paciente.sexo} ({paciente.edad} años)</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">Teléfono</p>
                            <p className="text-sm font-semibold text-slate-700 mt-0.5">{paciente.telefono || 'No reg.'}</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                        {renderHistorialContent()}
                    </div>
                </div>
            )}

            <HistorialModalVer 
                isOpen={isVerModalOpen}
                evaluacion={selectedEval}
                onClose={() => {
                    setIsVerModalOpen(false);
                    setSelectedEval(null);
                }}
            />

            <HistorialModalEditar 
                isOpen={isEditarModalOpen}
                evaluacion={selectedEval}
                onClose={() => {
                    setIsEditarModalOpen(false);
                    setSelectedEval(null);
                }}
                onSave={(updatedEval, editProximoControl) => {
                    // Actualizar en el mock (lógica simplificada)
                    if (selectedEval) {
                        Object.assign(selectedEval, updatedEval);
                        alert('¡Evaluación actualizada con éxito!');
                    }
                    setIsEditarModalOpen(false);
                    setSelectedEval(null);
                }}
            />
        </>
    );
}