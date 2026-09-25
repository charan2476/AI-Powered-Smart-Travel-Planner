import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  ArrowRight,
  MoreVertical,
  Trash2,
  Edit,
  Sparkles,
  MapPin,
} from 'lucide-react';
import Card from './Card';

export const TripCard = ({ trip, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusColors = {
    Upcoming: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-emerald-500/10',
    Completed: 'bg-slate-100 text-slate-700 border-slate-200 shadow-slate-500/10',
    Planning: 'bg-sky-50 text-sky-700 border-sky-200/80 shadow-sky-500/10',
    Draft: 'bg-amber-50 text-amber-700 border-amber-200/80 shadow-amber-500/10',
  };

  return (
    <Card
      hoverEffect
      glassEffect
      className="flex flex-col justify-between p-5 relative group border-slate-200/90 hover:border-sky-400/60 shadow-soft hover:shadow-card transition-all duration-300"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-xs ${
                statusColors[trip.status] || statusColors.Upcoming
              }`}
            >
              {trip.status}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50/80 text-sky-700 border border-sky-100/80">
              {trip.travelStyle}
            </span>
          </div>

          {/* Action dropdown menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
              aria-label="Trip actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-1 w-36 bg-white/95 backdrop-blur-md rounded-xl shadow-card border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link
                  to={`/trips/${trip._id}/edit`}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Trip
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete(trip);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Destination Title */}
        <Link to={`/trips/${trip._id}`} className="block group/link">
          <h3 className="text-xl font-extrabold text-slate-900 line-clamp-1 mb-1 flex items-center gap-1.5 group-hover/link:text-sky-600 transition-colors">
            <MapPin className="w-4.5 h-4.5 text-sky-500 flex-shrink-0" />
            {trip.destination}
          </h3>
          <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-4">
            {trip.tripTitle || `${trip.travelStyle} Adventure in ${trip.destination}`}
          </p>
        </Link>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4 bg-slate-50/50 rounded-xl px-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
            <span className="truncate font-medium">{trip.startDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
            <span className="font-medium">{trip.duration} {trip.duration === 1 ? 'Day' : 'Days'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="font-medium">{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <DollarSign className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>{trip.budget?.toLocaleString()} {trip.currency || 'USD'}</span>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-slate-400 font-medium">
          {trip.days?.length || 0} Itinerary {trip.days?.length === 1 ? 'Day' : 'Days'}
        </span>
        <Link
          to={`/trips/${trip._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-all group-hover:translate-x-1"
        >
          View Plan <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};

export default TripCard;
