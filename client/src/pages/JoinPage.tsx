import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, ArrowRight } from 'lucide-react';
import Sidebar from '../components/ui/Sidebar';
import MobileHeader from '../components/ui/MobileHeader';
import toast from 'react-hot-toast';

export default function JoinPage() {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const id = meetingId.trim().toUpperCase();
    if (!id) return toast.error('Enter a meeting ID');
    navigate(`/meeting/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-surface-900">
      <Sidebar />
      <MobileHeader />
      <main className="flex-1 ml-0 md:ml-64 flex items-center justify-center p-4 md:p-8 pt-20 md:pt-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="card bg-gradient-to-br from-brand-600/15 to-brand-600/5 border-brand-600/40">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600/40 to-brand-600/20 flex items-center justify-center shadow-lg shadow-brand-600/30">
                <Video size={32} className="text-brand-400" />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Join a Meeting</h1>
              <p className="text-slate-400 text-sm">Enter the meeting ID to join instantly</p>
            </div>

            <form onSubmit={handleJoin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">Meeting ID</label>
                <input
                  className="w-full px-6 py-4 text-center text-2xl tracking-[0.5rem] font-mono uppercase bg-surface-700/50 border-2 border-surface-600 rounded-xl text-brand-400 placeholder-slate-600 focus:border-brand-500/70 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                  placeholder="XXXXXXXX"
                  value={meetingId}
                  onChange={e => setMeetingId(e.target.value)}
                  maxLength={8}
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-2">8-character meeting ID</p>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base font-semibold"
              >
                Join Meeting <ArrowRight size={18} />
              </button>

              <button 
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary w-full py-3 text-sm"
              >
                Back to Dashboard
              </button>
            </form>

            {/* Info section */}
            <div className="mt-8 pt-8 border-t border-surface-600/50 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-300"><strong>Make sure you have the correct meeting ID</strong></p>
                  <p className="text-xs text-slate-500">You'll be connected with other participants in the room</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-300"><strong>Check your audio and video</strong></p>
                  <p className="text-xs text-slate-500">Your devices will be enabled when you join</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
