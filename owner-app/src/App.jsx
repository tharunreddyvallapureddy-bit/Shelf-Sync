import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { OwnerPortal } from './components/OwnerPortal';
import { LoginPage } from './components/LoginPage';

const MainOwnerApp = () => {
  const { currentUser } = useAuth();

  // Mandatory Initial Login Flow: If not authenticated, initialize LoginPage first!
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white transition-colors">
      <Header />

      <main className="pb-16">
        <OwnerPortal />
      </main>

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
