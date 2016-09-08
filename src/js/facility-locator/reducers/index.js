import { combineReducers } from 'redux';
import FacilitiesReducer from './facilities';

const rootReducer = combineReducers({
  facilities: FacilitiesReducer
});

export default rootReducer;
