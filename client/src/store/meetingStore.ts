import { create } from 'zustand';
import { Meeting, Message, Participant } from '../types';

export interface Reaction {
  id: string;
  emoji: string;
  name: string;
  x: number;
}

interface MeetingState {
  currentMeeting: Meeting | null;
  participants: Participant[];
  messages: Message[];
  isAudioOn: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  isParticipantsOpen: boolean;
  isHandRaised: boolean;
  isRecording: boolean;
  isSettingsOpen: boolean;
  localStream: MediaStream | null;
  unreadMessages: number;
  reactions: Reaction[];

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
  toggleHand: () => void;
  toggleRecording: () => void;
  toggleSettings: () => void;
  setLocalStream: (stream: MediaStream | null) => void;
  updateParticipantMedia: (socketId: string, audio?: boolean, video?: boolean) => void;
  addReaction: (reaction: Reaction) => void;
  removeReaction: (id: string) => void;
  clearUnread: () => void;
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
  isHandRaised: false,
  isRecording: false,
  isSettingsOpen: false,
  localStream: null,
  unreadMessages: 0,
  reactions: [],

  setCurrentMeeting: (meeting) => set({ currentMeeting: meeting }),
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) =>
    set((s) => ({ participants: [...s.participants.filter(p => p.socketId !== participant.socketId), participant] })),
  removeParticipant: (socketId) =>
    set((s) => ({ participants: s.participants.filter((p) => p.socketId !== socketId) })),
  addMessage: (message) =>
    set((s) => ({
      messages: [...s.messages, message],
      unreadMessages: s.isChatOpen ? s.unreadMessages : s.unreadMessages + 1,
    })),
  toggleAudio: () => set((s) => ({ isAudioOn: !s.isAudioOn })),
  toggleVideo: () => set((s) => ({ isVideoOn: !s.isVideoOn })),
  toggleScreenShare: () => set((s) => ({ isScreenSharing: !s.isScreenSharing })),
  toggleChat: () =>
    set((s) => ({
      isChatOpen: !s.isChatOpen,
      isParticipantsOpen: false,
      isSettingsOpen: false,
      unreadMessages: 0,
    })),
  toggleParticipants: () =>
    set((s) => ({
      isParticipantsOpen: !s.isParticipantsOpen,
      isChatOpen: false,
      isSettingsOpen: false,
    })),
  toggleHand: () => set((s) => ({ isHandRaised: !s.isHandRaised })),
  toggleRecording: () => set((s) => ({ isRecording: !s.isRecording })),
  toggleSettings: () =>
    set((s) => ({
      isSettingsOpen: !s.isSettingsOpen,
      isChatOpen: false,
      isParticipantsOpen: false,
    })),
  setLocalStream: (stream) => set({ localStream: stream }),
  updateParticipantMedia: (socketId, audio, video) =>
    set((s) => ({
      participants: s.participants.map((p) =>
        p.socketId === socketId
          ? { ...p, ...(audio !== undefined && { audio }), ...(video !== undefined && { video }) }
          : p
      ),
    })),
  addReaction: (reaction) =>
    set((s) => ({ reactions: [...s.reactions, reaction] })),
  removeReaction: (id) =>
    set((s) => ({ reactions: s.reactions.filter((r) => r.id !== id) })),
  clearUnread: () => set({ unreadMessages: 0 }),
  reset: () =>
    set({
      currentMeeting: null,
      participants: [],
      messages: [],
      isAudioOn: true,
      isVideoOn: true,
      isScreenSharing: false,
      isChatOpen: false,
      isParticipantsOpen: false,
      isHandRaised: false,
      isRecording: false,
      isSettingsOpen: false,
      localStream: null,
      unreadMessages: 0,
      reactions: [],
    }),
}));
