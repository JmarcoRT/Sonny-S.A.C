export interface KpiData {
    totales: number;
    atendidos: number;
}

export interface ChartPoint {
    label: string;
    value: number;
}

export interface SexDistribution {
    label: 'Femenino' | 'Masculino';
    value: number;
    color: string;
}

export interface AgeGroupDistribution {
    label: string;
    value: number;
    color: string;
}

export const MOCK_KPI_DATA: KpiData = {
    totales: 15,
    atendidos: 5
};

export const MOCK_LINE_CHART_DATA = {
    Jornada: [
        { label: '08:00', value: 45 },
        { label: '10:00', value: 60 },
        { label: '12:00', value: 78 },
        { label: '14:00', value: 75 },
        { label: '16:00', value: 65 },
        { label: '18:00', value: 50 },
    ],
    Mensual: [
        { label: '1-5', value: 50 },
        { label: '6-10', value: 65 },
        { label: '11-15', value: 78 },
        { label: '16-20', value: 90 },
        { label: '21-25', value: 105 },
        { label: '26-30', value: 112 },
    ],
    Anual: [
        { label: 'Ene', value: 80 },
        { label: 'Feb', value: 85 },
        { label: 'Mar', value: 90 },
        { label: 'Abr', value: 95 },
        { label: 'May', value: 110 },
        { label: 'Jun', value: 105 },
        { label: 'Jul', value: 100 },
        { label: 'Ago', value: 90 },
        { label: 'Sep', value: 80 },
        { label: 'Oct', value: 75 },
        { label: 'Nov', value: 65 },
        { label: 'Dic', value: 60 },
    ]
};

export const MOCK_SEX_DATA: Record<string, SexDistribution[]> = {
    Jornada: [
        { label: 'Femenino', value: 70, color: '#FF6B8B' },
        { label: 'Masculino', value: 30, color: '#1A82C4' }
    ],
    Mensual: [
        { label: 'Femenino', value: 60, color: '#FF6B8B' },
        { label: 'Masculino', value: 40, color: '#1A82C4' }
    ],
    Anual: [
        { label: 'Femenino', value: 55, color: '#FF6B8B' },
        { label: 'Masculino', value: 45, color: '#1A82C4' }
    ]
};

export const MOCK_AGE_DATA: Record<string, AgeGroupDistribution[]> = {
    Jornada: [
        { label: '0-5', value: 10, color: '#8ecae6' },
        { label: '6-17', value: 20, color: '#219ebc' },
        { label: '18-39', value: 50, color: '#126782' },
        { label: '65+', value: 20, color: '#023047' }
    ],
    Mensual: [
        { label: '0-5', value: 18, color: '#8ecae6' },
        { label: '6-17', value: 34, color: '#219ebc' },
        { label: '18-39', value: 28, color: '#126782' },
        { label: '65+', value: 20, color: '#023047' }
    ],
    Anual: [
        { label: '0-5', value: 25, color: '#8ecae6' },
        { label: '6-17', value: 30, color: '#219ebc' },
        { label: '18-39', value: 30, color: '#126782' },
        { label: '65+', value: 15, color: '#023047' }
    ]
};
