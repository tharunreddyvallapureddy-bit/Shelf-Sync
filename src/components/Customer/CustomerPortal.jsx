import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Store, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Bell, 
  Sparkles,
  ArrowRight,
  Navigation
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_CATEGORIES } from '../../data/mockData';
import { ProductCard } from './ProductCard';
import { RecommendationWidget } from './RecommendationWidget';
import { CustomerAlertsView } from './CustomerAlertsView';

export const CustomerPortal = () => {
  const { 
    stores, 
    selectedStoreId, 
    setSelectedStoreId, 
    selectedStore, 
    products, 
    recordSearch,
    userLocation,
    detectLocation,
    subscribeToRestockAlert
  } = useApp();

  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'alerts'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // Filter products for the selected store
  const storeProducts = products.filter((p) => p.storeId === selectedStore.id);

  // Apply search, category, and availability filters
  const filteredProducts = storeProducts.filter((product) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchTag = product.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchBrand && !matchCategory && !matchTag) return false;
    }

    // Category
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }

    // Availability
    const threshold = product.lowStockThreshold || 5;
    if (availabilityFilter === 'in_stock' && product.stockQuantity < threshold) return false;
    if (availabilityFilter === 'low_stock' && (product.stockQuantity === 0 || product.stockQuantity >= threshold)) return false;
    if (availabilityFilter === 'out_of_stock' && product.stockQuantity > 0) return false;

    return true;
  });

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      recordSearch(val);
    }
  };

  const totalCount = storeProducts.length;
  const inStockCount = storeProducts.filter(p => p.stockQuantity >= (p.lowStockThreshold || 5)).length;
  const lowStockCount = storeProducts.filter(p => p.stockQuantity > 0 && p.stockQuantity < (p.lowStockThreshold || 5)).length;
  const outOfStockCount = storeProducts.filter(p => p.stockQuantity === 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Nearest Stores Horizontal Selector Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Nearest Registered Stores Around <span className="text-emerald-600">{userLocation.address.split(',')[0]}</span>
            </h2>
          </div>
          <button
            onClick={detectLocation}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <Navigation className="w-3 h-3" />
            Detect GPS
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stores.map((s) => {
            const isSelected = s.id === selectedStoreId;
            const items = products.filter(p => p.storeId === s.id);
            const inStock = items.filter(p => p.stockQuantity > 0).length;
            const percentage = items.length ? Math.round((inStock / items.length) * 100) : 90;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedStoreId(s.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-emerald-500 shadow-xl ring-2 ring-emerald-500/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black truncate">{s.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold">
                      {s.deliveryEta}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{s.location}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-medium">📍 {s.distanceKm} km away</span>
                  <span className="font-bold text-emerald-400">🟢 {percentage}% Stock Health</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Navigation Tabs (Store Catalog vs My Restock Alerts) */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Store Catalog & Stock Indicators
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            My Restock Alerts
          </button>
        </div>
      </div>

      {/* TAB 2: MY RESTOCK ALERTS VIEW */}
      {activeTab === 'alerts' ? (
        <CustomerAlertsView />
      ) : (
        <>
          {/* Main Store Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-700/50">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Darkstore
                </span>
                <span className="text-xs text-slate-400">• {selectedStore.deliveryEta} Express Delivery</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {selectedStore.name}
              </h1>

              <p className="text-xs text-slate-300 max-w-xl">
                {selectedStore.address} ({selectedStore.distanceKm} km away)
              </p>
            </div>

            {/* Live Inventory KPI Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3.5 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-center min-w-[80px]">
                <span className="text-[10px] font-bold text-slate-400 block">Total</span>
                <span className="text-base font-black text-white">{totalCount}</span>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-center min-w-[80px]">
                <span className="text-[10px] font-bold text-emerald-400 block">In Stock</span>
                <span className="text-base font-black text-emerald-300">{inStockCount}</span>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-amber-950/60 border border-amber-800/60 text-center min-w-[80px]">
                <span className="text-[10px] font-bold text-amber-400 block">Low Stock</span>
                <span className="text-base font-black text-amber-300">{lowStockCount}</span>
              </div>

              <div className="px-3.5 py-2 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-center min-w-[80px]">
                <span className="text-[10px] font-bold text-rose-400 block">Out of Stock</span>
                <span className="text-base font-black text-rose-300">{outOfStockCount}</span>
              </div>
            </div>
          </div>

          {/* Search Bar & Category Chips */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={`Search in ${selectedStore.name} (e.g. 'Amul Milk', 'Lays', 'Bread')...`}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {MOCK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Availability Status Filter Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Filter Stock Status:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All Items', count: totalCount },
                  { id: 'in_stock', label: '🟢 Available Only', count: inStockCount },
                  { id: 'low_stock', label: '🟡 Low Stock', count: lowStockCount },
                  { id: 'out_of_stock', label: '🔴 Out of Stock', count: outOfStockCount }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAvailabilityFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      availabilityFilter === f.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Recommendation Banner */}
          <RecommendationWidget />

          {/* Product Grid */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Store Catalog ({filteredProducts.length} items)
              </h2>
              <span className="text-xs text-slate-400 font-medium">Live stock indicators active</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 dark:text-slate-300">No products found matching filters</h3>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setAvailabilityFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNotify={(prod) => subscribeToRestockAlert(prod.id, currentUser ? currentUser.id : 'user-c1')}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};
