import { Mic, MicOff, Video, VideoOff, Monitor, MessageSquare, Users, Phone, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';

interface ControlBarProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  chatOpen: boolean;
  participantsOpen: boolean;
  unreadMessages: number;
  participantCount: number;
}

export default function ControlBar({
  audioEnabled, videoEnabled, onToggleAudio, onToggleVideo, onEndCall,
  onToggleChat, onToggleParticipants, chatOpen, participantsOpen, unreadMessages, participantCount,
}: ControlBarProps) {
  const ControlBtn = ({ active, danger, onClick, icon: Icon, offIcon: OffIcon, label, badge }: any) => (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95
          ${danger ? 'bg-red-600 hover:bg-red-700 text-white' :
            active ? 'bg-surface-500 hover:bg-surface-400 text-white border border-white/10' :
            'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/30'}`}
      >
        {active !== undefined ? (active ? <Icon size={20} /> : <OffIcon size={20} />) : <Icon size={20} />}
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            {badge}
          </span>
        )}
      </button>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );

  return (
    <div className="h-20 glass border-t border-white/5 flex items-center justify-center gap-4 px-8">
      <ControlBtn active={audioEnabled} icon={Mic} offIcon={MicOff} onClick={onToggleAudio} label="Mic" />
      <ControlBtn active={videoEnabled} icon={Video} offIcon={VideoOff} onClick={onToggleVideo} label="Camera" />
      <ControlBtn icon={Monitor} onClick={() => {}} label="Share" active={true} />

      <div className="w-px h-8 bg-white/10 mx-2" />

      <ControlBtn icon={MessageSquare} onClick={onToggleChat} label="Chat" badge={unreadMessages}
        active={!chatOpen} danger={false} />
      <div className="flex flex-col items-center gap-1">
        <button onClick={onToggleParticipants}
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95
            bg-surface-500 hover:bg-surface-400 text-white border border-white/10`}>
          <Users size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
            {participantCount}
          </span>
        </button>
        <span className="text-xs text-gray-500">People</span>
      </div>

      <div className="w-px h-8 bg-white/10 mx-2" />

      <div className="flex flex-col items-center gap-1">
        <button onClick={onEndCall}
          className="w-14 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all active:scale-95">
          <Phone size={20} className="rotate-[135deg]" />
        </button>
        <span className="text-xs text-gray-500">Leave</span>
      </div>
    </div>
  );
}
