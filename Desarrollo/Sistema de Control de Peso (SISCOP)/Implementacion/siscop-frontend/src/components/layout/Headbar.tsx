import { useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../context/SISCOP-AUTH';

export function Headbar() {
    const { usuario } = useAuth();
    const rol = usuario?.rol;
    const location = useLocation();
    const path = location.pathname.toLowerCase();

    let title = "Sistema SISCOP";
    let subtitle = "Gestión de Control de Peso";

    if (path.includes('/dashboard')) {
        title = "Dashboard";
        subtitle = "Resumen de pacientes del día y alertas";
    } else if (path.includes('/pacientes/atencion/evaluacion')) {
        title = "Evaluación del Paciente";
        subtitle = "Ingresa los datos registrados";
    } else if (path.includes('/pacientes/atencion/evolucion')) {
        title = "Evolución del Paciente";
        subtitle = "Visualiza su progreso en el tiempo";
    } else if (path.includes('/pacientes/atencion/historial') || path.includes('/pacientes/historial')) {
        title = "Historial Clínico";
        subtitle = "Historial de atenciones del paciente";
    } else if (path.includes('/pacientes/atencion')) {
        title = "Atención del Paciente";
        subtitle = "Detalles de atención del paciente";
    } else if (path.includes('/pacientes/registrar')) {
        title = "Registrar Paciente";
        subtitle = "Formulario de registro de nuevos pacientes";
    } else if (path.includes('/pacientes')) {
        title = "Búsqueda de Pacientes";
        subtitle = rol === 'Recepcionista' ? "Buscar registros de pacientes" : "Buscar paciente a atender";
    } else if (path.includes('/perfil')) {
        title = "Mi Perfil";
        subtitle = "Configuración y datos del usuario logueado";
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // Capitalize first letter of the date string
    let currentDate = new Date().toLocaleDateString('es-ES', dateOptions);
    currentDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

    // Format the time as well
    const timeString = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return (
        <header className="px-8 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-30 h-[85px] flex-shrink-0">
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-slate-800 leading-tight">{title}</h1>
                <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{currentDate} - {timeString}</span>
            </div>
        </header>
    );
}