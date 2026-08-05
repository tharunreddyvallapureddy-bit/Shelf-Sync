import React, { useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LocationModal = ({ isOpen, onClose }) => {
  const { userLocation, setUserLocation, detectLocation } = useApp();
  const [detecting, setDetecting] = useState(false);
  const [customAddress, setCustomAddress] = useState(userLocation.address || '');

  if (!isOpen) return null;

  const handleDetectGPS = async () => {
    setDetecting(true);
    await detectLocation();
    setDetecting(false);
    onClose();
  };

  const handleSaveCustomAddress = (e) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    setUserLocation((prev) => ({
      ...prev,
      address: customAddress.trim()
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Select Delivery Location</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Detect your GPS location or enter your delivery address to see registered stores nearby.
        </p>

        <button
          onClick={handleDetectGPS}
          disabled={detecting || userLocation.isDetecting}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm border border-emerald-200 transition shadow-sm"
        >
          <Navigation className={`w-4 h-4 ${(detecting || userLocation.isDetecting) ? 'animate-spin' : ''}`} />
          {(detecting || userLocation.isDetecting) ? 'Detecting Real GPS Location...' : '📍 Detect Current GPS Location'}
        </button>

        <form onSubmit={handleSaveCustomAddress} className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Enter Delivery Address Manually
            </label>
            <input
              type="text"
              placeholder="e.g. Kovada Road, Kakinada"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
          >
            Set Delivery Location
          </button>
        </form>
      </div>
    </div>
  );
};
