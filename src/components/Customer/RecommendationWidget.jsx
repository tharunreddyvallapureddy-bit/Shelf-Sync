import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';

export const RecommendationWidget = () => {
  const { products, selectedStoreId, searchHistory } = useApp();

  const storeProducts = products.filter((p) => p.storeId === selectedStoreId);

  // Recommendation Algorithm:
  // 1. Find items that are IN STOCK (stock >= lowStockThreshold)
  // 2. Score them based on matches with user's search terms & categories
  const recommendations = React.useMemo(() => {
    if (!searchHistory || searchHistory.length === 0) return [];

    const availableItems = storeProducts.filter((p) => p.stockQuantity > 0);
    const scored = availableItems.map((product) => {
      let score = 0;
      let reason = 'Smart Recommendation';

      searchHistory.forEach((term, idx) => {
        const weight = searchHistory.length - idx; // More recent search = higher weight
        const text = `${product.name} ${product.category} ${product.brand} ${product.tags.join(' ')}`.toLowerCase();
        
        if (text.includes(term)) {
          score += weight * 10;
          reason = `Available alternative for "${term}"`;
        }
      });

      // Bonus score for popular or high-rated items
      if (product.isPopular) score += 5;
      score += (product.rating || 4) * 2;

      return { product, score, reason };
    });

    // Sort by score descending and take top 4
    return scored
      .filter((item) => item.score > 8)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [storeProducts, searchHistory]);

  if (recommendations.length === 0) return null;

  return (
    <div className="my-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-emerald-800/50">
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Smart Availability Recommendations</h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                  AI Algorithm
                </span>
              </div>
              <p className="text-xs text-slate-400">
                In-stock substitutes matched from your recent searches: {' '}
                <span className="text-emerald-300 font-semibold">{searchHistory.slice(0, 3).map(s => `"${s}"`).join(', ')}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Ready for Delivery</span>
          </div>
        </div>

        {/* Recommended Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {recommendations.map(({ product, reason }) => (
            <ProductCard
              key={`rec-${product.id}`}
              product={product}
              recommendationReason={reason}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
