import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Bot,
  Compass,
  ArrowRight,
  CheckCircle2,
  Globe,
  Sliders,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { destinationService } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';

export const LandingPage = () => {
  const [popularDestinations, setPopularDestinations] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await destinationService.getDestinations();
        if (res.success && res.data) {
          setPopularDestinations(res.data.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not fetch popular destinations for landing page:', err.message);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-sky-50/70 via-white to-slate-50">
        {/* Decorative background blurs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-10 w-[300px] h-[300px] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-200/80 shadow-soft text-sky-700 text-xs sm:text-sm font-semibold mb-8 animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
            <span>Next-Generation AI Travel Planner</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15] mb-6">
            Plan Less.{' '}
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Travel More.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Create personalized travel itineraries, manage your budget, and get intelligent travel assistance with TripGenie.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <Link to="/plan" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base shadow-glow" icon={Sparkles}>
                Plan My Trip
              </Button>
            </Link>
            <Link to="/explore" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base" icon={Globe}>
                Explore Destinations
              </Button>
            </Link>
          </div>

          {/* Hero Feature Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700 text-left">Instant Itinerary in 5 Seconds</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700 text-left">Dynamic Budget Optimizer</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700 text-left">24/7 AI Travel Assistant</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Sliders className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700 text-left">100% Editable & Custom</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-2 block">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything you need for an unforgettable journey
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Say goodbye to messy spreadsheets and countless open tabs. TripGenie handles the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="p-6 flex flex-col justify-between hover:border-sky-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 border border-sky-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Personalized Itineraries
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tailored hour-by-hour schedules aligned precisely with your pace, travel style, and personal interests.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 flex flex-col justify-between hover:border-sky-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Smart Budget Planning
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Detailed category breakdowns across accommodation, food, transit, and activities to prevent unexpected overspending.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 flex flex-col justify-between hover:border-sky-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 border border-purple-100">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  AI Travel Assistant
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Context-aware assistant ready to adjust pacing, recommend secret spots, and suggest packing lists for your specific trip.
                </p>
              </div>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 flex flex-col justify-between hover:border-sky-300">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-100">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Save & Manage Trips
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Easily edit activities, add new sights, adjust dates, or export your plans in one centralized dashboard.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 block">
              Step-By-Step
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              How TripGenie Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              From initial idea to departure in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <span className="text-3xl font-black text-sky-400 mb-4 block">01</span>
              <h3 className="text-base font-bold text-white mb-2">Enter your preferences</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your destination, dates, travel party size, budget, and favorite activities.
              </p>
            </div>

            <div className="relative bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <span className="text-3xl font-black text-sky-400 mb-4 block">02</span>
              <h3 className="text-base font-bold text-white mb-2">Generate your itinerary</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our Gemini AI builds a realistic, day-by-day travel blueprint in seconds.
              </p>
            </div>

            <div className="relative bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <span className="text-3xl font-black text-sky-400 mb-4 block">03</span>
              <h3 className="text-base font-bold text-white mb-2">Customize your trip</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add, reorder, or edit activities anytime. Ask the AI assistant to refine your schedule.
              </p>
            </div>

            <div className="relative bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <span className="text-3xl font-black text-sky-400 mb-4 block">04</span>
              <h3 className="text-base font-bold text-white mb-2">Travel confidently</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access your itinerary on the go, stay on budget, and enjoy every moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Preview Section */}
      {popularDestinations.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-2 block">
                  Get Inspired
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Popular Destinations
                </h2>
              </div>
              <Link to="/explore">
                <Button variant="outline" icon={ArrowRight}>
                  View All Destinations
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularDestinations.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to design your next dream vacation?
          </h2>
          <p className="text-sky-100 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Join thousands of smart travelers planning their perfect getaways with TripGenie.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-bold"
              icon={Sparkles}
            >
              Start Planning for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
