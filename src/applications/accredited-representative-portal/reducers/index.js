import { combineReducers } from 'redux';
import user from './user';

const rootReducer = combineReducers({
  user,
  // Add other reducers here if needed
});

export default rootReducer;
