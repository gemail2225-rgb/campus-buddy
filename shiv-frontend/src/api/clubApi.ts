// src/api/clubApi.ts
import API_URL, { getHeaders } from './config';

// ==================== Types ====================

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  registeredCount: number;
  max: number;
  registerBy: string;
  type: string;
  club: { _id: string; name: string };
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  club: { _id: string; name: string };
  pinned: boolean;
  priority: 'Low' | 'Medium' | 'High';
  views: number;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  user: { _id: string; name: string };
  text: string;
  date: string;
}

// ==================== Events ====================

export const fetchEvents = async (user?: { id: string; role: string }): Promise<Event[]> => {
  const res = await fetch(`${API_URL}/events`, { headers: getHeaders(user) });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
};

export const createEvent = async (data: Partial<Event>, user?: { id: string; role: string }): Promise<Event> => {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: getHeaders(user),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
};

export const updateEvent = async (id: string, data: Partial<Event>, user?: { id: string; role: string }): Promise<Event> => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: getHeaders(user),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update event');
  return res.json();
};

export const deleteEvent = async (id: string, user?: { id: string; role: string }): Promise<{ msg: string }> => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: getHeaders(user),
  });
  if (!res.ok) throw new Error('Failed to delete event');
  return res.json();
};

// ==================== Announcements ====================

export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  const res = await fetch(`${API_URL}/announcements`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch announcements');
  return res.json();
};

export const createAnnouncement = async (data: Partial<Announcement>): Promise<Announcement> => {
  const res = await fetch(`${API_URL}/announcements`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create announcement');
  return res.json();
};

export const updateAnnouncement = async (id: string, data: Partial<Announcement>): Promise<Announcement> => {
  const res = await fetch(`${API_URL}/announcements/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update announcement');
  return res.json();
};

export const deleteAnnouncement = async (id: string): Promise<{ msg: string }> => {
  const res = await fetch(`${API_URL}/announcements/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete announcement');
  return res.json();
};

export const addComment = async (announcementId: string, text: string): Promise<Comment[]> => {
  const res = await fetch(`${API_URL}/announcements/${announcementId}/comments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
};