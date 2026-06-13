import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/SISCOP-AUTH';
import type { Paciente } from '../../mocks/mockPacientes';
import PacienteFiltros from './ui/PacienteFiltros';
import PacienteTablaNutricionista from './ui/PacienteTablaNutricionista';
import PacienteTablaRecepcionista from './ui/PacienteTablaRecepcionista';
import Paginacion from '../../components/ui/Paginacion';
import { UserPlus, Loader2 } from 'lucide-react';
import SiscopMpac from './SISCOP-PACFORM';
import {
    listarPacientes,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    type PacienteInput,
} from '../../services/pacientes';
import { ApiError } from '../../services/api';
import ModalConfirmacion from '../../components/ui/ModalConfirmacion';

const ITEMS_PER_PAGE = 8;

interface PacienteFormSubmit {
    tipoDocumento: string;
    documento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    edad: string;
    sexo: 'Femenino' | 'Masculino';
    telefono: string;
}

export default function SiscopPac() {
    const { usuario } = useAuth();
    const rol = (usuario?.rol || 'Nutricionista') as 'Nutricionista' | 'Recepcionista';
    const navigate = useNavigate();

    const [pacientesList, setPacientesList] = useState<Paciente[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<Paciente | null>(null);

    const [nombreQuery, setNombreQuery] = useState('');
    const [documentoQuery, setDocumentoQuery] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({ nombre: '', documento: '' });

    const [currentPage, setCurrentPage] = useState(1);

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

    const cargarPacientes = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const res = await listarPacientes({
                nombre: appliedFilters.nombre,
                documento: appliedFilters.documento,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });
            setPacientesList(res.data);
            setTotalPages(res.paginacion.totalPages);
        } catch (err) {
            setErrorMsg(
                err instanceof ApiError
                    ? err.message
                    : 'No se pudo conectar con el servidor.'
            );
            setPacientesList([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [appliedFilters, currentPage]);

    useEffect(() => {
        cargarPacientes();
    }, [cargarPacientes]);

    const handleFiltrar = () => {
        setAppliedFilters({ nombre: nombreQuery, documento: documentoQuery });
        setCurrentPage(1);
    };

    const handleAbrirHistoria = (id: string) => {
        navigate(`/nutricionista/pacientes/atencion?id=${id}`);
    };

    const handleVerHistorial = (id: string) => {
        navigate(`/recepcionista/pacientes/historial?id=${id}`);
    };

    const handleNuevoPaciente = () => {
        setPatientToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditar = (paciente: Paciente) => {
        setPatientToEdit(paciente);
        setIsModalOpen(true);
    };

    const mapFormToInput = (data: PacienteFormSubmit): PacienteInput => ({
        nombres: data.nombre,
        apellidos: `${data.apellidoPaterno} ${data.apellidoMaterno}`.trim(),
        dni: data.documento,
        tipo_documento: (data.tipoDocumento as 'DNI' | 'Carnet de Extranjería') || 'DNI',
        sexo: data.sexo === 'Femenino' ? 'F' : 'M',
        fecha_nacimiento: data.fechaNacimiento,
        telefono: data.telefono,
    });

    const handleSavePatient = (data: PacienteFormSubmit) => {
        const title = patientToEdit ? 'Confirmar Modificación' : 'Confirmar Registro';
        const message = patientToEdit 
            ? `¿Está seguro de que desea guardar los cambios en los datos de ${data.nombre} ${data.apellidoPaterno}?`
            : `¿Está seguro de que desea registrar al nuevo paciente ${data.nombre} ${data.apellidoPaterno}?`;

        setModalConfirm({
            isOpen: true,
            title,
            message,
            type: 'info',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                setModalConfirm(prev => ({ ...prev, isLoading: true }));
                try {
                    if (patientToEdit) {
                        await actualizarPaciente(patientToEdit.id, mapFormToInput(data));
                        setIsModalOpen(false);
                        setPatientToEdit(null);
                        cargarPacientes();
                        setModalConfirm({
                            isOpen: true,
                            title: '¡Operación Exitosa!',
                            message: `La información de ${data.nombre} ha sido actualizada con éxito en la plataforma.`,
                            type: 'success',
                            confirmText: 'Aceptar',
                            cancelText: 'Cerrar',
                            onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
                        });
                    } else {
                        await crearPaciente(mapFormToInput(data));
                        setIsModalOpen(false);
                        setPatientToEdit(null);
                        cargarPacientes();
                        setModalConfirm({
                            isOpen: true,
                            title: '¡Registro Exitoso!',
                            message: `El paciente ${data.nombre} ha sido registrado con éxito en la plataforma.`,
                            type: 'success',
                            confirmText: 'Aceptar',
                            cancelText: 'Cerrar',
                            onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
                        });
                    }
                } catch (err) {
                    const msg = err instanceof ApiError ? err.message : 'No se pudo guardar la información del paciente.';
                    setModalConfirm({
                        isOpen: true,
                        title: 'Error al Procesar',
                        message: msg,
                        type: 'danger',
                        confirmText: 'Cerrar',
                        cancelText: 'Volver',
                        onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
                    });
                }
            }
        });
    };

    const handleEliminarPatient = (paciente: Paciente) => {
        setModalConfirm({
            isOpen: true,
            title: 'Confirmar Eliminación',
            message: `¿Está seguro de que desea eliminar al paciente ${paciente.nombre} ${paciente.apellido}? Esta acción eliminará permanentemente su registro y todo su historial de evaluaciones de la plataforma.`,
            type: 'danger',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                setModalConfirm(prev => ({ ...prev, isLoading: true }));
                try {
                    await eliminarPaciente(paciente.id);
                    cargarPacientes();
                    setModalConfirm({
                        isOpen: true,
                        title: '¡Registro Eliminado!',
                        message: `El paciente ${paciente.nombre} ${paciente.apellido} ha sido retirado del sistema.`,
                        type: 'success',
                        confirmText: 'Aceptar',
                        cancelText: 'Cerrar',
                        onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
                    });
                } catch (err) {
                    setModalConfirm({
                        isOpen: true,
                        title: 'Error al Eliminar',
                        message: 'Ocurrió un error al intentar eliminar el registro del paciente.',
                        type: 'danger',
                        confirmText: 'Cerrar',
                        cancelText: 'Cerrar',
                        onConfirm: () => setModalConfirm(prev => ({ ...prev, isOpen: false }))
                    });
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <PacienteFiltros
                rol={rol}
                nombreFilter={nombreQuery}
                setNombreFilter={setNombreQuery}
                documentoFilter={documentoQuery}
                setDocumentoFilter={setDocumentoQuery}
                onFiltrar={handleFiltrar}
            />

            {rol === 'Recepcionista' && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">Pacientes encontrados</h2>
                    <button
                        onClick={handleNuevoPaciente}
                        className="bg-[#00c03a] hover:bg-[#00a832] text-white font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-sm shadow-xs active:scale-[0.98] select-none"
                    >
                        <UserPlus className="w-5 h-5" />
                        Paciente nuevo
                    </button>
                </div>
            )}

            {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {errorMsg}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-10 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Cargando pacientes...
                </div>
            ) : rol === 'Nutricionista' ? (
                <PacienteTablaNutricionista
                    pacientes={pacientesList}
                    onAbrirHistoria={handleAbrirHistoria}
                />
            ) : (
                <PacienteTablaRecepcionista
                    pacientes={pacientesList}
                    onVerHistorial={handleVerHistorial}
                    onEditar={handleEditar}
                    onEliminar={handleEliminarPatient}
                />
            )}

            {!loading && pacientesList.length > 0 && (
                <Paginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <SiscopMpac
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setPatientToEdit(null);
                }}
                onSave={handleSavePatient}
                patientToEdit={patientToEdit}
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
        </div>
    );
}
