import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { tripService } from '../services/tripService';
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
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [trips, setTrips] = useState([]);
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

  useEffect(() => {
    fetchTrips();
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

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Traveler Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Traveler'}! ✈️
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here is an overview of your upcoming adventures and travel budget.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/explore">
              <Button variant="outline" size="md" icon={Globe}>
                Explore
              </Button>
            </Link>
            <Link to="/plan">
              <Button variant="primary" size="md" icon={PlusCircle}>
                Plan New Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Key Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
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
            subtitle="Past adventures"
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

        {loading ? (
          <LoadingSpinner message="Loading your travel dashboard..." fullPage />
        ) : trips.length === 0 ? (
          <EmptyState
            title="No planned trips yet"
            description="You haven't planned any trips yet. Create your first personalized itinerary in seconds with our AI generator!"
            actionText="Plan My First Trip ✨"
            onAction={() => (window.location.href = '/plan')}
          />
        ) : (
          <div className="space-y-10">
            {/* Highlighted Upcoming Trip Banner (if available) */}
            {highlightedTrip && (
              <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                      <Sparkles className="w-3.5 h-3.5" /> Next Upcoming Trip
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
                      <MapPin className="w-7 h-7 text-sky-400 flex-shrink-0" />
                      {highlightedTrip.destination}
                    </h2>
                    <p className="text-xs sm:text-sm text-sky-100/90 max-w-xl line-clamp-2">
                      {highlightedTrip.destinationSummary ||
                        highlightedTrip.tripTitle ||
                        'Get ready for an exciting journey tailored to your interests!'}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-sky-200 pt-1">
                      <span>📅 {highlightedTrip.startDate} to {highlightedTrip.endDate}</span>
                      <span>⏱️ {highlightedTrip.duration} Days</span>
                      <span>👥 {highlightedTrip.travelers} Travelers</span>
                      <span className="font-bold text-white">💰 {highlightedTrip.budget?.toLocaleString()} {highlightedTrip.currency}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <Link to={`/trips/${highlightedTrip._id}`}>
                      <Button
                        size="lg"
                        className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-bold"
                        icon={ArrowRight}
                      >
                        View Full Itinerary
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* All Trips Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Your Planned Trips</h2>
                  <p className="text-xs text-slate-500">
                    Manage, edit, and explore your generated itineraries
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip._id}
                    trip={trip}
                    onDelete={(t) => setTripToDelete(t)}
                  />
                ))}
              </div>
            </div>
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
