import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glassEffect = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        glassEffect
          ? 'glass-card border-slate-200/80 shadow-soft'
          : 'bg-white border-slate-200/80 shadow-soft'
      } ${
        hoverEffect
          ? 'hover:shadow-card hover:-translate-y-1 hover:border-sky-300/80 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
