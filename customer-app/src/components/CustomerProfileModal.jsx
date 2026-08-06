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
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            {photoUrl ? (
              <img src={photoUrl} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-md" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white font-black flex items-center justify-center text-lg shadow-md">
                {name ? name.charAt(0).toUpperCase() : 'C'}
              </div>
            )}
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>{name || 'Customer Profile'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-extrabold border border-emerald-800">
                  Verified Customer
                </span>
              </h2>
              <p className="text-xs text-slate-400">{email || 'customer@cartly.app'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header Navigation */}
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
            Personal & Identity
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
            <Bell className="w-4 h-4" />
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
            <Shield className="w-4 h-4" />
            Security Controls
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
            <Sparkles className="w-4 h-4" />
            Custom & System Data
          </button>
        </div>

        {/* Tab Body */}
        <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* TAB 1: PERSONAL & IDENTITY */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-2">Profile Photo / Avatar</label>
                <div className="flex flex-wrap items-center gap-3">
                  {presetAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(url)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition ${
                        photoUrl === url ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset Avatar" className="w-12 h-12 object-cover" />
                    </button>
                  ))}
                </div>

                <div className="mt-3 relative flex items-center">
                  <Camera className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="url"
                    placeholder="Or enter custom avatar image URL..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">Display Name / Full Name *</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">Bio / Personal Summary</label>
                <textarea
                  rows="3"
                  placeholder="Short note about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
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
                      placeholder="customer@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">Mobile Phone Number *</label>
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
                  <label className="text-xs font-bold text-slate-200 block mb-2">Interface Theme</label>
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
                  <label className="text-xs font-bold text-slate-200 block mb-2">Preferred Language</label>
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
                  Customer Notification Preferences
                </label>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                    <div>
                      <span className="font-extrabold text-white text-xs block">Email Restock Notifications</span>
                      <span className="text-slate-400 text-[11px]">Receive email alerts when out-of-stock items become available</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                    <div>
                      <span className="font-extrabold text-white text-xs block">SMS Express Order Updates</span>
                      <span className="text-slate-400 text-[11px]">Get SMS updates on store availability & delivery ETAs</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
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
                  <Key className="w-4 h-4 text-emerald-400" />
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
                <label className="text-xs font-bold text-slate-200 block">Privacy Controls</label>
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 cursor-pointer">
                  <div>
                    <span className="font-extrabold text-white text-xs block">Public Customer Profile</span>
                    <span className="text-slate-400 text-[11px]">Allow store owners to see your name on restock alert lists</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicProfile}
                    onChange={(e) => setPublicProfile(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM & SYSTEM DATA */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration Date</span>
                  <span className="font-mono text-emerald-400 font-bold block text-xs">
                    {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Aug 2026'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Login</span>
                  <span className="font-bold text-white text-xs">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">Custom Skills & Interests</label>
                <div className="relative flex items-center">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Organic Produce, Quick Delivery"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">Delivery Address / Location</label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Kovada Road, Kakinada"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">Personal Website / Social Link</label>
                <div className="relative flex items-center">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="url"
                    placeholder="https://mywebsite.com"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-sm font-semibold text-white placeholder:text-slate-400 leading-normal focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
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
              <CheckCircle2 className="w-4 h-4" />
              Save Customer Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
