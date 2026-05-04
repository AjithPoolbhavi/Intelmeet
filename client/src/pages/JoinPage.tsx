import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, ArrowRight } from 'lucide-react';
import Sidebar from '../components/ui/Sidebar';
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
      <main className="flex-1 ml-64 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 flex items-center justify-center">
                <Video size={24} className="text-brand-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Join a Meeting</h1>
                <p className="text-slate-400 text-sm">Enter a meeting ID to join</p>
              </div>
            </div>
            <form onSubmit={handleJoin} className="space-y-4">
              <input
                className="input text-center text-lg tracking-widest font-mono uppercase"
                placeholder="XXXXXXXX"
                value={meetingId}
                onChange={e => setMeetingId(e.target.value)}
                maxLength={8}
              />
              <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                Join Meeting <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
