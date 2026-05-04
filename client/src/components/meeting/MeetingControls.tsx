import { Mic, MicOff, Video, VideoOff, Monitor, MessageSquare, Users, Phone, MoreHorizontal } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { useMeetingStore } from '../../store/meetingStore';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Props {
  meetingId: string;
  socket: Socket | null;
  onLeave: () => void;
}

export default function MeetingControls({ meetingId, socket, onLeave }: Props) {
  const {
    isAudioOn, isVideoOn, isScreenSharing, isChatOpen, isParticipantsOpen,
    toggleAudio, toggleVideo, toggleScreenShare, toggleChat, toggleParticipants,
    participants,
  } = useMeetingStore();

  const handleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        toggleScreenShare();
        socket?.emit('screen-share-started', { meetingId });
        toast.success('Screen sharing started');
      } catch {
        toast.error('Could not share screen');
      }
    } else {
      toggleScreenShare();
      socket?.emit('screen-share-stopped', { meetingId });
    }
  };

  const ControlButton = ({
    icon: Icon, activeIcon: ActiveIcon, label, active, onClick, variant = 'default', badge
  }: {
    icon: any; activeIcon?: any; label: string; active?: boolean;
    onClick: () => void; variant?: 'default' | 'danger'; badge?: number;
  }) => {
    const DisplayIcon = active && ActiveIcon ? ActiveIcon : Icon;
    return (
      <div className="relative flex flex-col items-center gap-1">
        <button
          onClick={onClick}
          title={label}
          className={clsx(
            'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90',
            variant === 'danger'
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : active === false
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 ring-1 ring-red-500/40'
              : 'bg-surface-600 hover:bg-surface-500 text-slate-200'
          )}
        >
          <DisplayIcon size={20} />
        </button>
        {badge != null && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            {badge}
          </span>
        )}
        <span className="text-[10px] text-slate-500 hidden md:block">{label}</span>
      </div>
    );
  };

  return (
    <div className="h-20 bg-surface-800 border-t border-surface-600 flex items-center justify-center gap-4 px-6 flex-shrink-0">
      <ControlButton
        icon={MicOff} activeIcon={Mic}
        label={isAudioOn ? 'Mute' : 'Unmute'}
        active={isAudioOn}
        onClick={toggleAudio}
      />
      <ControlButton
        icon={VideoOff} activeIcon={Video}
        label={isVideoOn ? 'Stop Video' : 'Start Video'}
        active={isVideoOn}
        onClick={toggleVideo}
      />
      <ControlButton
        icon={Monitor}
        label={isScreenSharing ? 'Stop Share' : 'Share Screen'}
        active={!isScreenSharing}
        onClick={handleScreenShare}
      />

      <div className="w-px h-8 bg-surface-600" />

      <ControlButton
        icon={MessageSquare}
        label="Chat"
        active={!isChatOpen}
        onClick={toggleChat}
        badge={isChatOpen ? undefined : 0}
      />
      <ControlButton
        icon={Users}
        label={`People (${participants.length + 1})`}
        active={!isParticipantsOpen}
        onClick={toggleParticipants}
      />
      <ControlButton
        icon={MoreHorizontal}
        label="More"
        onClick={() => toast('More options coming soon', { icon: '🔜' })}
      />

      <div className="w-px h-8 bg-surface-600" />

      <ControlButton
        icon={Phone}
        label="Leave"
        variant="danger"
        onClick={onLeave}
      />
    </div>
  );
}
