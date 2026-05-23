import { instance } from "./api";

export const sessionService = {
  createSession: async (programId, phone, message) => {
    const { data } = await instance.post("sessions", {
      programId,
      phone,
      message,
    });
    return data.data.session;
  },

  getMySessions: async () => {
    const { data } = await instance.get("sessions/my");
    return data.data.sessions;
  },

  getAllSessions: async () => {
    const { data } = await instance.get("sessions");
    return data.data.sessions;
  },

  respondToSession: async (id, responseData) => {
    const { data } = await instance.put(`sessions/${id}/respond`, responseData);
    return data.data.session;
  },
};
