import { X, Mic, MicOff, Video, VideoOff, Crown } from 'lucide-react';
import { useMeetingStore } from '../../store/meetingStore';
import { useAuthStore } from '../../store/authStore';

export default function ParticipantsPanel() {
  const { participants, toggleParticipants } = useMeetingStore();
  const { user } = useAuthStore();

  const allParticipants = [
    { socketId: 'local', userId: user?.id || '', name: user?.name || 'You', audio: true, video: true, isLocal: true },
    ...participants,
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-600 flex-shrink-0">
        <h3 className="font-semibold text-white text-sm">
          Participants ({allParticipants.length})
        </h3>
        <button onClick={toggleParticipants} className="btn-ghost p-1">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {allParticipants.map((p) => (
          <div
            key={p.socketId}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-700 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {p.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 font-medium truncate">
                {p.name} {p.isLocal && '(You)'}
              </p>
              {p.isLocal && (
                <div className="flex items-center gap-1">
                  <Crown size={10} className="text-amber-400" />
                  <span className="text-xs text-amber-400">Host</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {p.audio === false ? (
                <MicOff size={14} className="text-red-400" />
              ) : (
                <Mic size={14} className="text-emerald-400" />
              )}
              {p.video === false ? (
                <VideoOff size={14} className="text-red-400" />
              ) : (
                <Video size={14} className="text-emerald-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
