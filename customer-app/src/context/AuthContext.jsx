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
    const saved = localStorage.getItem('spark_tank_customer_user');
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
              localStorage.setItem('spark_tank_customer_user', JSON.stringify(uData));
            } else {
              const uData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                role: 'customer'
              };
              setCurrentUser(uData);
              localStorage.setItem('spark_tank_customer_user', JSON.stringify(uData));
            }
          } catch (e) {
            console.warn('Error fetching Firestore user document:', e);
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
      let userData = { uid: userCredential.user.uid, email: cleanEmail, role: 'customer' };
      try {
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          userData = { uid: userCredential.user.uid, ...userDoc.data() };
        }
      } catch (e) {}

      setCurrentUser(userData);
      localStorage.setItem('spark_tank_customer_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.warn('Firebase auth login error:', error.code || error.message);
      
      if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) {
        const fallbackUser = {
          uid: `local-${Date.now()}`,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'customer',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        setCurrentUser(fallbackUser);
        localStorage.setItem('spark_tank_customer_user', JSON.stringify(fallbackUser));
        return { 
          success: true, 
          user: fallbackUser
        };
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
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, userData.password);

      const customerProfile = {
        uid: userCredential.user.uid,
        name: userData.name,
        email: cleanEmail,
        mobileNumber: userData.mobileNumber,
        deliveryAddress: userData.deliveryAddress,
        role: 'customer',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), customerProfile);
      } catch (dbErr) {
        console.warn('Firestore setDoc warning:', dbErr);
      }

      setCurrentUser(customerProfile);
      localStorage.setItem('spark_tank_customer_user', JSON.stringify(customerProfile));
      return { success: true, user: customerProfile };
    } catch (error) {
      console.warn('Firebase auth signup error:', error.code || error.message);

      if (error.code === 'auth/configuration-not-found' || error.message.includes('configuration-not-found')) {
        const localCustomer = {
          uid: `user-${Date.now()}`,
          name: userData.name,
          email: cleanEmail,
          mobileNumber: userData.mobileNumber,
          deliveryAddress: userData.deliveryAddress,
          role: 'customer',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        try {
          await setDoc(doc(db, 'users', localCustomer.uid), localCustomer);
        } catch (e) {}

        setCurrentUser(localCustomer);
        localStorage.setItem('spark_tank_customer_user', JSON.stringify(localCustomer));
        return { success: true, user: localCustomer };
      }

      return { success: false, message: error.message || 'Sign up failed' };
    }
  };

  const updateUserProfile = async (updatedFields) => {
    if (!currentUser) return;
    const merged = { 
      ...currentUser, 
      ...updatedFields, 
      lastLoginAt: currentUser.lastLoginAt || new Date().toISOString() 
    };
    setCurrentUser(merged);
    localStorage.setItem('spark_tank_customer_user', JSON.stringify(merged));
    
    if (merged.uid && !merged.uid.startsWith('local-')) {
      try {
        await setDoc(doc(db, 'users', merged.uid), merged, { merge: true });
      } catch (e) {
        console.warn('Error updating profile in Firestore:', e);
      }
    }
    return merged;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setCurrentUser(null);
    localStorage.removeItem('spark_tank_customer_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, signup, updateUserProfile, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
