import { useRef, useEffect } from 'react';
import { MicOff, VideoOff, User } from 'lucide-react';
import { useMeetingStore } from '../../store/meetingStore';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx';

function VideoTile({
  stream, name, isLocal = false, isMuted = false, isVideoOff = false, isScreenSharing = false
}: {
  stream: MediaStream | null; name: string; isLocal?: boolean;
  isMuted?: boolean; isVideoOff?: boolean; isScreenSharing?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideoTrack = stream && stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled;

  return (
    <div className={clsx(
      'relative rounded-xl overflow-hidden bg-surface-700 flex items-center justify-center group',
      isScreenSharing && 'ring-2 ring-brand-500'
    )}>
      {(hasVideoTrack && !isVideoOff) ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">
              {name?.charAt(0)?.toUpperCase() || <User size={28} />}
            </span>
          </div>
          <span className="text-slate-400 text-sm">{name}</span>
        </div>
      )}

      {/* Name badge */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
        {isMuted && <MicOff size={12} className="text-red-400" />}
        {isVideoOff && <VideoOff size={12} className="text-red-400" />}
        <span className="text-white text-xs font-medium">{name}{isLocal ? ' (You)' : ''}</span>
      </div>

      {isScreenSharing && (
        <div className="absolute top-2 left-2 bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
          Sharing Screen
        </div>
      )}
    </div>
  );
}

export default function VideoGrid({ remoteStreams }: { remoteStreams: Map<string, MediaStream> }) {
  const { user } = useAuthStore();
  const { localStream, participants, isAudioOn, isVideoOn, isScreenSharing } = useMeetingStore();

  const totalCount = participants.length + 1;

  const gridClass = clsx(
    'flex-1 grid gap-2 p-3 overflow-hidden',
    totalCount === 1 && 'grid-cols-1',
    totalCount === 2 && 'grid-cols-2',
    totalCount === 3 && 'grid-cols-2',
    totalCount === 4 && 'grid-cols-2',
    totalCount >= 5 && 'grid-cols-3',
  );

  return (
    <div className={gridClass}>
      {/* Local stream */}
      <VideoTile
        stream={localStream}
        name={user?.name || 'You'}
        isLocal
        isMuted={!isAudioOn}
        isVideoOff={!isVideoOn}
        isScreenSharing={isScreenSharing}
      />

      {/* Remote streams */}
      {participants.map((participant) => (
        <VideoTile
          key={participant.socketId}
          stream={remoteStreams.get(participant.socketId) || null}
          name={participant.name}
          isMuted={participant.audio === false}
          isVideoOff={participant.video === false}
        />
      ))}
    </div>
  );
}
