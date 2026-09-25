import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { destinationService } from '../services/destinationService';
import {
  MapPin,
  Sparkles,
  ArrowLeft,
  DollarSign,
  Compass,
  CheckCircle2,
  Lightbulb,
  Camera,
  ArrowRight,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

export const DestinationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDest = async () => {
      try {
        setLoading(true);
        const res = await destinationService.getDestinationById(id);
        if (res.success && res.data) {
          setDestination(res.data);
        }
      } catch (err) {
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetchDest();
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading destination details..." />;
  }

  if (!destination) return null;

  return (
    <div className="min-h-screen bg-slate-950 py-8 lg:py-12 relative overflow-hidden text-white">
      {/* Full-Page Destination Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover object-center opacity-30 brightness-90 transform scale-105"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/92 via-slate-900/85 to-slate-950/95" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Destinations
          </Link>
        </div>

        {/* Hero Image & Title Banner */}
        <div className="glass-panel relative rounded-3xl overflow-hidden shadow-2xl mb-8 h-[360px] sm:h-[420px] border border-white/20">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 backdrop-blur-md text-sky-300 border border-sky-400/30 shadow-md">
              {destination.category}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold flex items-center gap-2 tracking-tight drop-shadow-md">
                <MapPin className="w-8 h-8 text-sky-400 flex-shrink-0" />
                {destination.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 max-w-xl line-clamp-2">
                {destination.description}
              </p>
            </div>

            <Link
              to={`/plan?destination=${encodeURIComponent(destination.name)}`}
              className="flex-shrink-0"
            >
              <Button size="lg" className="shadow-glow font-bold" icon={Sparkles}>
                Plan a Trip Here
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info (Left 2 cols) */}
          <div className="md:col-span-2 space-y-8">
            {/* Overview */}
            <div className="glass-panel p-6 rounded-3xl border border-white/15 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-400" /> About {destination.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Popular Attractions */}
            {destination.attractions && destination.attractions.length > 0 && (
              <div className="glass-panel p-6 rounded-3xl border border-white/15 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-400" /> Top Attractions & Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.attractions.map((attraction, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs font-semibold text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <span>{attraction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Tips */}
            {destination.travelTips && destination.travelTips.length > 0 && (
              <div className="glass-panel p-6 rounded-3xl border border-white/15 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" /> Insider Travel Tips
                </h2>
                <ul className="space-y-3 text-xs text-slate-300">
                  {destination.travelTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-amber-500/10 p-3 rounded-xl border border-amber-400/20">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Summary (Right col) */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/15 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4">
                Traveler Quick Facts
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-slate-400">Approx. Budget:</span>
                  <span className="font-bold text-white">{destination.approximateBudget}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-slate-400">Best Style:</span>
                  <span className="font-bold text-white">{destination.bestFor}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-sky-400">{destination.category}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to={`/plan?destination=${encodeURIComponent(destination.name)}`}
                  className="w-full block"
                >
                  <Button variant="primary" className="w-full shadow-glow font-bold" icon={Sparkles}>
                    Plan {destination.name} Trip
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailsPage;
