import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { tripService } from '../services/tripService';
import { destinationService } from '../services/destinationService';
import {
  Compass,
  Calendar,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  Globe,
  Sparkles,
  MapPin,
  ArrowRight,
  Trash2,
  AlertTriangle,
  Bot,
  Lightbulb,
  Plane,
  Clock,
  Luggage,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import InteractiveGlobe from '../components/InteractiveGlobe';
import DestinationCard from '../components/DestinationCard';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [trips, setTrips] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    totalPlannedBudget: 0,
  });
  const [loading, setLoading] = useState(true);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await tripService.getTrips();
      if (res.success) {
        setTrips(res.data || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      showToast('Failed to load trips. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await destinationService.getDestinations();
      if (res.success && res.data) {
        setPopularDestinations(res.data.slice(0, 3));
      }
    } catch (e) {
      console.warn('Could not fetch destinations preview:', e);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchDestinations();
  }, []);

  const confirmDeleteTrip = async () => {
    if (!tripToDelete) return;
    setDeleting(true);
    try {
      const res = await tripService.deleteTrip(tripToDelete._id);
      if (res.success) {
        showToast(`Trip to ${tripToDelete.destination} deleted.`, 'success');
        setTripToDelete(null);
        fetchTrips();
      }
    } catch (err) {
      showToast('Error deleting trip.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Find most imminent upcoming trip
  const upcomingTripsList = trips.filter((t) => t.status === 'Upcoming');
  const highlightedTrip = upcomingTripsList.length > 0 ? upcomingTripsList[0] : null;

  // Calculate dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Command Center Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-navy-900 rounded-3xl p-6 sm:p-10 text-white shadow-card relative overflow-hidden mb-8 border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                <Sparkles className="w-3.5 h-3.5" /> Travel Command Center
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {getGreeting()}, {user?.name || 'Traveler'} 👋
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Where are you going next? Plan intelligent itineraries, monitor travel expenditures, and explore world destinations with Gemini AI.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <Link to="/plan">
                  <Button size="md" variant="primary" icon={PlusCircle} className="shadow-glow font-bold">
                    + Create New Trip
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button
                    size="md"
                    variant="outline"
                    icon={Globe}
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                  >
                    Explore Destinations
                  </Button>
                </Link>
              </div>
            </div>

            {/* 3D Interactive Globe Element */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <InteractiveGlobe size={240} />
            </div>
          </div>
        </div>

        {/* 4 Key Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            title="Total Trips"
            value={stats.totalTrips}
            subtitle="Saved itineraries"
            icon={Compass}
            color="blue"
          />
          <StatCard
            title="Upcoming Trips"
            value={stats.upcomingTrips}
            subtitle="Ready for departure"
            icon={Calendar}
            color="emerald"
          />
          <StatCard
            title="Completed"
            value={stats.completedTrips}
            subtitle="Past vacations"
            icon={CheckCircle2}
            color="purple"
          />
          <StatCard
            title="Total Planned Budget"
            value={`$${stats.totalPlannedBudget.toLocaleString()}`}
            subtitle="Across all trips"
            icon={DollarSign}
            color="amber"
          />
        </div>

        {/* AI Travel Insight Card */}
        {highlightedTrip && (
          <div className="mb-8 p-5 bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 rounded-2xl border border-sky-100 flex items-start gap-3.5 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-0.5 flex items-center gap-1.5">
                AI Travel Insight for {highlightedTrip.destination}
                <Sparkles className="w-3 h-3 text-sky-600" />
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {highlightedTrip.travelTips && highlightedTrip.travelTips.length > 0
                  ? highlightedTrip.travelTips[0]
                  : `Based on your upcoming ${highlightedTrip.travelStyle.toLowerCase()} trip to ${highlightedTrip.destination}, consider visiting major sights in the morning to enjoy pleasant weather and beat the afternoon crowds!`}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading your travel dashboard..." fullPage />
        ) : (
          <div className="space-y-10">
            {/* Upcoming Trip Highlight (if any) */}
            {highlightedTrip && (
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <Plane className="w-4 h-4 text-sky-600" />
                  <h2 className="text-lg font-black text-slate-900">Upcoming Journey</h2>
                </div>

                <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden border border-slate-800">
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-bold border border-white/20 backdrop-blur-xs">
                        {highlightedTrip.travelStyle} Escape
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black flex items-center gap-2 text-white">
                        <MapPin className="w-6 h-6 text-sky-400 flex-shrink-0" />
                        {highlightedTrip.destination}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2">
                        {highlightedTrip.destinationSummary ||
                          highlightedTrip.tripTitle ||
                          'Get ready for an exciting journey tailored to your interests!'}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-sky-200 pt-1 font-medium">
                        <span>📅 {highlightedTrip.startDate} – {highlightedTrip.endDate}</span>
                        <span>⏱️ {highlightedTrip.duration} Days</span>
                        <span>👥 {highlightedTrip.travelers} Travelers</span>
                        <span className="font-bold text-white">💰 {highlightedTrip.budget?.toLocaleString()} {highlightedTrip.currency}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Link to={`/trips/${highlightedTrip._id}`}>
                        <Button
                          size="lg"
                          className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-bold text-sm px-6"
                          icon={ArrowRight}
                        >
                          View Full Trip
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Trips Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Your Saved Trips</h2>
                  <p className="text-xs text-slate-500">
                    Manage, customize, and review your day-by-day itineraries
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                  {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
                </span>
              </div>

              {trips.length === 0 ? (
                <EmptyState
                  title="No planned trips yet"
                  description="You haven't planned any trips yet. Create your first personalized itinerary in seconds with our AI generator!"
                  actionText="Plan My First Trip ✨"
                  onAction={() => (window.location.href = '/plan')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip) => (
                    <TripCard
                      key={trip._id}
                      trip={trip}
                      onDelete={(t) => setTripToDelete(t)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Popular Destinations Showcase */}
            {popularDestinations.length > 0 && (
              <div className="pt-6 border-t border-slate-200/80">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Trending Destinations</h2>
                    <p className="text-xs text-slate-500">
                      Looking for inspiration? Browse popular travel spots
                    </p>
                  </div>
                  <Link to="/explore">
                    <Button variant="outline" size="sm" icon={ArrowRight}>
                      View All Destinations
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularDestinations.map((dest) => (
                    <DestinationCard key={dest._id} destination={dest} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(tripToDelete)}
        onClose={() => setTripToDelete(null)}
        title="Confirm Trip Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-100">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>
              Are you sure you want to delete your trip to{' '}
              <strong>{tripToDelete?.destination}</strong>? This action cannot be undone.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTripToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleting}
              icon={Trash2}
              onClick={confirmDeleteTrip}
            >
              Delete Trip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
