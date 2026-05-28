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
    totales: 5,
    atendidos: 3
};

export const MOCK_LINE_CHART_DATA: ChartPoint[] = [
    { label: '17 mar', value: 450 },
    { label: '24 mar', value: 400 },
    { label: '31 mar', value: 420 },
    { label: '7 abr', value: 370 },
    { label: '14 abr', value: 390 }
];

export const MOCK_SEX_DATA: SexDistribution[] = [
    { label: 'Femenino', value: 60, color: '#FF6B8B' },
    { label: 'Masculino', value: 40, color: '#1A82C4' }
];

export const MOCK_AGE_DATA: AgeGroupDistribution[] = [
    { label: '0-5', value: 18, color: '#8ecae6' },
    { label: '6-17', value: 34, color: '#219ebc' },
    { label: '18-39', value: 28, color: '#126782' },
    { label: '65+', value: 20, color: '#023047' }
];
