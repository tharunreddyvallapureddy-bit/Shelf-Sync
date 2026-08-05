import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  Package, 
  TrendingUp,
  RefreshCw,
  BellRing,
  ShieldCheck,
  Calendar,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AddProductModal } from './AddProductModal';
import { RestockModal } from './RestockModal';

export const OwnerPortal = () => {
  const { 
    selectedStore, 
    stores,
    setSelectedStoreId,
    products, 
    updateProductQuantity, 
    deleteProduct,
    restockSubscriptions
  } = useApp();

  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRestockProduct, setEditingRestockProduct] = useState(null);

  // Identify owner's active store
  const activeOwnerStore = currentUser && currentUser.role === 'owner' && currentUser.storeId
    ? stores.find(s => s.id === currentUser.storeId) || selectedStore
    : selectedStore;

  // Filter products belonging to this shop
  const storeProducts = products.filter((p) => p.storeId === activeOwnerStore.id);

  // Compute KPI Statistics
  const totalCount = storeProducts.length;
  const inStockCount = storeProducts.filter((p) => p.stockQuantity >= (p.lowStockThreshold || 5)).length;
  const lowStockCount = storeProducts.filter((p) => p.stockQuantity > 0 && p.stockQuantity < (p.lowStockThreshold || 5)).length;
  const outOfStockCount = storeProducts.filter((p) => p.stockQuantity === 0).length;

  const urgentAlertItems = storeProducts.filter((p) => p.stockQuantity <= (p.lowStockThreshold || 5));

  // Customer Demand Insights for out-of-stock items in this store
  const demandInsights = storeProducts
    .filter((p) => p.stockQuantity === 0)
    .map((p) => {
      const demandCount = restockSubscriptions.filter((sub) => sub.productId === p.id).length;
      return { product: p, demandCount };
    })
    .sort((a, b) => b.demandCount - a.demandCount);

  // Filtered dataset for inventory table
  const filteredProducts = storeProducts.filter((product) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      if (!matchName && !matchBrand) return false;
    }

    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }

    const threshold = product.lowStockThreshold || 5;
    if (statusFilter === 'available' && product.stockQuantity < threshold) return false;
    if (statusFilter === 'low_stock' && (product.stockQuantity === 0 || product.stockQuantity >= threshold)) return false;
    if (statusFilter === 'out_of_stock' && product.stockQuantity > 0) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Executive Store Manager Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[11px] border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Shop Owner Management Hub
            </span>
            <span className="text-xs text-slate-400">
              • Signed in as {currentUser ? currentUser.name : activeOwnerStore.ownerName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {activeOwnerStore.name} Inventory Dashboard
          </h1>

          <p className="text-xs text-slate-400">
            {activeOwnerStore.location} ({activeOwnerStore.address}) • Hours: {activeOwnerStore.openHours}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Product to Shop Catalog
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setStatusFilter('all')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            statusFilter === 'all' ? 'bg-slate-900 text-white border-slate-800 shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Store SKUs</span>
            <Package className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-black mt-2">{totalCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active Shop Products</span>
        </div>

        <div 
          onClick={() => setStatusFilter('available')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            statusFilter === 'available' ? 'bg-emerald-950 text-white border-emerald-800 shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Available Products</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{inStockCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Ready for Customer Orders</span>
        </div>

        <div 
          onClick={() => setStatusFilter('low_stock')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            statusFilter === 'low_stock' ? 'bg-amber-950 text-white border-amber-800 shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">{lowStockCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Below Safety Threshold</span>
        </div>

        <div 
          onClick={() => setStatusFilter('out_of_stock')}
          className={`p-5 rounded-3xl border transition cursor-pointer ${
            statusFilter === 'out_of_stock' ? 'bg-rose-950 text-white border-rose-800 shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Out of Stock Alerts</span>
            <AlertCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">{outOfStockCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Immediate Restock Needed</span>
        </div>
      </div>

      {/* Customer Demand Insights Analytics Widget */}
      {demandInsights.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-800/60 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Customer Restock Demand Analytics</span>
            </div>
            <span className="text-xs text-slate-400">Based on "Notify Me" Customer Subscriptions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {demandInsights.map(({ product, demandCount }) => (
              <div key={product.id} className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={product.image} alt={product.name} className="w-9 h-9 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-bold text-xs text-white line-clamp-1">{product.name}</h5>
                    <span className="text-[10px] text-rose-400 font-bold">Currently Out of Stock</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-amber-400">{demandCount + 1}</span>
                  <span className="text-[10px] text-slate-400 block">Waiting</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Alerts Banner */}
      {urgentAlertItems.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-sm">
              <BellRing className="w-4 h-4 text-amber-600 animate-bounce" />
              <span>Urgent Restock Action Center ({urgentAlertItems.length} items require attention)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {urgentAlertItems.slice(0, 5).map((item) => (
              <div
                key={`alert-${item.id}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-xs font-semibold shadow-sm"
              >
                <span className={`w-2 h-2 rounded-full ${item.stockQuantity === 0 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                <span className="text-[11px] text-slate-400">
                  ({item.stockQuantity === 0 ? 'Out of Stock' : `Qty: ${item.stockQuantity}`})
                </span>
                <button
                  onClick={() => setEditingRestockProduct(item)}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 ml-1"
                  title="Set Restock Date"
                >
                  <Calendar className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory items..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {[
            { id: 'all', label: 'All Products' },
            { id: 'available', label: 'In Stock' },
            { id: 'low_stock', label: 'Low Stock' },
            { id: 'out_of_stock', label: 'Out of Stock' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === f.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-4">Price / Unit</th>
                <th className="py-4 px-6 text-center">Stock Quantity Manager</th>
                <th className="py-4 px-4">Stock Status</th>
                <th className="py-4 px-6">Restock Date ETA</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    No products found in this shop catalog matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isAvailable = p.stockQuantity >= (p.lowStockThreshold || 5);
                  const isLow = p.stockQuantity > 0 && p.stockQuantity < (p.lowStockThreshold || 5);
                  const isOut = p.stockQuantity === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block">{p.name}</span>
                            <span className="text-[11px] text-slate-400">{p.brand} • {p.category} ({p.unit})</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-extrabold text-slate-900 dark:text-white">₹{p.price}</span>
                        {p.mrp > p.price && (
                          <span className="text-[11px] text-slate-400 line-through block">₹{p.mrp}</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateProductQuantity(p.id, p.stockQuantity - 1)}
                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-extrabold text-slate-800 dark:text-white flex items-center justify-center transition"
                          >
                            -
                          </button>

                          <input
                            type="number"
                            value={p.stockQuantity}
                            onChange={(e) => updateProductQuantity(p.id, e.target.value)}
                            className={`w-16 text-center py-1.5 rounded-xl font-extrabold text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              isOut
                                ? 'border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
                                : isLow
                                ? 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                            }`}
                          />

                          <button
                            onClick={() => updateProductQuantity(p.id, p.stockQuantity + 1)}
                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-extrabold text-slate-800 dark:text-white flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {isAvailable && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                            <span className="pulse-dot-available"></span>
                            Available
                          </span>
                        )}
                        {isLow && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[11px]">
                            <span className="pulse-dot-low"></span>
                            Low Stock
                          </span>
                        )}
                        {isOut && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-extrabold text-[11px]">
                            <span className="pulse-dot-out"></span>
                            Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            {p.estimatedRestockDate
                              ? new Date(p.estimatedRestockDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                              : 'Not set'}
                          </span>
                          <button
                            onClick={() => setEditingRestockProduct(p)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-600 transition"
                            title="Edit Restock Date & Time"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                          title="Remove item from store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <RestockModal
        product={editingRestockProduct}
        isOpen={!!editingRestockProduct}
        onClose={() => setEditingRestockProduct(null)}
      />
    </div>
  );
};
