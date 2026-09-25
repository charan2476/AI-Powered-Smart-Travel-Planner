import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Globe } from 'lucide-react';
import Button from '../components/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-slate-950 text-white">
      {/* Background Image: Scenic misty nature road */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=2000&q=80"
          alt="Misty scenic nature road"
          className="w-full h-full object-cover object-center opacity-30 brightness-90 transform scale-105"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95" />
      </div>

      <div className="glass-panel max-w-md w-full p-8 sm:p-10 rounded-3xl border border-white/20 shadow-2xl relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-6 shadow-xl border border-sky-400/30">
          <Compass className="w-10 h-10 animate-spin" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Page Off The Map
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-8 leading-relaxed">
          Looks like you've taken a wrong turn! The destination you are looking for does not exist or may have moved to a new route.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" icon={Home} className="shadow-glow font-bold">
              Return Home
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" icon={Globe} className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">
              Explore Destinations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
