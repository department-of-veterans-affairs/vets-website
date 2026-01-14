/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

/** @typedef {{ topicId: string, topicName: string }} Topic */
/** @type {{ selectedDate: Date | null, selectedTopics: Topic[], obfuscatedEmail: string | null, uuid: string | null, token: string | null, lastname: string | null, dob: string | null }} */
const initialState = {
  hydrated: false,
  selectedDate: null,
  selectedTopics: [],
  obfuscatedEmail: null,
  token: null,
  uuid: null,
  lastname: null,
  dob: null,
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
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setObfuscatedEmail: (state, action) => {
      state.obfuscatedEmail = action.payload;
    },
    setLowAuthFormData: (state, action) => {
      state.uuid = action.payload.uuid;
      state.lastname = action.payload.lastname;
      state.dob = action.payload.dob;
    },
    clearFormData: state => {
      state.selectedDate = null;
      state.selectedTopics = [];
      state.obfuscatedEmail = null;
      state.uuid = null;
      state.token = null;
      state.lastname = null;
      state.dob = null;
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
  setLowAuthFormData,
  setToken,
  setObfuscatedEmail,
  clearFormData,
  hydrateFormData,
} = formSlice.actions;

export const selectSelectedDate = state => state.vassForm.selectedDate;
export const selectSelectedTopics = state => state.vassForm.selectedTopics;
export const selectUuid = state => state.vassForm.uuid;
export const selectHydrated = state => state.vassForm.hydrated;
export const selectToken = state => state.vassForm.token;
export const selectObfuscatedEmail = state => state.vassForm.obfuscatedEmail;
export const selectLastname = state => state.vassForm.lastname;
export const selectDob = state => state.vassForm.dob;

export default formSlice.reducer;
