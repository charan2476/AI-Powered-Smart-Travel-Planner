import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6 shadow-soft border border-sky-100">
        <Compass className="w-10 h-10 animate-spin" />
      </div>
      <span className="text-sm font-bold uppercase tracking-wider text-sky-600 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Page Off The Map
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
        The destination you are looking for does not exist or may have moved to a new route.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Return Home
          </Button>
        </Link>
        <Link to="/explore">
          <Button variant="outline">
            Explore Destinations
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
