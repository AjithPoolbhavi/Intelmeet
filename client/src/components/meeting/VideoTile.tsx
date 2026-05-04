import { useEffect, useRef } from 'react';
import { Avatar } from '../ui/Avatar';
import { MicOff, VideoOff } from 'lucide-react';

interface VideoTileProps {
  stream: MediaStream | null | undefined;
  name: string;
  isLocal?: boolean;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  isSpeaking?: boolean;
}

export default function VideoTile({ stream, name, isLocal, audioEnabled = true, videoEnabled = true, isSpeaking }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative bg-surface-700 rounded-2xl overflow-hidden aspect-video flex items-center justify-center
      ${isSpeaking ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-surface-900' : ''}`}>
      {stream && videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          muted={isLocal}
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Avatar name={name} size="lg" />
          {!videoEnabled && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <VideoOff size={12} /> Camera off
            </span>
          )}
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white truncate">
            {name} {isLocal && '(You)'}
          </span>
          <div className="flex gap-1">
            {!audioEnabled && (
              <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                <MicOff size={12} className="text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {isSpeaking && (
        <div className="absolute top-2 right-2 flex gap-0.5 items-end h-4">
          {[2,4,3].map((h, i) => (
            <div key={i} className={`w-1 bg-brand-400 rounded-full animate-pulse`} style={{ height: `${h * 4}px`, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}
