import React from 'react';
import {
  Clock,
  DollarSign,
  Edit2,
  Trash2,
  MapPin,
  Utensils,
  Compass,
  Camera,
  ShoppingBag,
  Sparkles,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';

export const ActivityCard = ({
  activity,
  dayNumber,
  onEdit,
  onDelete,
  currency = 'USD',
}) => {
  // Determine time-of-day icon & badge
  const getTimeOfDayBadge = (timeStr = '') => {
    const t = timeStr.toLowerCase();
    if (t.includes('am') || t.includes('08:') || t.includes('09:') || t.includes('10:') || t.includes('11:')) {
      return {
        label: '🌅 Morning',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
      };
    }
    if (t.includes('12:') || t.includes('01:') || t.includes('02:') || t.includes('03:') || t.includes('04:') || t.includes('pm')) {
      if (t.includes('07:') || t.includes('08:') || t.includes('09:') || t.includes('10:') || t.includes('night') || t.includes('evening')) {
        return {
          label: '🌆 Evening',
          badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
        };
      }
      return {
        label: '🍴 Afternoon',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
      };
    }
    return {
      label: '🕒 Activity',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-200/80',
    };
  };

  const timeOfDay = getTimeOfDayBadge(activity.time);

  const getCategoryIcon = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('food') || cat.includes('dining') || cat.includes('meal'))
      return <Utensils className="w-3.5 h-3.5 text-amber-500" />;
    if (cat.includes('photo') || cat.includes('sight'))
      return <Camera className="w-3.5 h-3.5 text-sky-500" />;
    if (cat.includes('shop'))
      return <ShoppingBag className="w-3.5 h-3.5 text-rose-500" />;
    if (cat.includes('adventure'))
      return <Compass className="w-3.5 h-3.5 text-emerald-500" />;
    return <Sparkles className="w-3.5 h-3.5 text-purple-500" />;
  };

  return (
    <div className="relative pl-6 sm:pl-8 pb-8 group last:pb-2">
      {/* Timeline vertical bar */}
      <div className="absolute top-3 left-2 sm:left-2.5 bottom-0 w-0.5 bg-gradient-to-b from-sky-400/60 to-slate-200 group-last:hidden" />

      {/* Timeline bullet icon */}
      <div className="absolute top-2 left-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white border-2 border-sky-500 shadow-sm flex items-center justify-center -translate-x-[1px] group-hover:scale-110 transition-transform">
        <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
      </div>

      {/* Activity Card Content */}
      <div className="glass-card p-4.5 rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card hover:border-sky-300/80 transition-all duration-300">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          {/* Time of Day & Time Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${timeOfDay.badgeClass}`}>
              {timeOfDay.label}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <Clock className="w-3 h-3 text-slate-400" />
              {activity.time || 'Flexible Time'}
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-slate-600 text-[11px] font-medium border border-slate-200/80 shadow-2xs">
              {getCategoryIcon(activity.category)}
              {activity.category || 'Sightseeing'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(activity, dayNumber)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                title="Edit activity"
                aria-label="Edit activity"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(activity, dayNumber)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete activity"
                aria-label="Delete activity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-extrabold text-slate-900 mb-1 tracking-tight">
          {activity.title}
        </h4>

        {/* Description */}
        {activity.description && (
          <p className="text-xs text-slate-600 leading-relaxed mb-3 font-normal">
            {activity.description}
          </p>
        )}

        {/* Cost estimate */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2.5 border-t border-slate-100 font-medium">
          <span className="flex items-center gap-1">
            💰 <span className="text-slate-400">Estimated Cost</span>
          </span>
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            {activity.estimatedCost > 0
              ? `${activity.estimatedCost.toLocaleString()} ${currency}`
              : 'Free / Included'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
