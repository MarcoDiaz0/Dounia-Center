import { instance as api } from "./api";

export const userService = {
  getUsers: async (params) => {
    const response = await api.get("/users", { params });
    return response.data.data.users;
  },

  updateProfile: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data.data.user;
  },

  changePassword: async (passwordData) => {
    const response = await api.put("/auth/password", passwordData);
    return response.data;
  },
};
