import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { LocationModal } from './components/LocationModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { CustomerPortal } from './components/CustomerPortal';
import { LoginPage } from './components/LoginPage';

const MainCustomerApp = () => {
  const { currentUser } = useAuth();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Mandatory Initial Login Flow: If not authenticated, initialize LoginPage first!
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className={`min-h-screen transition-colors ${
      currentUser?.theme === 'dark' ? 'bg-slate-950 text-white dark' : 'bg-[#f4f6f8] text-slate-900'
    }`}>
      <Header
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <main className="pb-16">
        <CustomerPortal />
      </main>

      <Toast />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainCustomerApp />
      </AppProvider>
    </AuthProvider>
  );
}
