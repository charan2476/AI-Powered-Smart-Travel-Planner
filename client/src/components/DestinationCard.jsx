import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Sparkles, ArrowRight, Compass } from 'lucide-react';
import Card from './Card';
import Button from './Button';

export const DestinationCard = ({ destination }) => {
  return (
    <Card hoverEffect glassEffect className="flex flex-col h-full group border-slate-200/90 hover:border-sky-400/60 shadow-soft hover:shadow-card transition-all duration-300">
      {/* Cover Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
        
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-md border border-white/60">
          {destination.category}
        </span>

        {/* Destination Title on image */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-xl font-extrabold flex items-center gap-1.5 drop-shadow-md">
            <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0" />
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 font-normal">
            {destination.description}
          </p>

          <div className="space-y-1.5 text-xs text-slate-500 mb-4 bg-slate-50/80 backdrop-blur-xs p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Est. Budget:</span>
              <span className="font-bold text-slate-800">{destination.approximateBudget}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Best For:</span>
              <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                {destination.bestFor}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
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
