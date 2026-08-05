import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Bell, 
  AlertCircle, 
  Navigation,
  Store
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/mockData';
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

  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const storeProducts = products.filter((p) => p.storeId === selectedStore.id);

  const filteredProducts = storeProducts.filter((product) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchTag = product.tags ? product.tags.some(t => t.toLowerCase().includes(q)) : false;
      if (!matchName && !matchBrand && !matchCategory && !matchTag) return false;
    }

    if (selectedCategory !== 'All Products' && selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }

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
      
      {/* Registered Stores Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h2 className="font-extrabold text-sm text-slate-900">
              Registered Stores Around <span className="text-emerald-600">{userLocation.address.split(',')[0]}</span>
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

        {stores.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <Store className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-xs text-slate-700">No registered stores in database</h3>
            <p className="text-[11px] text-slate-400">
              Registered shop storefronts will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stores.map((s) => {
              const isSelected = s.id === selectedStoreId;
              const items = products.filter(p => p.storeId === s.id);
              const inStock = items.filter(p => p.stockQuantity > 0).length;
              const percentage = items.length ? Math.round((inStock / items.length) * 100) : 100;

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStoreId(s.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-emerald-500 shadow-xl ring-2 ring-emerald-500/50'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black truncate">{s.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold">
                        {s.deliveryEta || '12 mins'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 truncate">{s.location}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">📍 {s.distanceKm || 1.0} km away</span>
                    <span className="font-bold text-emerald-400">🟢 {percentage}% Stock Health</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Store Catalog
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            My Restock Alerts
          </button>
        </div>
      </div>

      {activeTab === 'alerts' ? (
        <CustomerAlertsView />
      ) : (
        <>
          {/* Store Info Banner & Live Indicators */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[11px] border border-emerald-500/30 uppercase tracking-widest">
                  Live Store Catalog
                </span>
                <span className="text-xs text-slate-400">• Real-time inventory status</span>
              </div>
              <h1 className="text-2xl font-black">{selectedStore.name}</h1>
              <p className="text-xs text-slate-400">{selectedStore.address || selectedStore.location}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-center min-w-[80px]">
                <span className="text-[10px] font-bold text-slate-400 block">Total Items</span>
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

          {/* Search & Category */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={`Search in ${selectedStore.name}...`}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
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
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <RecommendationWidget />

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                Store Catalog ({filteredProducts.length} items)
              </h2>
              <span className="text-xs text-slate-400 font-medium">Real-time stock indicators active</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700">No products in this catalog yet</h3>
                <p className="text-xs text-slate-400">
                  Products added by shop owners will display here automatically in real time!
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Products');
                    setAvailabilityFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md mt-2"
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
                    onNotify={(prod) => subscribeToRestockAlert(prod.id, currentUser ? currentUser.uid : 'user-c1')}
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
