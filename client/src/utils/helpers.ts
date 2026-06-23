// Format utilities
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isValidMeetingCode = (code: string): boolean => {
  return /^[A-Z0-9]{6,}$/.test(code);
};

// Quality indicators
export const getQualityColor = (quality: 'excellent' | 'good' | 'fair' | 'poor'): string => {
  switch (quality) {
    case 'excellent':
      return 'text-emerald-400';
    case 'good':
      return 'text-blue-400';
    case 'fair':
      return 'text-amber-400';
    case 'poor':
      return 'text-red-400';
  }
};

export const getQualityBg = (quality: 'excellent' | 'good' | 'fair' | 'poor'): string => {
  switch (quality) {
    case 'excellent':
      return 'bg-emerald-500/20';
    case 'good':
      return 'bg-blue-500/20';
    case 'fair':
      return 'bg-amber-500/20';
    case 'poor':
      return 'bg-red-500/20';
  }
};

// Meeting utilities
export const generateMeetingCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const isMeetingUpcoming = (startTime: string): boolean => {
  return new Date(startTime) > new Date();
};

export const isMeetingActive = (startTime: string, endTime?: string): boolean => {
  const now = new Date();
  const start = new Date(startTime);
  if (endTime) {
    const end = new Date(endTime);
    return now >= start && now <= end;
  }
  return now >= start;
};

export const isMeetingEnded = (endTime: string): boolean => {
  return new Date(endTime) < new Date();
};

// Analytics utilities
export const calculateAverageParticipants = (meetings: any[]): number => {
  if (meetings.length === 0) return 0;
  const total = meetings.reduce((sum, m) => sum + (m.participants?.length || 0), 0);
  return Math.round(total / meetings.length);
};

export const calculateTotalMeetingDuration = (meetings: any[]): number => {
  return meetings.reduce((sum, m) => sum + (m.duration || 0), 0);
};

export const calculateProductivityScore = (
  totalMeetings: number,
  totalDuration: number,
  tasksCompleted: number
): number => {
  const meetingScore = Math.min(totalMeetings * 10, 30);
  const durationScore = Math.min(totalDuration / 60, 30);
  const taskScore = Math.min(tasksCompleted * 10, 40);
  return Math.round((meetingScore + durationScore + taskScore) / 100 * 100);
};

// Notification utilities
export const getNotificationIcon = (type: string): React.ReactNode => {
  const icons: Record<string, string> = {
    meeting: '📅',
    message: '💬',
    mention: '👤',
    task: '✓',
    system: '⚙️',
  };
  return icons[type] || '📢';
};

// UI utilities
export const truncateText = (text: string, length: number = 50): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const getAvatarColor = (id: string): string => {
  const colors = [
    'from-red-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-purple-500 to-pink-500',
    'from-indigo-500 to-blue-500',
  ];
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Error handling
export class MeetingError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'MeetingError';
  }
}

export const handleMeetingError = (error: any): string => {
  if (error instanceof MeetingError) {
    const messages: Record<string, string> = {
      INVALID_CODE: 'Invalid meeting code',
      MEETING_FULL: 'Meeting is full',
      MEETING_ENDED: 'Meeting has ended',
      UNAUTHORIZED: 'You do not have permission to join',
      NETWORK_ERROR: 'Network connection error',
    };
    return messages[error.code] || error.message;
  }
  return 'An unexpected error occurred';
};

// Performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Storage utilities
export const getFromStorage = <T>(key: string, defaultValue?: T): T | undefined => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from storage:', error);
  }
};
