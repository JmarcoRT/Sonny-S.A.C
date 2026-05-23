import React, { createContext, useContext, useState } from 'react';

interface AuthState {
    rol: string | null;
}

// 1. Crear el contexto internamente (no lo exportamos para no molestar a ESLint)
const AuthContext = createContext<AuthState>({ rol: null });

// 2. Exportar el Hook personalizado para usarlo en los componentes
export const useAuth = () => useContext(AuthContext);

// 3. El componente Proveedor principal
export function SiscopAuthProvider({ children }: { children: React.ReactNode }) {
    // CAMBIA AQUÍ: 'Nutricionista', 'Recepcionista' o 'Administrador' para probar las rutas
    const [user] = useState<AuthState>({ rol: 'Nutricionista' });

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
}