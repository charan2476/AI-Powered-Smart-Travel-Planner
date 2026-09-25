import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result?.success) {
      navigate(from, { replace: true });
    } else if (result?.message) {
      setError(result.message);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@tripgenie.com');
    setPassword('traveler123');
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-slate-950">
      {/* Background Image: Airplane wing flying above sunset clouds (Take Off theme) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80"
          alt="Airplane wing above sunset clouds"
          className="w-full h-full object-cover object-center brightness-90 transform scale-105"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-900/75 to-slate-950/85" />
      </div>

      {/* Glass Login Card Container */}
      <div className="max-w-4xl w-full glass-panel rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 text-white">
        {/* Left Side: Travel Visual Hero */}
        <div className="relative hidden md:flex flex-col justify-between p-8 bg-slate-950/60 border-r border-white/10 text-white overflow-hidden">
          {/* Brand header */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">TripGenie</span>
            </Link>
          </div>

          <div className="relative z-10 my-8">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1">
              Ready for takeoff?
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight leading-snug">
              "Your passport to stress-free, intelligent travel."
            </h3>
          </div>

          {/* Floating travel highlight */}
          <div className="relative z-10 space-y-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shadow-lg">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Trip Concierge
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                "TripGenie planned our entire 5-day vacation with budget allocations and great local spots in seconds."
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free AI Plan
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant Itineraries
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Glass Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-slate-900/60 backdrop-blur-md">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[11px] font-bold mb-2">
              <Sparkles className="w-3 h-3 text-sky-400" /> Welcome back! ✈️
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign In to TripGenie
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Continue planning your next adventure.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-xs text-rose-300 font-semibold animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-white/20 bg-slate-950/60 text-white placeholder-slate-400 text-sm pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all font-medium"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-white/20 bg-slate-950/60 text-white placeholder-slate-400 text-sm pl-11 pr-11 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 font-bold shadow-glow"
              size="lg"
              isLoading={loading}
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Fill Button */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Quick Demo Access</p>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Fill Demo Credentials
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-sky-400 hover:text-sky-300 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
