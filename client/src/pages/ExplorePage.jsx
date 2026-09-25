import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { destinationService } from '../services/destinationService';
import { Search, Globe, Filter, Sparkles, MapPin } from 'lucide-react';
import Input from '../components/Input';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

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
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold mb-3 border border-sky-100">
            <Globe className="w-3.5 h-3.5 text-sky-500" /> Explore Iconic Destinations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Discover Your Next Dream Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse through handpicked locations with curated travel tips, approximate budgets, and instant AI trip generation.
          </p>
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              <span className="text-xs font-semibold text-slate-500">
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
