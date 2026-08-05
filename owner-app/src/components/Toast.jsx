import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBg = () => {
    switch (toast.type) {
      case 'success': return 'bg-emerald-950 border-emerald-800 text-emerald-200';
      case 'warning': return 'bg-amber-950 border-amber-800 text-amber-200';
      case 'error': return 'bg-rose-950 border-rose-800 text-rose-200';
      default: return 'bg-blue-950 border-blue-800 text-blue-200';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-xl ${getBg()} max-w-md`}>
        {getIcon()}
        <p className="text-sm font-medium pr-2">{toast.message}</p>
      </div>
    </div>
  );
};
