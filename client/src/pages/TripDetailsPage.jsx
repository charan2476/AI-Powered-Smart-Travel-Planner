import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { tripService } from '../services/tripService';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  Edit,
  Trash2,
  Plus,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Luggage,
  Info,
  Clock,
  PieChart,
  ListOrdered,
  Bot,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import BudgetBreakdown from '../components/BudgetBreakdown';
import ItineraryDay from '../components/ItineraryDay';
import TravelAssistant from '../components/TravelAssistant';

export const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'budget' | 'tips'

  // Modals state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Activity Add/Edit Modal
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [activityModalMode, setActivityModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [activityForm, setActivityForm] = useState({
    time: '10:00 AM',
    title: '',
    description: '',
    estimatedCost: 20,
    category: 'Sightseeing',
  });
  const [savingActivity, setSavingActivity] = useState(false);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const res = await tripService.getTripById(id);
      if (res.success && res.data) {
        setTrip(res.data);
      }
    } catch (err) {
      showToast('Could not load trip details.', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const handleDeleteTrip = async () => {
    setDeleting(true);
    try {
      const res = await tripService.deleteTrip(id);
      if (res.success) {
        showToast('Trip deleted successfully', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast('Failed to delete trip.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Open Add Activity Modal
  const handleOpenAddActivity = (dayNumber) => {
    setSelectedDayNumber(dayNumber);
    setActivityModalMode('add');
    setActivityForm({
      time: '10:00 AM',
      title: '',
      description: '',
      estimatedCost: 25,
      category: 'Sightseeing',
    });
    setActivityModalOpen(true);
  };

  // Open Edit Activity Modal
  const handleOpenEditActivity = (activity, dayNumber) => {
    setSelectedDayNumber(dayNumber);
    setSelectedActivityId(activity._id);
    setActivityModalMode('edit');
    setActivityForm({
      time: activity.time || '10:00 AM',
      title: activity.title || '',
      description: activity.description || '',
      estimatedCost: activity.estimatedCost || 0,
      category: activity.category || 'Sightseeing',
    });
    setActivityModalOpen(true);
  };

  // Delete Activity Handler
  const handleDeleteActivity = async (activity, dayNumber) => {
    try {
      const res = await tripService.deleteActivity(id, dayNumber, activity._id);
      if (res.success) {
        showToast('Activity removed.', 'info');
        setTrip(res.data);
      }
    } catch (err) {
      showToast('Could not delete activity.', 'error');
    }
  };

  // Save Add/Edit Activity
  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!activityForm.title.trim()) {
      showToast('Activity title is required', 'warning');
      return;
    }

    setSavingActivity(true);
    try {
      let res;
      if (activityModalMode === 'add') {
        res = await tripService.addActivity(id, selectedDayNumber, activityForm);
      } else {
        res = await tripService.updateActivity(
          id,
          selectedDayNumber,
          selectedActivityId,
          activityForm
        );
      }

      if (res.success) {
        showToast(
          activityModalMode === 'add' ? 'Activity added! 🎯' : 'Activity updated! ✏️',
          'success'
        );
        setTrip(res.data);
        setActivityModalOpen(false);
      }
    } catch (err) {
      showToast('Error saving activity.', 'error');
    } finally {
      setSavingActivity(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading trip itinerary..." />;
  }

  if (!trip) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-5">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Hero Header Banner with Destination Travel Background & Dark Gradient Overlay */}
        <div className="rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-card mb-8 relative overflow-hidden bg-slate-950 text-white">
          {/* Destination Hero Background Image */}
          <img
            src={`https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80`}
            alt={trip.destination}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-90 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/70" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30 backdrop-blur-md">
                  {trip.travelStyle} Style
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                  {trip.status}
                </span>
                {trip.interests && trip.interests.length > 0 && (
                  <span className="text-xs text-slate-300 font-medium">
                    Interests: {trip.interests.join(', ')}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-md">
                <MapPin className="w-7 h-7 text-sky-400 flex-shrink-0" />
                {trip.destination}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium leading-relaxed">
                {trip.tripTitle || `${trip.travelStyle} Journey in ${trip.destination}`}
              </p>
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link to={`/trips/${trip._id}/edit`}>
                <Button variant="outline" size="sm" icon={Edit} className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-md">
                  Edit Trip
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Dates</span>
                <span className="font-bold text-white">{trip.startDate} - {trip.endDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Duration</span>
                <span className="font-bold text-white">{trip.duration} {trip.duration === 1 ? 'Day' : 'Days'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Travelers</span>
                <span className="font-bold text-slate-800">{trip.travelers} {trip.travelers === 1 ? 'Person' : 'People'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Total Budget</span>
                <span className="font-bold text-slate-800">{trip.budget?.toLocaleString()} {trip.currency || 'USD'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Itinerary, Budget, Tips) */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('itinerary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'itinerary'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Itinerary Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'budget'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Budget Breakdown</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tips'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Luggage className="w-4 h-4" />
            <span>Packing & Tips</span>
          </button>
        </div>

        {/* Tab 1: Itinerary */}
        {activeTab === 'itinerary' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Day-by-Day Schedule</h2>
                  <p className="text-xs text-slate-500">
                    Customized time-of-day activities for your {trip.travelStyle.toLowerCase()} journey
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                  {trip.days?.length || 0} Days
                </span>
              </div>

              {trip.days && trip.days.length > 0 ? (
                trip.days.map((dayData) => (
                  <ItineraryDay
                    key={dayData.day}
                    dayData={dayData}
                    currency={trip.currency}
                    onAddActivity={handleOpenAddActivity}
                    onEditActivity={handleOpenEditActivity}
                    onDeleteActivity={handleDeleteActivity}
                  />
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                  No itinerary days found. You can regenerate the itinerary from the Edit Trip page.
                </div>
              )}
            </div>

            {/* Sidebar Summary on Itinerary Tab */}
            <div className="space-y-6">
              {trip.destinationSummary && (
                <Card glassEffect className="p-6">
                  <h3 className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-500" /> Destination Overview
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {trip.destinationSummary}
                  </p>
                </Card>
              )}

              <BudgetBreakdown
                breakdown={trip.budgetBreakdown}
                totalBudget={trip.budget}
                currency={trip.currency}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Budget */}
        {activeTab === 'budget' && (
          <div className="max-w-3xl mx-auto">
            <BudgetBreakdown
              breakdown={trip.budgetBreakdown}
              totalBudget={trip.budget}
              currency={trip.currency}
            />
          </div>
        )}

        {/* Tab 3: Packing & Local Tips */}
        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Packing Suggestions */}
            <Card glassEffect className="p-6">
              <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                <Luggage className="w-5 h-5 text-emerald-500" /> Packing Suggestions
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {trip.packingSuggestions && trip.packingSuggestions.length > 0 ? (
                  trip.packingSuggestions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No packing suggestions specified.</li>
                )}
              </ul>
            </Card>

            {/* Travel Tips */}
            <Card glassEffect className="p-6">
              <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" /> Local Travel Tips
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                {trip.travelTips && trip.travelTips.length > 0 ? (
                  trip.travelTips.map((tipItem, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                      <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{tipItem}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 italic">No travel tips specified.</li>
                )}
              </ul>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Travel Assistant Widget */}
      <TravelAssistant
        tripContext={{
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          duration: trip.duration,
          travelers: trip.travelers,
          budget: trip.budget,
          currency: trip.currency,
          travelStyle: trip.travelStyle,
          interests: trip.interests,
          destinationSummary: trip.destinationSummary,
          days: trip.days,
        }}
      />

      {/* Add/Edit Activity Modal */}
      <Modal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        title={
          activityModalMode === 'add'
            ? `Add Activity to Day ${selectedDayNumber}`
            : `Edit Activity on Day ${selectedDayNumber}`
        }
      >
        <form onSubmit={handleSaveActivity} className="space-y-4">
          <Input
            label="Activity Title"
            placeholder="e.g. Visit Museum, Beach Sunset Walk, Lunch at Cafe"
            value={activityForm.title}
            onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Time"
              placeholder="e.g. 09:30 AM"
              value={activityForm.time}
              onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
            />

            <Input
              label={`Estimated Cost (${trip.currency || 'USD'})`}
              type="number"
              min="0"
              value={activityForm.estimatedCost}
              onChange={(e) =>
                setActivityForm({ ...activityForm, estimatedCost: e.target.value })
              }
            />
          </div>

          <Select
            label="Category"
            options={[
              'Sightseeing',
              'Food',
              'Dining',
              'Adventure',
              'Culture',
              'Leisure',
              'Shopping',
              'Photography',
            ]}
            value={activityForm.category}
            onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value })}
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows="3"
              value={activityForm.description}
              onChange={(e) =>
                setActivityForm({ ...activityForm, description: e.target.value })
              }
              placeholder="Additional details, directions, or ticket notes..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActivityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={savingActivity}
            >
              {activityModalMode === 'add' ? 'Add Activity' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Trip"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-100">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>
              Are you sure you want to delete your trip to{' '}
              <strong>{trip.destination}</strong>? All itinerary items and notes will be permanently removed.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleting}
              icon={Trash2}
              onClick={handleDeleteTrip}
            >
              Delete Trip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TripDetailsPage;
