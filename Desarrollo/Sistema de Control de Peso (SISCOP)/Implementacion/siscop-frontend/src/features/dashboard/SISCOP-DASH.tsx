import { Folder, Check } from 'lucide-react';
import DashboardKpiCard from './ui/DashboardTarjetaKpi';
import DashboardTarjetaGrafico from './ui/DashboardTarjetaGrafico';
import DashboardGraficoLineas from './ui/DashboardGraficoLineas';
import DashboardGraficoDona from './ui/DashboardGraficoDona';
import DashboardGraficoBarras from './ui/DashboardGraficoBarras';
import { MOCK_KPI_DATA, MOCK_LINE_CHART_DATA, MOCK_SEX_DATA, MOCK_AGE_DATA } from '../../mocks/mockDashboard';

export default function SiscopDash() {
    return (
        <div className="flex flex-col gap-6 h-full min-h-[500px]">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Tarjetas de indicadores rápidos (KPI Cards) a la izquierda */}
                <div className="lg:col-span-1 flex flex-col gap-6">
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

                {/* Gráfico principal de atenciones */}
                <div className="lg:col-span-3">
                    <DashboardTarjetaGrafico
                        title="Número de atenciones"
                        description="Reporte semanal de pacientes ingresados"
                    >
                        {(periodo) => <DashboardGraficoLineas data={MOCK_LINE_CHART_DATA[periodo]} />}
                    </DashboardTarjetaGrafico>
                </div>
            </div>

            {/* Gráficos de distribución */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                <DashboardTarjetaGrafico
                    title="Distribución por sexo"
                    description="Clasificación de pacientes por género registrado"
                >
                    {(periodo) => <DashboardGraficoDona data={MOCK_SEX_DATA[periodo]} />}
                </DashboardTarjetaGrafico>

                <DashboardTarjetaGrafico
                    title="Distribución por grupo etario"
                    description="Clasificación por edades del total de pacientes"
                >
                    {(periodo) => <DashboardGraficoBarras data={MOCK_AGE_DATA[periodo]} />}
                </DashboardTarjetaGrafico>
            </div>
        </div>
    );
}
