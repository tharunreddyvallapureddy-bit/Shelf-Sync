import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  Bell, 
  Sparkles, 
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductCard = ({ product, recommendationReason, onNotify }) => {
  const { addToCart, cart, updateCartQty, showToast } = useApp();
  const [notified, setNotified] = useState(false);

  const cartItem = cart.find((item) => item.product.id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const isAvailable = product.stockQuantity >= (product.lowStockThreshold || 5);
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < (product.lowStockThreshold || 5);
  const isOutOfStock = product.stockQuantity === 0;

  const formatRestockDate = (dateStr) => {
    if (!dateStr) return 'Restock expected soon';
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (isToday) return `Restocking Today at ${timeStr}`;
    return `Restocking ${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeStr}`;
  };

  const handleNotify = () => {
    setNotified(true);
    showToast(`You will be alerted when "${product.name}" is restocked!`, 'info');
    if (onNotify) onNotify(product);
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 flex flex-col justify-between product-card-hover relative ${
      isOutOfStock ? 'border-rose-200/80 dark:border-rose-950 opacity-90' : 'border-slate-200/80 dark:border-slate-800'
    }`}>
      
      {/* Recommendation Header Badge */}
      {recommendationReason && (
        <div className="absolute -top-3 left-4 right-4 z-10">
          <div className="shimmer-badge px-3 py-1 rounded-full border border-emerald-300 text-emerald-900 text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-emerald-600 shrink-0 animate-spin" />
            <span className="truncate">{recommendationReason}</span>
          </div>
        </div>
      )}

      <div>
        {/* Image Container & Availability Badge */}
        <div className="relative aspect-square w-full rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden mb-3 group">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              isOutOfStock ? 'grayscale brightness-75' : ''
            }`}
          />

          {/* Availability Status Badge overlay */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            {isAvailable && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-emerald-800 dark:text-emerald-400 text-[11px] font-bold shadow-md border border-emerald-200 dark:border-emerald-800">
                <span className="pulse-dot-available"></span>
                In Stock ({product.stockQuantity})
              </span>
            )}

            {isLowStock && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-extrabold shadow-md animate-bounce">
                <span className="pulse-dot-low"></span>
                Only {product.stockQuantity} Left!
              </span>
            )}

            {isOutOfStock && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-extrabold shadow-md">
                <span className="pulse-dot-out"></span>
                Out of Stock
              </span>
            )}
          </div>

          {/* Discount Badge */}
          {product.mrp > product.price && (
            <div className="absolute top-2.5 right-2.5 bg-slate-900/90 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-md">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
            {product.brand} • {product.unit}
          </span>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
            {product.name}
          </h4>
        </div>
      </div>

      {/* Restock Date ETA Section for Low Stock & Out of Stock items */}
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        
        {(isLowStock || isOutOfStock) && (
          <div className={`p-2 rounded-xl text-[11px] font-semibold flex items-start gap-1.5 ${
            isOutOfStock ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
          }`}>
            <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold block">
                {isOutOfStock ? 'Next Restock Scheduled:' : 'Restock Expected Soon:'}
              </span>
              <span>{formatRestockDate(product.estimatedRestockDate)}</span>
            </div>
          </div>
        )}

        {/* Price & Action Button */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ₹{product.mrp}
                </span>
              )}
            </div>
          </div>

          {/* Action Trigger */}
          {isOutOfStock ? (
            <button
              onClick={handleNotify}
              disabled={notified}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                notified
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-300'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              {notified ? 'Alert Set' : 'Notify Me'}
            </button>
          ) : qtyInCart === 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              ADD
            </button>
          ) : (
            <div className="flex items-center rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md">
              <button
                onClick={() => updateCartQty(product.id, -1)}
                className="px-2.5 py-1.5 hover:bg-emerald-700 rounded-l-xl transition"
              >
                -
              </button>
              <span className="px-2">{qtyInCart}</span>
              <button
                onClick={() => updateCartQty(product.id, 1)}
                className="px-2.5 py-1.5 hover:bg-emerald-700 rounded-r-xl transition"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
