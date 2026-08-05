import React from 'react';
import { MapPin, Navigation, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LocationModal = ({ isOpen, onClose }) => {
  const { userLocation, detectLocation } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Select Delivery Location</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Product availability and store stock indicators are updated in real-time based on your hyper-local store radius.
          </p>

          <button
            onClick={() => {
              detectLocation();
            }}
            disabled={userLocation.isDetecting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold text-sm border border-emerald-200/60 dark:border-emerald-800 transition"
          >
            <Navigation className={`w-4 h-4 ${userLocation.isDetecting ? 'animate-spin' : ''}`} />
            {userLocation.isDetecting ? 'Detecting GPS Coordinates...' : 'Detect Current GPS Location'}
          </button>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Popular Quick Commerce Zones</label>
            <div className="space-y-1.5">
              {[
                'Indiranagar 100ft Road, Bengaluru',
                'HSR Layout Sector 3, Bengaluru',
                'Koramangala 4th Block, Bengaluru',
                'MG Road Metro Plaza, Bengaluru'
              ].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    userLocation.address = loc;
                    onClose();
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between border transition ${
                    userLocation.address.includes(loc.split(',')[0])
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>{loc}</span>
                  {userLocation.address.includes(loc.split(',')[0]) && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-md hover:opacity-90 transition"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};
