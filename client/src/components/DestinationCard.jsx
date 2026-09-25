import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Sparkles, ArrowRight } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export const DestinationCard = ({ destination }) => {
  return (
    <Card className="flex flex-col h-full group hover:border-slate-300">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
          {destination.category}
        </span>

        {/* Destination Title on image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-xl font-bold flex items-center gap-1.5 drop-shadow-md">
            <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {destination.description}
          </p>

          <div className="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Est. Budget:</span>
              <span className="font-semibold text-slate-700">{destination.approximateBudget}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Best For:</span>
              <span className="font-medium text-slate-700 truncate max-w-[140px]">
                {destination.bestFor}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Link to={`/explore/${destination._id}`}>
            <Button variant="outline" size="sm" className="w-full text-xs">
              Details
            </Button>
          </Link>
          <Link to={`/plan?destination=${encodeURIComponent(destination.name)}`}>
            <Button variant="primary" size="sm" className="w-full text-xs" icon={Sparkles}>
              Plan Trip
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default DestinationCard;
