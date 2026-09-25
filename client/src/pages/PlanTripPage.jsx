import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { aiService } from '../services/aiService';
import { tripService } from '../services/tripService';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  Clock,
  Heart,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sliders,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import MultiSelect from '../components/MultiSelect';
import Card from '../components/Card';
import FloatingTravelAsset from '../components/FloatingTravelAsset';

export const PlanTripPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const destinationParam = searchParams.get('destination') || '';

  // Calculate default dates: tomorrow and 4 days later
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultStart = tomorrow.toISOString().split('T')[0];

  const fourDaysLater = new Date();
  fourDaysLater.setDate(fourDaysLater.getDate() + 5);
  const defaultEnd = fourDaysLater.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    destination: destinationParam,
    startDate: defaultStart,
    endDate: defaultEnd,
    travelers: 2,
    budget: 1200,
    currency: 'USD',
    travelStyle: 'Relaxed',
    interests: ['Food', 'Culture', 'Sightseeing'],
  });

  const [duration, setDuration] = useState(5);
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);

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

  // Recalculate duration whenever start or end dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays > 0 ? diffDays : 0);
    }
  }, [formData.startDate, formData.endDate]);

  const validateForm = () => {
    const errs = {};

    if (!formData.destination.trim()) {
      errs.destination = 'Destination is required';
    }

    if (!formData.startDate) {
      errs.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      errs.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      errs.endDate = 'End date cannot be before start date';
    }

    if (!formData.travelers || Number(formData.travelers) < 1) {
      errs.travelers = 'Must have at least 1 traveler';
    }

    if (!formData.budget || Number(formData.budget) <= 0) {
      errs.budget = 'Budget must be a positive number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors before generating.', 'warning');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);

    // Simulate animated generation steps for delightful UX
    const stepTimer1 = setTimeout(() => setGenerationStep(2), 1200);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 2400);

    try {
      // 1. Generate itinerary via AI API
      const aiResponse = await aiService.generateItinerary({
        ...formData,
        duration,
      });

      const aiData = aiResponse.data;

      // 2. Save the complete generated trip to MongoDB
      const saveResponse = await tripService.createTrip({
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration,
        travelers: Number(formData.travelers),
        budget: Number(formData.budget),
        currency: formData.currency,
        travelStyle: formData.travelStyle,
        interests: formData.interests,
        tripTitle: aiData.tripTitle || `${formData.travelStyle} Trip to ${formData.destination}`,
        destinationSummary: aiData.destinationSummary || '',
        estimatedTotalCost: aiData.estimatedTotalCost || Number(formData.budget),
        budgetBreakdown: aiData.budgetBreakdown,
        days: aiData.days || [],
        travelTips: aiData.travelTips || [],
        packingSuggestions: aiData.packingSuggestions || [],
        importantNotes: aiData.importantNotes || [],
      });

      if (saveResponse.success && saveResponse.data?._id) {
        showToast('Trip created successfully! 🎉', 'success');
        navigate(`/trips/${saveResponse.data._id}`);
      } else {
        throw new Error('Could not save generated trip');
      }
    } catch (err) {
      console.error('Generation error:', err);
      showToast(err.response?.data?.message || 'Failed to generate itinerary. Please try again.', 'error');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 lg:py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-3 border border-sky-100 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" /> AI Itinerary Builder
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Plan Your Next Adventure
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Customize your travel preferences below. Our AI will curate a personalized day-by-day itinerary with budget allocation.
          </p>
        </div>

        {/* Form Card */}
        <Card glassEffect className="p-6 sm:p-10 shadow-card border-slate-200/90">
          <form onSubmit={handleGenerate} className="space-y-8">
            {/* Section 1: Destination */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-4 h-4 text-sky-500" /> 1. Where are you going?
              </h3>
              <Input
                label="Destination City or Country"
                placeholder="e.g. Goa, Manali, Jaipur, Tokyo, Paris, Bali"
                icon={MapPin}
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                error={errors.destination}
                required
              />
            </div>

            {/* Section 2: Dates & Duration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-500" /> 2. When are you traveling?
                </h3>
                {duration > 0 && (
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                    ⏱️ Total: {duration} {duration === 1 ? 'Day' : 'Days'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  error={errors.startDate}
                  required
                />
                <Input
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  error={errors.endDate}
                  required
                />
              </div>
            </div>

            {/* Section 3: Travelers & Budget */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Users className="w-4 h-4 text-sky-500" /> 3. Group Size & Budget
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Travelers"
                  type="number"
                  min="1"
                  max="20"
                  icon={Users}
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                  error={errors.travelers}
                  required
                />

                <Input
                  label="Total Budget"
                  type="number"
                  min="1"
                  icon={DollarSign}
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  error={errors.budget}
                  required
                />

                <Select
                  label="Currency"
                  options={currencies}
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                />
              </div>
            </div>

            {/* Section 4: Travel Style */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass className="w-4 h-4 text-sky-500" /> 4. Travel Style
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {travelStyles.map((style) => {
                  const isSelected = formData.travelStyle === style;
                  return (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setFormData({ ...formData, travelStyle: style })}
                      className={`p-3.5 rounded-2xl text-left border text-xs font-bold transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                        isSelected
                          ? 'btn-shimmer border-sky-500 bg-sky-50 text-sky-900 shadow-md shadow-sky-500/20 scale-[1.02]'
                          : 'border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span>{style}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Interests */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Heart className="w-4 h-4 text-rose-500" /> 5. What are you interested in?
              </h3>

              <MultiSelect
                options={interestOptions}
                selected={formData.interests}
                onChange={(newInterests) => setFormData({ ...formData, interests: newInterests })}
                helperText="Select all activities that you would like included in your daily itinerary."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                ✨ AI will structure a complete {duration}-day schedule with cost breakdown.
              </div>
              <Button
                type="submit"
                size="lg"
                variant="primary"
                isLoading={isGenerating}
                className="w-full sm:w-auto px-9 shadow-glow text-base"
                icon={Sparkles}
              >
                Generate My Trip ✨
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* AI Generating High-Tech Loading Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-dark rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/10 space-y-6 text-white">
            <div className="flex justify-center -mb-4">
              <FloatingTravelAsset size={130} />
            </div>

            <div>
              <h3 className="text-xl font-black text-white mb-1.5 tracking-tight">
                Creating your personalized itinerary...
              </h3>
              <p className="text-xs text-slate-300">
                Tailoring activities, estimating budgets, and optimizing routes for {formData.destination}.
              </p>
            </div>

            {/* Animated generation progress steps */}
            <div className="space-y-2.5 text-left bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-200 font-medium">Analyzing preferences & {formData.travelStyle} style</span>
              </div>
              <div className="flex items-center gap-2.5">
                {generationStep >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin flex-shrink-0" />
                )}
                <span className={generationStep >= 2 ? 'text-slate-200 font-medium' : 'text-slate-400'}>
                  Balancing {formData.budget} {formData.currency} budget breakdown
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {generationStep >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin flex-shrink-0" />
                )}
                <span className={generationStep >= 3 ? 'text-slate-200 font-medium' : 'text-slate-400'}>
                  Compiling day-by-day activities & packing tips
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTripPage;
