/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  controlInformation: null,
  paymentAccount: null,
  loadError: null,
  saveError: null,
  ui: {
    isEditing: false,
    isSaving: false,
  },
};

const directDepositSlice = createSlice({
  name: 'directDeposit',
  initialState,
  reducers: {
    directDepositFetchSucceeded(state, action) {
      state.controlInformation = action.payload?.controlInformation ?? null;
      state.paymentAccount = action.payload?.paymentAccount ?? null;
      state.loadError = null;
      state.saveError = null;
      state.ui.isEditing = false;
      state.ui.isSaving = false;
    },
    directDepositFetchFailed(state, action) {
      state.loadError = action.payload?.error ?? true;
      state.saveError = null;
    },
    directDepositEditToggled(state, action) {
      state.saveError = null;
      state.ui.isEditing = action.payload?.open ?? !state.ui.isEditing;
    },
    directDepositLoadErrorCleared(state) {
      state.saveError = null;
    },
    directDepositSaveErrorCleared(state) {
      state.loadError = null;
    },
    directDepositSaveStarted(state) {
      state.saveError = null;
      state.ui.isSaving = true;
    },
    directDepositSaveFailed(state, action) {
      state.saveError = action.payload?.error ?? action.payload?.errors ?? true;
      state.ui.isSaving = false;
    },
  },
});

export const {
  directDepositFetchSucceeded,
  directDepositFetchFailed,
  directDepositEditToggled,
  directDepositLoadErrorCleared,
  directDepositSaveErrorCleared,
  directDepositSaveStarted,
  directDepositSaveFailed,
} = directDepositSlice.actions;

export const directDepositReducer = directDepositSlice.reducer;
