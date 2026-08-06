import React, { useState } from 'react';
import { ChevronDown, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onOpenAuth }) => {
  const { currentUser, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 dark-glass shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 cursor-pointer">
              <img 
                src="/logo.png" 
                alt="Cartly Logo" 
                className="w-10 h-10 rounded-xl object-cover shadow-md border border-amber-500/30" 
              />
              <div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-1">
                  <span className="text-emerald-400">Cartly</span>
                  <span className="text-amber-400 font-black">Owner</span>
                </span>
              </div>
            </div>
          </div>

          {/* User Account Controls */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white hover:bg-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-950 text-emerald-300 font-extrabold flex items-center justify-center text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <span className="max-w-[100px] truncate hidden md:inline">{currentUser.name || 'Shop Owner'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-3 z-50 space-y-2 animate-fadeIn">
                    <div className="pb-2 border-b border-slate-800">
                      <span className="font-extrabold text-xs text-white block">{currentUser.name}</span>
                      <span className="text-[11px] text-slate-400 block truncate">{currentUser.email}</span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-extrabold">
                        {currentUser.shopName || 'Shop Manager'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-950 text-rose-400 text-xs font-bold transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
