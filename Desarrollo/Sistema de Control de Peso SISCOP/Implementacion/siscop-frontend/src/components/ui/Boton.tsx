import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    isLoading?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'font-semibold px-6 py-3 rounded-2xl transition-all cursor-pointer text-sm shadow-xs select-none active:scale-[0.98] flex items-center justify-center gap-2';
    
    const variants = {
        primary: 'bg-[#1A82C4] hover:bg-[#156fa9] text-white',
        secondary: 'border border-slate-200 text-slate-500 hover:bg-slate-50 bg-white shadow-none',
        success: 'bg-[#00c03a] hover:bg-[#00a832] text-white',
        danger: 'bg-red-500 hover:bg-red-650 text-white shadow-red-500/10'
    };

    return (
        <button
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cargando...
                </>
            ) : (
                children
            )}
        </button>
    );
}
