import { useState, useRef, useEffect } from 'react';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  MessageSquare, Users, Phone, Hand, Smile,
  Circle, Settings, ChevronUp
} from 'lucide-react';
import { Socket } from 'socket.io-client';
import { useMeetingStore } from '../../store/meetingStore';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

interface Props {
  meetingId: string;
  socket: Socket | null;
  onLeave: () => void;
}

const REACTIONS = [
  { emoji: '👍', label: 'Thumbs Up' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '🎉', label: 'Celebrate' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💯', label: 'Perfect' },
];

export default function MeetingControls({ meetingId, socket, onLeave }: Props) {
  const { user } = useAuthStore();
  const {
    isAudioOn, isVideoOn, isScreenSharing, isChatOpen, isParticipantsOpen,
    isHandRaised, isRecording, isSettingsOpen, unreadMessages, participants,
    toggleAudio, toggleVideo, toggleScreenShare, toggleChat, toggleParticipants,
    toggleHand, toggleRecording, toggleSettings, addReaction, removeReaction,
  } = useMeetingStore();

  const [showReactions, setShowReactions] = useState(false);
  const reactionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (reactionsRef.current && !reactionsRef.current.contains(e.target as Node)) {
        setShowReactions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
      toast('Screen sharing stopped', { icon: '🖥️' });
    }
  };

  const handleRaiseHand = () => {
    toggleHand();
    if (!isHandRaised) {
      socket?.emit('raise-hand', { meetingId, userName: user?.name });
      toast('Hand raised ✋', { duration: 2000 });
    } else {
      socket?.emit('lower-hand', { meetingId });
    }
  };

  const handleReaction = (emoji: string) => {
    setShowReactions(false);
    const id = `rxn-${Date.now()}`;
    const reaction = { id, emoji, name: user?.name || 'You', x: Math.random() * 60 + 20 };
    addReaction(reaction);
    socket?.emit('send-reaction', { meetingId, emoji, userName: user?.name });
    setTimeout(() => removeReaction(id), 3500);
  };

  const handleRecording = () => {
    toggleRecording();
    if (!isRecording) {
      toast.success('Recording started 🔴', { duration: 3000 });
    } else {
      toast('Recording stopped', { icon: '⏹️', duration: 2000 });
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .meeting-ctrl-label { display: none !important; }
          .meeting-ctrl-left { display: none !important; }
          .meeting-ctrl-right { flex: none !important; }
          .meeting-leave-btn span { display: none !important; }
          .meeting-leave-btn {
            padding: 0 !important;
            width: 44px !important;
            height: 44px !important;
            border-radius: 12px !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .meeting-ctrl-container {
            justify-content: space-around !important;
            padding: 0 10px !important;
            height: 72px !important;
            gap: 2px !important;
          }
          .meeting-ctrl-divider { display: none !important; }
        }
      `}</style>
      <div className="meeting-ctrl-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '88px',
        background: '#1c1c1e',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px',
        flexShrink: 0,
        gap: '8px',
      }}>

        {/* ── Left: status pills ── */}
        <div className="meeting-ctrl-left" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
          <Users size={14} style={{ color: '#94a3b8' }} />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{participants.length + 1}</span>
        </div>
        {isRecording && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '20px', padding: '4px 12px',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite', display: 'inline-block' }} />
            <span style={{ color: '#f87171', fontSize: '12px', fontWeight: 600 }}>REC</span>
          </div>
        )}
        {isHandRaised && (
          <div style={{
            background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '20px', padding: '4px 12px',
          }}>
            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 600 }}>✋ Hand raised</span>
          </div>
        )}
      </div>

      {/* ── Center: controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

        {/* Mic */}
        <CtrlGroup>
          <CtrlBtn
            icon={isAudioOn ? Mic : MicOff}
            isOff={!isAudioOn}
            label={isAudioOn ? 'Mute' : 'Unmute'}
            onClick={toggleAudio}
            hasChevron
            onChevronClick={() => toast('Audio settings', { icon: '🎤' })}
          />
        </CtrlGroup>

        {/* Camera */}
        <CtrlGroup>
          <CtrlBtn
            icon={isVideoOn ? Video : VideoOff}
            isOff={!isVideoOn}
            label={isVideoOn ? 'Stop Video' : 'Start Video'}
            onClick={toggleVideo}
            hasChevron
            onChevronClick={() => toast('Video settings', { icon: '📹' })}
          />
        </CtrlGroup>

        <Divider />

        {/* Screen Share */}
        <CtrlGroup>
          <CtrlBtn
            icon={isScreenSharing ? MonitorOff : Monitor}
            label={isScreenSharing ? 'Stop Share' : 'Share Screen'}
            isHighlight={isScreenSharing}
            highlightColor="#10b981"
            onClick={handleScreenShare}
          />
        </CtrlGroup>

        {/* Chat */}
        <CtrlGroup>
          <div style={{ position: 'relative' }}>
            <CtrlBtn
              icon={MessageSquare}
              label="Chat"
              isHighlight={isChatOpen}
              onClick={toggleChat}
            />
            {unreadMessages > 0 && !isChatOpen && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                minWidth: 18, height: 18, borderRadius: 9,
                background: '#ef4444', color: '#fff',
                fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px', zIndex: 10,
              }}>
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </div>
        </CtrlGroup>

        {/* Raise Hand */}
        <CtrlGroup>
          <CtrlBtn
            icon={Hand}
            label={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
            isHighlight={isHandRaised}
            highlightColor="#f59e0b"
            onClick={handleRaiseHand}
          />
        </CtrlGroup>

        {/* Reactions */}
        <CtrlGroup>
          <div ref={reactionsRef} style={{ position: 'relative' }}>
            <CtrlBtn
              icon={Smile}
              label="Reactions"
              isHighlight={showReactions}
              onClick={() => setShowReactions(v => !v)}
            />
            {showReactions && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', gap: '4px',
                background: '#2a2a2e', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px', padding: '10px 14px',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
                zIndex: 100,
                animation: 'slideUpFade 0.18s ease-out both',
              }}>
                {REACTIONS.map(r => (
                  <button
                    key={r.emoji}
                    title={r.label}
                    onClick={() => handleReaction(r.emoji)}
                    style={{
                      fontSize: '26px', border: 'none', background: 'transparent',
                      cursor: 'pointer', borderRadius: '10px', padding: '6px 8px',
                      transition: 'transform 0.12s, background 0.12s', lineHeight: 1,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.4) translateY(-4px)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CtrlGroup>

        {/* Participants */}
        <CtrlGroup>
          <CtrlBtn
            icon={Users}
            label={`People (${participants.length + 1})`}
            isHighlight={isParticipantsOpen}
            onClick={toggleParticipants}
          />
        </CtrlGroup>

        <div className="meeting-ctrl-divider">
          <Divider />
        </div>

        {/* Record */}
        <CtrlGroup>
          <CtrlBtn
            icon={Circle}
            label={isRecording ? 'Stop Rec' : 'Record'}
            isHighlight={isRecording}
            highlightColor="#ef4444"
            isRecordPulse={isRecording}
            onClick={handleRecording}
          />
        </CtrlGroup>

        {/* Settings */}
        <CtrlGroup>
          <CtrlBtn
            icon={Settings}
            label="Settings"
            isHighlight={isSettingsOpen}
            onClick={toggleSettings}
          />
        </CtrlGroup>
      </div>

      {/* ── Right: Leave ── */}
      <div className="meeting-ctrl-right" style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
        <button
          onClick={onLeave}
          className="meeting-leave-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 22px',
            background: '#dc2626',
            color: '#fff', border: 'none', borderRadius: '12px',
            cursor: 'pointer', fontWeight: 700, fontSize: '14px',
            fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(220,38,38,0.35)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#ef4444';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(220,38,38,0.5)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = '#dc2626';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(220,38,38,0.35)';
          }}
        >
          <Phone size={16} style={{ transform: 'rotate(135deg)' }} />
          <span>Leave</span>
        </button>
      </div>
    </div>
    </>
  );
}

/* ─── Helper: Ctrl Group (vertical flex with label) ─── */
function CtrlGroup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
      {children}
    </div>
  );
}

/* ─── Helper: Divider ─── */
function Divider() {
  return <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)', margin: '0 6px' }} />;
}

/* ─── Main Control Button ─── */
function CtrlBtn({
  icon: Icon, label, isOff = false, isHighlight = false,
  highlightColor, onClick, hasChevron, onChevronClick, isRecordPulse = false,
}: {
  icon: any; label: string;
  isOff?: boolean; isHighlight?: boolean;
  highlightColor?: string;
  onClick: () => void;
  hasChevron?: boolean; onChevronClick?: () => void;
  isRecordPulse?: boolean;
}) {
  const offStyle = {
    background: 'rgba(239,68,68,0.18)',
    color: '#f87171',
    border: '1px solid rgba(239,68,68,0.35)',
  };

  const highlightStyle = {
    background: highlightColor
      ? `${highlightColor}22`
      : 'rgba(99,102,241,0.2)',
    color: highlightColor || '#a5b4fc',
    border: `1px solid ${highlightColor ? highlightColor + '55' : 'rgba(99,102,241,0.4)'}`,
  };

  const defaultStyle = {
    background: 'rgba(255,255,255,0.07)',
    color: '#e2e8f0',
    border: '1px solid rgba(255,255,255,0.05)',
  };

  const btnStyle = isOff ? offStyle : isHighlight ? highlightStyle : defaultStyle;

  const sharedBtn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 48, height: 48,
    borderRadius: hasChevron ? '12px 0 0 12px' : '12px',
    cursor: 'pointer', transition: 'all 0.14s ease',
    fontFamily: 'inherit',
    ...btnStyle,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
      <div style={{ display: 'flex' }}>
        <button
          onClick={onClick}
          title={label}
          style={sharedBtn}
          onMouseEnter={e => {
            if (!isOff && !isHighlight) {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)';
              (e.currentTarget as HTMLElement).style.color = '#fff';
            }
          }}
          onMouseLeave={e => {
            if (!isOff && !isHighlight) {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
              (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
            }
          }}
          onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.9)'; }}
          onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          <Icon
            size={22}
            style={isRecordPulse ? { color: '#ef4444' } : undefined}
          />
        </button>

        {hasChevron && (
          <button
            onClick={onChevronClick}
            title={`${label} options`}
            style={{
              ...sharedBtn,
              width: 22,
              borderRadius: '0 12px 12px 0',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <ChevronUp size={11} />
          </button>
        )}
      </div>

      <span className="meeting-ctrl-label" style={{
        fontSize: '11px', color: '#64748b', textAlign: 'center',
        maxWidth: hasChevron ? 70 : 58, lineHeight: 1.2,
        fontWeight: 500, letterSpacing: '0.01em',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {label}
      </span>
    </div>
  );
}
