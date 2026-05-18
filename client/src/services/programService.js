import { instance } from "./api";

export const programService = {
  getPrograms: async () => {
    const { data } = await instance.get("programs");
    return data.data.programs;
  },

  createProgram: async (programData) => {
    const { data } = await instance.post("programs", programData);
    return data.data.program;
  },

  updateProgram: async (id, programData) => {
    const { data } = await instance.put(`programs/${id}`, programData);
    return data.data.program;
  },

  deleteProgram: async (id) => {
    const { data } = await instance.delete(`programs/${id}`);
    return data;
  },
};
