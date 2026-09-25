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
    <div className="min-h-screen bg-slate-50 py-8 lg:py-14 relative overflow-hidden">
      {/* Subtle Travel Destination Watermark */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none bg-repeat bg-center"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 10 L65 25 L80 25 L68 35 L72 50 L60 40 L48 50 L52 35 L40 25 L55 25 Z M10 80 A5 5 0 1 1 10 70 A5 5 0 1 1 10 80 Z M110 90 A4 4 0 1 1 110 82 A4 4 0 1 1 110 90 Z' fill='%230284c7'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Hero Banner with Destination Background */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 sm:p-12 mb-10 shadow-card border border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
            alt="World Destination Explore"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-25 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-navy-950/85" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30 backdrop-blur-md">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                Curated Travel Catalog
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
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

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-soft mb-10 flex flex-col md:flex-row items-center gap-4 justify-between">
          {/* Search Input */}
          <div className="w-full md:w-96">
            <Input
              placeholder="Search by city name (Goa, Jaipur, Manali...)"
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 text-xs"
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
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
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
