import { instance as api } from "./api";

export const settingsService = {
  getSettings: async () => {
    const response = await api.get("/settings");
    return response.data.data;
  },

  updateSettings: async (settingsObj) => {
    const response = await api.post("/settings", settingsObj);
    return response.data.data;
  },
};
