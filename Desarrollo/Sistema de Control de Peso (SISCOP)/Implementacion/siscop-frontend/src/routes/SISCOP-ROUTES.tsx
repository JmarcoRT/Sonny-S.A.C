import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SiscopGuard from '../components/SISCOP-GUARD';
import SiscopLay from '../components/SISCOP-LAY';

import SiscopLogin from '../features/auth/SISCOP-LOGIN';
import SiscopDash from '../features/dashboard/SISCOP-DASH';
import SiscopPac from '../features/pacientes/SISCOP-PAC';
import SiscopHc from '../features/pacientes/SISCOP-HC';
import SiscopEvn from '../features/atencion/SISCOP-EVN';
import SiscopGraf from '../features/atencion/SISCOP-GRAF';

import SiscopAten from '../features/atencion/SISCOP-ATEN';
import SiscopMate from '../features/atencion/SISCOP-CONSULTA';
import SiscopMpac from '../features/pacientes/SISCOP-PACFORM';
import SiscopPerf from '../features/perfil/SISCOP-PERF';
import SiscopVpdf from '../components/SISCOP-REPORTE';

export default function SiscopRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<SiscopLogin />} />

                {/* ================= NUTRICIONISTA ================= */}
                <Route element={<SiscopGuard rolRequerido="Nutricionista" />}>
                    <Route path="/nutricionista" element={<SiscopLay />}>
                        <Route path="dashboard" element={<SiscopDash />} />
                        <Route path="perfil" element={<SiscopPerf />} />

                        <Route path="pacientes">
                            <Route index element={<SiscopPac />} />
                            <Route path="atencion" element={<SiscopAten />} />
                            <Route path="atencion/evaluacion" element={<SiscopEvn />} />
                            <Route path="atencion/evolucion" element={<SiscopGraf />} />
                            <Route path="atencion/reporte/:tipoReporte/:id" element={<SiscopVpdf />} />

                            <Route path="atencion/historial">
                                <Route index element={<SiscopHc />} />
                                <Route path="registro/nuevo" element={<SiscopMate />} />
                                <Route path="registro/editar/:atencionId" element={<SiscopMate />} />
                            </Route>
                        </Route>
                    </Route>
                </Route>

                {/* ================= RECEPCIONISTA ================= */}
                <Route element={<SiscopGuard rolRequerido="Recepcionista" />}>
                    <Route path="/recepcionista" element={<SiscopLay />}>
                        <Route path="dashboard" element={<SiscopDash />} />
                        <Route path="perfil" element={<SiscopPerf />} />

                        <Route path="pacientes">
                            <Route index element={<SiscopPac />} />
                            <Route path="registrar" element={<SiscopMpac />} />
                            <Route path="historial" element={<SiscopHc />} />
                            <Route path="reporte/:tipoReporte/:id" element={<SiscopVpdf />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}