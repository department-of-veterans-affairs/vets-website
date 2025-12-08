/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
  },
});

export const {
  setSelectedDate,
  setSelectedTopics,
  clearFormData,
} = formSlice.actions;

export const selectSelectedDate = state => state.vassForm.selectedDate;
export const selectSelectedTopics = state => state.vassForm.selectedTopics;

export default formSlice.reducer;
