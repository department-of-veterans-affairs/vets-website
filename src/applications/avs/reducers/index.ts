import type { AppState } from '../types';

// Since the current reducer is empty, we'll define a simple default state
const initialState: AppState = {};

// For now, keeping the reducer simple since the original was empty
// This can be expanded as needed when actual state management is required
const rootReducer = (state: AppState = initialState): AppState => {
  return state;
};

export default rootReducer;