import { useState } from 'react';
import { Users, UserPlus, Search, Copy, Check, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/ui/Sidebar';
import MobileHeader from '../components/ui/MobileHeader';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  status: 'Online' | 'In Meeting' | 'Offline';
}

const initialMembers: Member[] = [
  { id: '1', name: 'Ajith Poolbhavi', email: 'ajith@intellmeet.com', role: 'Admin', status: 'Online' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@intellmeet.com', role: 'Member', status: 'In Meeting' },
  { id: '3', name: 'Robert Johnson', email: 'robert@intellmeet.com', role: 'Member', status: 'Offline' },
];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const inviteCode = 'INT-MEET-7719-OP';

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success('Workspace invite code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusClasses = {
    'Online': 'bg-emerald-500 text-emerald-400',
    'In Meeting': 'bg-amber-500 text-amber-400 animate-pulse',
    'Offline': 'bg-slate-600 text-slate-500'
  };

  return (
    <div className="flex min-h-screen bg-[#0E0E11] text-slate-200">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0E71EB]/20">
                <Users size={24} className="text-[#0E71EB]" />
              </div>
              Team Directory
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage active workspace users, roles, and status levels</p>
          </div>
        </div>

        {/* Top Blocks: Invite Code and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-[#16161B] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#0E71EB]/10 border border-[#0E71EB]/20 rounded-xl">
                <UserPlus size={20} className="text-[#0E71EB]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Add Team Members</h3>
                <p className="text-slate-400 text-xs mt-0.5">Share this invite code to register coworkers</p>
              </div>
            </div>
            <button 
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-2 border border-slate-800 hover:border-[#0E71EB]/50 bg-[#1F1F26] hover:bg-[#0E71EB]/10 rounded-xl text-xs font-semibold text-slate-200 transition-all"
            >
              <span className="font-mono tracking-wider font-extrabold text-[#0E71EB] mr-1">{inviteCode}</span>
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="md:col-span-1 bg-[#16161B] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                type="text"
                placeholder="Search colleagues..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#1F1F26] border border-slate-800 rounded-xl text-white text-xs placeholder-slate-550 focus:border-[#0E71EB]/50 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="bg-[#16161B] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-slate-800 bg-[#1A1A22] p-5">
            <h3 className="font-bold text-white text-sm">Workspace Members ({filtered.length})</h3>
          </div>

          <div className="p-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                No colleagues matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filtered.map(m => (
                  <div key={m.id} className="p-4 bg-[#1F1F26] border border-slate-850 hover:border-slate-750 hover:bg-[#25252F] rounded-xl flex items-center justify-between gap-4 transition-all">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0E71EB]/20 to-[#0E71EB]/5 border border-slate-800 flex items-center justify-center font-bold text-[#0E71EB] text-sm flex-shrink-0">
                        {m.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate text-sm flex items-center gap-1.5">
                          {m.name}
                          {m.role === 'Admin' && <Shield size={12} className="text-[#0E71EB]" />}
                        </p>
                        <p className="text-slate-500 text-xs truncate mt-0.5">{m.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-[10px] text-slate-500 font-semibold">{m.role}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${statusClasses[m.status].split(' ')[0]}`} />
                        <span className={`text-[10px] font-bold ${statusClasses[m.status].split(' ')[1]}`}>{m.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
