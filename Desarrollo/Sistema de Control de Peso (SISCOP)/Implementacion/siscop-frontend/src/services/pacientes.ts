import { apiRequest } from './api';
import type { Paciente } from '../mocks/mockPacientes';
import { MOCK_PACIENTES } from '../mocks/mockPacientes';

interface ListadoResponse {
    ok: true;
    data: Paciente[];
    paginacion: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface SingleResponse {
    ok: true;
    data: Paciente;
}

export interface PacienteInput {
    nombres: string;
    apellidos: string;
    dni: string;
    tipo_documento?: 'DNI' | 'Carnet de Extranjería';
    sexo: 'M' | 'F';
    fecha_nacimiento: string;
    telefono?: string;
}

export async function listarPacientes(params: {
    nombre?: string;
    documento?: string;
    page?: number;
    limit?: number;
}) {
    let filtrados = [...MOCK_PACIENTES];
    
    if (params.nombre) {
        const query = params.nombre.toLowerCase();
        filtrados = filtrados.filter(p => 
            p.nombre.toLowerCase().includes(query) || 
            p.apellido.toLowerCase().includes(query)
        );
    }
    if (params.documento) {
        filtrados = filtrados.filter(p => p.documento.includes(params.documento!));
    }

    const page = params.page || 1;
    const limit = params.limit || 8;
    const total = filtrados.length;
    const totalPages = Math.ceil(total / limit) || 1;
    
    const data = filtrados.slice((page - 1) * limit, page * limit);

    // Simular un pequeño retardo de red
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
        ok: true,
        data,
        paginacion: {
            total,
            page,
            limit,
            totalPages
        }
    } as ListadoResponse;
}

export async function obtenerPaciente(id: string | number) {
    const paciente = MOCK_PACIENTES.find(p => p.id === String(id));
    if (!paciente) throw new Error("Paciente no encontrado");
    return paciente;
}

export async function crearPaciente(data: PacienteInput) {
    // Simular creación
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_PACIENTES[0];
}

export async function actualizarPaciente(id: string | number, data: PacienteInput) {
    // Simular actualización
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_PACIENTES.find(p => p.id === String(id)) || MOCK_PACIENTES[0];
}
