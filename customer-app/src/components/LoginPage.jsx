import React, { useState } from 'react';
import { 
  Zap, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  AlertCircle,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRealLocation } from '../utils/geolocation';

export const LoginPage = () => {
  const { login, signup } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);

  // Required Customer Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleAutoDetectAddress = async () => {
    setDetectingGps(true);
    setError('');

    try {
      const loc = await getRealLocation();
      setDeliveryAddress(loc.fullAddress);
      setGpsDetected(true);
    } catch (err) {
      setError('Could not detect location automatically');
    } finally {
      setDetectingGps(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name || !email || !password || !mobileNumber || !deliveryAddress) {
          setError('Please fill in all required customer details');
          setLoading(false);
          return;
        }

        const res = await signup({
          name,
          email,
          password,
          mobileNumber,
          deliveryAddress,
          role: 'customer'
        });

        if (!res.success) {
          setError(res.message);
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.message);
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-600/30">
            <Zap className="w-8 h-8 fill-current" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
              <span>Spark</span>
              <span className="text-amber-400">Stock</span>
            </h1>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 block mt-0.5">
              Customer Web Application
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {isSignUp
              ? 'Create a customer account to view nearby store availability & restock alerts'
              : 'Sign in with your email & password to access express store catalogs'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">Delivery Address *</label>
                  <button
                    type="button"
                    onClick={handleAutoDetectAddress}
                    disabled={detectingGps}
                    className="text-[11px] font-extrabold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Navigation className={`w-3 h-3 ${detectingGps ? 'animate-spin' : ''}`} />
                    {detectingGps ? 'Detecting GPS...' : '📍 Auto-Detect GPS'}
                  </button>
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Indiranagar 100ft Road, Bengaluru"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {gpsDetected && (
                  <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Real Address Auto-Detected!
                  </span>
                )}
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="customer@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Connecting to Firebase...' : isSignUp ? 'Register Customer Account' : 'Sign In to Customer Web App'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center text-xs text-slate-400">
          {isSignUp ? (
            <p>
              Already registered?{' '}
              <button onClick={() => setIsSignUp(false)} className="font-bold text-emerald-400 underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New customer?{' '}
              <button onClick={() => setIsSignUp(true)} className="font-bold text-emerald-400 underline">
                Register Customer Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
