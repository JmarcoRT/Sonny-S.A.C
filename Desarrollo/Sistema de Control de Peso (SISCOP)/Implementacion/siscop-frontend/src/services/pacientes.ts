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
    // Simular creación real en el mock en memoria
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Calcular año de nacimiento estimado para la edad
    let edadCalculada = 30;
    if (data.fecha_nacimiento) {
        const nacimiento = new Date(data.fecha_nacimiento);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        edadCalculada = edad >= 0 ? edad : 0;
    }

    const nuevoId = (MOCK_PACIENTES.length > 0 ? Math.max(...MOCK_PACIENTES.map(p => parseInt(p.id))) + 1 : 1).toString();
    const nuevo: Paciente = {
        id: nuevoId,
        nombre: data.nombres,
        apellido: data.apellidos,
        documento: data.dni,
        sexo: data.sexo === 'F' ? 'Femenino' : 'Masculino',
        edad: edadCalculada,
        telefono: data.telefono || '',
        fechaUltimoRegistro: new Date().toLocaleDateString('es-PE').replace(/\//g, ' / ')
    };
    
    MOCK_PACIENTES.unshift(nuevo);
    return nuevo;
}

export async function actualizarPaciente(id: string | number, data: PacienteInput) {
    // Simular actualización real en el mock en memoria
    await new Promise(resolve => setTimeout(resolve, 400));
    const pac = MOCK_PACIENTES.find(p => p.id === String(id));
    if (pac) {
        // Recalcular edad si cambia la fecha de nacimiento
        let edadCalculada = pac.edad;
        if (data.fecha_nacimiento) {
            const nacimiento = new Date(data.fecha_nacimiento);
            const hoy = new Date();
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const mes = hoy.getMonth() - nacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            edadCalculada = edad >= 0 ? edad : 0;
        }

        pac.nombre = data.nombres;
        pac.apellido = data.apellidos;
        pac.documento = data.dni;
        pac.sexo = data.sexo === 'F' ? 'Femenino' : 'Masculino';
        pac.telefono = data.telefono || '';
        pac.edad = edadCalculada;
    }
    return pac || MOCK_PACIENTES[0];
}

export async function eliminarPaciente(id: string | number) {
    // Simular eliminación real en el mock en memoria
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = MOCK_PACIENTES.findIndex(p => p.id === String(id));
    if (index !== -1) {
        MOCK_PACIENTES.splice(index, 1);
        return true;
    }
    return false;
}
