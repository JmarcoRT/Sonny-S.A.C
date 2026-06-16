import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
                <input
                    ref={ref}
                    className={`w-full bg-slate-50/50 border rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all text-slate-700 ${
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-slate-200'
                    } ${className}`}
                    {...props}
                />
                {error && <span className="text-red-500 text-xs mt-0.5">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
