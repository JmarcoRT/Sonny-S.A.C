import { apiRequest, setToken, clearToken } from './api';

export type RolUsuario = 'Nutricionista' | 'Recepcionista';

export interface UsuarioApi {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    usuario: string;
    rol: RolUsuario;
}

interface LoginResponse {
    ok: true;
    token: string;
    usuario: UsuarioApi;
}

export async function loginRequest(usuario: string, contrasena: string): Promise<UsuarioApi> {
    const res = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { usuario, contrasena },
    });
    setToken(res.token);
    return res.usuario;
}

export function logoutLocal() {
    clearToken();
}
