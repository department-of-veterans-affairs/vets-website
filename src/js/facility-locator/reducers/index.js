import { combineReducers } from 'redux';
import FacilitiesReducer from './facilities';
import SearchQueryReducer from './searchQuery';

const rootReducer = combineReducers({
  facilities: FacilitiesReducer,
  searchQuery: SearchQueryReducer,
});

export default rootReducer;
