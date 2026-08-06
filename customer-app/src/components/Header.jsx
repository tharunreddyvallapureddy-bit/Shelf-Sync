import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  ChevronDown, 
  LogOut, 
  LogIn,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onOpenLocationModal, onOpenProfile, onOpenAuth }) => {
  const { 
    stores, 
    selectedStoreId, 
    setSelectedStoreId, 
    selectedStore, 
    userLocation 
  } = useApp();

  const { currentUser, logout } = useAuth();
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-header shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand & Store Selector */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 cursor-pointer">
              <img 
                src="/logo.png" 
                alt="Cartly Logo" 
                className="w-10 h-10 rounded-xl object-cover shadow-md border border-amber-500/30" 
              />
              <div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-0.5">
                  <span className="text-emerald-700">Cart</span>
                  <span className="text-amber-500 font-black">ly</span>
                </span>
              </div>
            </div>

            {/* Location Selector */}
            <button 
              onClick={onOpenLocationModal}
              className="hidden lg:flex items-center gap-2 text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 transition text-xs border border-slate-200"
            >
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="max-w-[170px] truncate">
                <span className="font-bold block text-slate-800">Delivery Location</span>
                <span className="text-slate-500 truncate block text-[11px]">{userLocation.address}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Registered Stores Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 transition"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">
                  {stores.length > 0 ? selectedStore.name : 'No registered shops'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showStoreDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Registered Stores</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold">Real Database</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {stores.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500 font-medium">
                        No registered shops found in Firestore database. Register a new shop to see it list here.
                      </div>
                    ) : (
                      stores.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSelectedStoreId(s.id);
                            setShowStoreDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-emerald-50 transition ${
                            s.id === selectedStoreId ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold">{s.name}</div>
                            <div className="text-[11px] text-slate-400">{s.location}</div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            {s.deliveryEta || '12 mins'}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Auth & User Profile */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
                >
                  {currentUser.photoUrl ? (
                    <img src={currentUser.photoUrl} alt="Avatar" className="w-7 h-7 rounded-xl object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-xs">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="max-w-[90px] truncate hidden md:inline">{currentUser.name || 'User'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 space-y-2 animate-fadeIn">
                    <div className="pb-2 border-b border-slate-100">
                      <span className="font-extrabold text-xs text-slate-900 block">{currentUser.name}</span>
                      <span className="text-[11px] text-slate-400 block truncate">{currentUser.email}</span>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-700 text-xs font-bold transition"
                    >
                      <User className="w-4 h-4" />
                      My Account & Profile
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition"
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
