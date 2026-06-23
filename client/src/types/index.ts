export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Meeting {
  _id?: string;
  meetingId: string;
  title: string;
  host: string | User;
  hostName: string;
  status: 'scheduled' | 'active' | 'ended';
  startTime: string;
  endTime?: string;
  duration?: number;
  participants: Participant[];
  messages: Message[];
  summary?: string;
  actionItems?: string[];
  tags?: string[];
  createdAt: string;
}

export interface Participant {
  socketId: string;
  userId: string;
  name: string;
  stream?: MediaStream;
  audio?: boolean;
  video?: boolean;
  isLocal?: boolean;
  avatar?: string;
  status?: 'speaking' | 'idle' | 'disconnected';
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Task {
  _id: string;
  id?: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  owner?: string;
  assigneeName?: string;
  dueDate?: string;
  createdAt?: string;
}

export interface AISummaryResponse {
  summary: string;
  actionItems: string[];
  generatedAt: string;
  model: string;
  confidence: string;
}

export interface AISummary {
  summary: string;
  actionItems: string[];
  generatedAt: string;
  model: string;
  confidence?: string;
  keywords?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

// Premium Types
export interface UserProfile extends User {
  bio?: string;
  phone?: string;
  timezone?: string;
  preferences?: UserPreferences;
  createdAt?: string;
  updatedAt?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: boolean;
  emailDigest?: 'daily' | 'weekly' | 'off';
  autoJoinMeeting?: boolean;
  defaultMicState?: boolean;
  defaultCameraState?: boolean;
  virtualBackground?: string;
}

export interface MeetingAdvanced extends Meeting {
  maxParticipants?: number;
  recordingUrl?: string;
  isRecording?: boolean;
  waitingRoom?: Participant[];
  breakoutRooms?: BreakoutRoom[];
  isLocked?: boolean;
  allowScreenShare?: boolean;
  allowChat?: boolean;
  allowParticipantVideo?: boolean;
  meetingCode?: string;
  timezone?: string;
  recurrence?: MeetingRecurrence;
  customLayout?: 'grid' | 'speaker' | 'focus';
  backgroundImage?: string;
}

export interface BreakoutRoom {
  id: string;
  name: string;
  participants: Participant[];
  createdAt: string;
}

export interface MeetingRecurrence {
  frequency: 'daily' | 'weekly' | 'monthly';
  endDate?: string;
  interval?: number;
}

export interface MessageAdvanced extends Message {
  type?: 'text' | 'file' | 'system' | 'reaction';
  edited?: boolean;
  reactions?: Record<string, string[]>;
  replyTo?: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
}

export interface TaskAdvanced extends Task {
  watchers?: string[];
  comments?: Comment[];
  attachments?: Attachment[];
  timeEstimate?: number;
  timeLogged?: number;
  subtasks?: Task[];
  labels?: string[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  edited?: boolean;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  members: WorkspaceMember[];
  owner: string;
  createdAt: string;
  settings?: WorkspaceSettings;
}

export interface WorkspaceMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: string;
}

export interface WorkspaceSettings {
  isPublic?: boolean;
  allowMemberInvite?: boolean;
  defaultRole?: 'member' | 'guest';
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'meeting' | 'message' | 'mention' | 'task' | 'system';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  icon?: string;
}

export interface Analytics {
  totalMeetings: number;
  totalDuration: number;
  totalParticipants: number;
  averageParticipants: number;
  meetingTrend: { date: string; count: number }[];
  topParticipants: { name: string; count: number }[];
  mostActiveTimes: { hour: number; count: number }[];
}

export interface MeetingInsight {
  meetingId: string;
  transcripts: Transcript[];
  highlights: string[];
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    byParticipant: Record<string, string>;
  };
  topics: { topic: string; mentions: number }[];
  speakerStats: {
    speaker: string;
    speakingTime: number;
    wordsSpoken: number;
    turnCount: number;
  }[];
}

export interface Transcript {
  speaker: string;
  text: string;
  timestamp: number;
  confidence: number;
}

export interface ScheduleMeeting {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  invitees?: string[];
  meetingLink?: string;
  timezone?: string;
  recurrence?: MeetingRecurrence;
}

export interface TeamStats {
  totalMembers: number;
  activeMeetings: number;
  totalProjects: number;
  taskCompletion: number;
  productivity: number;
}

export interface MeetingQuality {
  videoQuality: 'excellent' | 'good' | 'fair' | 'poor';
  audioQuality: 'excellent' | 'good' | 'fair' | 'poor';
  networkStatus: 'strong' | 'stable' | 'unstable' | 'poor';
  latency: number;
  packetLoss: number;
  bandwidth: number;
}

export interface ScreenShare {
  userId: string;
  userName: string;
  startTime: string;
  stream?: MediaStream;
}
