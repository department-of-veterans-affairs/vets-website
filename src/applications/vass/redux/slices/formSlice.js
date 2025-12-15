/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

/** @typedef {{ topicId: string, topicName: string }} Topic */
/** @type {{ selectedDate: Date | null, selectedTopics: Topic[] }} */
const initialState = {
  hydrated: false,
  selectedDate: null,
  selectedTopics: [],
};

export const formSlice = createSlice({
  name: 'vassForm',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedTopics: (state, action) => {
      state.selectedTopics = action.payload;
    },
    clearFormData: state => {
      state.selectedDate = null;
      state.selectedTopics = [];
    },
    hydrateFormData: (state, action) => {
      state.hydrated = true;
      if (action.payload.selectedSlotTime) {
        state.selectedDate = action.payload.selectedSlotTime;
      }
      if (action.payload.selectedTopics) {
        state.selectedTopics = action.payload.selectedTopics;
      }
    },
  },
});

export const {
  setSelectedDate,
  setSelectedTopics,
  clearFormData,
  hydrateFormData,
} = formSlice.actions;

export const selectSelectedDate = state => state.vassForm.selectedDate;
export const selectSelectedTopics = state => state.vassForm.selectedTopics;
export const selectHydrated = state => state.vassForm.hydrated;

export default formSlice.reducer;
