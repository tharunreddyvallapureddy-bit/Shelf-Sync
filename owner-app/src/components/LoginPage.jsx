import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Store, 
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
  const [detectedAddressDetail, setDetectedAddressDetail] = useState('');

  // Required Shop Owner Registration Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState({ lat: null, lng: null });

  // Real-World OpenStreetMap Geolocation API Auto-Detect
  const handleAutoDetectLocation = async () => {
    setDetectingGps(true);
    setError('');

    try {
      const loc = await getRealLocation();
      setCoords({ lat: loc.lat, lng: loc.lng });
      setLocation(loc.locality);
      setAddress(loc.fullAddress);
      setDetectedAddressDetail(`${loc.locality} (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`);
      setGpsDetected(true);
    } catch (err) {
      setError('Could not detect location. Please enter manually.');
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
        if (!name || !email || !password || !shopName || !location || !mobileNumber) {
          setError('Please fill in all required shop details');
          setLoading(false);
          return;
        }

        const res = await signup({
          name,
          email,
          password,
          shopName,
          mobileNumber,
          location,
          address: address || `${location}, Bengaluru`,
          lat: coords.lat,
          lng: coords.lng,
          openHours: '7:00 AM - 11:00 PM'
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
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <img 
            src="/logo.png" 
            alt="Cartly Logo" 
            className="w-16 h-16 rounded-2xl object-cover mx-auto shadow-xl border border-amber-500/30" 
          />

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-1">
              <span className="text-emerald-400">Cartly</span>
              <span className="text-amber-400 font-black">Owner</span>
            </h1>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 block mt-0.5">
              Shop Owner Web Application
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {isSignUp
              ? 'Register your shop with real GPS geocoding & manage inventory'
              : 'Sign in with your shop account email to manage store stock'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Shop Manager Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Rajesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Shop / Store Name *</label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ganapathi Super Market"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Real GPS Geolocation Auto-Detect */}
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/70 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                    <Navigation className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
                    Real GPS Geolocation
                  </label>

                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={detectingGps}
                    className="text-[11px] font-extrabold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
                  >
                    {detectingGps ? 'Fetching GPS...' : gpsDetected ? 'Re-detect GPS' : '📍 Auto-Detect GPS'}
                  </button>
                </div>

                {gpsDetected && (
                  <div className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Detected: {detectedAddressDetail}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Locality *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Kovada Road"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Contact Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Shop Account Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="manager@shopdomain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
            <span>{loading ? (isSignUp ? 'Registering Shop...' : 'Signing In...') : isSignUp ? 'Register Shop Account' : 'Sign In to Cartly Owner'}</span>
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
              Want to register a new shop?{' '}
              <button onClick={() => setIsSignUp(true)} className="font-bold text-emerald-400 underline">
                Register Shop Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
