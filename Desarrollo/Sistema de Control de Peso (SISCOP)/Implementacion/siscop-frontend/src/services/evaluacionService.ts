// services/evaluacionService.ts
import { apiRequest } from './api';

export interface EvaluacionBackend {
    id: string;
    pacienteId: string;
    fecha: string;
    peso: number;
    talla: number;
    perimetroAbdominal: number;
    imc: number;
    clasificacionImc: 'Bajo peso' | 'Normal' | 'Sobrepeso' | 'Obesidad';
    indicaciones: string;
    recomendacionesAli: string | null;
    recomendacionesFis: string | null;
    fechaProximoCtrl: string | null;
    editableHasta: string;
    nutricionista: string;
}

interface EvaluacionesResponse {
    ok: true;
    data: EvaluacionBackend[];
}

export interface CrearEvaluacionInput {
    id_paciente: number;
    peso_kg: number;
    talla_cm: number;
    perimetro_abdom_cm?: number;
    recomendaciones_ali?: string;
    recomendaciones_fis?: string;
    fecha_proximo_ctrl?: string;
    fecha_evaluacion?: string;
}

// 1. LISTAR EVALUACIONES DE UN PACIENTE
export async function listarEvaluaciones(pacienteId: string | number) {
    return await apiRequest<EvaluacionesResponse>(
        `/pacientes/${pacienteId}/evaluaciones`,
        { method: 'GET' }
    );
}

// 2. CREAR EVALUACION
export async function crearEvaluacion(data: CrearEvaluacionInput) {
    return await apiRequest<{ ok: true; data: EvaluacionBackend }>(
        '/evaluaciones',
        { method: 'POST', body: data }
    );
}

// OBTENER UNA EVALUACIÓN POR ID
export async function obtenerEvaluacion(id: string | number) {
    return await apiRequest<{ ok: true; data: EvaluacionBackend }>(
        `/evaluaciones/${id}`,
        { method: 'GET' }
    );
}

// ACTUALIZAR EVALUACIÓN (solo Nutricionista en el backend)
export async function actualizarEvaluacion(id: string | number, data: CrearEvaluacionInput) {
    return await apiRequest<{ ok: true; data: EvaluacionBackend }>(
        `/evaluaciones/${id}`,
        { method: 'PUT', body: data }
    );
}