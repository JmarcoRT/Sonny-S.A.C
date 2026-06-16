import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SiscopWrap from '../atencion/SISCOP-WRAP';
import { type Paciente } from '../../mocks/mockPacientes';
import type { Evaluacion } from '../../mocks/mockPacientes';

import { HistorialFiltros } from './ui/HistorialFiltros';
import { HistorialLista } from './ui/HistorialLista';
import { HistorialModalVer } from './ui/HistorialModalVer';
import { HistorialModalEditar } from './ui/HistorialModalEditar';
import Paginacion from '../../components/ui/Paginacion';
import ModalConfirmacion from '../../components/ui/ModalConfirmacion';

import { obtenerPaciente, type PacienteBackend} from '../../services/pacientes';
import { listarEvaluaciones, actualizarEvaluacion } from '../../services/evaluacionService';
import { ApiError } from '../../services/api';
import type { EvaluacionBackend } from '../../services/evaluacionService';

function adaptarPaciente(raw: PacienteBackend): Paciente {
    return {
        ...raw,
        telefono: raw.telefono ?? '',
    };
}

function isoADmy(iso: string | null | undefined): string {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

function adaptarEvaluacion(raw: EvaluacionBackend): Evaluacion {
    return {
        id: String(raw.id),
        pacienteId: String(raw.pacienteId),
        fecha: isoADmy(raw.fecha),
        tipo: 'Control Nutricional',
        peso: raw.peso,
        talla: raw.talla,
        perimetroAbdominal: raw.perimetroAbdominal,
        imc: raw.imc,
        clasificacionImc: raw.clasificacionImc,
        indicaciones: raw.indicaciones,
        fechaProximoControl: raw.fechaProximoCtrl
            ? isoADmy(raw.fechaProximoCtrl)
            : undefined,
    };
}

export default function SiscopHc() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const pacienteId = searchParams.get('id') || '';
    const isNutricionista = location.pathname.includes('/nutricionista');

    // Cargar paciente
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [loadingPac, setLoadingPac] = useState<boolean>(true);

    useEffect(() => {
        let activo = true;
        (async () => {
            if (!pacienteId) {
                if (activo) { setPaciente(null); setLoadingPac(false); }
                return;
            }
            try {
                setLoadingPac(true);
                const resp = await obtenerPaciente(pacienteId); // { ok, data }
                if (activo) setPaciente(adaptarPaciente(resp.data));
            } catch {
                if (activo) setPaciente(null);
            } finally {
                if (activo) setLoadingPac(false);
            }
        })();
        return () => { activo = false; };
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

    const [modalConfirm, setModalConfirm] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        type: 'info' | 'success' | 'warning' | 'danger';
        onConfirm: () => void | Promise<void>;
        isLoading?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: () => {}
    });

    // Todas las evaluaciones del paciente, de más reciente a más antigua
    const [todasLasEvaluaciones, setTodasLasEvaluaciones] = useState<Evaluacion[]>([]);

    const cargarEvaluaciones = async () => {
        if (!pacienteId) { setTodasLasEvaluaciones([]); return; }
        try {
            const resp = await listarEvaluaciones(pacienteId);
            const adaptadas = resp.data
                .map(adaptarEvaluacion)
                .sort((a, b) => {
                    const dA = a.fecha.split('-').reverse().join('-');
                    const dB = b.fecha.split('-').reverse().join('-');
                    return new Date(dB).getTime() - new Date(dA).getTime();
                });
            setTodasLasEvaluaciones(adaptadas);
        } catch {
            setTodasLasEvaluaciones([]);
        }
    };

    useEffect(() => {
        cargarEvaluaciones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (loadingPac) {
        return <div className="p-8 text-center text-slate-400">Cargando paciente…</div>;
    }
    
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
                onSave={async (updatedEval, editProximoControl) => {
                    if (!selectedEval) return;
                    try {
                        await actualizarEvaluacion(selectedEval.id, {
                            id_paciente: Number(pacienteId),
                            peso_kg: updatedEval.peso,
                            talla_cm: updatedEval.talla,
                            perimetro_abdom_cm: updatedEval.perimetroAbdominal,
                            recomendaciones_ali: updatedEval.indicaciones,
                            fecha_proximo_ctrl: editProximoControl || undefined,
                        });

                        await cargarEvaluaciones(); // ← recarga desde el backend (dato real)

                        setIsEditarModalOpen(false);
                        setSelectedEval(null);
                        setModalConfirm({
                            isOpen: true,
                            title: '¡Operación Exitosa!',
                            message: 'La evaluación médica ha sido modificada y guardada correctamente.',
                            type: 'success',
                            confirmText: 'Aceptar',
                            cancelText: 'Cerrar',
                            onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
                        });
                    } catch (err) {
                        const msg = err instanceof ApiError
                            ? err.message
                            : 'No se pudo guardar la evaluación.';
                        setIsEditarModalOpen(false);
                        setSelectedEval(null);
                        setModalConfirm({
                            isOpen: true,
                            title: 'Error al Guardar',
                            message: msg, // ← acá sale el aviso de "plazo de 24h vencido" si aplica
                            type: 'danger',
                            confirmText: 'Cerrar',
                            cancelText: 'Cerrar',
                            onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
                        });
                    }
                }}
            />

            <ModalConfirmacion
                isOpen={modalConfirm.isOpen}
                onClose={() => setModalConfirm(prev => ({ ...prev, isOpen: false }))}
                onConfirm={modalConfirm.onConfirm}
                title={modalConfirm.title}
                message={modalConfirm.message}
                confirmText={modalConfirm.confirmText}
                cancelText={modalConfirm.cancelText}
                type={modalConfirm.type}
                isLoading={modalConfirm.isLoading}
            />
        </>
    );
}