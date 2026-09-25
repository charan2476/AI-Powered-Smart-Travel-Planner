import React, { useState } from 'react';
import { Calendar, Plus, ChevronDown, ChevronUp, Sparkles, MapPin } from 'lucide-react';
import ActivityCard from './ActivityCard';
import Button from './Button';

export const ItineraryDay = ({
  dayData,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  currency = 'USD',
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden mb-6 transition-all duration-300 hover:border-slate-300">
      {/* Day Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white cursor-pointer select-none border-b border-slate-800"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-black text-sky-400 text-base shadow-inner">
            D{dayData.day}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Day {dayData.day}
              </h3>
              {dayData.date && (
                <span className="text-xs text-sky-200/90 flex items-center gap-1 font-medium bg-white/10 px-2 py-0.5 rounded-full">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  {dayData.date}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {dayData.theme || 'Exploration & Sightseeing'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full bg-slate-800/90 text-sky-300 border border-slate-700/80">
            {dayData.activities?.length || 0} Activities
          </span>
          <button
            type="button"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse day' : 'Expand day'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Activities List */}
      {isExpanded && (
        <div className="p-6 bg-slate-50/40">
          {dayData.activities && dayData.activities.length > 0 ? (
            <div className="pt-2">
              {dayData.activities.map((activity, idx) => (
                <ActivityCard
                  key={activity._id || `${dayData.day}-${idx}`}
                  activity={activity}
                  dayNumber={dayData.day}
                  onEdit={onEditActivity}
                  onDelete={onDeleteActivity}
                  currency={currency}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 italic">
              No activities planned for Day {dayData.day} yet.
            </div>
          )}

          {/* Add Activity Button */}
          {onAddActivity && (
            <div className="pt-4 mt-2 border-t border-slate-200/70 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => onAddActivity(dayData.day)}
                className="text-xs font-bold"
              >
                Add Activity to Day {dayData.day}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItineraryDay;
