import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { destinationService } from '../services/destinationService';
import { Search, Globe, Filter, Sparkles, MapPin, Compass, ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import InteractiveGlobe from '../components/InteractiveGlobe';

export const ExplorePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Beach',
    'Mountain',
    'Heritage',
    'City',
    'Nature',
  ];

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await destinationService.getDestinations({
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });
      if (res.success) {
        setDestinations(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDestinations();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-950 py-8 lg:py-14 relative overflow-hidden text-white">
      {/* Background Image: World Travel Explorer / Destinations */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80"
          alt="World destination explorer"
          className="w-full h-full object-cover object-center opacity-30 brightness-90 transform scale-105"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/92 via-slate-900/85 to-slate-950/95" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Hero Banner with Destination Background */}
        <div className="glass-panel relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-10 shadow-2xl border border-white/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30 backdrop-blur-md">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                Curated Travel Catalog
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Explore Your Next Adventure 🌍
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Handpicked travel destinations with curated local insights, weather guides, estimated budgets, and instant 1-click AI itinerary creation.
              </p>
            </div>

            <div className="hidden lg:flex justify-end items-center">
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border border-sky-500/30 bg-slate-900/70 backdrop-blur-md">
                <InteractiveGlobe />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Controls in Glass Panel */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/20 shadow-xl mb-10 flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search Input */}
          <div className="w-full md:w-96">
            <Input
              placeholder="Search by city name (Goa, Jaipur, Manali...)"
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/80 text-white border-white/20 text-xs"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 sm:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 ring-2 ring-sky-300/40'
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <LoadingSpinner message="Finding curated destinations..." fullPage />
        ) : destinations.length === 0 ? (
          <EmptyState
            icon={Globe}
            title="No destinations matched your criteria"
            description="Try adjusting your search keywords or switching category filters."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing {destinations.length} destination{destinations.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination._id}
                  destination={destination}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
