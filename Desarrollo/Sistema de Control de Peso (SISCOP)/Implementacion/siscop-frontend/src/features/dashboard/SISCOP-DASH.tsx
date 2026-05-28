import { Folder, Check } from 'lucide-react';
import DashboardKpiCard from './ui/DashboardKpiCard';
import DashboardChartCard from './ui/DashboardChartCard';
import DashboardLineChart from './ui/DashboardLineChart';
import DashboardDonutChart from './ui/DashboardDonutChart';
import DashboardBarChart from './ui/DashboardBarChart';
import { MOCK_KPI_DATA, MOCK_LINE_CHART_DATA, MOCK_SEX_DATA, MOCK_AGE_DATA } from '../../mocks/mockDashboard';

export default function SiscopDash() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Métricas rápidas (KPI Cards) a la izquierda */}
                <div className="lg:col-span-1 flex flex-col sm:flex-row lg:flex-col gap-6">
                    <DashboardKpiCard
                        title="Pacientes Totales"
                        value={MOCK_KPI_DATA.totales}
                        description="En toda la historia"
                        icon={Folder}
                        iconColorClass="text-[#1A82C4]"
                        iconBgClass="bg-blue-50"
                        valueColorClass="text-[#1A82C4]"
                    />
                    <DashboardKpiCard
                        title="Pacientes atendidos"
                        value={MOCK_KPI_DATA.atendidos}
                        description="De el día de hoy"
                        icon={Check}
                        iconColorClass="text-[#00c03a]"
                        iconBgClass="bg-emerald-50"
                        valueColorClass="text-[#00c03a]"
                    />
                </div>

                {/* Gráfico principal de atenciones a la derecha */}
                <div className="lg:col-span-3">
                    <DashboardChartCard
                        title="Número de atenciones"
                        description="Reporte semanal de pacientes ingresados"
                    >
                        <DashboardLineChart data={MOCK_LINE_CHART_DATA} />
                    </DashboardChartCard>
                </div>
            </div>

            {/* Gráficos inferiores de distribución */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardChartCard
                    title="Distribución por sexo"
                    description="Clasificación de pacientes por género registrado"
                >
                    <DashboardDonutChart data={MOCK_SEX_DATA} />
                </DashboardChartCard>

                <DashboardChartCard
                    title="Distribución por grupo etario"
                    description="Clasificación por edades del total de pacientes"
                >
                    <DashboardBarChart data={MOCK_AGE_DATA} />
                </DashboardChartCard>
            </div>
        </div>
    );
}