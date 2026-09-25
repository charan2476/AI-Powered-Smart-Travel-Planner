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
  Luggage,
  Clock,
  Heart,
  ChevronRight,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { destinationService } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import InteractiveGlobe from '../components/InteractiveGlobe';

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
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Modern Hero Section without Vanta.js */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50">
        {/* Soft background ambient gradient glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-sky-300/25 via-blue-200/20 to-teal-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[350px] h-[350px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-[350px] h-[350px] bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-sky-200/80 text-sky-800 text-xs sm:text-sm font-bold shadow-soft mb-6 animate-in fade-in slide-in-from-top-3 duration-500">
              <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
              <span>Next-Gen AI Travel Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
              PLAN LESS.{' '}
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TRAVEL MORE.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-9">
              Your AI-powered travel companion for smarter, faster and personalized trip planning.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-14">
              <Link to="/plan" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base shadow-glow px-8" icon={Sparkles}>
                  Plan My Trip
                </Button>
              </Link>
              <Link to="/explore" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-6" icon={Globe}>
                  Explore Destinations
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Travel Composition Showcase */}
          <div className="relative max-w-4xl mx-auto mt-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left Side: Real-time Feature Snapshot */}
                <div className="space-y-4 max-w-md text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
                    <Compass className="w-3.5 h-3.5" /> Interactive AI Experience
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Personalized trips built around you
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Simply enter your budget, dates, and favorite interests. Our Gemini AI constructs timed daily schedules, local gems, and cost breakdowns in seconds.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      🏝️ Beaches
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      🍜 Culinary Walks
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      🏛️ Cultural Heritage
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      ⛰️ Mountain Treks
                    </span>
                  </div>
                </div>

                {/* Right Side: Interactive 3D Globe with Floating Tags */}
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <InteractiveGlobe size={280} />

                  {/* Floating Micro Cards */}
                  <div className="absolute -top-2 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2 animate-float">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[11px] font-bold text-slate-800">Goa · 4 Days Planned</span>
                  </div>

                  <div className="absolute -bottom-3 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2 animate-float" style={{ animationDelay: '1.5s' }}>
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-[11px] font-bold text-slate-800">AI Budget Optimized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 text-left">Instant 5s Generation</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 text-left">Smart Budget Allocation</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 text-left">24/7 AI Concierge</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-soft">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Sliders className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 text-left">100% Customizable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-2 block">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Designed for seamless vacations and getaways
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to turn a vague vacation dream into an organized, stress-free journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card hoverEffect glassEffect className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5 border border-sky-100 shadow-xs">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  ✨ AI-Powered Itineraries
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Detailed day-by-day schedules with morning, afternoon, and evening activity time slots.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card hoverEffect glassEffect className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100 shadow-xs">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  💰 Smart Budget Planning
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Visual breakdowns for accommodation, dining, transport, tours, and miscellaneous expenses.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card hoverEffect glassEffect className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 border border-purple-100 shadow-xs">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  🌍 Explore Destinations
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Curated city guides with top attractions, travel tips, and approximate budget benchmarks.
                </p>
              </div>
            </Card>

            {/* Feature 4 */}
            <Card hoverEffect glassEffect className="p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 border border-amber-100 shadow-xs">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  🤖 AI Travel Assistant
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Contextual 24/7 concierge that knows your specific trip dates, travelers, and preferences.
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
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              How TripGenie Works
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              From destination discovery to a complete customized itinerary in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-card">
              <span className="text-3xl font-black text-sky-400 mb-4 block">01</span>
              <h3 className="text-base font-bold text-white mb-2">1. Tell us your destination</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose where you want to travel and enter your preferred start and end dates.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-card">
              <span className="text-3xl font-black text-sky-400 mb-4 block">02</span>
              <h3 className="text-base font-bold text-white mb-2">2. Customize your preferences</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set group size, budget, travel style, and select interests like beaches, food, or history.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-card">
              <span className="text-3xl font-black text-sky-400 mb-4 block">03</span>
              <h3 className="text-base font-bold text-white mb-2">3. Let AI build your trip</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini AI generates a realistic, paced itinerary with estimated costs and packing suggestions.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-card">
              <span className="text-3xl font-black text-sky-400 mb-4 block">04</span>
              <h3 className="text-base font-bold text-white mb-2">4. Travel smarter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Edit activities, ask the AI assistant for adjustments, and travel confidently with zero stress.
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
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-1.5 block">
                  Curated Locations
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Popular Destinations
                </h2>
              </div>
              <Link to="/explore">
                <Button variant="outline" icon={ArrowRight} size="sm">
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

      {/* Final CTA Banner */}
      <section className="py-18 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
            Your next adventure starts here.
          </h2>
          <p className="text-sky-100 text-xs sm:text-base max-w-xl mx-auto mb-8 font-normal">
            Join smart travelers planning tailored, unforgettable itineraries in seconds with TripGenie.
          </p>
          <Link to="/plan">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl font-bold px-8 text-base"
              icon={Sparkles}
            >
              Create Your Trip
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
