import { combineReducers } from 'redux';
import { prescriptionsReducer } from './prescriptions';
import { inProductEducationReducer } from './inProductEducation';
import { allergiesApi } from '../api/allergiesApi';
import { prescriptionsApi } from '../api/prescriptionsApi';

const rootReducer = {
  rx: combineReducers({
    prescriptions: prescriptionsReducer,
    inProductEducation: inProductEducationReducer,
  }),
  // Add the api reducers to the store
  [allergiesApi.reducerPath]: allergiesApi.reducer,
  [prescriptionsApi.reducerPath]: prescriptionsApi.reducer,
};

export default rootReducer;
