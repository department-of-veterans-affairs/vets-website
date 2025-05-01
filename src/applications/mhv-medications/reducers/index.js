import { combineReducers } from 'redux';
import { prescriptionsReducer } from './prescriptions';
import { inProductEducationReducer } from './inProductEducation';
import { allergiesApi } from '../api/allergiesApi';
import { prescriptionsApi } from '../api/prescriptionsApi';
import preferencesReducer from '../redux/preferencesSlice';

const rootReducer = {
  rx: combineReducers({
    prescriptions: prescriptionsReducer,
    inProductEducation: inProductEducationReducer,
    preferences: preferencesReducer,
  }),
  // Add the api reducers to the store
  [allergiesApi.reducerPath]: allergiesApi.reducer,
  [prescriptionsApi.reducerPath]: prescriptionsApi.reducer,
};

export default rootReducer;
