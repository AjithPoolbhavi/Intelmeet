import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Video, Users, Clock, LogIn, X, Loader2, Calendar, TrendingUp, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Sidebar from '../components/ui/Sidebar';
import { MeetingCardSkeleton } from '../components/ui/Skeleton';
import { meetingsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Meeting } from '../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [joinId, setJoinId] = useState('');

  const loadMeetings = useCallback(async () => {
    if (!user) return;
    try {
      const res = await meetingsAPI.getUserMeetings(user.id);
      setMeetings(res.data.meetings || []);
    } catch {
      // Ignore – will show empty state
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMeetings();
    // Check if new meeting modal should open
    if (sessionStorage.getItem('openNewMeeting')) {
      setShowNewModal(true);
      sessionStorage.removeItem('openNewMeeting');
    }
  }, [loadMeetings]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return toast.error('Meeting title required');
    setCreating(true);
    try {
      const res = await meetingsAPI.create({ title: newTitle });
      const meeting = res.data.meeting;
      toast.success('Meeting created!');
      setShowNewModal(false);
      setNewTitle('');
      navigate(`/meeting/${meeting.meetingId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const id = joinId.trim().toUpperCase();
    if (!id) return toast.error('Enter a meeting ID');
    navigate(`/meeting/${id}`);
  };

  const stats = [
    { icon: Video, label: 'Total Meetings', value: meetings.length, color: 'text-brand-400' },
    { icon: Clock, label: 'Hours Saved', value: `${(meetings.length * 0.8).toFixed(1)}h`, color: 'text-emerald-400' },
    { icon: Zap, label: 'AI Summaries', value: meetings.filter(m => m.summary).length, color: 'text-amber-400' },
    { icon: Users, label: 'Collaborators', value: Math.max(1, meetings.length * 2), color: 'text-rose-400' },
  ];

  return (
    <div className="flex min-h-screen bg-surface-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},
            <span className="text-brand-400"> {user?.name?.split(' ')[0]}</span> ...
          </h1>
          <p className="text-slate-400 mt-1">{format(new Date(), 'EEEE, MMMM do yyyy')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card hover:border-surface-500 transition-colors">
              <Icon size={20} className={`${color} mb-3`} />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* New Meeting */}
          <div className="card border-brand-600/30 bg-gradient-to-br from-brand-900/40 to-surface-800">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2"><Plus size={16} className="text-brand-400"/> Start New Meeting</h3>
            <p className="text-slate-400 text-sm mb-4">Create an instant meeting room</p>
            <button onClick={() => setShowNewModal(true)} className="btn-primary text-sm">
              New Meeting
            </button>
          </div>

          {/* Join Meeting */}
          <div className="card">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2"><LogIn size={16} className="text-brand-400"/> Join Meeting</h3>
            <p className="text-slate-400 text-sm mb-4">Enter a meeting ID to join</p>
            <form onSubmit={handleJoin} className="flex gap-2">
              <input className="input text-sm font-mono uppercase tracking-widest flex-1"
                placeholder="Meeting ID" value={joinId}
                onChange={e => setJoinId(e.target.value)} maxLength={8} />
              <button type="submit" className="btn-secondary text-sm px-3">Join</button>
            </form>
          </div>
        </div>

        {/* Recent Meetings */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" /> Recent Meetings
          </h2>

          {loading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map(i => <MeetingCardSkeleton key={i} />)}
            </div>
          ) : meetings.length === 0 ? (
            <div className="card text-center py-12">
              <Video size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No meetings yet</p>
              <p className="text-slate-600 text-sm mt-1">Create your first meeting to get started</p>
              <button onClick={() => setShowNewModal(true)} className="btn-primary mt-4 text-sm">
                Create Meeting
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {meetings.map((meeting) => (
                <MeetingCard key={meeting._id || meeting.meetingId} meeting={meeting} onNavigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Meeting Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">New Meeting</h2>
              <button onClick={() => setShowNewModal(false)} className="btn-ghost p-1.5">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Meeting Title</label>
                <input className="input" placeholder="e.g. Product Sync, Sprint Planning..."
                  value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={creating}>
                  {creating && <Loader2 size={15} className="animate-spin" />}
                  {creating ? 'Creating...' : 'Start Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MeetingCard({ meeting, onNavigate }: { meeting: Meeting; onNavigate: (path: string) => void }) {
  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    ended: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    scheduled: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
  };

  return (
    <div className="card hover:border-surface-500 transition-all duration-200 flex items-center justify-between gap-4 group">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-brand-600/20 flex items-center justify-center flex-shrink-0">
          <Video size={18} className="text-brand-400" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-white truncate">{meeting.title}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-slate-500 text-xs">
              {format(new Date(meeting.startTime || meeting.createdAt), 'MMM d, h:mm a')}
            </span>
            <span className="font-mono text-xs text-slate-600">{meeting.meetingId}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`badge border ${statusColors[meeting.status]}`}>
          {meeting.status}
        </span>
        {meeting.status === 'active' && (
          <button onClick={() => onNavigate(`/meeting/${meeting.meetingId}`)}
            className="btn-primary text-xs py-1.5 px-3">Rejoin</button>
        )}
        {meeting.status === 'ended' && (
          <button onClick={() => onNavigate(`/meeting/${meeting.meetingId}/summary`)}
            className="btn-secondary text-xs py-1.5 px-3">Summary</button>
        )}
      </div>
    </div>
  );
}
