import { create } from "zustand";
import { persist } from "zustand/middleware";
import { instance } from "../services/api";

const extractError = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred"
  );
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setLoading: (loading) => set({ isLoading: loading }),

      // LOGIN
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const { data } = await instance.post("auth/login", credentials);
          set({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return data;
        } catch (error) {
          const message = extractError(error);
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // SIGNUP
      signup: async (userData) => {
        try {
          set({ isLoading: true, error: null });

          const { data } = await instance.post("auth/register", userData);

          set({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return data;
        } catch (error) {
          const message = extractError(error);

          set({
            error:
              typeof message === "string" ? message : JSON.stringify(message),
            isLoading: false,
          });
          throw error;
        }
      },

      // LOGOUT
      logout: async () => {
        try {
          set({ isLoading: true });
          await instance.post("auth/logout");
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null, // Clear errors on logout
          });
        } catch (error) {
          set({ isLoading: false, error: extractError(error) });
          throw error;
        }
      },

      // CHECK SESSION
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const { data } = await instance.get("auth/me");
          set({
            user: data.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "dounia-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
