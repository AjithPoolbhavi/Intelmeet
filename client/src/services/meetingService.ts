import api from './api';
import { Meeting, AISummary } from '../types';

export const createMeeting = async (title: string): Promise<Meeting> => {
  const { data } = await api.post('/meetings/create', { title });
  return data;
};

export const getMeeting = async (id: string): Promise<Meeting> => {
  const { data } = await api.get(`/meetings/${id}`);
  return data;
};

export const getUserMeetings = async (userId: string): Promise<Meeting[]> => {
  const { data } = await api.get(`/meetings/user/${userId}`);
  return data;
};

export const endMeeting = async (id: string): Promise<Meeting> => {
  const { data } = await api.patch(`/meetings/${id}/end`);
  return data;
};

export const generateAISummary = async (
  meetingId: string, duration: number, participantCount: number
): Promise<AISummary> => {
  const { data } = await api.post('/ai/summary', { meetingId, duration, participantCount });
  return data;
};
