import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { LocationModal } from './components/LocationModal';
import { CartDrawer } from './components/CartDrawer';
import { CustomerPortal } from './components/CustomerPortal';
import { LoginPage } from './components/LoginPage';

const MainCustomerApp = () => {
  const { currentUser } = useAuth();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Mandatory Initial Login Flow: If not authenticated, initialize LoginPage first!
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900 transition-colors">
      <Header
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="pb-16">
        <CustomerPortal />
      </main>

      <Toast />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
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
