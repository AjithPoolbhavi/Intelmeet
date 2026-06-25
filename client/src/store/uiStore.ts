import { create } from 'zustand';

export type Theme = 'dark' | 'light' | 'auto';
export type NotificationLevel = 'all' | 'important' | 'none';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('intellmeet-theme') as Theme) || 'dark',
  isDark: true,
  setTheme: (theme) => {
    localStorage.setItem('intellmeet-theme', theme);
    const root = window.document.documentElement;
    if (
      theme === 'dark' ||
      (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('intellmeet-theme', nextTheme);
      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      return { theme: nextTheme };
    });
  },
}));

interface PreferencesState {
  autoJoinMeeting: boolean;
  defaultMicState: boolean;
  defaultCameraState: boolean;
  notificationLevel: NotificationLevel;
  emailNotifications: boolean;
  screenShareQuality: 'high' | 'medium' | 'low';
  videoQuality: 'high' | 'medium' | 'low';
  audioQuality: 'high' | 'medium' | 'low';
  enableNoiseSuppression: boolean;
  enableVideoBackground: boolean;
  enableLiveCaption: boolean;
  setPreference: (key: string, value: any) => void;
  getPreferences: () => any;
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  autoJoinMeeting: JSON.parse(localStorage.getItem('prefs-autoJoin') || 'false'),
  defaultMicState: JSON.parse(localStorage.getItem('prefs-defaultMic') || 'true'),
  defaultCameraState: JSON.parse(localStorage.getItem('prefs-defaultCamera') || 'true'),
  notificationLevel: (localStorage.getItem('prefs-notifLevel') as NotificationLevel) || 'all',
  emailNotifications: JSON.parse(localStorage.getItem('prefs-emailNotif') || 'true'),
  screenShareQuality: (localStorage.getItem('prefs-screenQuality') as any) || 'high',
  videoQuality: (localStorage.getItem('prefs-videoQuality') as any) || 'high',
  audioQuality: (localStorage.getItem('prefs-audioQuality') as any) || 'high',
  enableNoiseSuppression: JSON.parse(localStorage.getItem('prefs-noiseSuppression') || 'true'),
  enableVideoBackground: JSON.parse(localStorage.getItem('prefs-videoBackground') || 'false'),
  enableLiveCaption: JSON.parse(localStorage.getItem('prefs-liveCaption') || 'true'),

  setPreference: (key, value) => {
    localStorage.setItem(`prefs-${key}`, JSON.stringify(value));
    set({ [key]: value } as any);
  },

  getPreferences: () => get(),
}));

interface UIState {
  sidebarOpen: boolean;
  showChat: boolean;
  showParticipants: boolean;
  showMeetingDetails: boolean;
  showSettings: boolean;
  fullscreenVideoId?: string;
  isRecording: boolean;
  toggleSidebar: () => void;
  toggleChat: () => void;
  toggleParticipants: () => void;
  toggleMeetingDetails: () => void;
  toggleSettings: () => void;
  setFullscreen: (videoId?: string) => void;
  setRecording: (isRecording: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  showChat: false,
  showParticipants: false,
  showMeetingDetails: false,
  showSettings: false,
  fullscreenVideoId: undefined,
  isRecording: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
  toggleParticipants: () => set((state) => ({ showParticipants: !state.showParticipants })),
  toggleMeetingDetails: () => set((state) => ({ showMeetingDetails: !state.showMeetingDetails })),
  toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
  setFullscreen: (videoId) => set({ fullscreenVideoId: videoId }),
  setRecording: (isRecording) => set({ isRecording }),
}));

interface NotificationItem {
  id: string;
  type: 'meeting' | 'message' | 'mention' | 'task' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      notifications: [
        {
          ...notification,
          id,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    }));
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));

interface AnalyticsState {
  sessionStartTime?: Date;
  meetingDuration: number;
  participantCount: number;
  totalMessages: number;
  startSession: () => void;
  incrementMeetingDuration: () => void;
  setParticipantCount: (count: number) => void;
  incrementMessages: () => void;
  getSessionStats: () => any;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  sessionStartTime: undefined,
  meetingDuration: 0,
  participantCount: 0,
  totalMessages: 0,
  startSession: () => set({ sessionStartTime: new Date() }),
  incrementMeetingDuration: () =>
    set((state) => ({ meetingDuration: state.meetingDuration + 1 })),
  setParticipantCount: (count) => set({ participantCount: count }),
  incrementMessages: () =>
    set((state) => ({ totalMessages: state.totalMessages + 1 })),
  getSessionStats: () => {
    const state = get();
    return {
      duration: state.meetingDuration,
      participants: state.participantCount,
      messages: state.totalMessages,
      startTime: state.sessionStartTime,
    };
  },
}));
