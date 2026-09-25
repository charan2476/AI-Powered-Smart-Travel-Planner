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
        <label className="block text-sm font-semibold text-slate-700 mb-2">
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
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30 scale-[1.02]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              {option}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default MultiSelect;
