import type { AvsState } from '../types';

// Since the current reducer is empty, we'll define a simple default state
const initialState: AvsState = {};

// For now, keeping the reducer simple since the original was empty
// This can be expanded as needed when actual state management is required
const rootReducer = (state: AvsState = initialState): AvsState => {
  return state;
};

// Export as an object structure as expected by startApp
export default {
  avs: rootReducer,
};
