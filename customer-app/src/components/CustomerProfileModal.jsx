import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Key, 
  Briefcase, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const CustomerProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('identity');

  // Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [photoUrl, setPhotoUrl] = useState(currentUser?.photoUrl || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobileNumber || '');

  // Preferences
  const [theme, setTheme] = useState(currentUser?.theme || 'light');
  const [language, setLanguage] = useState(currentUser?.language || 'English');
  const [emailAlerts, setEmailAlerts] = useState(currentUser?.emailAlerts ?? true);
  const [smsAlerts, setSmsAlerts] = useState(currentUser?.smsAlerts ?? false);
  const [pushAlerts, setPushAlerts] = useState(currentUser?.pushAlerts ?? true);

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [publicProfile, setPublicProfile] = useState(currentUser?.publicProfile ?? false);

  // Custom Fields
  const [skills, setSkills] = useState(currentUser?.skills || 'Quick Commerce & Essentials');
  const [location, setLocation] = useState(currentUser?.deliveryAddress || currentUser?.location || 'Kovada Road');
  const [websiteLink, setWebsiteLink] = useState(currentUser?.websiteLink || '');

  if (!isOpen) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters long', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
      }
    }

    const updatedProfile = {
      name: name.trim(),
      photoUrl: photoUrl.trim(),
      bio: bio.trim(),
      email: email.trim(),
      mobileNumber: mobileNumber.trim(),
      theme,
      language,
      emailAlerts,
      smsAlerts,
      pushAlerts,
      publicProfile,
      skills: skills.trim(),
      deliveryAddress: location.trim(),
      websiteLink: websiteLink.trim()
    };

    await updateUserProfile(updatedProfile);
    showToast('Customer profile updated successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-lg shadow-md">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-xl flex items-center gap-2">
                <span>Account Profile & Settings</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <span className="text-xs text-slate-400 font-medium block">
                Manage your identity, preferences, security, and custom fields
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'identity', label: 'Identity & Info', icon: User },
            { id: 'preferences', label: 'Preferences', icon: Globe },
            { id: 'security', label: 'Security & Privacy', icon: Shield },
            { id: 'custom', label: 'System & Custom', icon: Briefcase }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
                  activeTab === t.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* TAB 1: PERSONAL AND IDENTITY INFORMATION */}
          {activeTab === 'identity' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={photoUrl || presetAvatars[0]}
                  alt="Profile Avatar"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div className="space-y-2 w-full">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Choose Preset Avatar or Photo URL
                  </label>
                  <div className="flex items-center gap-2">
                    {presetAvatars.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="Avatar Option"
                        onClick={() => setPhotoUrl(url)}
                        className={`w-9 h-9 rounded-xl object-cover cursor-pointer border-2 transition ${
                          photoUrl === url ? 'border-emerald-500 scale-110 shadow' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.png"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Display Name (Full Name or Brand Alias)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Bio or Summary
                  </label>
                  <textarea
                    rows="2"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short summary about you or your grocery essentials preference..."
                    className="w-full p-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block uppercase tracking-wider">
                  Theme Choices
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                      theme === 'light'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Light Theme
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-emerald-400 border-slate-800 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Language Selection
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="English">English</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Notification Settings
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <span>Email Restock Alerts</span>
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <span>SMS Notifications</span>
                      <input
                        type="checkbox"
                        checked={smsAlerts}
                        onChange={(e) => setSmsAlerts(e.target.checked)}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <span>Browser Push Notifications</span>
                      <input
                        type="checkbox"
                        checked={pushAlerts}
                        onChange={(e) => setPushAlerts(e.target.checked)}
                        className="w-4 h-4 accent-emerald-600 rounded"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY CONTROLS & PRIVACY */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Key className="w-4 h-4 text-emerald-600" />
                  Password Update Options
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Privacy Controls
                </span>

                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <div>
                    <span className="font-bold block">Public Profile Visibility</span>
                    <span className="text-[11px] text-slate-400">Allow local darkstore owners to view your restock wishlist interest</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicProfile}
                    onChange={(e) => setPublicProfile(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM AND SYSTEM DATA */}
          {activeTab === 'custom' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Account Metadata */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest block">
                  Account System Metadata
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Registration Date</span>
                      <span className="font-semibold text-white">
                        {currentUser?.createdAt
                          ? new Date(currentUser.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
                          : 'August 5, 2026'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Last Login Time</span>
                      <span className="font-semibold text-white">
                        {currentUser?.lastLoginAt
                          ? new Date(currentUser.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Just Now'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Role-Specific Inputs (Skills / Interests)
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. Organic Produce, Bakery, Dairy Alerting"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Primary Location & Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Kovada Road, Kakinada"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Website or Social Profile Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={websiteLink}
                      onChange={(e) => setWebsiteLink(e.target.value)}
                      placeholder="https://twitter.com/myaccount"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Footer Save Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
