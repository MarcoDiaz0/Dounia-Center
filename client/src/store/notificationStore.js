import { create } from "zustand";
import { instance } from "../services/api";

const extractError = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred"
  );
};

export const useNotificationStore = create((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  getNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await instance.get("notifications");
      set({ notifications: data.data.notifications, isLoading: false });
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await instance.patch(`notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
      }));
    } catch (error) {
      set({ error: extractError(error) });
    }
  },

  markAllAsRead: async () => {
    try {
      await instance.patch("notifications/read-all");
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));
    } catch (error) {
      set({ error: extractError(error) });
    }
  },
}));
