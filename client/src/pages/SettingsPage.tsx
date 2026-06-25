import { useState } from 'react';
import { Settings, Save, Shield, Key, Eye, EyeOff, Bell, Volume2, Video, Sun, Moon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/ui/Sidebar';
import MobileHeader from '../components/ui/MobileHeader';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore, useThemeStore, NotificationLevel } from '../store/uiStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const preferences = usePreferencesStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'notifications' | 'media'>('profile');

  const [profile, setProfile] = useState({
    name: user?.name || 'Test User',
    email: user?.email || 'user@example.com',
    role: 'Workspace Administrator'
  });
  const [apiKey, setApiKey] = useState('sk-proj-••••••••••••••••••••••••••••••••••••••••');
  const [showKey, setShowKey] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAPI, setSavingAPI] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      toast.success('Profile preferences updated!');
    }, 800);
  };

  const handleSaveAPI = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAPI(true);
    setTimeout(() => {
      setSavingAPI(false);
      toast.success('OpenAI API integration keys updated!');
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-[#0E0E11] text-slate-200">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0E71EB]/20">
              <Settings size={24} className="text-[#0E71EB]" />
            </div>
            Application Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure profile metrics, integration API keys, device parameters, and notification rules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Menu Sections (Left column) */}
          <div className="md:col-span-1 bg-[#16161B] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
            {[
              { id: 'profile', label: 'General Profile', icon: Shield },
              { id: 'integrations', label: 'Integrations', icon: Key },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'media', label: 'Devices & Theme', icon: Video }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#0E71EB]/15 text-[#0E71EB] border border-[#0E71EB]/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Configuration Form (Right 2 columns) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-[#16161B] border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                <div className="border-b border-slate-800 bg-[#1A1A22] p-5">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Shield size={16} className="text-[#0E71EB]" /> General Profile Options
                  </h3>
                </div>
                <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-[#1F1F26] border border-slate-850 rounded-lg text-white text-xs focus:border-[#0E71EB]/50 focus:outline-none transition-all"
                        value={profile.name}
                        onChange={e => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2.5 bg-[#1F1F26] border border-slate-850 rounded-lg text-white text-xs focus:border-[#0E71EB]/50 focus:outline-none transition-all"
                        value={profile.email}
                        onChange={e => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">User Role</label>
                    <input
                      type="text"
                      disabled
                      className="w-full px-4 py-2.5 bg-[#1F1F26] border border-slate-850 rounded-lg text-slate-500 text-xs cursor-not-allowed"
                      value={profile.role}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ml-auto"
                  >
                    <Save size={13} /> {savingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="bg-[#16161B] border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                <div className="border-b border-slate-800 bg-[#1A1A22] p-5">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Key size={16} className="text-amber-400" /> AI Service Integrations
                  </h3>
                </div>
                <form onSubmit={handleSaveAPI} className="p-6 space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">OpenAI Secret Key</label>
                    <div className="relative flex items-center">
                      <input
                        type={showKey ? 'text' : 'password'}
                        className="w-full pl-4 pr-12 py-2.5 bg-[#1F1F26] border border-slate-850 rounded-lg text-white text-xs focus:border-[#0E71EB]/50 focus:outline-none transition-all font-mono"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                      >
                        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                      Connecting your OpenAI key enables direct GPT-powered meeting summaries, discussion outlines, and kanban action items. Left blank, the platform automatically defaults to local mockup utilities.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={savingAPI}
                    className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ml-auto"
                  >
                    <Save size={13} /> {savingAPI ? 'Saving...' : 'Save API Integration'}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-[#16161B] border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                <div className="border-b border-slate-800 bg-[#1A1A22] p-5">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Bell size={16} className="text-[#0E71EB]" /> Notification Configurations
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Notification Level */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Push Notification Settings</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['all', 'important', 'none'] as NotificationLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => preferences.setPreference('notificationLevel', level)}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                            preferences.notificationLevel === level
                              ? 'bg-[#0E71EB]/10 border-[#0E71EB] text-[#0E71EB]'
                              : 'bg-[#1F1F26] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white">Email Daily Briefings</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Receive summary emails for action items assigned to you.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) => preferences.setPreference('emailNotifications', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-800 bg-[#1F1F26] accent-[#0E71EB] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white">Browser Notifications</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Alerts when a meeting is about to start or tasks are modified.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.enableLiveCaption}
                        onChange={(e) => preferences.setPreference('enableLiveCaption', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-800 bg-[#1F1F26] accent-[#0E71EB] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Media & Devices & Theme Tab */}
            {activeTab === 'media' && (
              <div className="bg-[#16161B] border border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
                <div className="border-b border-slate-800 bg-[#1A1A22] p-5">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Video size={16} className="text-emerald-400" /> Devices, Audio & Theme Preferences
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Theme Mode Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Display Theme Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'dark', label: 'Dark Mode', icon: Moon },
                        { id: 'light', label: 'Light Mode', icon: Sun },
                        { id: 'auto', label: 'System Default', icon: Settings }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setTheme(item.id as any)}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                            theme === item.id
                              ? 'bg-[#0E71EB]/10 border-[#0E71EB] text-[#0E71EB]'
                              : 'bg-[#1F1F26] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <item.icon size={14} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Device Default states */}
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300">Device Defaults</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-semibold text-white">Default Microphone State</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">Start meetings with microphone muted or active.</p>
                      </div>
                      <select
                        value={preferences.defaultMicState ? 'active' : 'muted'}
                        onChange={(e) => preferences.setPreference('defaultMicState', e.target.value === 'active')}
                        className="bg-[#1F1F26] border border-slate-800 text-slate-300 rounded px-2.5 py-1 text-xs outline-none"
                      >
                        <option value="active">Active (On)</option>
                        <option value="muted">Muted (Off)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-semibold text-white">Default Camera State</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">Start meetings with camera feed active or turned off.</p>
                      </div>
                      <select
                        value={preferences.defaultCameraState ? 'active' : 'off'}
                        onChange={(e) => preferences.setPreference('defaultCameraState', e.target.value === 'active')}
                        className="bg-[#1F1F26] border border-slate-800 text-slate-300 rounded px-2.5 py-1 text-xs outline-none"
                      >
                        <option value="active">Active (On)</option>
                        <option value="off">Disabled (Off)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-semibold text-white">AI Noise Suppression</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">Intelligently filter background static and echoes.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.enableNoiseSuppression}
                        onChange={(e) => preferences.setPreference('enableNoiseSuppression', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-800 bg-[#1F1F26] accent-[#0E71EB] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-semibold text-white">Video Connection Quality</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5">Select standard bandwidth caps for streaming.</p>
                      </div>
                      <select
                        value={preferences.videoQuality}
                        onChange={(e) => preferences.setPreference('videoQuality', e.target.value)}
                        className="bg-[#1F1F26] border border-slate-800 text-slate-300 rounded px-2.5 py-1 text-xs outline-none"
                      >
                        <option value="high">High Definition (HD)</option>
                        <option value="medium">Standard Definition (SD)</option>
                        <option value="low">Data Saver</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
