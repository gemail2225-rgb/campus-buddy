// src/api/clubApi.js
import API_URL, { getHeaders } from './config';

export const fetchEvents = async () => {
  const res = await fetch(`${API_URL}/events`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
};

export const createEvent = async (eventData) => {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
};

export const updateEvent = async (id, eventData) => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error('Failed to update event');
  return res.json();
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete event');
  return res.json();
};

// Announcements
export const fetchAnnouncements = async () => {
  const res = await fetch(`${API_URL}/announcements`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch announcements');
  return res.json();
};

export const createAnnouncement = async (data) => {
  const res = await fetch(`${API_URL}/announcements`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create announcement');
  return res.json();
};

export const updateAnnouncement = async (id, data) => {
  const res = await fetch(`${API_URL}/announcements/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update announcement');
  return res.json();
};

export const deleteAnnouncement = async (id) => {
  const res = await fetch(`${API_URL}/announcements/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete announcement');
  return res.json();
};

export const addComment = async (announcementId, text) => {
  const res = await fetch(`${API_URL}/announcements/${announcementId}/comments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
};