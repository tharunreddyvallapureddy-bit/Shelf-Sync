import React, { useState } from 'react';
import { 
  X, 
  User, 
  Settings, 
  ShieldCheck, 
  Database, 
  Camera, 
  Save, 
  CheckCircle2, 
  Lock, 
  Mail, 
  Phone, 
  Globe, 
  Store, 
  MapPin, 
  Clock, 
  FileText,
  Moon,
  Sun,
  Bell,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
];

export const OwnerProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('identity');
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Form State initialized from currentUser
  const [name, setName] = useState(currentUser?.name || '');
  const [shopName, setShopName] = useState(currentUser?.shopName || '');
  const [photoUrl, setPhotoUrl] = useState(currentUser?.photoUrl || PRESET_AVATARS[0]);
  const [bio, setBio] = useState(currentUser?.bio || 'Leading hyperlocal superstore delivering fresh produce and daily essentials.');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || '');

  // Preferences
  const [theme, setTheme] = useState(currentUser?.theme || 'dark');
  const [language, setLanguage] = useState(currentUser?.language || 'English');
  const [notifications, setNotifications] = useState(currentUser?.notifications || {
    lowStockAlerts: true,
    customerRestockDemand: true,
    emailDailyDigest: false,
    smsAlerts: true
  });

  // Security Controls
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isStorePublic, setIsStorePublic] = useState(currentUser?.isStorePublic ?? true);
  const [showManagerName, setShowManagerName] = useState(currentUser?.showManagerName ?? true);

  // Custom & System Fields
  const [locality, setLocality] = useState(currentUser?.location || 'Kovada Road');
  const [fullAddress, setFullAddress] = useState(currentUser?.address || 'Kovada Road, Kakinada, AP');
  const [openHours, setOpenHours] = useState(currentUser?.openHours || '7:00 AM - 11:00 PM');
  const [gstin, setGstin] = useState(currentUser?.gstin || '37ABCDE1234F1Z5');
  const [website, setWebsite] = useState(currentUser?.website || 'https://cartly.app/store/ganapathi');

  if (!isOpen) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError('');
    setIsSaved(false);

    if (newPassword && newPassword !== confirmPassword) {
      setSaveError('New password and confirm password do not match');
      return;
    }

    try {
      const updatedData = {
        name,
        shopName,
        photoUrl,
        bio,
        email,
        mobileNumber,
        theme,
        language,
        notifications,
        isStorePublic,
        showManagerName,
        location: locality,
        address: fullAddress,
        openHours,
        gstin,
        website,
        lastLogin: new Date().toISOString()
      };

      const result = await updateUserProfile(updatedData);

      if (result.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        setSaveError(result.message || 'Failed to update profile');
      }
    } catch (err) {
      setSaveError(err.message || 'An error occurred while saving profile');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <img 
              src={photoUrl} 
              alt="Manager Avatar" 
              className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>{shopName || 'Shop Owner Account'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-extrabold border border-emerald-800">
                  Shop Owner Profile
                </span>
              </h2>
              <p className="text-xs text-slate-400">Manager: {name || 'Manager'} • {email}</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Toast Banner */}
        {isSaved && (
          <div className="bg-emerald-950 border-b border-emerald-800 px-6 py-2.5 text-xs text-emerald-300 font-extrabold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Shop Owner profile & settings updated successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="bg-rose-950 border-b border-rose-800 px-6 py-2.5 text-xs text-rose-300 font-extrabold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`py-3.5 px-4 text-xs font-extrabold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'identity'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Identity & Contact
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`py-3.5 px-4 text-xs font-extrabold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'preferences'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Preferences
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-3.5 px-4 text-xs font-extrabold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'security'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Security & Controls
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`py-3.5 px-4 text-xs font-extrabold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'system'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            Shop & System Data
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: IDENTITY & CONTACT */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              {/* Profile Photo / Avatar Chooser */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-2">Profile Photo / Store Logo</label>
                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(url)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition ${
                        photoUrl === url ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset" className="w-12 h-12 object-cover" />
                    </button>
                  ))}
                </div>

                <div className="mt-3 relative flex items-center">
                  <Camera className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="url"
                    placeholder="Or paste custom image URL..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">Shop Manager Name *</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">Shop / Store Name *</label>
                  <div className="relative flex items-center">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ganapathi Super Market"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">Bio / Store Summary</label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short description of your retail business..."
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">Contact Email *</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="supermarket@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">Contact Phone Number *</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-2">Theme Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                        theme === 'light' ? 'border-emerald-500 bg-emerald-950 text-emerald-300' : 'border-slate-800 bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                        theme === 'dark' ? 'border-emerald-500 bg-emerald-950 text-emerald-300' : 'border-slate-800 bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-2">Portal Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-200 block mb-3 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  Owner Notification Preferences
                </label>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                    <div>
                      <span className="font-extrabold text-white text-xs block">Low Stock Warnings</span>
                      <span className="text-slate-400 text-[11px]">Notify when inventory falls below safety threshold</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.lowStockAlerts}
                      onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                    <div>
                      <span className="font-extrabold text-white text-xs block">Customer Restock Demand Alerts</span>
                      <span className="text-slate-400 text-[11px]">Receive alerts when customers subscribe for out-of-stock items</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.customerRestockDemand}
                      onChange={(e) => setNotifications({ ...notifications, customerRestockDemand: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                    <div>
                      <span className="font-extrabold text-white text-xs block">SMS Urgent Stock Notifications</span>
                      <span className="text-slate-400 text-[11px]">Send critical out-of-stock alerts to mobile phone</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.smsAlerts}
                      onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY CONTROLS */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-200 block flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Update Account Password
                </label>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-200 block">Store Visibility & Privacy</label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                  <div>
                    <span className="font-extrabold text-white text-xs block">Public Store Listing</span>
                    <span className="text-slate-400 text-[11px]">Allow customers to view store stock catalog in Customer Web App</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isStorePublic}
                    onChange={(e) => setIsStorePublic(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                  <div>
                    <span className="font-extrabold text-white text-xs block">Display Manager Name</span>
                    <span className="text-slate-400 text-[11px]">Show manager name on store header info</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showManagerName}
                    onChange={(e) => setShowManagerName(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: SHOP & SYSTEM DATA */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              {/* Account Metadata Pills */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Store Account ID</span>
                  <span className="font-mono text-emerald-400 font-bold truncate block text-xs">{currentUser?.uid || 'SHOP-98721'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Role</span>
                  <span className="font-bold text-white text-xs">Shop Owner / Manager</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">Locality / City *</label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kovada Road"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">Operating Hours</label>
                  <div className="relative flex items-center">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="7:00 AM - 11:00 PM"
                      value={openHours}
                      onChange={(e) => setOpenHours(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">Full GPS Physical Address</label>
                <textarea
                  rows="2"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">GSTIN / Tax License No.</label>
                  <div className="relative flex items-center">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="37ABCDE1234F1Z5"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">Official Website / Link</label>
                  <div className="relative flex items-center">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="url"
                      placeholder="https://cartly.app/store"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Owner Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
