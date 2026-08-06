import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { OwnerPortal } from './components/OwnerPortal';
import { LoginPage } from './components/LoginPage';
import { OwnerProfileModal } from './components/OwnerProfileModal';

const MainOwnerApp = () => {
  const { currentUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mandatory Initial Login Flow: If not authenticated, initialize LoginPage first!
  if (!currentUser) {
    return <LoginPage />;
  }

  const isDarkMode = currentUser?.theme !== 'light';

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-[#030712] text-white' : 'bg-slate-900 text-white'}`}>
      <Header onOpenProfile={() => setIsProfileOpen(true)} />

      <main className="pb-16">
        <OwnerPortal />
      </main>

      <OwnerProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainOwnerApp />
      </AppProvider>
    </AuthProvider>
  );
}
