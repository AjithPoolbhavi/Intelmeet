import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass';
}

export function Input({
  label,
  error,
  icon,
  variant = 'default',
  className = '',
  ...props
}: InputProps) {
  const baseClasses = 'w-full px-4 py-2.5 rounded-lg transition-all duration-200';
  
  const variants = {
    default: 'bg-surface-700 border border-surface-600 focus:border-brand-500 text-white placeholder-white/30',
    glass: 'bg-white/5 border border-white/10 focus:border-brand-400 text-white placeholder-white/30 backdrop-blur-sm',
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
            {icon}
          </div>
        )}

        <input
          className={`${baseClasses} ${variants[variant]} ${icon ? 'pl-10' : ''} focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${className}`}
          {...props}
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'glass';
}

export function Textarea({
  label,
  error,
  variant = 'default',
  className = '',
  ...props
}: TextareaProps) {
  const baseClasses = 'w-full px-4 py-2.5 rounded-lg transition-all duration-200 resize-none';
  
  const variants = {
    default: 'bg-surface-700 border border-surface-600 focus:border-brand-500 text-white placeholder-white/30',
    glass: 'bg-white/5 border border-white/10 focus:border-brand-400 text-white placeholder-white/30 backdrop-blur-sm',
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}

      <textarea
        className={`${baseClasses} ${variants[variant]} focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${className}`}
        {...props}
      />

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  variant?: 'default' | 'glass';
}

export function Select({
  label,
  error,
  options,
  variant = 'default',
  className = '',
  ...props
}: SelectProps) {
  const baseClasses = 'w-full px-4 py-2.5 rounded-lg transition-all duration-200';
  
  const variants = {
    default: 'bg-surface-700 border border-surface-600 focus:border-brand-500 text-white',
    glass: 'bg-white/5 border border-white/10 focus:border-brand-400 text-white backdrop-blur-sm',
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}

      <select
        className={`${baseClasses} ${variants[variant]} focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        className={`w-4 h-4 rounded border border-white/20 bg-surface-700 cursor-pointer accent-brand-500 ${className}`}
        {...props}
      />
      {label && <span className="text-sm text-white">{label}</span>}
    </label>
  );
}

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Radio({ label, className = '', ...props }: RadioProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="radio"
        className={`w-4 h-4 rounded-full border border-white/20 bg-surface-700 cursor-pointer accent-brand-500 ${className}`}
        {...props}
      />
      {label && <span className="text-sm text-white">{label}</span>}
    </label>
  );
}
