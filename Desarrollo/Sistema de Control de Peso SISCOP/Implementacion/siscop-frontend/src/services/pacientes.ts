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

export interface PacienteInput {
    nombres: string;
    apellidos: string;
    dni: string;
    tipo_documento?: 'DNI' | 'Carnet de Extranjería';
    sexo: 'M' | 'F';
    fecha_nacimiento: string;
    telefono?: string;
}

export interface PacienteBackend {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    tipoDocumento: 'DNI' | 'Carnet de Extranjería';
    sexo: 'Femenino' | 'Masculino';
    edad: number;
    telefono?: string | null;
    fechaNacimiento: string;
    fechaUltimoRegistro?: string;
}

// 1. LISTAR PACIENTES DESDE EL BACKEND
export async function listarPacientes(params: {
    nombre?: string;
    documento?: string;
    page?: number;
    limit?: number;
}) {
    // Mandamos los filtros en el objeto 'query' gracias a tu buildQuery de api.ts
    return await apiRequest<ListadoResponse>('/pacientes', {
        method: 'GET',
        query: {
            nombre: params.nombre,
            documento: params.documento,
            page: params.page,
            limit: params.limit
        }
    });
}

// 2. OBTENER UN PACIENTE POR ID
export async function obtenerPaciente(id: string | number) {
    return await apiRequest<{ ok: true; data: PacienteBackend }>(`/pacientes/${id}`, {
        method: 'GET'
    });
}

// 3. CREAR PACIENTE EN EL BACKEND REAL
export async function crearPaciente(data: PacienteInput) {
    return await apiRequest<Paciente>('/pacientes', {
        method: 'POST',
        body: data
    });
}

// 4. ACTUALIZAR PACIENTE EN EL BACKEND REAL
export async function actualizarPaciente(id: string | number, data: PacienteInput) {
    return await apiRequest<Paciente>(`/pacientes/${id}`, {
        method: 'PUT', // Cambia a 'PATCH' si tu backend usa PATCH
        body: data
    });
}

// 5. ELIMINAR PACIENTE EN EL BACKEND REAL
export async function eliminarPaciente(id: string | number) {
    await apiRequest(`/pacientes/${id}`, {
        method: 'DELETE'
    });
    return true;
}
