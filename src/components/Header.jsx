import React, { useState } from 'react';
import { 
  Store, 
  MapPin, 
  ShoppingBag, 
  UserCheck, 
  ShieldAlert, 
  ChevronDown, 
  Zap, 
  RotateCcw,
  User,
  LogOut,
  LogIn,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onOpenLocationModal, onOpenCart, onOpenAuth }) => {
  const { 
    activeRole, 
    setActiveRole, 
    stores, 
    selectedStoreId, 
    setSelectedStoreId, 
    selectedStore,
    userLocation,
    cart,
    products,
    resetData,
    restockSubscriptions
  } = useApp();

  const { currentUser, logout } = useAuth();
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Out of stock and low stock counts
  const storeProducts = products.filter(p => p.storeId === selectedStoreId);
  const outOfStockCount = storeProducts.filter(p => p.stockQuantity === 0).length;
  const lowStockCount = storeProducts.filter(p => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5)).length;

  return (
    <header className={`sticky top-0 z-40 transition-colors ${activeRole === 'owner' ? 'dark-glass shadow-md' : 'glass-header'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left: Brand & Store Selector */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveRole('customer')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight flex items-center gap-1.5">
                  <span className="text-emerald-700 dark:text-emerald-400">Spark</span>
                  <span className="text-amber-500 font-black">Stock</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                  Availability Engine
                </span>
              </div>
            </div>

            {/* Location Selector (Customer view) */}
            {activeRole === 'customer' && (
              <button 
                onClick={onOpenLocationModal}
                className="hidden lg:flex items-center gap-2 text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs border border-slate-200/60 dark:border-slate-700"
              >
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="max-w-[170px] truncate">
                  <span className="font-bold block text-slate-800 dark:text-slate-200">Delivery Location</span>
                  <span className="text-slate-500 truncate block text-[11px]">{userLocation.address}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            )}

            {/* Registered Stores Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">{selectedStore.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showStoreDropdown && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Active Registered Stores</span>
                    <span className="text-[10px] text-emerald-600 font-extrabold">Ordered by Proximity</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {stores.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStoreId(s.id);
                          setShowStoreDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition ${
                          s.id === selectedStoreId ? 'bg-emerald-50/70 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold flex items-center gap-1.5">
                            <span>{s.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{s.location} ({s.distanceKm} km away)</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          {s.deliveryEta}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls: Role Switcher & User Profile */}
          <div className="flex items-center gap-3">
            
            {/* App View Switcher */}
            <div className="bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl flex items-center border border-slate-300/50 dark:border-slate-700">
              <button
                onClick={() => setActiveRole('customer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeRole === 'customer'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customer App</span>
              </button>

              <button
                onClick={() => setActiveRole('owner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                  activeRole === 'owner'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Shop Owner App</span>
                {(outOfStockCount > 0 || lowStockCount > 0) && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1 right-1" />
                )}
              </button>
            </div>

            {/* Cart Icon */}
            {activeRole === 'customer' && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center justify-center p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline ml-1.5">Cart</span>
                {cartCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[11px]">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Auth Account Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-50 transition"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="max-w-[90px] truncate hidden md:inline">{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 space-y-2 animate-fadeIn">
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white block">{currentUser.name}</span>
                      <span className="text-[11px] text-slate-400 block truncate">{currentUser.email}</span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold capitalize">
                        {currentUser.role} Account
                      </span>
                    </div>

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

            {/* Reset Data Button */}
            <button
              onClick={resetData}
              title="Reset Demo Data"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
