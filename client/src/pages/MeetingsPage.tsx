import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Plus, LogIn, Search, Copy, Clock, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Sidebar from '../components/ui/Sidebar';
import { MeetingCardSkeleton } from '../components/ui/Skeleton';
import { meetingsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Meeting } from '../types';

export default function MeetingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous' | 'personal'>('upcoming');
  const [search, setSearch] = useState('');

  const loadMeetings = useCallback(async () => {
    if (!user) return;
    try {
      const res = await meetingsAPI.getUserMeetings(user.id);
      setMeetings(res.data.meetings || []);
    } catch {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    toast.success(msg);
  };

  const pmi = user ? user.id.slice(0, 9).toUpperCase() : '123456789';
  const personalInviteLink = `${window.location.origin}/meeting/${pmi}`;

  // Filter meetings
  const filtered = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                          m.meetingId.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeTab === 'upcoming') {
      return m.status === 'active' || m.status === 'scheduled';
    } else if (activeTab === 'previous') {
      return m.status === 'ended';
    }
    return false;
  });

  return (
    <div className="flex min-h-screen bg-[#0E0E11] text-slate-200">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0E71EB]/20">
                <Video size={24} className="text-[#0E71EB]" />
              </div>
              Meetings List
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage, join, and schedule your video conferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                sessionStorage.setItem('openNewMeeting', 'true');
                navigate('/dashboard');
              }}
              className="bg-[#F26D21] hover:bg-[#E05A12] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus size={16} /> Instant Meeting
            </button>
          </div>
        </div>

        {/* Tab Headers and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 bg-[#16161B] px-6 py-2 rounded-t-2xl">
          <div className="flex gap-4">
            {[
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'previous', label: 'Previous' },
              { id: 'personal', label: 'Personal Room' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative py-4 px-2 font-semibold text-sm transition-colors focus:outline-none ${
                  activeTab === tab.id ? 'text-[#0E71EB]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E71EB] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab !== 'personal' && (
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search meeting title/ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#1F1F26] border border-slate-800 rounded-lg text-white placeholder-slate-550 focus:border-[#0E71EB]/50 focus:outline-none transition-all"
              />
            </div>
          )}
        </div>

        {/* Content Box */}
        <div className="bg-[#16161B] border-x border-b border-slate-800 p-6 rounded-b-2xl shadow-xl">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <MeetingCardSkeleton key={i} />)}
            </div>
          ) : activeTab === 'personal' ? (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                <div>
                  <h3 className="font-bold text-white text-lg">{user?.name}'s Personal Room</h3>
                  <p className="text-slate-400 text-xs mt-1">Permanent virtual workspace for instant collaborations</p>
                </div>
                <button 
                  onClick={() => navigate(`/meeting/${pmi}`)} 
                  className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Video size={16} /> Start Room
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#1F1F26] border border-slate-800/80 rounded-xl space-y-1">
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Meeting ID (PMI)</p>
                  <p className="text-xl font-mono font-bold text-white tracking-widest">{pmi.match(/.{1,3}/g)?.join(' ') || pmi}</p>
                </div>

                <div className="p-4 bg-[#1F1F26] border border-slate-800/80 rounded-xl space-y-1 flex flex-col justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Invite Link</p>
                    <p className="text-sm text-slate-300 truncate mt-1">{personalInviteLink}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(personalInviteLink, 'Personal Invite Link copied!')}
                    className="flex items-center gap-1.5 text-xs text-[#0E71EB] hover:text-[#0C62CC] font-semibold mt-2 focus:outline-none w-fit"
                  >
                    <Copy size={13} /> Copy Invitation
                  </button>
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Video size={36} className="text-slate-600 mx-auto mb-4" />
              <p className="text-white font-semibold text-sm mb-1">No meetings found</p>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">We couldn't find any meetings matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((meeting, i) => (
                <MeetingRow key={meeting._id || meeting.meetingId} meeting={meeting} onNavigate={navigate} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MeetingRow({ meeting, onNavigate, index = 0 }: { meeting: Meeting; onNavigate: (path: string) => void; index?: number }) {
  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    ended: 'bg-slate-850 text-slate-500 border-slate-800',
    scheduled: 'bg-[#0E71EB]/10 text-[#0E71EB] border-[#0E71EB]/25',
  };

  return (
    <div 
      className="p-4 bg-[#1F1F26] border border-slate-850 hover:border-slate-750 hover:bg-[#25252F] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all duration-200"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E71EB]/20 to-[#0E71EB]/5 flex items-center justify-center flex-shrink-0">
          <Video size={18} className="text-[#0E71EB]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white group-hover:text-[#0E71EB] transition-colors truncate text-sm">{meeting.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-500 text-xs">
              {format(new Date(meeting.startTime || meeting.createdAt), 'MMM d, yyyy · h:mm a')}
            </span>
            <span className="text-slate-700">·</span>
            <span className="font-mono text-xs text-slate-600">ID: {meeting.meetingId}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0 justify-between sm:justify-end">
        <span className={`badge border px-2.5 py-0.5 rounded text-[10px] font-semibold ${statusColors[meeting.status]}`}>
          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
        </span>
        {meeting.status === 'active' && (
          <button 
            onClick={() => onNavigate(`/meeting/${meeting.meetingId}`)}
            className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-colors"
          >
            Rejoin
          </button>
        )}
        {meeting.status === 'scheduled' && (
          <button 
            onClick={() => onNavigate(`/meeting/${meeting.meetingId}`)}
            className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-colors"
          >
            Start
          </button>
        )}
        {meeting.status === 'ended' && (
          <button 
            onClick={() => onNavigate(`/meeting/${meeting.meetingId}/summary`)}
            className="bg-[#1F1F26] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold py-1.5 px-3.5 rounded-lg transition-colors"
          >
            Summary
          </button>
        )}
      </div>
    </div>
  );
}
