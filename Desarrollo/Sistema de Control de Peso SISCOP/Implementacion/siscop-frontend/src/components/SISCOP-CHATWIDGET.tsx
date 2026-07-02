import React, { useEffect, useRef, useState } from 'react';
import { X, Send } from 'lucide-react';
import Markdown from 'react-markdown';
import { useChat } from '../context/SISCOP-CHAT';

// Componentes personalizados para Markdown: clases mínimas
// heredadas de Tailwind para no romper la burbuja.
const mdComponents = {
    p: ({ children }: { children?: React.ReactNode }) => <p className="m-0 leading-snug">{children}</p>,
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc pl-5 my-1 space-y-0.5">{children}</ul>,
    ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal pl-5 my-1 space-y-0.5">{children}</ol>,
    li: ({ children }: { children?: React.ReactNode }) => <li className="m-0">{children}</li>,
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
            {children}
        </a>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
        <code className="bg-slate-200/70 px-1 py-0.5 rounded text-[12px]">{children}</code>
    ),
};

function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="inline-block w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}

export default function SiscopChatWidget() {
    const { messages, isLoading, sendMessage } = useChat();
    const [abierto, setAbierto] = useState(false);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (abierto && scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isLoading, abierto]);

    // Foco al abrir
    useEffect(() => {
        if (abierto) {
            // pequeño delay para que termine la animación de entrada
            const t = setTimeout(() => inputRef.current?.focus(), 150);
            return () => clearTimeout(t);
        }
    }, [abierto]);

    const enviar = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const texto = input.trim();
        if (!texto || isLoading) return;
        setInput('');
        await sendMessage(texto);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviar();
        }
    };

    return (
        <>
            {/* Botón flotante */}
            <button
                type="button"
                onClick={() => setAbierto((v) => !v)}
                aria-label={abierto ? 'Cerrar chat' : 'Abrir chat'}
                className="fixed bottom-6 right-6 z-50 w-[60px] h-[60px] rounded-full bg-white border-2 border-[#1A82C4] shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
                {abierto ? (
                    <X className="w-6 h-6 text-[#1A82C4]" />
                ) : (
                    <>
                        <img src="/logo.svg" alt="Asistente SISCOP" className="w-9 h-9 object-contain" />
                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#00C03A] rounded-full border-2 border-white" />
                    </>
                )}
            </button>

            {/* Ventana del chat */}
            {abierto && (
                <div
                    className="fixed bottom-[90px] right-6 z-50 w-[340px] h-[470px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Cabecera */}
                    <div className="bg-gradient-to-r from-[#1A82C4] to-[#1a9c6b] px-4 py-3 flex items-center gap-3 flex-shrink-0">
                        <div className="bg-white rounded-lg p-1 w-9 h-9 flex items-center justify-center flex-shrink-0">
                            <img src="/logo.svg" alt="" className="w-7 h-7 object-contain" />
                        </div>
                        <div className="flex flex-col leading-tight min-w-0">
                            <span className="text-white font-bold text-sm truncate">Asistente SISCOP</span>
                            <span className="text-green-200 text-xs font-medium">En línea</span>
                        </div>
                    </div>

                    {/* Lista de mensajes */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50"
                    >
                        {messages.length === 0 && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 text-slate-700 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm max-w-[85%]">
                                    ¡Hola! Soy el asistente de SISCOP. ¿En qué te ayudo?
                                </div>
                            </div>
                        )}

                        {messages.map((m, i) => {
                            const esUsuario = m.role === 'user';
                            return (
                                <div key={i} className={`flex ${esUsuario ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-snug whitespace-pre-wrap break-words ${
                                            esUsuario
                                                ? 'bg-[#1A82C4] text-white rounded-br-md'
                                                : 'bg-slate-100 text-slate-700 rounded-bl-md'
                                        }`}
                                    >
                                        {esUsuario ? (
                                            m.text
                                        ) : (
                                            <Markdown components={mdComponents}>{m.text}</Markdown>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {isLoading && <TypingIndicator />}
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={enviar}
                        className="flex items-end gap-2 p-3 border-t border-slate-200 bg-white flex-shrink-0"
                    >
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            rows={1}
                            placeholder="Escribe tu mensaje…"
                            className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:bg-white focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all text-slate-700 max-h-24"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            aria-label="Enviar mensaje"
                            className="w-10 h-10 rounded-xl bg-[#1A82C4] hover:bg-[#156fa9] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}