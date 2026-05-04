import { create } from 'zustand';
import { Meeting, Message, Participant } from '../types';

interface MeetingState {
  currentMeeting: Meeting | null;
  participants: Participant[];
  messages: Message[];
  isAudioOn: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  localStream: MediaStream | null;
  setCurrentMeeting: (meeting: Meeting | null) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (socketId: string) => void;
  addMessage: (message: Message) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  toggleChat: () => void;
  toggleParticipants: () => void;
  setLocalStream: (stream: MediaStream | null) => void;
  updateParticipantMedia: (socketId: string, audio?: boolean, video?: boolean) => void;
  reset: () => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  currentMeeting: null,
  participants: [],
  messages: [],
  isAudioOn: true,
  isVideoOn: true,
  isScreenSharing: false,
  isChatOpen: false,
  isParticipantsOpen: false,
  localStream: null,
  setCurrentMeeting: (meeting) => set({ currentMeeting: meeting }),
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) =>
    set((s) => ({ participants: [...s.participants.filter(p => p.socketId !== participant.socketId), participant] })),
  removeParticipant: (socketId) =>
    set((s) => ({ participants: s.participants.filter((p) => p.socketId !== socketId) })),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  toggleAudio: () => set((s) => ({ isAudioOn: !s.isAudioOn })),
  toggleVideo: () => set((s) => ({ isVideoOn: !s.isVideoOn })),
  toggleScreenShare: () => set((s) => ({ isScreenSharing: !s.isScreenSharing })),
  toggleChat: () => set((s) => ({ isChatOpen: !s.isChatOpen, isParticipantsOpen: false })),
  toggleParticipants: () => set((s) => ({ isParticipantsOpen: !s.isParticipantsOpen, isChatOpen: false })),
  setLocalStream: (stream) => set({ localStream: stream }),
  updateParticipantMedia: (socketId, audio, video) =>
    set((s) => ({
      participants: s.participants.map((p) =>
        p.socketId === socketId
          ? { ...p, ...(audio !== undefined && { audio }), ...(video !== undefined && { video }) }
          : p
      ),
    })),
  reset: () => set({
    currentMeeting: null, participants: [], messages: [],
    isAudioOn: true, isVideoOn: true, isScreenSharing: false,
    isChatOpen: false, isParticipantsOpen: false, localStream: null,
  }),
}));
