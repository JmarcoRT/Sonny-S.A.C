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
    type PacienteInput,
} from '../../services/pacientes';
import { ApiError } from '../../services/api';

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

    const handleUltimaEvaluacion = (id: string) => {
        navigate(`/recepcionista/pacientes/reporte/evaluacion/${id}`);
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

    const handleSavePatient = async (data: PacienteFormSubmit) => {
        try {
            if (patientToEdit) {
                await actualizarPaciente(patientToEdit.id, mapFormToInput(data));
                alert(`¡Paciente ${data.nombre} actualizado con éxito!`);
            } else {
                await crearPaciente(mapFormToInput(data));
                alert(`¡Paciente ${data.nombre} registrado con éxito!`);
            }
            setIsModalOpen(false);
            setPatientToEdit(null);
            cargarPacientes();
        } catch (err) {
            const msg = err instanceof ApiError ? err.message : 'No se pudo guardar el paciente.';
            alert(msg);
        }
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
                    onUltimaEvaluacion={handleUltimaEvaluacion}
                    onEditar={handleEditar}
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
        </div>
    );
}
