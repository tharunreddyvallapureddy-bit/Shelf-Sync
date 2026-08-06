import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('spark_tank_owner_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const uData = { uid: user.uid, ...userDoc.data() };
              setCurrentUser(uData);
              localStorage.setItem('spark_tank_owner_user', JSON.stringify(uData));
            } else {
              const uData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                shopName: `${user.email.split('@')[0]}'s Shop`,
                role: 'owner',
                storeId: `store-${user.uid.slice(0, 8)}`
              };
              setCurrentUser(uData);
              localStorage.setItem('spark_tank_owner_user', JSON.stringify(uData));
            }
          } catch (e) {
            console.warn('Error fetching owner user doc:', e);
          }
        }
        setLoading(false);
      });
    } catch (err) {
      console.warn('Firebase Auth listener fallback:', err);
      setLoading(false);
    }

    setLoading(false);
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      let userData = { 
        uid: userCredential.user.uid, 
        email: cleanEmail, 
        name: cleanEmail.split('@')[0],
        shopName: `${cleanEmail.split('@')[0]}'s Shop`,
        storeId: `store-${userCredential.user.uid.slice(0, 8)}`,
        role: 'owner' 
      };
      try {
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          userData = { uid: userCredential.user.uid, ...userDoc.data() };
        }
      } catch (e) {}

      setCurrentUser(userData);
      localStorage.setItem('spark_tank_owner_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.warn('Firebase owner auth login error:', error.code || error.message);

      if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) {
        const fallbackOwner = {
          uid: `owner-${Date.now()}`,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          shopName: `${cleanEmail.split('@')[0].toUpperCase()} Store`,
          role: 'owner',
          storeId: `store-${Date.now()}`,
          location: 'Indiranagar',
          address: 'Indiranagar 100ft Road, Bengaluru'
        };

        const storeProfile = {
          id: fallbackOwner.storeId,
          ownerId: fallbackOwner.uid,
          name: fallbackOwner.shopName,
          location: 'Indiranagar',
          address: 'Indiranagar 100ft Road, Bengaluru',
          ownerName: fallbackOwner.name,
          openHours: '7:00 AM - 11:00 PM',
          distanceKm: 0.8,
          deliveryEta: '10 mins',
          createdAt: new Date().toISOString()
        };

        try {
          await setDoc(doc(db, 'users', fallbackOwner.uid), fallbackOwner);
          await setDoc(doc(db, 'stores', fallbackOwner.storeId), storeProfile);
        } catch (e) {}

        const currentLocalStores = JSON.parse(localStorage.getItem('spark_tank_stores') || '[]');
        const updatedStores = [storeProfile, ...currentLocalStores.filter(s => s.id !== storeProfile.id)];
        localStorage.setItem('spark_tank_stores', JSON.stringify(updatedStores));

        setCurrentUser(fallbackOwner);
        localStorage.setItem('spark_tank_owner_user', JSON.stringify(fallbackOwner));
        return { success: true, user: fallbackOwner, store: storeProfile };
      }

      return { 
        success: false, 
        message: error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found'
          ? 'Invalid email or password'
          : error.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const realShopName = userData.shopName.trim();
    const realManagerName = userData.name.trim();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, userData.password);
      const storeId = `store-${userCredential.user.uid.slice(0, 8)}`;

      const ownerProfile = {
        uid: userCredential.user.uid,
        name: realManagerName,
        email: cleanEmail,
        mobileNumber: userData.mobileNumber,
        role: 'owner',
        storeId,
        shopName: realShopName,
        location: userData.location,
        address: userData.address || `${userData.location}, Bengaluru`,
        openHours: userData.openHours || '7:00 AM - 11:00 PM',
        createdAt: new Date().toISOString()
      };

      const storeProfile = {
        id: storeId,
        ownerId: userCredential.user.uid,
        name: realShopName,
        location: userData.location,
        address: userData.address || `${userData.location}, Bengaluru`,
        phone: userData.mobileNumber,
        ownerName: realManagerName,
        openHours: userData.openHours || '7:00 AM - 11:00 PM',
        distanceKm: 1.0,
        deliveryEta: '12 mins',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), ownerProfile);
        await setDoc(doc(db, 'stores', storeId), storeProfile);
      } catch (e) {}

      const currentLocalStores = JSON.parse(localStorage.getItem('spark_tank_stores') || '[]');
      const updatedStores = [storeProfile, ...currentLocalStores.filter(s => s.id !== storeProfile.id)];
      localStorage.setItem('spark_tank_stores', JSON.stringify(updatedStores));

      setCurrentUser(ownerProfile);
      localStorage.setItem('spark_tank_owner_user', JSON.stringify(ownerProfile));
      return { success: true, user: ownerProfile, store: storeProfile };
    } catch (error) {
      console.warn('Firebase owner auth signup error:', error.code || error.message);

      if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) {
        const storeId = `store-${Date.now()}`;
        const localOwner = {
          uid: `owner-${Date.now()}`,
          name: realManagerName,
          email: cleanEmail,
          mobileNumber: userData.mobileNumber,
          role: 'owner',
          storeId,
          shopName: realShopName,
          location: userData.location,
          address: userData.address || `${userData.location}, Bengaluru`,
          openHours: userData.openHours || '7:00 AM - 11:00 PM',
          createdAt: new Date().toISOString()
        };

        const localStore = {
          id: storeId,
          name: realShopName,
          location: userData.location,
          address: userData.address || `${userData.location}, Bengaluru`,
          phone: userData.mobileNumber,
          ownerName: realManagerName,
          openHours: userData.openHours || '7:00 AM - 11:00 PM',
          distanceKm: 1.0,
          deliveryEta: '12 mins'
        };

        try {
          await setDoc(doc(db, 'users', localOwner.uid), localOwner);
          await setDoc(doc(db, 'stores', storeId), localStore);
        } catch (e) {}

        const currentLocalStores = JSON.parse(localStorage.getItem('spark_tank_stores') || '[]');
        const updatedStores = [localStore, ...currentLocalStores.filter(s => s.id !== localStore.id)];
        localStorage.setItem('spark_tank_stores', JSON.stringify(updatedStores));

        setCurrentUser(localOwner);
        localStorage.setItem('spark_tank_owner_user', JSON.stringify(localOwner));
        return { success: true, user: localOwner, store: localStore };
      }

      return { success: false, message: error.message || 'Sign up failed' };
    }
  };

  const updateUserProfile = async (updatedData) => {
    if (!currentUser) return { success: false, message: 'No authenticated user' };

    const mergedUser = {
      ...currentUser,
      ...updatedData
    };

    try {
      await setDoc(doc(db, 'users', currentUser.uid), mergedUser, { merge: true });

      if (currentUser.storeId) {
        const storeDocData = {
          name: updatedData.shopName || currentUser.shopName,
          location: updatedData.location || currentUser.location,
          address: updatedData.address || currentUser.address,
          ownerName: updatedData.name || currentUser.name,
          phone: updatedData.mobileNumber || currentUser.mobileNumber,
          openHours: updatedData.openHours || currentUser.openHours
        };
        await setDoc(doc(db, 'stores', currentUser.storeId), storeDocData, { merge: true });

        // Update local stores array
        const currentLocalStores = JSON.parse(localStorage.getItem('spark_tank_stores') || '[]');
        const updatedStores = currentLocalStores.map(s => 
          s.id === currentUser.storeId ? { ...s, ...storeDocData } : s
        );
        localStorage.setItem('spark_tank_stores', JSON.stringify(updatedStores));
      }
    } catch (err) {
      console.warn('Error persisting updated owner profile to Firestore:', err);
    }

    setCurrentUser(mergedUser);
    localStorage.setItem('spark_tank_owner_user', JSON.stringify(mergedUser));
    return { success: true, user: mergedUser };
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    localStorage.removeItem('spark_tank_owner_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, updateUserProfile, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
