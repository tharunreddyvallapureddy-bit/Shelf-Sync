import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_USERS = [
  {
    id: 'user-c1',
    name: 'Rahul Sharma',
    email: 'customer@sparkstock.com',
    password: 'password123',
    role: 'customer',
    address: 'Indiranagar 100ft Road, Bengaluru',
    lat: 12.9716,
    lng: 77.6412
  },
  {
    id: 'user-o1',
    name: 'Rajesh Kumar (Owner)',
    email: 'manager@blinkquick.com',
    password: 'owner123',
    role: 'owner',
    storeId: 'store-1',
    shopName: 'BlinkQuick Darkstore',
    location: 'Indiranagar 100ft Road, Bengaluru',
    address: 'Plot 42, 100 Feet Rd, HAL 2nd Stage, Indiranagar',
    phone: '+91 98765 43210'
  },
  {
    id: 'user-o2',
    name: 'Anita Sharma (Owner)',
    email: 'owner@freshmart.com',
    password: 'owner123',
    role: 'owner',
    storeId: 'store-2',
    shopName: 'FreshMart Superstore',
    location: 'HSR Layout Sector 3, Bengaluru',
    address: '27th Main Rd, Sector 3, HSR Layout',
    phone: '+91 98765 12345'
  }
];

export const AuthProvider = ({ children }) => {
  // Saved user accounts in LocalStorage or fallback to MOCK_USERS
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('spark_tank_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_USERS;
  });

  // Current logged in user (LocalStorage persisted)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('spark_tank_current_user');
    if (savedUser) {
      try { return JSON.parse(savedUser); } catch (e) {}
    }
    return MOCK_USERS[0]; // Default logged in as Customer
  });

  useEffect(() => {
    localStorage.setItem('spark_tank_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('spark_tank_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('spark_tank_current_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = (userData) => {
    // Check if email already exists
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists' };
    }

    const newId = `user-${Date.now()}`;
    let storeId = null;

    if (userData.role === 'owner') {
      storeId = `store-${Date.now()}`;
    }

    const newUser = {
      id: newId,
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role, // 'customer' or 'owner'
      phone: userData.phone || '+91 99000 00000',
      address: userData.address || 'Bengaluru, Karnataka',
      ...(userData.role === 'owner' ? {
        storeId,
        shopName: userData.shopName || 'New Shop Store',
        location: userData.location || 'Bengaluru',
        openHours: userData.openHours || '8:00 AM - 10:00 PM'
      } : {})
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        signup,
        logout,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
