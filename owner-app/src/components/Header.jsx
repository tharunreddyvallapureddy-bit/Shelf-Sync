import React, { useState } from 'react';
import { Store, ShieldAlert, ChevronDown, LogOut, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onOpenAuth }) => {
  const { stores, selectedStoreId, setSelectedStoreId, selectedStore } = useApp();
  const { currentUser, logout } = useAuth();
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 dark-glass shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                <ShieldAlert className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight flex items-center gap-1.5">
                  <span className="text-emerald-400">Spark</span>
                  <span className="text-amber-400 font-black">Owner</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                  Shop Owner Web App
                </span>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition"
              >
                <Store className="w-4 h-4 text-emerald-400" />
                <span className="max-w-[140px] sm:max-w-[200px] truncate">
                  {selectedStore ? selectedStore.name : 'My Registered Store'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showStoreDropdown && (
                <div className="absolute left-0 mt-2 w-72 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Registered Shops in Database
                  </div>
                  {stores.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No registered shops in database yet.
                    </div>
                  ) : (
                    stores.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStoreId(s.id);
                          setShowStoreDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-800 transition ${
                          s.id === selectedStoreId ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{s.name}</div>
                          <div className="text-[11px] text-slate-400">{s.location}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white hover:bg-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-950 text-emerald-300 font-extrabold flex items-center justify-center text-xs">
                    {currentUser.name ? currentUser.name.charAt(0) : 'S'}
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
