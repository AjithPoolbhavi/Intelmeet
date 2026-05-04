import { useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useMeetingStore } from '../store/meetingStore';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = (socket: Socket | null, meetingId: string, userName: string) => {
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const { localStream, setLocalStream, addParticipant, removeParticipant, updateParticipantMedia } = useMeetingStore();

  const initLocalStream = useCallback(async (audio = true, video = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio, video });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.warn('Could not get media:', err);
      // Return empty stream for demo purposes
      const emptyStream = new MediaStream();
      setLocalStream(emptyStream);
      return emptyStream;
    }
  }, [setLocalStream]);

  const createPeerConnection = useCallback((targetId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.onicecandidate = (e) => {
      if (e.candidate && socket) {
        socket.emit('ice-candidate', { targetId, candidate: e.candidate });
      }
    };

    pc.ontrack = (e) => {
      const remoteStream = e.streams[0];
      remoteStreamsRef.current.set(targetId, remoteStream);
      updateParticipantMedia(targetId, true, true);
    };

    peersRef.current.set(targetId, pc);
    return pc;
  }, [socket, updateParticipantMedia]);

  const initiateCall = useCallback(async (targetId: string, stream: MediaStream) => {
    const pc = createPeerConnection(targetId, stream);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket?.emit('offer', { targetId, offer, fromName: userName });
  }, [createPeerConnection, socket, userName]);

  const closePeer = useCallback((socketId: string) => {
    const pc = peersRef.current.get(socketId);
    if (pc) {
      pc.close();
      peersRef.current.delete(socketId);
    }
    remoteStreamsRef.current.delete(socketId);
    removeParticipant(socketId);
  }, [removeParticipant]);

  const stopLocalStream = useCallback(() => {
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    peersRef.current.forEach((pc) => pc.close());
    peersRef.current.clear();
  }, [localStream, setLocalStream]);

  useEffect(() => {
    if (!socket) return;

    socket.on('offer', async ({ fromId, offer, fromName }) => {
      const stream = useMeetingStore.getState().localStream || new MediaStream();
      const pc = createPeerConnection(fromId, stream);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { targetId: fromId, answer });
      addParticipant({ socketId: fromId, userId: fromId, name: fromName, audio: true, video: true });
    });

    socket.on('answer', async ({ fromId, answer }) => {
      const pc = peersRef.current.get(fromId);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', async ({ fromId, candidate }) => {
      const pc = peersRef.current.get(fromId);
      if (pc) {
        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch(e) {}
      }
    });

    socket.on('participant-media-state', ({ socketId, audio, video }) => {
      updateParticipantMedia(socketId, audio, video);
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('participant-media-state');
    };
  }, [socket, createPeerConnection, addParticipant, updateParticipantMedia]);

  return {
    initLocalStream,
    initiateCall,
    closePeer,
    stopLocalStream,
    remoteStreams: remoteStreamsRef.current,
  };
};
