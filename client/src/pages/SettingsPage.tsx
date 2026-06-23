import { useState } from 'react';
import { Settings, Save, Shield, Key, Eye, EyeOff, Layout, Globe, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/ui/Sidebar';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();
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
      <main className="flex-1 ml-64 p-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0E71EB]/20">
              <Settings size={24} className="text-[#0E71EB]" />
            </div>
            Application Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure profile metrics, integration API keys, and notification rules</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Menu Sections (Left column) */}
          <div className="md:col-span-1 bg-[#16161B] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-1">
            {[
              { label: 'General Profile', icon: Shield, active: true },
              { label: 'Integrations', icon: Key, active: false },
              { label: 'Notifications', icon: Bell, active: false },
              { label: 'Language & Region', icon: Globe, active: false }
            ].map(item => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active 
                    ? 'bg-[#0E71EB]/15 text-[#0E71EB] border border-[#0E71EB]/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Configuration Form (Right 2 columns) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Profile Section */}
            <div className="bg-[#16161B] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="border-b border-slate-800 bg-[#1A1A22] p-5">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Shield size={16} className="text-[#0E71EB]" /> General Profile Options
                </h3>
              </div>
              <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
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

            {/* AI Integration Section */}
            <div className="bg-[#16161B] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
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

          </div>

        </div>
      </main>
    </div>
  );
}
