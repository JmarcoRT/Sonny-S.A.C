import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/SISCOP-AUTH.tsx';

interface Props {
    rolRequerido: string;
}

export default function SISCOPGUARD({ rolRequerido }: Props) {
    const { rol } = useAuth();

    // Si el rol del usuario no coincide con el que pide la ruta, lo patea al login
    if (rol !== rolRequerido) {
        return <Navigate to="/login" replace />;
    }

    // Si coincide, renderiza las pantallas hijas que están dentro de la ruta
    return <Outlet />;
}