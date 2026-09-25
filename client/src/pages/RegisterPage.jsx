import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  User,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  MapPin,
  Luggage,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result?.success) {
      navigate('/dashboard', { replace: true });
    } else if (result?.message) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 relative overflow-hidden text-white">
      {/* Background Image: Adventurous Mountain Trekking / Scenic Horizon */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80"
          alt="Adventurous mountain trekking horizon"
          className="w-full h-full object-cover object-center brightness-90 transform scale-105"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95" />
      </div>

      {/* Subtle Floating Destination Chips in the background */}
      <div className="absolute top-12 left-10 hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-xl animate-float">
        <MapPin className="w-3.5 h-3.5 text-sky-400" /> Tokyo, Japan
      </div>
      <div className="absolute top-28 right-16 hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-xl animate-float" style={{ animationDelay: '1.2s' }}>
        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Goa, India
      </div>
      <div className="absolute bottom-20 left-16 hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-xl animate-float" style={{ animationDelay: '2s' }}>
        <MapPin className="w-3.5 h-3.5 text-purple-400" /> Paris, France
      </div>
      <div className="absolute bottom-16 right-20 hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-xl animate-float" style={{ animationDelay: '2.5s' }}>
        <MapPin className="w-3.5 h-3.5 text-amber-400" /> Manali, India
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              TripGenie
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Start Your Journey ✈️
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Create your TripGenie account and start planning smarter.
          </p>
        </div>

        {/* Passport / Registration Glass Card */}
        <div className="glass-panel p-7 sm:p-9 rounded-3xl shadow-2xl border border-white/20">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-xs text-rose-300 font-semibold animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-white/20 bg-slate-950/60 text-white placeholder-slate-400 text-sm pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all font-medium"
                />
              </div>
            </div>

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
                  placeholder="alex@example.com"
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
                  placeholder="Minimum 6 characters"
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full rounded-xl border border-white/20 bg-slate-950/60 text-white placeholder-slate-400 text-sm pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-3 shadow-glow font-bold"
              size="lg"
              isLoading={loading}
              icon={Sparkles}
            >
              Create Account
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-sky-400 hover:text-sky-300 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
