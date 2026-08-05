import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-rose-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBg = () => {
    switch (toast.type) {
      case 'success': return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'error': return 'bg-rose-50 border-rose-200 text-rose-900';
      default: return 'bg-blue-50 border-blue-200 text-blue-900';
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
