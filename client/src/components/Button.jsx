import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer select-none';

  const variants = {
    primary:
      'btn-shimmer bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 border border-sky-400/30 focus:ring-sky-500',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20 hover:shadow-slate-900/35 hover:-translate-y-0.5 border border-slate-700/60 focus:ring-slate-900',
    outline:
      'border border-slate-300/90 hover:border-sky-500/80 hover:bg-sky-50/50 text-slate-700 hover:text-sky-700 focus:ring-sky-400 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all',
    ghost:
      'text-slate-600 hover:text-sky-600 hover:bg-sky-50/80 focus:ring-sky-300 transition-colors',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-md shadow-rose-600/20 hover:shadow-rose-600/35 hover:-translate-y-0.5 border border-rose-500/40 focus:ring-rose-500',
    accent:
      'btn-shimmer bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-700 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 border border-teal-400/30 focus:ring-teal-500',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-4.5 py-2.5 text-sm gap-2',
    lg: 'px-6.5 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
