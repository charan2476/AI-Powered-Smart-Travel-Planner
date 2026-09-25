import React, { useState } from 'react';
import { Calendar, Plus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden mb-6 transition-all duration-300">
      {/* Day Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-black text-sky-400 text-sm shadow-inner">
            D{dayData.day}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Day {dayData.day}
              </h3>
              {dayData.date && (
                <span className="text-xs text-slate-300 flex items-center gap-1 font-normal">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  {dayData.date}
                </span>
              )}
            </div>
            <p className="text-xs text-sky-200/80 font-medium">
              {dayData.theme || 'Exploration & Sightseeing'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {dayData.activities?.length || 0} Activities
          </span>
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label={isExpanded ? 'Collapse day' : 'Expand day'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Activities List */}
      {isExpanded && (
        <div className="p-6 bg-slate-50/50">
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
            <div className="pt-4 mt-2 border-t border-slate-200/60 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => onAddActivity(dayData.day)}
                className="text-xs font-semibold"
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
