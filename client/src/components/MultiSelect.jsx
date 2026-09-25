import React from 'react';
import { Check } from 'lucide-react';

export const MultiSelect = ({
  label,
  options = [],
  selected = [],
  onChange,
  error,
  helperText,
  required = false,
}) => {
  const toggleOption = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              type="button"
              key={option}
              onClick={() => toggleOption(option)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? 'btn-shimmer bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30 scale-[1.03] border border-sky-400/40'
                  : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90 shadow-sm'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default MultiSelect;
