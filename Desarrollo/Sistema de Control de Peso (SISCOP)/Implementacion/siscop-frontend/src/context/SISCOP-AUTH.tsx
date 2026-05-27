import React, { createContext, useContext, useState, useEffect } from 'react';

// Definimos cómo luce nuestro usuario
export interface Usuario {
    nombre: string;
    apellidos: string;
    rol: 'Nutricionista' | 'Recepcionista';
}

interface AuthState {
    usuario: Usuario | null;
    login: (userData: Usuario) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthState>({
    usuario: null,
    login: () => { },
    logout: () => { }
});

export const useAuth = () => useContext(AuthContext);

export function SiscopAuthProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const userGuardado = localStorage.getItem('siscopUser');
        return userGuardado ? JSON.parse(userGuardado) : null;
    });

    useEffect(() => {
        if (usuario) {
            localStorage.setItem('siscopUser', JSON.stringify(usuario));
        } else {
            localStorage.removeItem('siscopUser');
        }
    }, [usuario]);

    const login = (userData: Usuario) => setUsuario(userData);

    const logout = () => setUsuario(null);

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}