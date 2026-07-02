import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { enviarMensaje } from '../services/chatService';
import type { ChatMessage } from '../services/chatService';

const STORAGE_KEY = 'siscopChatMessages';

interface ChatContextValue {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (text: string) => Promise<void>;
    clearMessages: () => void;
}

const ChatContext = createContext<ChatContextValue>({
    messages: [],
    isLoading: false,
    error: null,
    sendMessage: async () => {},
    clearMessages: () => {},
});

export const useChat = () => useContext(ChatContext);

const cargarMensajes = (): ChatMessage[] => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as ChatMessage[]) : [];
    } catch {
        return [];
    }
};

export function SiscopChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<ChatMessage[]>(cargarMensajes);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    // Persistencia automática
    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch {
            // sessionStorage lleno o no disponible: ignorar
        }
    }, [messages]);

    const sendMessage = async (text: string) => {
        const limpio = text.trim();
        if (!limpio || isLoading) return;

        const userMsg: ChatMessage = { role: 'user', text: limpio };
        const historialActual = [...messages, userMsg];
        setMessages(historialActual);
        setIsLoading(true);
        setError(null);

        try {
            const reply = await enviarMensaje(historialActual);
            if (!mounted.current) return;
            setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
        } catch (e) {
            if (!mounted.current) return;
            const mensaje = e instanceof Error ? e.message : 'Error desconocido.';
            setError(mensaje);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: `⚠ No pude responder: ${mensaje}`,
                },
            ]);
        } finally {
            if (mounted.current) setIsLoading(false);
        }
    };

    const clearMessages = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <ChatContext.Provider value={{ messages, isLoading, error, sendMessage, clearMessages }}>
            {children}
        </ChatContext.Provider>
    );
}