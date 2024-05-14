import { combineReducers } from 'redux';

import { prescriptionsReducer } from './prescriptions';
import { allergiesReducer } from './allergies';

const rootReducer = {
  rx: combineReducers({
    prescriptions: prescriptionsReducer,
    // TODO: consider re-using this from medical-records
    allergies: allergiesReducer,
  }),
};

export default rootReducer;
