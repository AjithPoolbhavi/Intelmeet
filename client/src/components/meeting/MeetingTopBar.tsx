import { useEffect, useState } from 'react';
import { Shield, Copy, Wifi, Users } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { useMeetingStore } from '../../store/meetingStore';
import toast from 'react-hot-toast';

export default function MeetingTopBar({ meetingId, socket }: { meetingId: string; socket: Socket | null }) {
  const { currentMeeting, participants, isRecording } = useMeetingStore();
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
      : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId);
    toast.success('Meeting ID copied!');
  };

  return (
    <div style={{
      height: 56,
      background: '#1c1c1e',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
      zIndex: 30,
    }}>

      {/* Left — Logo + Meeting info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
          }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '-0.5px' }}>IM</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>IntellMeet</span>
        </div>

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />

        {/* Meeting name + ID */}
        <div>
          <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13, lineHeight: 1.3, margin: 0 }}>
            {currentMeeting?.title || 'Meeting Room'}
          </p>
          <button
            onClick={copyMeetingId}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: 11, fontFamily: 'monospace',
              padding: 0, transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            {meetingId}
            <Copy size={9} />
          </button>
        </div>
      </div>

      {/* Center — Timer + REC */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isRecording && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
            borderRadius: 20, padding: '4px 12px',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#ef4444',
              display: 'inline-block',
              animation: 'pulse 1.2s ease-in-out infinite',
            }} />
            <span style={{ color: '#f87171', fontSize: 11, fontWeight: 700 }}>REC</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
            display: 'inline-block', animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {formatTime(elapsed)}
          </span>
        </div>
      </div>

      {/* Right — Status badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#22c55e', fontSize: 12 }}>
          <Wifi size={13} />
          <span style={{ color: '#94a3b8' }}>HD</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Shield size={13} style={{ color: '#22c55e' }} />
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Encrypted</span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 20, padding: '4px 10px',
        }}>
          <Users size={12} style={{ color: '#94a3b8' }} />
          <span style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600 }}>
            {participants.length + 1}
          </span>
        </div>
      </div>
    </div>
  );
}
