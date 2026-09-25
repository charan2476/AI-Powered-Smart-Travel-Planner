import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Heart, Globe, Shield, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                TripGenie
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered travel planning that turns your wanderlust into structured, customizable, and unforgettable day-by-day itineraries.
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini AI
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/explore" className="hover:text-sky-400 transition-colors">
                  Popular Destinations
                </Link>
              </li>
              <li>
                <Link to="/plan" className="hover:text-sky-400 transition-colors">
                  Plan a Trip
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-sky-400 transition-colors">
                  My Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                AI Day-by-Day Itineraries
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Smart Budget Estimator
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                Interactive AI Assistant
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Curated Travel Highlights
              </li>
            </ul>
          </div>

          {/* Safety & Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              TripGenie SaaS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Plan less, travel more. Your personal AI travel concierge designed for seamless vacations, road trips, and cultural adventures.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TripGenie. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern travelers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
