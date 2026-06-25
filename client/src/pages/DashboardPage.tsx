import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Video, Users, Clock, LogIn, X, Loader2, Calendar, 
  TrendingUp, Zap, MonitorUp, Copy, Check, Info, ExternalLink, CheckSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Sidebar from '../components/ui/Sidebar';
import MobileHeader from '../components/ui/MobileHeader';
import { MeetingCardSkeleton } from '../components/ui/Skeleton';
import { meetingsAPI, tasksAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Meeting } from '../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksCount, setTasksCount] = useState({ total: 0, completed: 0 });
  
  // Modals state
  const [showNewModal, setShowNewModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Forms state
  const [newTitle, setNewTitle] = useState('');
  const [joinId, setJoinId] = useState('');
  const [shareMeetingId, setShareMeetingId] = useState('');
  const [scheduleForm, setScheduleForm] = useState({ title: '', date: '', time: '' });

  const [creating, setCreating] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous' | 'personal'>('upcoming');
  const [time, setTime] = useState(new Date());

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const loadTasks = useCallback(async () => {
    try {
      const res = await tasksAPI.getAll();
      const allTasks = res.data.tasks || [];
      setTasksCount({
        total: allTasks.length,
        completed: allTasks.filter((t: any) => t.status === 'done').length
      });
    } catch {}
  }, []);

  useEffect(() => {
    loadMeetings();
    loadTasks();
    // Check if new meeting modal should open
    if (sessionStorage.getItem('openNewMeeting')) {
      setShowNewModal(true);
      sessionStorage.removeItem('openNewMeeting');
    }
  }, [loadMeetings, loadTasks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return toast.error('Meeting title required');
    setCreating(true);
    try {
      const res = await meetingsAPI.create({ title: newTitle });
      const meeting = res.data.meeting;
      toast.success('Meeting started!');
      setShowNewModal(false);
      setNewTitle('');
      navigate(`/meeting/${meeting.meetingId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start meeting');
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

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = shareMeetingId.trim().toUpperCase();
    if (!id) return toast.error('Enter a meeting ID');
    navigate(`/meeting/${id}?share=true`);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.title.trim()) return toast.error('Meeting title required');
    if (!scheduleForm.date) return toast.error('Meeting date required');
    if (!scheduleForm.time) return toast.error('Meeting time required');

    setScheduling(true);
    try {
      const startDateTime = new Date(`${scheduleForm.date}T${scheduleForm.time}`);
      await meetingsAPI.create({ 
        title: scheduleForm.title,
        status: 'scheduled',
        startTime: startDateTime.toISOString()
      });
      toast.success('Meeting scheduled successfully!');
      setShowScheduleModal(false);
      setScheduleForm({ title: '', date: '', time: '' });
      loadMeetings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setScheduling(false);
    }
  };

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    toast.success(msg);
  };

  const pmi = user ? user.id.slice(0, 9).toUpperCase() : '123456789';
  const personalInviteLink = `${window.location.origin}/meeting/${pmi}`;

  // Filtering meetings for tabs
  const upcomingMeetings = meetings.filter(m => m.status === 'active' || m.status === 'scheduled');
  const previousMeetings = meetings.filter(m => m.status === 'ended');

  return (
    <div className="flex min-h-screen bg-[#0E0E11] font-sans antialiased text-slate-200">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto w-full">
        {/* Main Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Panel: Zoom Actions + Tabs */}
          <div className="xl:col-span-2 space-y-8 animate-fade-in">
            {/* Header Greeting */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, <span className="text-[#0E71EB]">{user?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">Manage your enterprise collaboration suite</p>
              </div>
            </div>

            {/* Zoom Action Tiles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* New Meeting (Orange) */}
              <button 
                onClick={() => setShowNewModal(true)} 
                className="flex flex-col items-center justify-center p-6 bg-[#F26D21] hover:bg-[#E05A12] rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[#F26D21]/20 active:scale-95 group text-center"
              >
                <div className="p-3 bg-white/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Video size={28} className="text-white" />
                </div>
                <span className="font-semibold text-white text-sm">New Meeting</span>
                <span className="text-white/60 text-xs mt-1">Instant room</span>
              </button>

              {/* Join Meeting (Blue) */}
              <button 
                onClick={() => setShowJoinModal(true)} 
                className="flex flex-col items-center justify-center p-6 bg-[#0E71EB] hover:bg-[#0C62CC] rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[#0E71EB]/20 active:scale-95 group text-center"
              >
                <div className="p-3 bg-white/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <LogIn size={28} className="text-white" />
                </div>
                <span className="font-semibold text-white text-sm">Join</span>
                <span className="text-white/60 text-xs mt-1">Via meeting ID</span>
              </button>

              {/* Schedule (Blue) */}
              <button 
                onClick={() => setShowScheduleModal(true)} 
                className="flex flex-col items-center justify-center p-6 bg-[#0E71EB] hover:bg-[#0C62CC] rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[#0E71EB]/20 active:scale-95 group text-center"
              >
                <div className="p-3 bg-white/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Calendar size={28} className="text-white" />
                </div>
                <span className="font-semibold text-white text-sm">Schedule</span>
                <span className="text-white/60 text-xs mt-1">Plan for later</span>
              </button>

              {/* Share Screen (Green) */}
              <button 
                onClick={() => setShowShareModal(true)} 
                className="flex flex-col items-center justify-center p-6 bg-[#30A94E] hover:bg-[#288F41] rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[#30A94E]/20 active:scale-95 group text-center"
              >
                <div className="p-3 bg-white/10 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <MonitorUp size={28} className="text-white" />
                </div>
                <span className="font-semibold text-white text-sm">Share Screen</span>
                <span className="text-white/60 text-xs mt-1">Enter meeting ID</span>
              </button>
            </div>

            {/* Tabs & List Section */}
            <div className="bg-[#16161B] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Tab Header */}
              <div className="flex border-b border-slate-800 bg-[#1A1A22] px-6">
                {[
                  { id: 'upcoming', label: 'Upcoming', count: upcomingMeetings.length },
                  { id: 'previous', label: 'Previous', count: previousMeetings.length },
                  { id: 'personal', label: 'Personal Room', count: null }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative py-4 px-4 font-semibold text-sm transition-colors focus:outline-none ${
                      activeTab === tab.id ? 'text-[#0E71EB]' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[#0E71EB]/25 text-[#0E71EB]' : 'bg-slate-800 text-slate-500'}`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E71EB] rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <MeetingCardSkeleton key={i} />)}
                  </div>
                ) : activeTab === 'upcoming' ? (
                  upcomingMeetings.length === 0 ? (
                    <EmptyState 
                      icon={Calendar} 
                      title="No upcoming meetings" 
                      subtitle="Schedule a meeting or start one instantly using the options above."
                      actionLabel="Schedule Meeting"
                      onAction={() => setShowScheduleModal(true)}
                    />
                  ) : (
                    <div className="space-y-3">
                      {upcomingMeetings.map((meeting, i) => (
                        <MeetingItem key={meeting._id || meeting.meetingId} meeting={meeting} onNavigate={navigate} index={i} />
                      ))}
                    </div>
                  )
                ) : activeTab === 'previous' ? (
                  previousMeetings.length === 0 ? (
                    <EmptyState 
                      icon={Video} 
                      title="No meeting history" 
                      subtitle="Your completed meetings and summaries will show up here."
                    />
                  ) : (
                    <div className="space-y-3">
                      {previousMeetings.map((meeting, i) => (
                        <MeetingItem key={meeting._id || meeting.meetingId} meeting={meeting} onNavigate={navigate} index={i} />
                      ))}
                    </div>
                  )
                ) : (
                  /* Personal Room Tab */
                  <div className="space-y-6">
                    <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                      <div>
                        <h3 className="font-bold text-white text-lg">{user?.name}'s Personal Meeting Room</h3>
                        <p className="text-slate-400 text-xs mt-1">Your dedicated, persistent collaboration space</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/meeting/${pmi}`)} 
                        className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                      >
                        <Video size={16} /> Start Room
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1F1F26] border border-slate-800/80 rounded-xl space-y-1">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Personal Meeting ID (PMI)</p>
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

                    <div className="bg-[#1A1A22] border border-slate-800/60 rounded-xl p-4 flex gap-3 items-start">
                      <Info size={16} className="text-[#0E71EB] flex-shrink-0 mt-0.5" />
                      <p className="text-slate-400 text-xs leading-relaxed">
                        A Personal Meeting Room is a virtual meeting space permanently reserved for you. You can access it anytime or share your persistent Personal Meeting ID (PMI) to invite guests without generating a new ID.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Digital Clock & Upcoming Cards */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {/* Real-time Clock Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-900/30 rounded-3xl p-8 shadow-2xl flex flex-col justify-between min-h-[220px]">
              {/* Background abstract shapes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0E71EB]/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl" />

              <div>
                <p className="text-5xl font-extrabold text-white tracking-tight font-mono">
                  {format(time, 'hh:mm:ss')} <span className="text-xl font-medium text-slate-400">{format(time, 'a')}</span>
                </p>
                <p className="text-slate-400 text-sm font-semibold mt-2">{format(time, 'EEEE, MMMM d, yyyy')}</p>
              </div>

              <div className="border-t border-white/5 pt-4 mt-6">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Logged in as:</span>
                  <span className="font-semibold text-slate-200">{user?.name}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Agenda Section */}
            <div className="bg-[#16161B] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Clock size={16} className="text-[#0E71EB]" /> Today's Agenda
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{upcomingMeetings.length} Scheduled</span>
              </div>

              {upcomingMeetings.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No upcoming meetings scheduled for today.
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {upcomingMeetings.slice(0, 4).map(meeting => (
                    <div key={meeting.meetingId} className="p-3 bg-[#1F1F26] border border-slate-800/80 hover:border-slate-700/80 rounded-xl transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-white text-xs truncate">{meeting.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0E71EB]/10 text-[#0E71EB] border border-[#0E71EB]/20">
                          {format(new Date(meeting.startTime || meeting.createdAt), 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="font-mono text-[10px] text-slate-500">ID: {meeting.meetingId}</span>
                        <button 
                          onClick={() => navigate(`/meeting/${meeting.meetingId}`)}
                          className="text-[10px] text-white hover:text-[#0C62CC] font-bold bg-[#0E71EB] hover:bg-[#0E71EB]/10 border border-transparent hover:border-[#0E71EB]/20 px-2 py-1 rounded transition-colors"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Start Instant Meeting Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#1A1A22] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Start New Meeting</h2>
                <p className="text-slate-400 text-xs mt-0.5">Generate a room and join instantly</p>
              </div>
              <button 
                onClick={() => setShowNewModal(false)} 
                className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meeting Topic</label>
                <input 
                  className="w-full px-4 py-2.5 bg-[#1F1F26] border border-slate-850 rounded-lg text-white text-sm placeholder-slate-600 focus:border-[#0E71EB]/50 focus:outline-none transition-all" 
                  placeholder="e.g., Weekly Sync, Sprint Planning"
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  autoFocus 
                />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowNewModal(false)} 
                  className="flex-1 py-2 bg-[#1F1F26] hover:bg-[#2A2A35] border border-slate-800 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-[#F26D21] hover:bg-[#E05A12] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors" 
                  disabled={creating}
                >
                  {creating && <Loader2 size={14} className="animate-spin" />}
                  {creating ? 'Starting...' : 'Start Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Meeting Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#1A1A22] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Join Meeting</h2>
                <p className="text-slate-400 text-xs mt-0.5">Enter meeting ID or personal link</p>
              </div>
              <button 
                onClick={() => setShowJoinModal(false)} 
                className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meeting ID</label>
                <input 
                  className="w-full px-4 py-2.5 bg-[#1F1F26] border border-slate-850 rounded-lg text-white font-mono uppercase tracking-widest text-center text-sm placeholder-slate-600 focus:border-[#0E71EB]/50 focus:outline-none transition-all" 
                  placeholder="XXXXXXXX" 
                  value={joinId}
                  onChange={e => setJoinId(e.target.value)} 
                  maxLength={9} 
                  autoFocus
                />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowJoinModal(false)} 
                  className="flex-1 py-2 bg-[#1F1F26] hover:bg-[#2A2A35] border border-slate-800 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-[#0E71EB] hover:bg-[#0C62CC] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Join Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#1A1A22] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Schedule Meeting</h2>
                <p className="text-slate-400 text-xs mt-0.5">Plan a new session for later</p>
              </div>
              <button 
                onClick={() => setShowScheduleModal(false)} 
                className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Topic</label>
                <input 
                  className="w-full px-4 py-2.5 bg-[#1F1F26] border border-slate-850 rounded-lg text-white text-sm placeholder-slate-600 focus:border-[#0E71EB]/50 focus:outline-none transition-all" 
                  placeholder="e.g. Design Sync, Budget Review"
                  value={scheduleForm.title} 
                  onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} 
                  autoFocus 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2 bg-[#1F1F26] border border-slate-850 rounded-lg text-white text-sm placeholder-slate-600 focus:border-[#0E71EB]/50 focus:outline-none transition-all" 
                    value={scheduleForm.date} 
                    onChange={e => setScheduleForm({...scheduleForm, date: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time</label>
                  <input 
                    type="time"
                    className="w-full px-4 py-2 bg-[#1F1F26] border border-slate-850 rounded-lg text-white text-sm placeholder-slate-600 focus:border-[#0E71EB]/50 focus:outline-none transition-all" 
                    value={scheduleForm.time} 
                    onChange={e => setScheduleForm({...scheduleForm, time: e.target.value})} 
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowScheduleModal(false)} 
                  className="flex-1 py-2 bg-[#1F1F26] hover:bg-[#2A2A35] border border-slate-800 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-[#0E71EB] hover:bg-[#0C62CC] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors" 
                  disabled={scheduling}
                >
                  {scheduling && <Loader2 size={14} className="animate-spin" />}
                  {scheduling ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Screen Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#1A1A22] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">Share Screen</h2>
                <p className="text-slate-400 text-xs mt-0.5">Start a meeting sharing your workspace</p>
              </div>
              <button 
                onClick={() => setShowShareModal(false)} 
                className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Meeting ID</label>
                <input 
                  className="w-full px-4 py-2.5 bg-[#1F1F26] border border-slate-850 rounded-lg text-white font-mono uppercase tracking-widest text-center text-sm placeholder-slate-600 focus:border-[#0E71EB]/50 focus:outline-none transition-all" 
                  placeholder="XXXXXXXX" 
                  value={shareMeetingId}
                  onChange={e => setShareMeetingId(e.target.value)} 
                  maxLength={9} 
                  autoFocus
                />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowShareModal(false)} 
                  className="flex-1 py-2 bg-[#1F1F26] hover:bg-[#2A2A35] border border-slate-800 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-[#30A94E] hover:bg-[#288F41] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Share Screen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: any;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

function EmptyState({ icon: Icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="bg-[#1A1A22]/50 border border-slate-850 border-dashed text-center py-14 px-4 rounded-xl">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/40 flex items-center justify-center mx-auto mb-4">
        <Icon size={24} className="text-slate-500" />
      </div>
      <p className="text-white font-semibold text-sm mb-1">{title}</p>
      <p className="text-slate-500 text-xs max-w-sm mx-auto mb-5 leading-relaxed">{subtitle}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function MeetingItem({ meeting, onNavigate, index = 0 }: { meeting: Meeting; onNavigate: (path: string) => void; index?: number }) {
  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    ended: 'bg-slate-855 text-slate-500 border-slate-800',
    scheduled: 'bg-[#0E71EB]/10 text-[#0E71EB] border-[#0E71EB]/25',
  };

  return (
    <div 
      className="p-4 bg-[#1F1F26] border border-slate-850 hover:border-slate-750 hover:bg-[#25252F] rounded-xl flex items-center justify-between gap-4 group transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E71EB]/20 to-[#0E71EB]/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
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
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`badge border px-2.5 py-0.5 rounded text-[10px] font-semibold ${statusColors[meeting.status]}`}>
          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
        </span>
        {meeting.status === 'active' && (
          <button 
            onClick={() => onNavigate(`/meeting/${meeting.meetingId}`)}
            className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white text-xs font-semibold py-1.5 px-3.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Rejoin
          </button>
        )}
        {meeting.status === 'scheduled' && (
          <button 
            onClick={() => onNavigate(`/meeting/${meeting.meetingId}`)}
            className="bg-[#0E71EB] hover:bg-[#0C62CC] text-white text-xs font-semibold py-1.5 px-3.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Start
          </button>
        )}
        {meeting.status === 'ended' && (
          <button 
            onClick={() => onNavigate(`/meeting/${meeting.meetingId}/summary`)}
            className="bg-[#1F1F26] hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold py-1.5 px-3.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Summary
          </button>
        )}
      </div>
    </div>
  );
}
