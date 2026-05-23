import { create } from "zustand";
import { sessionService } from "../services/sessionService";

const extractError = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "حدث خطأ غير متوقع"
  );
};

export const useSessionStore = create((set) => ({
  sessions: [],
  isLoading: false,
  error: null,

  createSession: async (programId, phone, message) => {
    try {
      set({ isLoading: true, error: null });
      const newSession = await sessionService.createSession(programId, phone, message);
      set((state) => ({
        sessions: [newSession, ...state.sessions],
        isLoading: false,
      }));
      return newSession;
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  fetchMySessions: async () => {
    try {
      set({ isLoading: true, error: null });
      const sessions = await sessionService.getMySessions();
      set({ sessions, isLoading: false });
      return sessions;
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  fetchAllSessions: async () => {
    try {
      set({ isLoading: true, error: null });
      const sessions = await sessionService.getAllSessions();
      set({ sessions, isLoading: false });
      return sessions;
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  respondToSession: async (id, responseData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedSession = await sessionService.respondToSession(id, responseData);
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? updatedSession : s)),
        isLoading: false,
      }));
      return updatedSession;
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
