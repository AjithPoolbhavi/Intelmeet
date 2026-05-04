import { useEffect, useState } from 'react';
import { Shield, Copy } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { useMeetingStore } from '../../store/meetingStore';
import Logo from '../ui/Logo';
import toast from 'react-hot-toast';

export default function MeetingTopBar({ meetingId, socket }: { meetingId: string; socket: Socket | null }) {
  const { currentMeeting, participants } = useMeetingStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
      : `${m}:${String(sec).padStart(2, '0')}`;
  };

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId);
    toast.success('Meeting ID copied!');
  };

  return (
    <div className="h-14 bg-surface-800 border-b border-surface-600 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-4">
        <Logo size="sm" />
        <div className="h-5 w-px bg-surface-600" />
        <div>
          <p className="text-sm font-medium text-white leading-tight truncate max-w-xs">
            {currentMeeting?.title || 'Meeting'}
          </p>
          <button
            onClick={copyMeetingId}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-400 transition-colors"
          >
            <span className="font-mono">{meetingId}</span>
            <Copy size={10} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-mono text-white tabular-nums">{formatTime(elapsed)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
          <Shield size={14} className="text-emerald-400" />
          <span className="text-xs">Encrypted</span>
        </div>
        <div className="text-xs text-slate-500 bg-surface-700 px-2 py-1 rounded-full">
          {participants.length + 1} participant{participants.length !== 0 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
