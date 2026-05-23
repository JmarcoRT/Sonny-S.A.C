import { Outlet } from 'react-router-dom';

export default function SiscopHc() {
    return (
        <div>
            <h2>SISCOP-HC: Historial Clínico</h2>
            <p>Línea de tiempo cronológica con todas las evaluaciones previas del paciente seleccionado.</p>

            {/* ESPACIO RESERVADO: Aquí es donde React Router pintará el componente SISCOP-MATE */}
            <div style={{ marginTop: '2rem' }}>
                <Outlet />
            </div>
        </div>
    );
}