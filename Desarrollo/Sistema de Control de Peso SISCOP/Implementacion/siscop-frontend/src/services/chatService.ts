import { apiRequest, ApiError } from './api';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
    role: ChatRole;
    text: string;
}

interface ChatResponse {
    ok: true;
    reply: string;
}

/**
 * Envía el historial de mensajes al endpoint /chat del backend
 * y devuelve el texto de la respuesta del asistente.
 */
export async function enviarMensaje(messages: ChatMessage[]): Promise<string> {
    try {
        const res = await apiRequest<ChatResponse>('/chat', {
            method: 'POST',
            body: { messages },
        });
        return res.reply;
    } catch (e) {
        if (e instanceof ApiError) throw e;
        throw new ApiError('No se pudo contactar al asistente.', 0);
    }
}