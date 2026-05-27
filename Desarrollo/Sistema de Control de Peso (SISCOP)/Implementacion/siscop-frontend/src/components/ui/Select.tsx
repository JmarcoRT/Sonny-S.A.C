import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && <label className="text-sm font-semibold text-slate-700">{label}</label>}
                <select
                    ref={ref}
                    className={`w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-[#1A82C4] focus:ring-4 focus:ring-[#1A82C4]/10 transition-all text-slate-700 ${
                        error ? 'border-red-500' : ''
                    } ${className}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <span className="text-red-500 text-xs mt-0.5">{error}</span>}
            </div>
        );
    }
);

Select.displayName = 'Select';
export default Select;
