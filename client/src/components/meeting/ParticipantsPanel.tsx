import { useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Crown, Search, UserPlus, MoreHorizontal, Hand } from 'lucide-react';
import { useMeetingStore } from '../../store/meetingStore';
import { useAuthStore } from '../../store/authStore';

const GRADIENTS = [
  ['#7c3aed', '#4f46e5'],
  ['#0891b2', '#1d4ed8'],
  ['#059669', '#0d9488'],
  ['#e11d48', '#db2777'],
  ['#d97706', '#ea580c'],
  ['#9333ea', '#7c3aed'],
];
function getGradient(name: string) {
  return GRADIENTS[name?.charCodeAt(0) % GRADIENTS.length] || GRADIENTS[0];
}
function getInitials(name: string) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

export default function ParticipantsPanel() {
  const { participants, toggleParticipants, isHandRaised } = useMeetingStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');

  const allParticipants = [
    { socketId: 'local', userId: user?.id || '', name: user?.name || 'You', audio: true, video: true, isLocal: true },
    ...participants,
  ].filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#18181b' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
      }}>
        <div>
          <p style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14, margin: 0 }}>Participants</p>
          <p style={{ color: '#64748b', fontSize: 11, margin: '2px 0 0' }}>{allParticipants.length} in this call</p>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            title="Invite"
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none',
              background: 'rgba(99,102,241,0.12)', color: '#818cf8',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <UserPlus size={14} />
          </button>
          <button
            onClick={toggleParticipants}
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none',
              background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search participants…"
            style={{
              width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, color: '#e2e8f0', fontSize: 12, fontFamily: 'inherit', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Participant list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {allParticipants.length === 0 && (
          <p style={{ color: '#64748b', fontSize: 12, textAlign: 'center', padding: 24 }}>No participants found</p>
        )}
        {allParticipants.map(p => {
          const [g1, g2] = getGradient(p.name || '?');
          const initials = getInitials(p.name);
          return (
            <div
              key={p.socketId}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 12, transition: 'background 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${g1}, ${g2})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 13, fontWeight: 700,
                  boxShadow: `0 2px 10px ${g1}55`,
                }}>
                  {initials}
                </div>
                <span style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#22c55e', border: '2px solid #18181b',
                }} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name} {p.isLocal && <span style={{ color: '#64748b', fontWeight: 400 }}>(You)</span>}
                  </span>
                  {p.isLocal && <Crown size={10} style={{ color: '#fbbf24', flexShrink: 0 }} />}
                  {isHandRaised && p.isLocal && <Hand size={10} style={{ color: '#fbbf24', flexShrink: 0 }} />}
                </div>
                <span style={{ color: '#64748b', fontSize: 11 }}>
                  {p.isLocal ? 'Host' : 'Participant'}
                </span>
              </div>

              {/* Media status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: p.audio === false ? 'rgba(239,68,68,0.18)' : 'rgba(34,197,94,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.audio === false
                    ? <MicOff size={11} style={{ color: '#f87171' }} />
                    : <Mic size={11} style={{ color: '#4ade80' }} />
                  }
                </span>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: p.video === false ? 'rgba(239,68,68,0.18)' : 'rgba(34,197,94,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.video === false
                    ? <VideoOff size={11} style={{ color: '#f87171' }} />
                    : <Video size={11} style={{ color: '#4ade80' }} />
                  }
                </span>
                {!p.isLocal && (
                  <button style={{
                    width: 24, height: 24, borderRadius: '50%', border: 'none',
                    background: 'transparent', color: '#64748b', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MoreHorizontal size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: 8, padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <button style={{
          flex: 1, padding: '9px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)',
          background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
        >
          Mute All
        </button>
        <button style={{
          flex: 1, padding: '9px 0', borderRadius: 10,
          border: '1px solid rgba(99,102,241,0.35)',
          background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.22)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.12)'}
        >
          Invite
        </button>
      </div>
    </div>
  );
}
