import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const FAKE_STORE_NAMES = [
  'BlinkQuick Darkstore',
  'FreshMart Superstore',
  'InstaNeeds Daily Express',
  'GreenGrocery Organic Hub'
];

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
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
  
  const [selectedStoreId, setSelectedStoreId] = useState(currentUser?.storeId || '');
  const [products, setProducts] = useState(() => {
    try {
      const local = localStorage.getItem('spark_tank_products');
      if (local) return JSON.parse(local);
    } catch (e) {}
    return [];
  });
  const [restockSubscriptions, setRestockSubscriptions] = useState([]);
  const [isDbConnected, setIsDbConnected] = useState(true);
  const [toast, setToast] = useState(null);

  // Synchronize selectedStoreId with currentUser when currentUser updates
  useEffect(() => {
    if (currentUser?.storeId) {
      setSelectedStoreId(currentUser.storeId);
    }
  }, [currentUser?.storeId]);

  // REAL-TIME FIRESTORE LISTENERS (PERSISTENT ONCE ON MOUNT)
  useEffect(() => {
    // Purge fake stores from LocalStorage
    try {
      const local = localStorage.getItem('spark_tank_stores');
      if (local) {
        const parsed = JSON.parse(local);
        const filtered = parsed.filter(s => !FAKE_STORE_NAMES.includes(s.name));
        localStorage.setItem('spark_tank_stores', JSON.stringify(filtered));
        setStores(filtered);
      }
    } catch (e) {}

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
            return currentUser?.storeId || firestoreStores[0].id;
          }
          return prev;
        }
        return currentUser?.storeId || '';
      });
    }, (err) => {
      console.warn('Firestore stores listener warning:', err.message);
      setIsDbConnected(true);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setIsDbConnected(true);
      const firestoreProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(firestoreProducts);
      localStorage.setItem('spark_tank_products', JSON.stringify(firestoreProducts));
    }, (err) => {
      console.warn('Firestore products listener warning:', err.message);
    });

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
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const registerNewStore = async (storeData) => {
    try {
      await setDoc(doc(db, 'stores', storeData.id), storeData);
      const updatedStores = [storeData, ...stores.filter(s => s.id !== storeData.id && !FAKE_STORE_NAMES.includes(s.name))];
      setStores(updatedStores);
      localStorage.setItem('spark_tank_stores', JSON.stringify(updatedStores));
      setSelectedStoreId(storeData.id);
      showToast(`Store "${storeData.name}" registered!`, 'success');
    } catch (e) {
      console.error('Error saving store:', e);
      const updatedStores = [storeData, ...stores.filter(s => s.id !== storeData.id && !FAKE_STORE_NAMES.includes(s.name))];
      setStores(updatedStores);
      localStorage.setItem('spark_tank_stores', JSON.stringify(updatedStores));
      setSelectedStoreId(storeData.id);
    }
  };

  const updateProductQuantity = async (productId, newQty) => {
    const parsedQty = Math.max(0, parseInt(newQty) || 0);
    const updatedProducts = products.map((p) => (p.id === productId ? { ...p, stockQuantity: parsedQty } : p));
    setProducts(updatedProducts);
    localStorage.setItem('spark_tank_products', JSON.stringify(updatedProducts));

    try {
      await updateDoc(doc(db, 'products', productId), { stockQuantity: parsedQty });
      showToast(`Quantity updated to ${parsedQty}`, 'success');
    } catch (e) {
      showToast(`Stock updated to ${parsedQty}`, 'info');
    }
  };

  const updateRestockDate = async (productId, newRestockDate) => {
    const updatedProducts = products.map((p) => (p.id === productId ? { ...p, estimatedRestockDate: newRestockDate } : p));
    setProducts(updatedProducts);
    localStorage.setItem('spark_tank_products', JSON.stringify(updatedProducts));

    try {
      await updateDoc(doc(db, 'products', productId), { estimatedRestockDate: newRestockDate });
      showToast(`Restock ETA published!`, 'info');
    } catch (e) {
      showToast('Restock ETA updated', 'info');
    }
  };

  const addNewProduct = async (productData) => {
    const newId = `p-${Date.now()}`;
    const targetStoreId = productData.storeId || selectedStoreId || currentUser?.storeId || 'my-store';

    const newP = {
      id: newId,
      storeId: targetStoreId,
      name: productData.name,
      brand: productData.brand || 'Local Fresh',
      category: productData.category || 'Bakery & Staples',
      price: Number(productData.price) || 50,
      mrp: Number(productData.mrp) || Number(productData.price) || 60,
      unit: productData.unit || '1 pack',
      image: productData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
      stockQuantity: Number(productData.stockQuantity) || 0,
      lowStockThreshold: Number(productData.lowStockThreshold) || 5,
      estimatedRestockDate: productData.estimatedRestockDate || null,
      rating: 4.8,
      tags: (productData.name + ' ' + productData.category).toLowerCase().split(' ')
    };

    const updatedProducts = [newP, ...products];
    setProducts(updatedProducts);
    localStorage.setItem('spark_tank_products', JSON.stringify(updatedProducts));

    try {
      await setDoc(doc(db, 'products', newId), newP);
      showToast(`Added "${newP.name}" to store!`, 'success');
    } catch (e) {
      showToast(`Added product "${newP.name}"`, 'success');
    }
  };

  const deleteProduct = async (productId) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('spark_tank_products', JSON.stringify(updatedProducts));

    try {
      await deleteDoc(doc(db, 'products', productId));
      showToast('Product deleted from store', 'info');
    } catch (e) {
      showToast('Product removed', 'info');
    }
  };

  const realStoresOnly = stores.filter(s => !FAKE_STORE_NAMES.includes(s.name));
  const activeStoreId = selectedStoreId || currentUser?.storeId || realStoresOnly[0]?.id;
  const selectedStore = realStoresOnly.find((s) => s.id === activeStoreId) || realStoresOnly[0] || {
    id: currentUser?.storeId || 'my-store',
    name: currentUser?.shopName || 'Registered Shop',
    location: currentUser?.location || 'Indiranagar',
    address: currentUser?.address || 'Indiranagar, Bengaluru'
  };

  return (
    <AppContext.Provider
      value={{
        stores: realStoresOnly,
        selectedStoreId: activeStoreId,
        setSelectedStoreId,
        selectedStore,
        products,
        updateProductQuantity,
        updateRestockDate,
        addNewProduct,
        deleteProduct,
        registerNewStore,
        restockSubscriptions,
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
