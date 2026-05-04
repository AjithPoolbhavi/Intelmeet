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
import MeetingTopBar from '../components/meeting/MeetingTopBar';
import { Loader2 } from 'lucide-react';

export default function MeetingPage() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const {
    setCurrentMeeting, setParticipants, addParticipant, removeParticipant,
    addMessage, isChatOpen, isParticipantsOpen, isAudioOn, isVideoOn,
    localStream, reset,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-brand-400 mx-auto mb-3" />
          <p className="text-slate-400">Joining meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-surface-900 flex flex-col overflow-hidden">
      <MeetingTopBar meetingId={meetingId || ''} socket={socketRef.current} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main video area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <VideoGrid remoteStreams={remoteStreams} />
          <MeetingControls
            meetingId={meetingId || ''}
            socket={socketRef.current}
            onLeave={handleLeaveMeeting}
          />
        </div>

        {/* Sidepanel */}
        {(isChatOpen || isParticipantsOpen) && (
          <div className="w-80 border-l border-surface-600 flex flex-col animate-slide-up bg-surface-800">
            {isChatOpen && (
              <ChatPanel meetingId={meetingId || ''} socket={socketRef.current} />
            )}
            {isParticipantsOpen && <ParticipantsPanel />}
          </div>
        )}
      </div>

      {leaving && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="glass-strong rounded-2xl p-8 text-center">
            <Loader2 size={32} className="animate-spin text-brand-400 mx-auto mb-3" />
            <p className="text-white font-medium">Leaving meeting...</p>
          </div>
        </div>
      )}
    </div>
  );
}
