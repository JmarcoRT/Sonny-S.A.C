import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="fixed inset-0" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl w-full max-w-4xl p-10 shadow-xl border border-slate-100 z-10 my-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
                        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                        Cancelar
                    </button>
                </div>

                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
