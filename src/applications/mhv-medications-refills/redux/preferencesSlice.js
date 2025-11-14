import { createSlice } from '@reduxjs/toolkit';

/**
 * Preferences slice for medications refills UI state
 * Manages user preferences like sorting, filtering, pagination
 */
const initialState = {
  pageNumber: 1,
  sortOption: 'refillStatus',
  filterOption: 'all',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setPageNumber: (state, action) => {
      return { ...state, pageNumber: action.payload };
    },
    setSortOption: (state, action) => {
      return { ...state, sortOption: action.payload };
    },
    setFilterOption: (state, action) => {
      return { ...state, filterOption: action.payload };
    },
    resetPreferences: () => initialState,
  },
});

export const {
  setPageNumber,
  setSortOption,
  setFilterOption,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
