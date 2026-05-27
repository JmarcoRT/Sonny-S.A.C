import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/SISCOP-AUTH';
import { MOCK_PACIENTES } from '../../mocks/mockPacientes';
import type { Paciente } from '../../mocks/mockPacientes';
import PacienteFiltros from './ui/PacienteFiltros';
import PacienteTablaNutricionista from './ui/PacienteTablaNutricionista';
import PacienteTablaRecepcionista from './ui/PacienteTablaRecepcionista';
import Paginacion from '../../components/ui/Paginacion';
import { UserPlus } from 'lucide-react';
import SiscopMpac from './SISCOP-PACFORM';

export default function SiscopPac() {
    const { usuario } = useAuth();
    const rol = (usuario?.rol || 'Nutricionista') as 'Nutricionista' | 'Recepcionista';
    const navigate = useNavigate();

    // Listado de pacientes en estado local para simular persistencia en memoria durante la sesión
    const [pacientesList, setPacientesList] = useState<Paciente[]>(MOCK_PACIENTES);

    // Estado del modal de registro
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState<Paciente | null>(null);

    // Filtros de búsqueda (estado local)
    const [nombreQuery, setNombreQuery] = useState('');
    const [documentoQuery, setDocumentoQuery] = useState('');

    // Filtros aplicados al presionar el botón "Filtrar"
    const [appliedFilters, setAppliedFilters] = useState({ nombre: '', documento: '' });

    // Paginación (estado local)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Filtrado de pacientes local (simulación de base de datos)
    const filteredPacientes = useMemo(() => {
        return pacientesList.filter((paciente) => {
            const matchesNombre =
                paciente.nombre.toLowerCase().includes(appliedFilters.nombre.toLowerCase()) ||
                paciente.apellido.toLowerCase().includes(appliedFilters.nombre.toLowerCase());

            const matchesDocumento = paciente.documento.includes(appliedFilters.documento);

            return matchesNombre && matchesDocumento;
        });
    }, [appliedFilters, pacientesList]);

    // Pacientes paginados
    const paginatedPacientes = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPacientes.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPacientes, currentPage]);

    const totalPages = Math.ceil(filteredPacientes.length / itemsPerPage) || 1;

    const handleFiltrar = () => {
        setAppliedFilters({ nombre: nombreQuery, documento: documentoQuery });
        setCurrentPage(1); // Reiniciar a la primera página al buscar
    };

    // Acciones de navegación según el rol
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

    const handleSavePatient = (data: any) => {
        if (patientToEdit) {
            // Modo Edición: Actualizar datos locales
            const updatedList = pacientesList.map((p) => {
                if (p.id === patientToEdit.id) {
                    return {
                        ...p,
                        nombre: data.nombre,
                        apellido: `${data.apellidoPaterno} ${data.apellidoMaterno}`,
                        documento: data.documento,
                        sexo: data.sexo,
                        telefono: data.telefono,
                        edad: parseInt(data.edad) || p.edad
                    };
                }
                return p;
            });
            setPacientesList(updatedList);
            alert(`¡Paciente ${data.nombre} actualizado con éxito!`);
        } else {
            // Modo Creación: Añadir nuevo paciente
            const newPatient: Paciente = {
                id: (pacientesList.length + 1).toString(),
                nombre: data.nombre,
                apellido: `${data.apellidoPaterno} ${data.apellidoMaterno}`,
                documento: data.documento,
                sexo: data.sexo,
                edad: parseInt(data.edad) || 18,
                telefono: data.telefono,
                fechaUltimoRegistro: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, ' / ')
            };
            setPacientesList([newPatient, ...pacientesList]);
            alert(`¡Paciente ${data.nombre} registrado con éxito!`);
        }
        setIsModalOpen(false);
        setPatientToEdit(null);
    };

    return (
        <div className="space-y-6">
            {/* Componente modular de filtros */}
            <PacienteFiltros
                rol={rol}
                nombreFilter={nombreQuery}
                setNombreFilter={setNombreQuery}
                documentoFilter={documentoQuery}
                setDocumentoFilter={setDocumentoQuery}
                onFiltrar={handleFiltrar}
            />

            {/* Cabecera de la tabla y botón de paciente nuevo (Solo para Recepcionista) */}
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

            {/* Tablas específicas por rol */}
            {rol === 'Nutricionista' ? (
                <PacienteTablaNutricionista
                    pacientes={paginatedPacientes}
                    onAbrirHistoria={handleAbrirHistoria}
                />
            ) : (
                <PacienteTablaRecepcionista
                    pacientes={paginatedPacientes}
                    onVerHistorial={handleVerHistorial}
                    onUltimaEvaluacion={handleUltimaEvaluacion}
                    onEditar={handleEditar}
                />
            )}

            {/* Componente modular de paginación */}
            {filteredPacientes.length > 0 && (
                <Paginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Modal de registro/edición de pacientes */}
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