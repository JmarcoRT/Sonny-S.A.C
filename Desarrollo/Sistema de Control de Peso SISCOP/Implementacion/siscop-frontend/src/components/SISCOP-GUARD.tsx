import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/SISCOP-AUTH';

interface Props {
    rolRequerido: string;
}

export default function SISCOPGUARD({ rolRequerido }: Props) {
    // Jalamos el objeto usuario completo
    const { usuario } = useAuth();

    // Si no hay usuario logueado, o si su rol no coincide con el que pide la ruta, lo patea
    if (!usuario || usuario.rol !== rolRequerido) {
        return <Navigate to="/login" replace />;
    }

    // Si coincide, renderiza las pantallas hijas que están dentro de la ruta
    return <Outlet />;
}