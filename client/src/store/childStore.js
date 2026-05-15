import { create } from "zustand";
import { instance } from "../services/api";

const extractError = (error) => {
  return (
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred"
  );
};

export const useChildStore = create((set, get) => ({
  children: [],
  selectedChild: null,
  isLoading: false,
  error: null,

  // ─────────────────────────────────────────
  // CHILDREN
  // ─────────────────────────────────────────

  getChildren: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await instance.get("children");
      set({ children: data.data.children, isLoading: false });
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  getChildById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await instance.get(`children/${id}`);
      set({ selectedChild: data.data.child, isLoading: false });
      return data.data.child;
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  createChild: async (childData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await instance.post("children", childData);
      
      set((state) => ({
        children: [data.data.child, ...state.children],
        isLoading: false,
      }));
      return data.data.child;
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  updateChild: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await instance.put(`children/${id}`, updates);
      set((state) => ({
        children: state.children.map((c) =>
          c._id === id ? data.data.child : c,
        ),
        selectedChild:
          state.selectedChild?._id === id
            ? data.data.child
            : state.selectedChild,
        isLoading: false,
      }));
      return data.data.child;
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  deleteChild: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await instance.delete(`children/${id}`);
      set((state) => ({
        children: state.children.filter((c) => c._id !== id),
        selectedChild:
          state.selectedChild?._id === id ? null : state.selectedChild,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  // ─────────────────────────────────────────
  // MILESTONES
  // ─────────────────────────────────────────

  addMilestone: async (childId, milestoneData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await instance.post(
        `children/${childId}/milestones`,
        milestoneData,
      );
      set((state) => ({
        children: state.children.map((c) =>
          c._id === childId ? data.data.child : c,
        ),
        selectedChild:
          state.selectedChild?._id === childId
            ? data.data.child
            : state.selectedChild,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  // ─────────────────────────────────────────
  // PROGRAMS
  // ─────────────────────────────────────────

  enrollProgram: async (childId, programId) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await instance.post(`children/${childId}/programs`, {
        programId,
      });
      set((state) => ({
        selectedChild:
          state.selectedChild?._id === childId
            ? {
                ...state.selectedChild,
                enrolledPrograms: data.data.enrolledPrograms,
              }
            : state.selectedChild,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  unenrollProgram: async (childId, programId) => {
    try {
      set({ isLoading: true, error: null });
      await instance.delete(`children/${childId}/programs/${programId}`);
      set((state) => ({
        selectedChild:
          state.selectedChild?._id === childId
            ? {
                ...state.selectedChild,
                enrolledPrograms: state.selectedChild.enrolledPrograms.filter(
                  (p) => p._id !== programId,
                ),
              }
            : state.selectedChild,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  // ─────────────────────────────────────────
  // ASSESSMENTS
  // ─────────────────────────────────────────
  addAssessment: async (childId, assessmentData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await instance.post(
        `children/${childId}/assessments`,
        assessmentData,
      );
      set((state) => ({
        selectedChild:
          state.selectedChild?._id === childId
            ? {
                ...state.selectedChild,
                assessments: [
                  ...state.selectedChild.assessments,
                  data.data.assessment,
                ],
              }
            : state.selectedChild,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  deleteAssessment: async (childId, assessmentId) => {
    try {
      set({ isLoading: true, error: null });
      await instance.delete(`children/${childId}/assessments/${assessmentId}`);
      set((state) => ({
        selectedChild:
          state.selectedChild?._id === childId
            ? {
                ...state.selectedChild,
                assessments: state.selectedChild.assessments.filter(
                  (a) => a._id !== assessmentId,
                ),
              }
            : state.selectedChild,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },


  // ─────────────────────────────────────────
  // NOTES
  // ─────────────────────────────────────────

  addNote: async (childId, noteData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await instance.post(
        `children/${childId}/notes`,
        noteData,
      );
      set((state) => ({
        selectedChild:
          state.selectedChild?._id === childId
            ? {
                ...state.selectedChild,
                notes: [...state.selectedChild.notes, data.data.note],
              }
            : state.selectedChild,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  deleteNote: async (childId, noteId) => {
    try {
      set({ isLoading: true, error: null });
      await instance.delete(`children/${childId}/notes/${noteId}`);
      set((state) => ({
        selectedChild:
          state.selectedChild?._id === childId
            ? {
                ...state.selectedChild,
                notes: state.selectedChild.notes.filter(
                  (n) => n._id !== noteId,
                ),
              }
            : state.selectedChild,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: extractError(error), isLoading: false });
      throw error;
    }
  },

  // ─────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────

  clearSelectedChild: () => set({ selectedChild: null }),
  clearError: () => set({ error: null }),
}));
