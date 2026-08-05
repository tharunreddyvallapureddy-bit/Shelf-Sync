import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Role View State ('customer' or 'owner')
  const [activeRole, setActiveRole] = useState('customer');

  // 2. Stores State (persisted to LocalStorage so registered shop owner stores persist!)
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem('spark_tank_stores');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_STORES;
  });

  useEffect(() => {
    localStorage.setItem('spark_tank_stores', JSON.stringify(stores));
  }, [stores]);

  const [selectedStoreId, setSelectedStoreId] = useState('store-1');

  // 3. Products State (LocalStorage persisted)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('spark_tank_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('spark_tank_products', JSON.stringify(products));
  }, [products]);

  // 4. Customer Restock Alerts Subscriptions (`{ productId, userId, timestamp }`)
  const [restockSubscriptions, setRestockSubscriptions] = useState(() => {
    const saved = localStorage.getItem('spark_tank_restock_subscriptions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { productId: 'p-3', userId: 'user-c1', productName: 'Country Delight Organic Cow Milk', timestamp: Date.now() },
      { productId: 'p-7', userId: 'user-c1', productName: 'Hybrid Onions (Pyaz)', timestamp: Date.now() }
    ];
  });

  useEffect(() => {
    localStorage.setItem('spark_tank_restock_subscriptions', JSON.stringify(restockSubscriptions));
  }, [restockSubscriptions]);

  // 5. Search History for Recommendation Engine
  const [searchHistory, setSearchHistory] = useState(['milk', 'bread', 'chips']);

  // 6. Cart State
  const [cart, setCart] = useState([]);

  // 7. User Location (Simulated GPS / Address)
  const [userLocation, setUserLocation] = useState({
    address: 'Indiranagar 100ft Road, Bengaluru',
    lat: 12.9716,
    lng: 77.6412,
    isDetecting: false,
    isDetected: true
  });

  // 8. Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // --- ACTIONS ---

  const registerNewStore = (storeData) => {
    setStores((prev) => {
      const exists = prev.find((s) => s.id === storeData.id);
      if (exists) return prev;
      return [storeData, ...prev];
    });
    setSelectedStoreId(storeData.id);
  };

  const subscribeToRestockAlert = (productId, userId = 'guest') => {
    setRestockSubscriptions((prev) => {
      const exists = prev.find((item) => item.productId === productId && item.userId === userId);
      if (exists) return prev;

      const prod = products.find((p) => p.id === productId);
      return [
        {
          productId,
          userId,
          productName: prod ? prod.name : 'Store Item',
          storeId: prod ? prod.storeId : selectedStoreId,
          timestamp: Date.now()
        },
        ...prev
      ];
    });
  };

  const recordSearch = (query) => {
    if (!query || query.trim().length < 2) return;
    const clean = query.trim().toLowerCase();
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== clean);
      return [clean, ...filtered].slice(0, 10);
    });
  };

  const updateProductQuantity = (productId, newQty) => {
    const parsedQty = Math.max(0, parseInt(newQty) || 0);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const wasOutOrLow = p.stockQuantity <= (p.lowStockThreshold || 5);
          const nowInStock = parsedQty > (p.lowStockThreshold || 5);
          
          if (wasOutOrLow && nowInStock) {
            showToast(`Restocked "${p.name}"! Available for customer orders now.`, 'success');
          } else if (parsedQty === 0) {
            showToast(`Alert: "${p.name}" marked as Out of Stock!`, 'error');
          } else if (parsedQty <= (p.lowStockThreshold || 5)) {
            showToast(`Warning: "${p.name}" is now Low Stock (${parsedQty} left)`, 'warning');
          }
          return { ...p, stockQuantity: parsedQty };
        }
        return p;
      })
    );
  };

  const updateRestockDate = (productId, newRestockDate) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          showToast(`Updated restock ETA for "${p.name}" to ${new Date(newRestockDate).toLocaleString()}`, 'info');
          return { ...p, estimatedRestockDate: newRestockDate };
        }
        return p;
      })
    );
  };

  const addNewProduct = (productData) => {
    const newId = `p-${Date.now()}`;
    const newP = {
      id: newId,
      storeId: productData.storeId || selectedStoreId,
      name: productData.name,
      brand: productData.brand || 'Local Fresh',
      category: productData.category || 'Bakery & Staples',
      price: Number(productData.price) || 50,
      mrp: Number(productData.mrp) || Number(productData.price) || 60,
      unit: productData.unit || '1 pack',
      image: productData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
      stockQuantity: Number(productData.stockQuantity) || 10,
      lowStockThreshold: Number(productData.lowStockThreshold) || 5,
      estimatedRestockDate: productData.estimatedRestockDate || null,
      rating: 4.8,
      tags: (productData.name + ' ' + productData.category).toLowerCase().split(' ')
    };

    setProducts((prev) => [newP, ...prev]);
    showToast(`Added new product "${newP.name}" to inventory!`, 'success');
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from store inventory', 'info');
  };

  const detectLocation = () => {
    setUserLocation((prev) => ({ ...prev, isDetecting: true }));
    setTimeout(() => {
      setUserLocation({
        address: 'Indiranagar 100ft Road, Bengaluru (Detected via GPS)',
        lat: 12.9716,
        lng: 77.6412,
        isDetecting: false,
        isDetected: true
      });
      showToast('GPS location updated! Nearest stores prioritized.', 'success');
    }, 1000);
  };

  const addToCart = (product) => {
    if (product.stockQuantity <= 0) {
      showToast(`Sorry, "${product.name}" is currently Out of Stock!`, 'error');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          showToast(`Cannot add more. Max stock available is ${product.stockQuantity}.`, 'warning');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to cart`, 'success');
  };

  const updateCartQty = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stockQuantity) {
              showToast(`Only ${item.product.stockQuantity} items in stock!`, 'warning');
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const resetData = () => {
    setProducts(MOCK_PRODUCTS);
    setStores(MOCK_STORES);
    localStorage.removeItem('spark_tank_products');
    localStorage.removeItem('spark_tank_stores');
    showToast('Reset stores & inventory to default dataset', 'info');
  };

  // Sort stores so nearest stores appear first
  const sortedStores = [...stores].sort((a, b) => (a.distanceKm || 1) - (b.distanceKm || 1));
  const selectedStore = stores.find((s) => s.id === selectedStoreId) || sortedStores[0];

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        stores: sortedStores,
        selectedStoreId,
        setSelectedStoreId,
        selectedStore,
        products,
        searchHistory,
        recordSearch,
        updateProductQuantity,
        updateRestockDate,
        addNewProduct,
        deleteProduct,
        registerNewStore,
        userLocation,
        detectLocation,
        cart,
        addToCart,
        updateCartQty,
        restockSubscriptions,
        subscribeToRestockAlert,
        toast,
        showToast,
        resetData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
