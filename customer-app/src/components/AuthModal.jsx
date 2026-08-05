import React, { useState } from 'react';
import { X, User, Zap, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const { showToast } = useApp();

  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
      const res = signup({ name, email, password });
      if (res.success) {
        showToast(`Customer account created for ${name}!`, 'success');
        onClose();
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Customer Web App Login</h3>
              <p className="text-xs text-slate-400">Sign in to track orders and set restock alerts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Customer Email *</label>
            <input
              type="email"
              required
              placeholder="customer@sparkstock.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>{mode === 'signin' ? 'Sign In to Customer Web App' : 'Register Customer Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'signin' ? (
            <p>
              New customer?{' '}
              <button onClick={() => setMode('signup')} className="font-bold text-emerald-600 underline">
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('signin')} className="font-bold text-emerald-600 underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
