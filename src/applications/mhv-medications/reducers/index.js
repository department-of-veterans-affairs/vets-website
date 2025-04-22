import { combineReducers } from 'redux';
import { prescriptionsReducer } from './prescriptions';
import { inProductEducationReducer } from './inProductEducation';
import { allergiesApi } from '../api/allergiesApi';

const rootReducer = {
  rx: combineReducers({
    prescriptions: prescriptionsReducer,
    inProductEducation: inProductEducationReducer,
  }),
  // Add the api reducer to the store
  [allergiesApi.reducerPath]: allergiesApi.reducer,
};

export default rootReducer;
