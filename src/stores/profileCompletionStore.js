import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useProfileCompletionStore = create(
  persist(
    (set, get) => ({
      full_name: '',
      gender: '',
      grade_level_id: null,
      class_id: null,
      subject_ids: [],

      setFullName: (name) => set({ full_name: name }),
      setGender: (gender) => set({ gender }),
      setGradeLevelId: (id) => set({ grade_level_id: id }),
      setClassId: (id) => set({ class_id: id }),
      addSubjectId: (id) => {
        const current = get().subject_ids;
        if (!current.includes(id)) {
          set({ subject_ids: [...current, id] });
        }
      },
      removeSubjectId: (id) => {
        set({ subject_ids: get().subject_ids.filter(sid => sid !== id) });
      },
      getProfileData: () => {
        const state = get();
        return {
          full_name: state.full_name,
          gender: state.gender,
          grade_level_id: state.grade_level_id,
          class_id: state.class_id,
          subject_ids: state.subject_ids,
        };
      },
      clearAll: () => set({
        full_name: '',
        gender: '',
        grade_level_id: null,
        class_id: null,
        subject_ids: [],
      }),
    }),
    {
      name: 'profile-completion-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useProfileCompletionStore;

