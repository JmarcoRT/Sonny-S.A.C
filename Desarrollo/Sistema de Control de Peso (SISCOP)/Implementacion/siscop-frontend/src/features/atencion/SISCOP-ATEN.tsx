import { useSearchParams, Navigate } from 'react-router-dom';

export default function SiscopAten() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    if (!id) {
        return <Navigate to="/nutricionista/pacientes" replace />;
    }

    return <Navigate to={`/nutricionista/pacientes/atencion/evaluacion?id=${id}`} replace />;
}