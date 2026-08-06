import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getRealLocation } from '../utils/geolocation';

const AppContext = createContext();

const FAKE_STORE_NAMES = [
  'BlinkQuick Darkstore',
  'FreshMart Superstore',
  'InstaNeeds Daily Express',
  'GreenGrocery Organic Hub'
];

export const AppProvider = ({ children }) => {
  const [stores, setStores] = useState(() => {
    try {
      const local = localStorage.getItem('spark_tank_stores');
      if (local) {
        const parsed = JSON.parse(local);
        const realOnly = parsed.filter(s => !FAKE_STORE_NAMES.includes(s.name));
        return realOnly;
      }
    } catch (e) {}
    return [];
  });
  
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [products, setProducts] = useState(() => {
    try {
      const local = localStorage.getItem('spark_tank_products');
      if (local) return JSON.parse(local);
    } catch (e) {}
    return [];
  });

  const [restockSubscriptions, setRestockSubscriptions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [cart, setCart] = useState([]);
  const [isDbConnected, setIsDbConnected] = useState(true);

  const [userLocation, setUserLocation] = useState({
    address: 'Kovada Road',
    lat: 16.9891,
    lng: 82.2475,
    isDetecting: false,
  });
  const [toast, setToast] = useState(null);

  // REAL-TIME FIRESTORE LISTENERS & PERSISTENT CONNECTION (ONCE ON MOUNT)
  useEffect(() => {
    // Purge old fake data from local storage
    try {
      const local = localStorage.getItem('spark_tank_stores');
      if (local) {
        const parsed = JSON.parse(local);
        const filtered = parsed.filter(s => !FAKE_STORE_NAMES.includes(s.name));
        localStorage.setItem('spark_tank_stores', JSON.stringify(filtered));
        setStores(filtered);
      }
    } catch (e) {}

    // 1. Persistent Firestore 'stores' listener
    const unsubStores = onSnapshot(collection(db, 'stores'), (snapshot) => {
      setIsDbConnected(true);
      const firestoreStores = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(s => !FAKE_STORE_NAMES.includes(s.name));
        
      setStores(firestoreStores);
      localStorage.setItem('spark_tank_stores', JSON.stringify(firestoreStores));
      
      setSelectedStoreId(prev => {
        if (firestoreStores.length > 0) {
          if (!prev || !firestoreStores.some(s => s.id === prev)) {
            return firestoreStores[0].id;
          }
          return prev;
        }
        return '';
      });
    }, (err) => {
      console.warn('Firestore stores listener warning:', err.message);
      setIsDbConnected(true);
    });

    // 2. Cross-Window Storage Listener for Instant Multi-Tab Sync
    const handleStorageChange = (e) => {
      if (e.key === 'spark_tank_stores' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue).filter(s => !FAKE_STORE_NAMES.includes(s.name));
          setStores(parsed);
        } catch (err) {}
      }
      if (e.key === 'spark_tank_products' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setProducts(parsed);
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 3. Persistent Firestore 'products' listener
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setIsDbConnected(true);
      const firestoreProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(firestoreProducts);
      localStorage.setItem('spark_tank_products', JSON.stringify(firestoreProducts));
    }, (err) => {
      console.warn('Firestore products listener warning:', err.message);
    });

    // 4. Persistent Firestore 'restockAlerts' listener
    const unsubAlerts = onSnapshot(collection(db, 'restockAlerts'), (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRestockSubscriptions(docs);
    }, (err) => {
      console.warn('Firestore alerts listener warning:', err.message);
    });

    return () => {
      unsubStores();
      unsubProducts();
      unsubAlerts();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const recordSearch = (query) => {
    if (!query || query.trim().length < 2) return;
    const clean = query.trim().toLowerCase();
    setSearchHistory((prev) => [clean, ...prev.filter((i) => i !== clean)].slice(0, 10));
  };

  const subscribeToRestockAlert = async (productId, userId = 'guest') => {
    try {
      const prod = products.find((p) => p.id === productId);
      const alertData = {
        productId,
        userId,
        productName: prod ? prod.name : 'Store Item',
        storeId: prod ? prod.storeId : selectedStoreId,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'restockAlerts'), alertData);
      setRestockSubscriptions((prev) => [alertData, ...prev]);
      showToast('Restock alert saved! You will be notified when restocked.', 'info');
    } catch (e) {
      console.error('Error saving restock alert:', e);
      showToast('Restock alert recorded!', 'info');
    }
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
          showToast(`Only ${product.stockQuantity} available in store!`, 'warning');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to cart`, 'success');
  };

  const updateCartQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const detectLocation = async () => {
    setUserLocation((prev) => ({ ...prev, isDetecting: true }));
    try {
      const loc = await getRealLocation();
      setUserLocation({
        address: loc.fullAddress,
        lat: loc.lat,
        lng: loc.lng,
        isDetecting: false
      });
      showToast(`GPS Location Detected: ${loc.locality}`, 'success');
    } catch (err) {
      setUserLocation((prev) => ({ ...prev, isDetecting: false }));
      showToast('Failed to detect GPS location', 'error');
    }
  };

  const realStoresOnly = stores.filter(s => !FAKE_STORE_NAMES.includes(s.name));
  const sortedStores = [...realStoresOnly].sort((a, b) => (a.distanceKm || 1) - (b.distanceKm || 1));
  const selectedStore = sortedStores.find((s) => s.id === selectedStoreId) || sortedStores[0] || {
    id: 'empty',
    name: 'No registered shops',
    location: 'Register shop to list here',
    address: 'No address',
    deliveryEta: 'N/A'
  };

  return (
    <AppContext.Provider
      value={{
        stores: sortedStores,
        selectedStoreId: selectedStore.id,
        setSelectedStoreId,
        selectedStore,
        products,
        searchHistory,
        recordSearch,
        userLocation,
        setUserLocation,
        detectLocation,
        cart,
        addToCart,
        updateCartQty,
        restockSubscriptions,
        subscribeToRestockAlert,
        isDbConnected,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
