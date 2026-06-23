import { useRef, useEffect, useState, CSSProperties } from 'react';
import { MicOff, VideoOff, Pin, MoreVertical, Crown, Wifi } from 'lucide-react';
import { useMeetingStore } from '../../store/meetingStore';
import { useAuthStore } from '../../store/authStore';

const GRADIENTS = [
  ['#7c3aed', '#4f46e5'],  // violet-indigo
  ['#0891b2', '#1d4ed8'],  // cyan-blue
  ['#059669', '#0d9488'],  // emerald-teal
  ['#e11d48', '#db2777'],  // rose-pink
  ['#d97706', '#ea580c'],  // amber-orange
  ['#9333ea', '#7c3aed'],  // purple-violet
];
function getGradient(name: string) {
  return GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];
}
function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function VideoTile({
  stream, name, isLocal = false, isMuted = false,
  isVideoOff = false, isScreenSharing = false, isHost = false,
}: {
  stream: MediaStream | null; name: string;
  isLocal?: boolean; isMuted?: boolean;
  isVideoOff?: boolean; isScreenSharing?: boolean; isHost?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  const hasVideo = stream && stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled && !isVideoOff;
  const [g1, g2] = getGradient(name || '?');
  const initials = getInitials(name);

  const tileStyle: CSSProperties = {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    background: '#1a1a1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'box-shadow 0.2s, border-color 0.2s',
    border: isScreenSharing
      ? '2px solid #10b981'
      : hover ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.05)',
    boxShadow: isScreenSharing
      ? '0 0 0 2px #10b981, 0 0 32px rgba(16,185,129,0.2)'
      : hover ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
    cursor: 'default',
  };

  return (
    <div
      style={tileStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setShowMenu(false); }}
    >
      {/* Video or Avatar */}
      {hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at center, #1e1e28 0%, #0e0e12 100%)',
          position: 'relative',
        }}>
          {/* Glow blob */}
          <div style={{
            position: 'absolute', width: 140, height: 140, borderRadius: '50%',
            background: `radial-gradient(circle, ${g1}40, transparent)`,
            filter: 'blur(32px)', animation: 'pulseSlow 3s ease-in-out infinite',
          }} />
          {/* Avatar */}
          <div style={{
            position: 'relative',
            width: 72, height: 72, borderRadius: '50%',
            background: `linear-gradient(135deg, ${g1}, ${g2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 24px ${g1}66`,
            border: '3px solid rgba(255,255,255,0.08)',
          }}>
            <span style={{ color: '#fff', fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px', userSelect: 'none' }}>
              {initials}
            </span>
          </div>
          <span style={{ color: '#64748b', fontSize: 13, marginTop: 12, fontWeight: 500, position: 'relative' }}>
            {name}
          </span>
        </div>
      )}

      {/* Bottom gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 40%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Top-right hover controls */}
      {hover && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          display: 'flex', gap: 6, zIndex: 10,
          animation: 'fadeIn 0.15s ease-out',
        }}>
          {!isLocal && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 8px' }}>
              <Wifi size={11} style={{ color: '#22c55e' }} />
            </div>
          )}
          <button
            style={{
              width: 28, height: 28, borderRadius: 8, border: 'none',
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
              color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.12s',
            }}
            title="Pin"
          >
            <Pin size={13} />
          </button>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(v => !v)}
              style={{
                width: 28, height: 28, borderRadius: 8, border: 'none',
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="More"
            >
              <MoreVertical size={13} />
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 4,
                background: '#2a2a2e', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                overflow: 'hidden', zIndex: 20, minWidth: 130,
                animation: 'fadeIn 0.12s ease-out',
              }}>
                {['Spotlight', 'Hide tile', !isLocal && 'Remove'].filter(Boolean).map((item) => (
                  <button
                    key={item as string}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '8px 14px', fontSize: 12, background: 'transparent',
                      border: 'none', cursor: 'pointer', color: (item === 'Remove') ? '#f87171' : '#cbd5e1',
                      fontFamily: 'inherit', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Screen share badge */}
      {isScreenSharing && (
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.5)',
          borderRadius: 20, padding: '3px 10px',
          color: '#34d399', fontSize: 11, fontWeight: 600,
        }}>
          Sharing
        </div>
      )}

      {/* Bottom name bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px 10px', zIndex: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
          {isMuted && (
            <span style={{
              width: 20, height: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <MicOff size={10} style={{ color: '#fff' }} />
            </span>
          )}
          {isVideoOff && (
            <span style={{
              width: 20, height: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <VideoOff size={10} style={{ color: '#fff' }} />
            </span>
          )}
          <span style={{
            color: '#fff', fontSize: 12, fontWeight: 600,
            textShadow: '0 1px 4px rgba(0,0,0,0.8)', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name}{isLocal ? ' (You)' : ''}
          </span>
          {isHost && <Crown size={11} style={{ color: '#fbbf24', flexShrink: 0 }} />}
        </div>
      </div>
    </div>
  );
}

/* Grid layouts */
const GRID_STYLES: Record<number, CSSProperties> = {
  1: { gridTemplateColumns: '1fr' },
  2: { gridTemplateColumns: 'repeat(2, 1fr)' },
  3: { gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)' },
  4: { gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)' },
};

export default function VideoGrid({ remoteStreams }: { remoteStreams: Map<string, MediaStream> }) {
  const { user } = useAuthStore();
  const { localStream, participants, isAudioOn, isVideoOn, isScreenSharing } = useMeetingStore();
  const totalCount = participants.length + 1;
  const gridLayout = GRID_STYLES[Math.min(totalCount, 4)] ?? { gridTemplateColumns: 'repeat(3, 1fr)' };

  return (
    <div style={{
      flex: 1,
      display: 'grid',
      gap: 8,
      padding: 12,
      overflow: 'hidden',
      background: '#0d0d0f',
      ...gridLayout,
    }}>
      <VideoTile
        stream={localStream}
        name={user?.name || 'You'}
        isLocal
        isHost
        isMuted={!isAudioOn}
        isVideoOff={!isVideoOn}
        isScreenSharing={isScreenSharing}
      />
      {participants.map((p) => (
        <VideoTile
          key={p.socketId}
          stream={remoteStreams.get(p.socketId) || null}
          name={p.name}
          isMuted={p.audio === false}
          isVideoOff={p.video === false}
        />
      ))}
    </div>
  );
}
