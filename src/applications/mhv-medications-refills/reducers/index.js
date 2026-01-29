import { combineReducers } from 'redux';
import { refillsApi } from '../api/refillsApi';
import preferencesReducer from '../redux/preferencesSlice';

/**
 * Root reducer for medications refills application
 * Combines RTK Query API reducer with local UI state
 */
const rootReducer = {
  rx: combineReducers({
    preferences: preferencesReducer,
  }),
  // Add the RTK Query API reducer
  [refillsApi.reducerPath]: refillsApi.reducer,
};

export default rootReducer;
