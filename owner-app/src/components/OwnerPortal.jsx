import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Package, 
  BellRing,
  ShieldCheck,
  Calendar,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AddProductModal } from './AddProductModal';
import { RestockModal } from './RestockModal';

export const OwnerPortal = () => {
  const { 
    selectedStore, 
    stores,
    products, 
    updateProductQuantity, 
    deleteProduct,
    restockSubscriptions
  } = useApp();

  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRestockProduct, setEditingRestockProduct] = useState(null);

  const activeOwnerStore = (currentUser && currentUser.role === 'owner' && currentUser.storeId)
    ? stores.find(s => s.id === currentUser.storeId) || {
        id: currentUser.storeId,
        name: currentUser.shopName || 'My Registered Shop',
        location: currentUser.location || 'Indiranagar',
        address: currentUser.address || 'Indiranagar, Bengaluru',
        ownerName: currentUser.name
      }
    : selectedStore;

  const storeProducts = products.filter((p) => p.storeId === activeOwnerStore.id);

  const totalCount = storeProducts.length;
  const inStockCount = storeProducts.filter((p) => p.stockQuantity >= (p.lowStockThreshold || 5)).length;
  const lowStockCount = storeProducts.filter((p) => p.stockQuantity > 0 && p.stockQuantity < (p.lowStockThreshold || 5)).length;
  const outOfStockCount = storeProducts.filter((p) => p.stockQuantity === 0).length;

  const urgentAlertItems = storeProducts.filter((p) => p.stockQuantity <= (p.lowStockThreshold || 5));

  const demandInsights = storeProducts
    .filter((p) => p.stockQuantity === 0)
    .map((p) => {
      const demandCount = restockSubscriptions.filter((sub) => sub.productId === p.id).length;
      return { product: p, demandCount };
    })
    .sort((a, b) => b.demandCount - a.demandCount);

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
      
      {/* Executive Shop Manager Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[11px] border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Live Store Inventory Hub
            </span>
            <span className="text-xs text-slate-400">
              • Manager: {currentUser ? currentUser.name : activeOwnerStore.ownerName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {activeOwnerStore.name}
          </h1>

          <p className="text-xs text-slate-400">
            {activeOwnerStore.address || activeOwnerStore.location}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => setStatusFilter('all')} className={`p-5 rounded-3xl border transition cursor-pointer ${statusFilter === 'all' ? 'bg-slate-900 text-white border-slate-800 shadow-xl' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Store SKUs</span>
            <Package className="w-5 h-5 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black">{totalCount}</span>
            <span className="text-xs text-slate-400">Active Shop Catalog</span>
          </div>
        </div>

        <div onClick={() => setStatusFilter('available')} className={`p-5 rounded-3xl border transition cursor-pointer ${statusFilter === 'available' ? 'bg-emerald-950 text-emerald-200 border-emerald-800 shadow-xl' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Available Products</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{inStockCount}</span>
            <span className="text-xs text-emerald-300/80">Ready for Customer Orders</span>
          </div>
        </div>

        <div onClick={() => setStatusFilter('low_stock')} className={`p-5 rounded-3xl border transition cursor-pointer ${statusFilter === 'low_stock' ? 'bg-amber-950 text-amber-200 border-amber-800 shadow-xl' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Low Stock Warnings</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">{lowStockCount}</span>
            <span className="text-xs text-amber-300/80">Below Safety Threshold</span>
          </div>
        </div>

        <div onClick={() => setStatusFilter('out_of_stock')} className={`p-5 rounded-3xl border transition cursor-pointer ${statusFilter === 'out_of_stock' ? 'bg-rose-950 text-rose-200 border-rose-800 shadow-xl' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Out of Stock Alerts</span>
            <AlertCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-400">{outOfStockCount}</span>
            <span className="text-xs text-rose-300/80">Immediate Restock Needed</span>
          </div>
        </div>
      </div>

      {/* Demand Analytics Section */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
            <Users className="w-4 h-4" />
            <span>Customer Restock Demand Analytics</span>
          </div>
          <span className="text-xs text-slate-400">Synced from Customer Web App</span>
        </div>

        {demandInsights.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
            No active restock alert requests from customers yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {demandInsights.map(({ product, demandCount }) => (
              <div key={product.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-xs text-white block">{product.name}</span>
                    <span className="text-[11px] text-rose-400 font-semibold">Currently Out of Stock</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-amber-400 block">{demandCount}</span>
                  <span className="text-[10px] text-slate-400">Waiting</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white">Live Product Catalog</h2>
            <p className="text-xs text-slate-400">Inline quantity controls and restock date scheduler</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter products..."
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-6 text-center">Stock Quantity (- / +)</th>
                <th className="py-4 px-4">Stock Status</th>
                <th className="py-4 px-6">Restock Date ETA</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    No products found in this shop catalog matching filters. Click "+ Add Product to Shop Catalog" to add items.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isAvailable = p.stockQuantity >= (p.lowStockThreshold || 5);
                  const isLow = p.stockQuantity > 0 && p.stockQuantity < (p.lowStockThreshold || 5);
                  const isOut = p.stockQuantity === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <span className="font-extrabold text-white block">{p.name}</span>
                            <span className="text-[11px] text-slate-400">{p.brand} • {p.category} ({p.unit})</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-extrabold text-white">₹{p.price}</span>
                        {p.mrp > p.price && <span className="text-[11px] text-slate-400 line-through block">₹{p.mrp}</span>}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateProductQuantity(p.id, p.stockQuantity - 1)}
                            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 font-extrabold text-white flex items-center justify-center transition"
                          >
                            -
                          </button>

                          <input
                            type="number"
                            value={p.stockQuantity}
                            onChange={(e) => updateProductQuantity(p.id, e.target.value)}
                            className={`w-16 text-center py-1.5 rounded-xl font-extrabold text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                              isOut
                                ? 'border-rose-500 bg-rose-950 text-rose-200'
                                : isLow
                                ? 'border-amber-500 bg-amber-950 text-amber-200'
                                : 'border-slate-700 bg-slate-800 text-white'
                            }`}
                          />

                          <button
                            onClick={() => updateProductQuantity(p.id, p.stockQuantity + 1)}
                            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 font-extrabold text-white flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {isAvailable && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-extrabold text-[11px]">
                            Available
                          </span>
                        )}
                        {isLow && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 font-extrabold text-[11px]">
                            Low Stock
                          </span>
                        )}
                        {isOut && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 font-extrabold text-[11px]">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-slate-400">
                            {p.estimatedRestockDate
                              ? new Date(p.estimatedRestockDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                              : 'Not set'}
                          </span>
                          <button
                            onClick={() => setEditingRestockProduct(p)}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-emerald-400 transition"
                          >
                            <Calendar className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950 transition"
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
