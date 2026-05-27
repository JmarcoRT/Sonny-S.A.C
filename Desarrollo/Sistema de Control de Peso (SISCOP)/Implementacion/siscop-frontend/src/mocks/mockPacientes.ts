export interface Paciente {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    sexo: 'Femenino' | 'Masculino';
    edad: number;
    telefono: string;
    fechaUltimoRegistro: string;
}

export const MOCK_PACIENTES: Paciente[] = [
    {
        id: '1',
        nombre: 'Angie Danna',
        apellido: 'Jimenez Vera',
        documento: '12345678',
        sexo: 'Femenino',
        edad: 55,
        telefono: '955456876',
        fechaUltimoRegistro: '2026 / 05 / 11'
    },
    {
        id: '2',
        nombre: 'Carlos Alberto',
        apellido: 'Ramos Quispe',
        documento: '74839215',
        sexo: 'Masculino',
        edad: 42,
        telefono: '965214783',
        fechaUltimoRegistro: '2026 / 05 / 11'
    },
    {
        id: '3',
        nombre: 'Lucía Fernanda',
        apellido: 'Torres Paredes',
        documento: '71462839',
        sexo: 'Femenino',
        edad: 61,
        telefono: '956874123',
        fechaUltimoRegistro: '2026 / 05 / 11'
    },
    {
        id: '4',
        nombre: 'José Manuel',
        apellido: 'Cárdenas Rojas',
        documento: '70295184',
        sexo: 'Masculino',
        edad: 47,
        telefono: '992341875',
        fechaUltimoRegistro: '2026 / 05 / 11'
    },
    {
        id: '5',
        nombre: 'Renato Miguel',
        apellido: 'Castillo Núñez',
        documento: '74583621',
        sexo: 'Masculino',
        edad: 38,
        telefono: '964728315',
        fechaUltimoRegistro: '2026 / 05 / 08'
    },
    {
        id: '6',
        nombre: 'Camila Alejandra',
        apellido: 'Vargas León',
        documento: '76921543',
        sexo: 'Femenino',
        edad: 23,
        telefono: '973812456',
        fechaUltimoRegistro: '2026 / 05 / 08'
    },
    {
        id: '7',
        nombre: 'Diego Andrés',
        apellido: 'Salazar Medina',
        documento: '75918346',
        sexo: 'Masculino',
        edad: 34,
        telefono: '981245670',
        fechaUltimoRegistro: '2026 / 05 / 08'
    },
    {
        id: '8',
        nombre: 'Sergio Iván',
        apellido: 'Lozano Chávez',
        documento: '74261835',
        sexo: 'Masculino',
        edad: 57,
        telefono: '963741852',
        fechaUltimoRegistro: '2026 / 05 / 05'
    },
    {
        id: '9',
        nombre: 'Daniela Rocío',
        apellido: 'Campos Silva',
        documento: '72945186',
        sexo: 'Femenino',
        edad: 19,
        telefono: '981563247',
        fechaUltimoRegistro: '2026 / 05 / 05'
    },
    {
        id: '10',
        nombre: 'Patricia Elena',
        apellido: 'Mendoza Ruiz',
        documento: '76521984',
        sexo: 'Femenino',
        edad: 45,
        telefono: '978456123',
        fechaUltimoRegistro: '2026 / 05 / 05'
    }
];

export interface Evaluacion {
    id: string;
    pacienteId: string;
    fecha: string; // Formato DD-MM-YYYY o DD/MM/YYYY
    tipo: string; // e.g., 'Control Nutricional'
    peso: number; // en kg
    talla: number; // en cm
    perimetroAbdominal: number; // en cm
    imc: number;
    clasificacionImc: 'Bajo peso' | 'Normal' | 'Sobrepeso' | 'Obesidad';
    indicaciones: string;
}

export const MOCK_EVALUACIONES: Evaluacion[] = [
    {
        id: '1',
        pacienteId: '1',
        fecha: '13-04-2026',
        tipo: 'Control Nutricional',
        peso: 67.2,
        talla: 165,
        perimetroAbdominal: 75,
        imc: 24.7,
        clasificacionImc: 'Normal',
        indicaciones: 'Paciente mantiene un control adecuado de su peso. Se sugiere continuar con dieta balanceada baja en carbohidratos simples y continuar con rutinas de cardio 3 veces por semana.'
    },
    {
        id: '2',
        pacienteId: '1',
        fecha: '16-03-2026',
        tipo: 'Control Nutricional',
        peso: 69.0,
        talla: 165,
        perimetroAbdominal: 76,
        imc: 25.3,
        clasificacionImc: 'Sobrepeso',
        indicaciones: 'Se observa reducción constante de peso. Continuar con plan nutricional hipocalórico.'
    },
    {
        id: '3',
        pacienteId: '1',
        fecha: '09-02-2026',
        tipo: 'Control Nutricional',
        peso: 70.8,
        talla: 165,
        perimetroAbdominal: 78,
        imc: 26.0,
        clasificacionImc: 'Sobrepeso',
        indicaciones: 'Pérdida moderada. Mantener meta física e incrementar caminatas diarias.'
    },
    {
        id: '4',
        pacienteId: '1',
        fecha: '12-01-2026',
        tipo: 'Control Nutricional',
        peso: 72.9,
        talla: 165,
        perimetroAbdominal: 80,
        imc: 26.8,
        clasificacionImc: 'Sobrepeso',
        indicaciones: 'Paciente muestra apego parcial a la dieta. Reforzar restricción de azúcares.'
    },
    {
        id: '5',
        pacienteId: '1',
        fecha: '15-12-2025',
        tipo: 'Control Nutricional',
        peso: 74.8,
        talla: 165,
        perimetroAbdominal: 82,
        imc: 27.5,
        clasificacionImc: 'Sobrepeso',
        indicaciones: 'Progreso favorable en la reducción de medidas abdominales.'
    },
    {
        id: '6',
        pacienteId: '1',
        fecha: '10-11-2025',
        tipo: 'Control Nutricional',
        peso: 76.9,
        talla: 165,
        perimetroAbdominal: 84,
        imc: 28.2,
        clasificacionImc: 'Sobrepeso',
        indicaciones: 'Pérdida de peso adecuada. Mantener hábitos alimenticios saludables.'
    },
    {
        id: '7',
        pacienteId: '1',
        fecha: '13-10-2025',
        tipo: 'Control Nutricional',
        peso: 78.8,
        talla: 165,
        perimetroAbdominal: 86,
        imc: 28.9,
        clasificacionImc: 'Sobrepeso',
        indicaciones: 'Buena adherencia. Continuar con plan de alimentación y ejercicio aeróbico.'
    },
    {
        id: '8',
        pacienteId: '1',
        fecha: '15-09-2025',
        tipo: 'Control Nutricional',
        peso: 80.5,
        talla: 165,
        perimetroAbdominal: 87,
        imc: 29.6,
        clasificacionImc: 'Sobrepeso',
        indicaciones: 'Control de peso inicial. Reducir porciones de carbohidratos en la cena.'
    },
    {
        id: '9',
        pacienteId: '1',
        fecha: '11-08-2025',
        tipo: 'Control Nutricional',
        peso: 82.9,
        talla: 165,
        perimetroAbdominal: 89,
        imc: 30.5,
        clasificacionImc: 'Obesidad',
        indicaciones: 'Paciente muestra predisposición a mejorar. Se prescribe plan nutricional restrictivo.'
    },
    {
        id: '10',
        pacienteId: '1',
        fecha: '12-07-2025',
        tipo: 'Control Nutricional',
        peso: 84.7,
        talla: 165,
        perimetroAbdominal: 90,
        imc: 31.1,
        clasificacionImc: 'Obesidad',
        indicaciones: 'Inicio de tratamiento de control de peso. Paciente muestra alta motivación.'
    },
    {
        id: '11',
        pacienteId: '1',
        fecha: '12-06-2025',
        tipo: 'Control Nutricional',
        peso: 86.2,
        talla: 165,
        perimetroAbdominal: 92,
        imc: 31.7,
        clasificacionImc: 'Obesidad',
        indicaciones: 'Primera consulta exploratoria. Evaluación de hábitos alimenticios.'
    },
    {
        id: '12',
        pacienteId: '2',
        fecha: '11-05-2026',
        tipo: 'Control Nutricional',
        peso: 84.5,
        talla: 178,
        perimetroAbdominal: 92,
        imc: 26.7,
        clasificacionImc: 'Sobrepeso',
        indicaciones: 'Paciente con sobrepeso leve. Reducir consumo de azúcares y grasas saturadas.'
    },
    {
        id: '13',
        pacienteId: '3',
        fecha: '11-05-2026',
        tipo: 'Control Nutricional',
        peso: 59.8,
        talla: 160,
        perimetroAbdominal: 78,
        imc: 23.4,
        clasificacionImc: 'Normal',
        indicaciones: 'Estado nutricional óptimo. Mantener régimen actual de alimentación y ejercicios.'
    }
];

