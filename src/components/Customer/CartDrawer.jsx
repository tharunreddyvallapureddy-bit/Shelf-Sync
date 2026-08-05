import React, { useState } from 'react';
import { X, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateCartQty, selectedStore, showToast } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 199 ? 0 : 25;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      showToast('Order placed successfully! Items dispatching from darkstore now.', 'success');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-slideLeft">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Your Grocery Cart</h3>
                <p className="text-xs text-slate-500">{selectedStore.name} ({selectedStore.deliveryEta})</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orderSuccess ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-extrabold text-xl text-slate-900 dark:text-white">Order Confirmed!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your order has been verified against darkstore inventory. Delivery ETA: <span className="font-bold text-emerald-600">{selectedStore.deliveryEta}</span>.
                </p>
                <button
                  onClick={() => {
                    setOrderSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-700 dark:text-slate-300">Your cart is empty</p>
                <p className="text-xs text-slate-400">Add in-stock items to complete your quick delivery order.</p>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{product.name}</h5>
                      <span className="text-[11px] text-slate-400">₹{product.price} / unit</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                      <button onClick={() => updateCartQty(product.id, -1)} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-xl">-</button>
                      <span className="px-2">{quantity}</span>
                      <button onClick={() => updateCartQty(product.id, 1)} className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-xl">+</button>
                    </div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white min-w-[50px] text-right">
                      ₹{product.price * quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {!orderSuccess && cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-emerald-600">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Grand Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition"
              >
                {isCheckingOut ? (
                  <span>Reserving Store Inventory...</span>
                ) : (
                  <>
                    <span>Proceed to Pay • ₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
