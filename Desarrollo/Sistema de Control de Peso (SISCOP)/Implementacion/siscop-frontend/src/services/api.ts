// Cliente HTTP base para SISCOP. Toma la URL del backend desde VITE_API_URL
// (definida en .env.local) y, si no existe, asume http://localhost:3000/api.

const API_URL =
    (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api';

const TOKEN_KEY = 'siscopToken';

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
    status: number;
    detalles?: unknown;
    constructor(message: string, status: number, detalles?: unknown) {
        super(message);
        this.status = status;
        this.detalles = detalles;
    }
}

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    query?: Record<string, string | number | undefined | null>;
};

const buildQuery = (query?: RequestOptions['query']) => {
    if (!query) return '';
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
            params.append(k, String(v));
        }
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

export async function apiRequest<T = unknown>(
    path: string,
    options: RequestOptions = {}
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}${buildQuery(options.query)}`, {
        method: options.method ?? 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    let payload: { ok?: boolean; mensaje?: string; errores?: unknown; [k: string]: unknown } = {};
    try {
        payload = await res.json();
    } catch {
        // respuesta sin body JSON
    }

    if (!res.ok || payload.ok === false) {
        throw new ApiError(
            (payload.mensaje as string) || `Error ${res.status} en la solicitud`,
            res.status,
            payload.errores
        );
    }

    return payload as T;
}

export const API_BASE_URL = API_URL;
