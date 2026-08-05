import React, { useState } from 'react';
import { X, Store, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const { showToast, registerNewStore } = useApp();

  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
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
      if (!shopName || !location) {
        setError('Please provide Shop Name and Locality');
        return;
      }
      const res = signup({ name, email, password, shopName, location, phone });
      if (res.success) {
        registerNewStore({
          id: res.user.storeId,
          name: shopName,
          location: location,
          address: `${location}, Bengaluru`,
          phone: phone || '+91 98765 43210',
          ownerName: name,
          openHours: '7:00 AM - 11:00 PM',
          distanceKm: 1.2,
          deliveryEta: '15 mins'
        });
        showToast(`Registered shop "${shopName}"!`, 'success');
        onClose();
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Shop Owner Login</h3>
              <p className="text-xs text-slate-400">Sign in with your shop account email</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950 text-rose-300 text-xs font-semibold flex items-center gap-2 border border-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Shop Manager Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Shop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="BlinkQuick Darkstore"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Neighborhood / Locality *</label>
                <input
                  type="text"
                  required
                  placeholder="Indiranagar"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Shop Account Email *</label>
            <input
              type="email"
              required
              placeholder="manager@blinkquick.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>{mode === 'signin' ? 'Sign In to Shop Owner Portal' : 'Register Shop Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'signin' ? (
            <p>
              Register new shop?{' '}
              <button onClick={() => setMode('signup')} className="font-bold text-emerald-400 underline">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('signin')} className="font-bold text-emerald-400 underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
