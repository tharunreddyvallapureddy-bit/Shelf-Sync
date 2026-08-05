import React from 'react';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const CustomerAlertsView = () => {
  const { restockSubscriptions, products, stores, addToCart } = useApp();
  const { currentUser } = useAuth();

  const userSubs = restockSubscriptions.filter(
    (sub) => sub.userId === (currentUser ? currentUser.id : 'user-c1') || sub.userId === 'guest'
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">My Restock Alerts</h3>
          <p className="text-xs text-slate-400">Products you asked to be notified about when restocked</p>
        </div>
      </div>

      {userSubs.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 space-y-2">
          <Bell className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold text-slate-700 text-xs">No active restock alerts</p>
          <p className="text-[11px] text-slate-400">Click "Notify Me" on any out-of-stock product to get restock notifications.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {userSubs.map((sub) => {
            const product = products.find((p) => p.id === sub.productId);
            if (!product) return null;

            const store = stores.find((s) => s.id === product.storeId);
            const isRestocked = product.stockQuantity > 0;

            return (
              <div
                key={sub.productId + sub.timestamp}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{product.name}</h5>
                    <span className="text-[11px] text-slate-400 block">{store ? store.name : 'Local Darkstore'}</span>
                    
                    {isRestocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        Now Restocked! ({product.stockQuantity} available)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-600">
                        <Clock className="w-3 h-3" />
                        {product.estimatedRestockDate
                          ? `ETA: ${new Date(product.estimatedRestockDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : 'Restock expected soon'}
                      </span>
                    )}
                  </div>
                </div>

                {isRestocked && (
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md shrink-0"
                  >
                    ADD
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
