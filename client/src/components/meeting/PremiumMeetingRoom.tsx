import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Hand,
  Smile,
  MessageCircle,
  Users,
  Settings,
  Phone,
  MoreVertical,
  ScreenShare,
  Edit3,
  Maximize2,
  Volume2,
  Wind,
} from 'lucide-react';
import { Tooltip } from '../ui/Tabs';
import { Dropdown } from '../ui/Tabs';

interface PremiumControlBarProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
  onRaiseHand: () => void;
  onShowChat: () => void;
  onShowParticipants: () => void;
  onEndCall: () => void;
  onSettings: () => void;
}

export function PremiumControlBar({
  isMuted,
  isVideoOff,
  isScreenSharing,
  isHandRaised,
  onToggleMic,
  onToggleVideo,
  onScreenShare,
  onRaiseHand,
  onShowChat,
  onShowParticipants,
  onEndCall,
  onSettings,
}: PremiumControlBarProps) {
  const [showReactions, setShowReactions] = useState(false);

  const reactions = ['👍', '🎉', '❤️', '😂', '🤔', '👏'];

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-surface-900/80 to-surface-800/80 backdrop-blur-xl border-t border-white/5 rounded-2xl mx-4 mb-4">
      {/* Left Controls */}
      <div className="flex items-center gap-2">
        <Tooltip content={isMuted ? 'Unmute' : 'Mute'}>
          <button
            onClick={onToggleMic}
            className={`p-3 rounded-full transition-all duration-200 ${
              isMuted
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </Tooltip>

        <Tooltip content={isVideoOff ? 'Turn on camera' : 'Turn off camera'}>
          <button
            onClick={onToggleVideo}
            className={`p-3 rounded-full transition-all duration-200 ${
              isVideoOff
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
          </button>
        </Tooltip>

        <div className="w-px h-8 bg-white/10 mx-1" />

        <Tooltip content="Share screen">
          <button
            onClick={onScreenShare}
            className={`p-3 rounded-full transition-all duration-200 ${
              isScreenSharing
                ? 'bg-brand-500/20 text-brand-400 hover:bg-brand-500/30'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            <Share2 size={18} />
          </button>
        </Tooltip>

        <Tooltip content="Raise hand">
          <button
            onClick={onRaiseHand}
            className={`p-3 rounded-full transition-all duration-200 ${
              isHandRaised
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            <Hand size={18} />
          </button>
        </Tooltip>
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-2 mx-4">
        <div className="relative">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all"
          >
            <Smile size={18} />
          </button>

          {showReactions && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface-800 border border-white/10 rounded-lg p-2 flex gap-2 shadow-lg">
              {reactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    // Send reaction
                    setShowReactions(false);
                  }}
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <Tooltip content="Message">
          <button
            onClick={onShowChat}
            className="p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all relative"
          >
            <MessageCircle size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
          </button>
        </Tooltip>

        <Tooltip content="Whiteboard">
          <button className="p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all">
            <Edit3 size={18} />
          </button>
        </Tooltip>

        <Tooltip content="Participants">
          <button
            onClick={onShowParticipants}
            className="p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all relative"
          >
            <Users size={18} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center">
              5
            </span>
          </button>
        </Tooltip>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <div className="w-px h-8 bg-white/10 mx-1" />

        <Dropdown
          trigger={
            <button className="p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all">
              <Settings size={18} />
            </button>
          }
          items={[
            { label: 'Audio Settings', icon: <Volume2 size={14} />, onClick: onSettings },
            { label: 'Video Settings', icon: <Video size={14} />, onClick: onSettings },
            { label: 'Noise Suppression', icon: <Wind size={14} />, onClick: () => {} },
            { label: 'Recording', icon: <ScreenShare size={14} />, onClick: () => {} },
          ]}
        />

        <button
          onClick={onEndCall}
          className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
        >
          <Phone size={18} />
        </button>
      </div>
    </div>
  );
}

interface MeetingHeaderProps {
  title: string;
  duration: number;
  isRecording: boolean;
  participantCount: number;
  onSettings: () => void;
}

export function MeetingHeader({
  title,
  duration,
  isRecording,
  participantCount,
  onSettings,
}: MeetingHeaderProps) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-surface-900/80 to-surface-800/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-white">{title}</h1>

        {isRecording && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
          <Users size={14} className="text-white/60" />
          <span className="text-sm text-white/80">{participantCount}</span>
        </div>

        <div className="text-sm font-medium text-white/80">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <Dropdown
          trigger={
            <button className="p-2 hover:bg-white/5 rounded-lg transition-all">
              <MoreVertical size={18} className="text-white/60" />
            </button>
          }
          items={[
            { label: 'Meeting Details', onClick: () => {} },
            { label: 'Invite', onClick: () => {} },
            { label: 'Settings', onClick: onSettings },
            { label: 'Leave Meeting', isDangerous: true, onClick: () => {} },
          ]}
        />
      </div>
    </div>
  );
}

interface VideoTileProps {
  name: string;
  isLocal?: boolean;
  isSpeaking?: boolean;
  videoStream?: boolean;
  audioEnabled?: boolean;
  onContextMenu?: () => void;
}

export function PremiumVideoTile({
  name,
  isLocal = false,
  isSpeaking = false,
  videoStream = true,
  audioEnabled = true,
  onContextMenu,
}: VideoTileProps) {
  return (
    <div
      className={`relative bg-gradient-to-br from-surface-700 to-surface-800 rounded-xl overflow-hidden transition-all duration-200 ${
        isSpeaking
          ? 'ring-2 ring-brand-500 scale-105 shadow-lg shadow-brand-500/50'
          : 'ring-1 ring-white/5'
      }`}
      onContextMenu={onContextMenu}
    >
      {/* Video Background */}
      {videoStream ? (
        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-600 to-surface-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-xs font-medium">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-white truncate">{name}</span>
          {isLocal && (
            <span className="text-xs text-white/60 bg-black/30 px-2 py-0.5 rounded">You</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!audioEnabled && <MicOff size={12} className="text-red-400" />}
          {!videoStream && <VideoOff size={12} className="text-red-400" />}
        </div>
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-brand-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}

interface GridLayoutProps {
  participants: Array<{ id: string; name: string; isSpeaking: boolean }>;
  children?: React.ReactNode;
}

export function VideoGrid({ participants, children }: GridLayoutProps) {
  const getGridClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3 || count === 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <div className={`grid ${getGridClass(participants.length)} gap-3 p-4 auto-rows-max`}>
      {participants.map((participant) => (
        <PremiumVideoTile
          key={participant.id}
          name={participant.name}
          isSpeaking={participant.isSpeaking}
        />
      ))}
      {children}
    </div>
  );
}
