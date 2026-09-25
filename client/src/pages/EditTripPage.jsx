import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { tripService } from '../services/tripService';
import { aiService } from '../services/aiService';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  Heart,
  ArrowLeft,
  RefreshCw,
  Save,
  AlertTriangle,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import MultiSelect from '../components/MultiSelect';
import Card from '../components/Card';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';

export const EditTripPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [confirmRegenModal, setConfirmRegenModal] = useState(false);

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    duration: 1,
    travelers: 1,
    budget: 1000,
    currency: 'USD',
    travelStyle: 'Relaxed',
    interests: [],
    tripTitle: '',
    destinationSummary: '',
    status: 'Upcoming',
    importantNotes: [],
  });

  const travelStyles = [
    'Relaxed',
    'Adventure',
    'Luxury',
    'Budget',
    'Family',
    'Romantic',
    'Cultural',
    'Food & Exploration',
  ];

  const interestOptions = [
    'Beaches',
    'Mountains',
    'Food',
    'Culture',
    'History',
    'Shopping',
    'Adventure',
    'Nightlife',
    'Photography',
    'Nature',
    'Sightseeing',
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'INR', label: 'INR (₹)' },
    { value: 'CAD', label: 'CAD ($)' },
    { value: 'AUD', label: 'AUD ($)' },
  ];

  const statusOptions = ['Upcoming', 'Completed', 'Planning', 'Draft'];

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const res = await tripService.getTripById(id);
        if (res.success && res.data) {
          const t = res.data;
          setFormData({
            destination: t.destination || '',
            startDate: t.startDate || '',
            endDate: t.endDate || '',
            duration: t.duration || 1,
            travelers: t.travelers || 1,
            budget: t.budget || 0,
            currency: t.currency || 'USD',
            travelStyle: t.travelStyle || 'Relaxed',
            interests: t.interests || [],
            tripTitle: t.tripTitle || '',
            destinationSummary: t.destinationSummary || '',
            status: t.status || 'Upcoming',
            importantNotes: t.importantNotes || [],
          });
        }
      } catch (err) {
        showToast('Error loading trip data.', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await tripService.updateTrip(id, {
        ...formData,
        travelers: Number(formData.travelers),
        budget: Number(formData.budget),
      });

      if (res.success) {
        showToast('Trip updated successfully! ✅', 'success');
        navigate(`/trips/${id}`);
      }
    } catch (err) {
      showToast('Failed to update trip.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateItinerary = async () => {
    setConfirmRegenModal(false);
    setRegenerating(true);
    try {
      const aiRes = await aiService.generateItinerary({
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: Number(formData.travelers),
        budget: Number(formData.budget),
        currency: formData.currency,
        travelStyle: formData.travelStyle,
        interests: formData.interests,
      });

      const aiData = aiRes.data;

      const updateRes = await tripService.updateTrip(id, {
        ...formData,
        tripTitle: aiData.tripTitle || formData.tripTitle,
        destinationSummary: aiData.destinationSummary || formData.destinationSummary,
        estimatedTotalCost: aiData.estimatedTotalCost || formData.budget,
        budgetBreakdown: aiData.budgetBreakdown,
        days: aiData.days || [],
        travelTips: aiData.travelTips || [],
        packingSuggestions: aiData.packingSuggestions || [],
        importantNotes: aiData.importantNotes || [],
      });

      if (updateRes.success) {
        showToast('Itinerary regenerated with AI! ✨', 'success');
        navigate(`/trips/${id}`);
      }
    } catch (err) {
      showToast('Failed to regenerate itinerary.', 'error');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading trip details..." />;
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 lg:py-12 relative overflow-hidden text-white">
      {/* Background Image: Tropical Travel Horizon */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
          alt="Tropical Travel Horizon"
          className="w-full h-full object-cover object-center opacity-30 brightness-90 transform scale-105"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/92 via-slate-900/85 to-slate-950/95" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/trips/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Return to Itinerary
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmRegenModal(true)}
            isLoading={regenerating}
            icon={RefreshCw}
            className="text-xs text-white bg-white/10 hover:bg-white/20 border-white/20 backdrop-blur-md"
          >
            Regenerate Itinerary with AI
          </Button>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="mb-6 border-b border-white/10 pb-4">
            <h1 className="text-2xl font-extrabold text-white">Edit Trip Details</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Update travel preferences, dates, or trip status
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Destination"
                icon={MapPin}
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />

              <Input
                label="Trip Title"
                value={formData.tripTitle}
                onChange={(e) => setFormData({ ...formData, tripTitle: e.target.value })}
                placeholder="e.g. Summer Vacation in Goa"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />

              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />

              <Select
                label="Status"
                options={statusOptions}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Travelers"
                type="number"
                min="1"
                icon={Users}
                value={formData.travelers}
                onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                required
              />

              <Input
                label="Budget"
                type="number"
                min="1"
                icon={DollarSign}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              />

              <Select
                label="Currency"
                options={currencies}
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
            </div>

            <Select
              label="Travel Style"
              options={travelStyles}
              icon={Compass}
              value={formData.travelStyle}
              onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
            />

            <div>
              <MultiSelect
                label="Interests"
                options={interestOptions}
                selected={formData.interests}
                onChange={(interests) => setFormData({ ...formData, interests })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Destination Summary / Notes
              </label>
              <textarea
                rows="3"
                value={formData.destinationSummary}
                onChange={(e) =>
                  setFormData({ ...formData, destinationSummary: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link to={`/trips/${id}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                isLoading={saving}
                icon={Save}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal for AI Regeneration */}
      <Modal
        isOpen={confirmRegenModal}
        onClose={() => setConfirmRegenModal(false)}
        title="Regenerate Itinerary with AI?"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 text-amber-900 text-xs border border-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              This will create a brand new day-by-day itinerary with AI and replace existing activities. Are you sure you want to proceed?
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmRegenModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              onClick={handleRegenerateItinerary}
            >
              Yes, Regenerate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditTripPage;
