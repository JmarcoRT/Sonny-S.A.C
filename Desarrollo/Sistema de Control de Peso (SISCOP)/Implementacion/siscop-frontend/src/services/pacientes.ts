import { apiRequest } from './api';
import type { Paciente } from '../mocks/mockPacientes';

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
    const res = await apiRequest<ListadoResponse>('/pacientes', { query: params });
    return res;
}

export async function obtenerPaciente(id: string | number) {
    const res = await apiRequest<SingleResponse>(`/pacientes/${id}`);
    return res.data;
}

export async function crearPaciente(data: PacienteInput) {
    const res = await apiRequest<SingleResponse>('/pacientes', {
        method: 'POST',
        body: data,
    });
    return res.data;
}

export async function actualizarPaciente(id: string | number, data: PacienteInput) {
    const res = await apiRequest<SingleResponse>(`/pacientes/${id}`, {
        method: 'PUT',
        body: data,
    });
    return res.data;
}
