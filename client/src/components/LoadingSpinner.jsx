import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export const LoadingSpinner = ({
  message = 'Loading your adventure...',
  subtext,
  fullPage = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
      <div className="relative mb-6">
        {/* Glowing ring animation */}
        <div className="w-16 h-16 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-sky-600">
          <Compass className="w-7 h-7 animate-pulse" />
        </div>
      </div>
      <h4 className="text-base font-semibold text-slate-800 flex items-center gap-2 justify-center">
        {message}
        <Sparkles className="w-4 h-4 text-sky-500 animate-bounce" />
      </h4>
      {subtext && (
        <p className="mt-1.5 text-xs text-slate-500 max-w-sm">{subtext}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
