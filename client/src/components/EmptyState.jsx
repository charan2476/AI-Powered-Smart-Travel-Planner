import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = MapPin,
  title = 'No trips found',
  description = 'You have not planned any trips yet. Start crafting your dream itinerary with AI!',
  actionText = 'Plan a New Trip',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 shadow-sm border border-sky-100">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={ArrowRight}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
