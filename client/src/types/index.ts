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
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Task {
  _id?: string;
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
