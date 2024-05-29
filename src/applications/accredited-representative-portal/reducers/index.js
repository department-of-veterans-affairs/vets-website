import { combineReducers } from 'redux';
import ArfUserInformation from './user';

const rootReducer = combineReducers({
  user: ArfUserInformation,
});

export default rootReducer;
