/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedApps: [],
};

const mockFormAeDesignPatternsSlice = createSlice({
  name: 'AE_DES_PAT',
  initialState,
  reducers: {
    setSelectedApps: (state, action) => {
      state.selectedApps = action.payload;
    },
  },
});

export const { setSelectedApps } = mockFormAeDesignPatternsSlice.actions;

export const vadxReducer = mockFormAeDesignPatternsSlice.reducer;
