/**
 * Redux slice for managing user preferences in the MHV Medications application.
 *
 * This slice handles the following user preferences:
 * - Sorting options for medication lists
 * - Filter selections for medication types
 * - Filter panel expansion state
 * - Pagination state
 *
 * All preferences are persisted in sessionStorage to maintain state across page
 * refreshes within the same session. The slice includes safe storage access
 * functions to handle cases where sessionStorage might be unavailable.
 *
 * Usage:
 *
 * // To access preferences in components:
 * const sortOption = useSelector(state => state.rx.preferences.sortOption);
 *
 * // To update preferences:
 * dispatch(setSortOption(newOption));
 * dispatch(setFilterOption(newFilter));
 * dispatch(setFilterOpen(isOpen));
 * dispatch(setPageNumber(pageNum));
 *
 * @module preferencesSlice
 */
import { createSlice } from '@reduxjs/toolkit';
import {
  SESSION_SELECTED_SORT_OPTION,
  SESSION_SELECTED_FILTER_OPTION,
  SESSION_RX_FILTER_OPEN_BY_DEFAULT,
  SESSION_SELECTED_PAGE_NUMBER,
  ALL_MEDICATIONS_FILTER_KEY,
  rxListSortingOptions,
} from '../util/constants';

// Define default values
const DEFAULT_SORT_OPTION = Object.keys(rxListSortingOptions)[0];
const DEFAULT_FILTER_OPTION = ALL_MEDICATIONS_FILTER_KEY;

// Safe sessionStorage access functions
const getSessionItem = key => {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

const setSessionItem = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    // Handle errors silently
  }
};

// Initial state that reads from sessionStorage but has defaults
const initialState = {
  sortOption:
    getSessionItem(SESSION_SELECTED_SORT_OPTION) || DEFAULT_SORT_OPTION,
  filterOption:
    getSessionItem(SESSION_SELECTED_FILTER_OPTION) || DEFAULT_FILTER_OPTION,
  filterOpenByDefault:
    getSessionItem(SESSION_RX_FILTER_OPEN_BY_DEFAULT) === 'true',
  pageNumber: Number(getSessionItem(SESSION_SELECTED_PAGE_NUMBER) || 1),
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setSortOption: (state, action) => {
      setSessionItem(SESSION_SELECTED_SORT_OPTION, action.payload);
      return {
        ...state,
        sortOption: action.payload,
      };
    },
    setFilterOption: (state, action) => {
      setSessionItem(SESSION_SELECTED_FILTER_OPTION, action.payload);
      return {
        ...state,
        filterOption: action.payload,
      };
    },
    setFilterOpen: (state, action) => {
      setSessionItem(SESSION_RX_FILTER_OPEN_BY_DEFAULT, String(action.payload));
      return {
        ...state,
        filterOpenByDefault: action.payload,
      };
    },
    setPageNumber: (state, action) => {
      setSessionItem(SESSION_SELECTED_PAGE_NUMBER, String(action.payload));
      return {
        ...state,
        pageNumber: action.payload,
      };
    },
  },
});

export const {
  setSortOption,
  setFilterOption,
  setFilterOpen,
  setPageNumber,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
