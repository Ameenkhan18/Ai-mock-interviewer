import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const startInterview = async (userId, role, difficulty) => {
  const { data } = await api.post('/interview/start', { userId, role, difficulty });
  return data;
};

export const submitAnswer = async (sessionId, question, answer) => {
  const { data } = await api.post(`/interview/${sessionId}/answer`, { question, answer });
  return data;
};

export const getSession = async (sessionId) => {
  const { data } = await api.get(`/interview/${sessionId}`);
  return data;
};

export const getHistory = async (userId) => {
  const { data } = await api.get(`/interview/history/${userId}`);
  return data;
};

export const deleteSession = async (sessionId) => {
  const { data } = await api.delete(`/interview/${sessionId}`);
  return data;
};

export default api;
