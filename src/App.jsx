import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { LocationModal } from './components/LocationModal';
import { CartDrawer } from './components/Customer/CartDrawer';
import { AuthModal } from './components/Auth/AuthModal';
import { CustomerPortal } from './components/Customer/CustomerPortal';
import { OwnerPortal } from './components/Owner/OwnerPortal';

const MainApp = () => {
  const { activeRole } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      
      {/* Navbar Header */}
      <Header
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="pb-16">
        {activeRole === 'customer' ? (
          <CustomerPortal />
        ) : (
          <OwnerPortal />
        )}
      </main>

      {/* Toast Notification Container */}
      <Toast />

      {/* Modals & Drawers */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </AuthProvider>
  );
}
