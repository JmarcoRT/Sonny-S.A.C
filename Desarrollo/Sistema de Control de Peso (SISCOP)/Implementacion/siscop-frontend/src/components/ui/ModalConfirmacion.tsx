import { useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, Trash2, X } from 'lucide-react';
import { Button } from './Boton';

interface ModalConfirmacionProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'success' | 'warning' | 'danger';
    isLoading?: boolean;
    showCancel?: boolean;
}

export function ModalConfirmacion({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'info',
    isLoading = false,
    showCancel = type !== 'success' && type !== 'warning'
}: ModalConfirmacionProps) {
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
            if (e.key === 'Escape' && !isLoading) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, isLoading]);

    if (!isOpen) return null;

    const iconMap = {
        info: <Info className="w-10 h-10 text-[#1A82C4]" />,
        success: <CheckCircle className="w-10 h-10 text-[#00c03a]" />,
        warning: <AlertTriangle className="w-10 h-10 text-amber-500" />,
        danger: <Trash2 className="w-10 h-10 text-red-500" />
    };

    const bgIconMap = {
        info: 'bg-[#1A82C4]/10 border border-[#1A82C4]/20',
        success: 'bg-[#00c03a]/10 border border-[#00c03a]/20',
        warning: 'bg-amber-500/10 border border-amber-500/20',
        danger: 'bg-red-500/10 border border-red-500/20'
    };

    const confirmButtonVariant = type === 'danger' ? 'danger' : type === 'success' ? 'success' : 'primary';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={() => !isLoading && onClose()}></div>

            {/* Modal Box */}
            <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className={`p-4 rounded-2xl mb-4 ${bgIconMap[type]}`}>
                        {iconMap[type]}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed px-2">{message}</p>
                </div>

                <div className="flex gap-3 mt-8">
                    {showCancel && (
                        <Button 
                            onClick={onClose} 
                            variant="secondary" 
                            className="flex-1 justify-center"
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button 
                        onClick={onConfirm} 
                        variant={confirmButtonVariant} 
                        className="flex-1 justify-center"
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmacion;

