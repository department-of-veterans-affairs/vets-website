/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

// Storage key constants
const VASS_CURRENT_UUID_KEY = 'vass_current_uuid';
const VASS_FORM_KEY_PREFIX = 'vass_form';

// Safe sessionStorage helpers
const getSessionItem = key => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

const setSessionItem = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Handle storage errors (e.g., quota exceeded, private browsing)
  }
};

const removeSessionItem = key => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    // Handle storage errors
  }
};

/**
 * Get the storage key for the current session
 * @returns {string}
 */
const getSessionStorageKey = () => VASS_FORM_KEY_PREFIX;

/**
 * Save form data to sessionStorage keyed by UUID
 * @param {string} uuid
 * @param {object} data
 */
const saveFormDataToStorage = (uuid, data) => {
  if (!uuid) return;
  setSessionItem(VASS_CURRENT_UUID_KEY, uuid);
  setSessionItem(getSessionStorageKey(), data);
};

/**
 * Load form data from sessionStorage for the current session
 * @returns {object|null}
 */
export const loadFormDataFromStorage = () => {
  const currentUuid = getSessionItem(VASS_CURRENT_UUID_KEY);
  if (!currentUuid) return null;
  return getSessionItem(getSessionStorageKey());
};

/**
 * Clear form data from sessionStorage for the current session
 */
const clearFormDataFromStorage = () => {
  removeSessionItem(getSessionStorageKey());
  removeSessionItem(VASS_CURRENT_UUID_KEY);
};

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
      if (state.uuid) {
        saveFormDataToStorage(state.uuid, {
          ...state,
          selectedDate: action.payload,
        });
      }
    },
    setSelectedTopics: (state, action) => {
      state.selectedTopics = action.payload;
      if (state.uuid) {
        saveFormDataToStorage(state.uuid, {
          ...state,
          selectedTopics: action.payload,
        });
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (state.uuid) {
        saveFormDataToStorage(state.uuid, { ...state, token: action.payload });
      }
    },
    setObfuscatedEmail: (state, action) => {
      state.obfuscatedEmail = action.payload;
      if (state.uuid) {
        saveFormDataToStorage(state.uuid, {
          ...state,
          obfuscatedEmail: action.payload,
        });
      }
    },
    setLowAuthFormData: (state, action) => {
      state.uuid = action.payload.uuid;
      state.lastname = action.payload.lastname;
      state.dob = action.payload.dob;
      // Save to storage keyed by UUID
      saveFormDataToStorage(action.payload.uuid, {
        ...state,
        uuid: action.payload.uuid,
        lastname: action.payload.lastname,
        dob: action.payload.dob,
      });
    },
    clearFormData: state => {
      // Clear from storage before resetting state
      clearFormDataFromStorage();
      state.selectedDate = null;
      state.selectedTopics = [];
      state.obfuscatedEmail = null;
      state.uuid = null;
      state.token = null;
      state.lastname = null;
      state.dob = null;
      state.hydrated = false;
    },
    hydrateFormData: (state, action) => {
      state.hydrated = true;
      if (action.payload.uuid) {
        state.uuid = action.payload.uuid;
      }
      if (action.payload.lastname) {
        state.lastname = action.payload.lastname;
      }
      if (action.payload.dob) {
        state.dob = action.payload.dob;
      }
      if (action.payload.obfuscatedEmail) {
        state.obfuscatedEmail = action.payload.obfuscatedEmail;
      }
      if (action.payload.token) {
        state.token = action.payload.token;
      }
      if (action.payload.selectedDate) {
        state.selectedDate = action.payload.selectedDate;
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
