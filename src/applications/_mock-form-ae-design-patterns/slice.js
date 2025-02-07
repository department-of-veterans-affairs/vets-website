/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedApps: [],
};

const vadxSlice = createSlice({
  name: 'VADX',
  initialState,
  reducers: {
    setSelectedApps: (state, action) => {
      state.selectedApps = action.payload;
    },
  },
});

export const { setSelectedApps } = vadxSlice.actions;

export const vadxReducer = vadxSlice.reducer;
