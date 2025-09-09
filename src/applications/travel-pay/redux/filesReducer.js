// filesReducer.js

// Action Types
export const SET_FILES = 'SET_FILES';

// Initial State
const initialState = [];

// Reducer
export default function filesReducer(state = initialState, action) {
  if (action.type === SET_FILES) {
    return action.payload; // overwrite with the new list
  }

  return state;
}
