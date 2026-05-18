import { instance as api } from "./api";

export const userService = {
  updateProfile: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data.data.user;
  },

  changePassword: async (passwordData) => {
    const response = await api.put("/auth/password", passwordData);
    return response.data;
  },
};
