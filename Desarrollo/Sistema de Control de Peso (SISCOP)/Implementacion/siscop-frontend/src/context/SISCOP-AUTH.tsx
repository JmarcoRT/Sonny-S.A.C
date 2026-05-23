import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthState {
    rol: string | null;
    setRol: (rol: string | null) => void;
}

// 1. Crear el contexto internamente (no lo exportamos para no molestar a ESLint)
const AuthContext = createContext<AuthState>({ rol: null, setRol: () => {} });

// 2. Exportar el Hook personalizado para usarlo en los componentes
export const useAuth = () => useContext(AuthContext);

// 3. El componente Proveedor principal
export function SiscopAuthProvider({ children }: { children: React.ReactNode }) {
    const [rol, setRol] = useState<string | null>(() => {
        // Cargar el rol del localStorage si existe
        const rolGuardado = localStorage.getItem('userRol');
        return rolGuardado || null;
    });

    // Sincronizar el rol con localStorage
    useEffect(() => {
        if (rol) {
            localStorage.setItem('userRol', rol);
        } else {
            localStorage.removeItem('userRol');
        }
    }, [rol]);

    return (
        <AuthContext.Provider value={{ rol, setRol }}>
            {children}
        </AuthContext.Provider>
    );
}