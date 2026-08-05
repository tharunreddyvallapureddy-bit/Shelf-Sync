import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RestockModal = ({ product, isOpen, onClose }) => {
  const { updateRestockDate } = useApp();

  const [dateVal, setDateVal] = useState(() => {
    if (product?.estimatedRestockDate) {
      return product.estimatedRestockDate.slice(0, 16);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });

  if (!isOpen || !product) return null;

  const handleSave = () => {
    updateRestockDate(product.id, dateVal);
    onClose();
  };

  const quickPresets = [
    { label: 'Today (2:00 PM)', getVal: () => { const d = new Date(); d.setHours(14, 0, 0); return d.toISOString().slice(0, 16); }},
    { label: 'Tomorrow (10:00 AM)', getVal: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0); return d.toISOString().slice(0, 16); }},
    { label: 'In 2 Days (8:00 AM)', getVal: () => { const d = new Date(); d.setDate(d.getDate() + 2); d.setHours(8, 0, 0); return d.toISOString().slice(0, 16); }}
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Schedule Restock Date</h3>
              <p className="text-xs text-slate-400">{product.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-xs text-slate-500">
            Updating the restock date alerts customers in real-time on product cards and search results.
          </p>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Select Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateVal}
              onChange={(e) => setDateVal(e.target.value)}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Quick Preset Shortcuts</label>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setDateVal(preset.getVal())}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-1/2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition"
          >
            Save & Publish ETA
          </button>
        </div>

      </div>
    </div>
  );
};
