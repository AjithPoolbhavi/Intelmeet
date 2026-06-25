import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { initSocket, disconnectSocket } from '../services/socket';
import { meetingsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useMeetingStore } from '../store/meetingStore';
import { useWebRTC } from '../hooks/useWebRTC';
import { Socket } from 'socket.io-client';
import MeetingControls from '../components/meeting/MeetingControls';
import VideoGrid from '../components/meeting/VideoGrid';
import ChatPanel from '../components/meeting/ChatPanel';
import ParticipantsPanel from '../components/meeting/ParticipantsPanel';
import SettingsPanel from '../components/meeting/SettingsPanel';
import MeetingTopBar from '../components/meeting/MeetingTopBar';
import { Loader2 } from 'lucide-react';

export default function MeetingPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const {
    setCurrentMeeting, setParticipants, addParticipant, removeParticipant,
    addMessage, isChatOpen, isParticipantsOpen, isSettingsOpen,
    isAudioOn, isVideoOn, localStream, reactions, reset,
  } = useMeetingStore();

  const socketRef = useRef<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  const { initLocalStream, initiateCall, closePeer, stopLocalStream, remoteStreams } = useWebRTC(
    socketRef.current, meetingId || '', user?.name || 'Guest'
  );

  const setupMeeting = useCallback(async () => {
    if (!meetingId || !user) return;

    try {
      // Try to load meeting info
      try {
        const res = await meetingsAPI.getById(meetingId);
        setCurrentMeeting(res.data.meeting);
      } catch {
        // Meeting not found, create context anyway for joining
        setCurrentMeeting({
          meetingId: meetingId,
          title: `Meeting ${meetingId}`,
          host: user.id,
          hostName: user.name,
          status: 'active',
          startTime: new Date().toISOString(),
          participants: [],
          messages: [],
          createdAt: new Date().toISOString(),
        });
      }

      // Init media
      await initLocalStream(true, true);

      // Init socket
      const socket = initSocket(token || undefined);
      socketRef.current = socket;

      // Join room
      socket.emit('join-room', { meetingId, userName: user.name });

      // Handle participants
      socket.on('room-participants', ({ participants }) => {
        setParticipants(participants.filter((p: any) => p.socketId !== socket.id));
      });

      socket.on('user-joined', async ({ socketId, name, participants }) => {
        toast.success(`${name} joined`, { duration: 2000 });
        addParticipant({ socketId, userId: socketId, name, audio: true, video: true });
        // Initiate WebRTC call
        const stream = useMeetingStore.getState().localStream || new MediaStream();
        await initiateCall(socketId, stream);
      });

      socket.on('user-left', ({ socketId, name }) => {
        toast(`${name} left`, { icon: '👋', duration: 2000 });
        closePeer(socketId);
        removeParticipant(socketId);
      });

      // Chat
      socket.on('receive-message', (message) => {
        addMessage(message);
      });

      // Reactions from remote
      socket.on('receive-reaction', ({ emoji, userName }: { emoji: string; userName: string }) => {
        toast(`${userName} reacted ${emoji}`, { duration: 2000 });
      });

      // Raise hand
      socket.on('hand-raised', ({ userName }: { userName: string }) => {
        toast(`${userName} raised their hand ✋`, { duration: 3000 });
      });

      setLoading(false);
    } catch (err) {
      console.error('Meeting setup error:', err);
      toast.error('Failed to join meeting');
      setLoading(false);
    }
  }, [meetingId, user, token, initLocalStream, setCurrentMeeting, setParticipants, addParticipant, removeParticipant, addMessage, initiateCall, closePeer]);

  useEffect(() => {
    setupMeeting();
    return () => {
      // Cleanup
    };
  }, []);

  // Sync audio/video tracks
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => { t.enabled = isAudioOn; });
      localStream.getVideoTracks().forEach(t => { t.enabled = isVideoOn; });
      if (socketRef.current) {
        socketRef.current.emit('media-state', { meetingId, audio: isAudioOn, video: isVideoOn });
      }
    }
  }, [isAudioOn, isVideoOn, localStream, meetingId]);

  const handleLeaveMeeting = useCallback(async () => {
    setLeaving(true);
    try {
      socketRef.current?.emit('leave-room', { meetingId });
      stopLocalStream();
      disconnectSocket();
      await meetingsAPI.end(meetingId!).catch(() => {});
      reset();
      navigate(`/meeting/${meetingId}/summary`);
    } catch {
      navigate('/dashboard');
    }
  }, [meetingId, stopLocalStream, reset, navigate]);

  const hasSidepanel = isChatOpen || isParticipantsOpen || isSettingsOpen;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-brand-400 mx-auto mb-3" />
          <p className="text-slate-400">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh', background: '#0d0d0f',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <MeetingTopBar meetingId={meetingId || ''} socket={socketRef.current} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <style>{`
          @media (max-width: 768px) {
            .meeting-sidepanel {
              position: absolute !important;
              top: 0 !important;
              bottom: 0 !important;
              right: 0 !important;
              width: 100% !important;
              height: 100% !important;
              z-index: 25 !important;
              border-left: none !important;
            }
          }
        `}</style>
        {/* Main video area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <VideoGrid remoteStreams={remoteStreams} />
          <MeetingControls
            meetingId={meetingId || ''}
            socket={socketRef.current}
            onLeave={handleLeaveMeeting}
          />
        </div>

        {/* Sidepanel */}
        {hasSidepanel && (
          <div className="meeting-sidepanel" style={{
            width: 320, flexShrink: 0,
            borderLeft: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', flexDirection: 'column',
            background: '#18181b',
            animation: 'slideInRight 0.22s ease-out both',
          }}>
            {isChatOpen && <ChatPanel meetingId={meetingId || ''} socket={socketRef.current} />}
            {isParticipantsOpen && <ParticipantsPanel />}
            {isSettingsOpen && <SettingsPanel />}
          </div>
        )}

        {/* Floating Reactions */}
        <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 20 }}>
          {reactions.map((r) => (
            <div
              key={r.id}
              style={{
                position: 'absolute', bottom: 96, left: `${r.x}%`,
                animation: 'reactionFloat 3.5s ease-out forwards',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 52, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))', userSelect: 'none' }}>{r.emoji}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '2px 10px' }}>
                  {r.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {leaving && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '32px 40px', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
            <Loader2 size={32} className="animate-spin text-brand-400 mx-auto mb-3" />
            <p style={{ color: '#fff', fontWeight: 600, margin: '12px 0 0', fontSize: 15 }}>Leaving meeting…</p>
          </div>
        </div>
      )}
    </div>
  );
}
