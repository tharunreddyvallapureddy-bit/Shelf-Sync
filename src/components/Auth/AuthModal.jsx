import React, { useState } from 'react';
import { 
  X, 
  User, 
  Store, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Zap, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AuthModal = ({ isOpen, onClose, defaultMode = 'signin', defaultRole = 'customer' }) => {
  const { login, signup } = useAuth();
  const { showToast, registerNewStore } = useApp();

  const [mode, setMode] = useState(defaultMode); // 'signin' or 'signup'
  const [role, setRole] = useState(defaultRole); // 'customer' or 'owner'

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Shop Owner specific fields
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [openHours, setOpenHours] = useState('7:00 AM - 11:00 PM');

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signin') {
      const res = login(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        onClose();
      } else {
        setError(res.message);
      }
    } else {
      // Sign Up
      if (!email || !password || !name) {
        setError('Please fill in all required fields');
        return;
      }

      if (role === 'owner' && (!shopName || !location)) {
        setError('Please provide your Shop Name and Location');
        return;
      }

      const res = signup({
        name,
        email,
        password,
        role,
        phone,
        address,
        shopName,
        location,
        openHours
      });

      if (res.success) {
        if (role === 'owner' && res.user.storeId) {
          // Register store in AppContext
          registerNewStore({
            id: res.user.storeId,
            name: shopName,
            location: location || 'Bengaluru',
            address: address || `${location}, Bengaluru`,
            phone: phone || '+91 99000 11223',
            ownerName: `${name} (Shop Manager)`,
            openHours: openHours || '7:00 AM - 11:00 PM',
            distanceKm: (Math.random() * 2 + 0.5).toFixed(1),
            deliveryEta: '12 mins',
            rating: 4.8
          });
          showToast(`Shop "${shopName}" registered & logged in successfully!`, 'success');
        } else {
          showToast(`Customer account created for ${name}!`, 'success');
        }
        onClose();
      } else {
        setError(res.message);
      }
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    const res = login(demoEmail, demoPassword);
    if (res.success) {
      showToast(`Logged in as ${res.user.name} (${res.user.role.toUpperCase()})`, 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {mode === 'signin' ? 'Sign In to SparkStock' : 'Create New Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {role === 'customer' ? 'Customer Web Portal' : 'Shop Owner Management Portal'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs (Customer vs Shop Owner) */}
        <div className="mt-4 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`w-1/2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'customer'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Customer Portal
          </button>

          <button
            type="button"
            onClick={() => setRole('owner')}
            className={`w-1/2 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'owner'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Shop Owner Portal
          </button>
        </div>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-2">
          <span className="text-[11px] font-extrabold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block">
            ⚡ 1-Click Fast Demo Login
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('customer@sparkstock.com', 'password123')}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-100 transition text-left truncate"
            >
              👤 Demo Customer
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('manager@blinkquick.com', 'owner123')}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 hover:bg-emerald-100 transition text-left truncate"
            >
              🏪 Shop Owner 1
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {role === 'owner' ? 'Shop Manager Full Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
              />
            </div>
          )}

          {/* Shop Owner Sign Up Specific Fields */}
          {mode === 'signup' && role === 'owner' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Shop / Store Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Express Darkstore"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Neighborhood / Locality *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indiranagar"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Store Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {role === 'owner' ? 'Shop Account Email *' : 'Email Address *'}
            </label>
            <input
              type="email"
              required
              placeholder={role === 'owner' ? 'manager@yourshop.com' : 'customer@email.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <span>{mode === 'signin' ? `Sign In to ${role === 'owner' ? 'Shop Owner' : 'Customer'} Portal` : `Register ${role === 'owner' ? 'Shop' : 'Customer'} Account`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Mode Switcher */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          {mode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Sign Up for Free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('signin')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Sign In here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
